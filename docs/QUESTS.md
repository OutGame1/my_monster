# Système de Quêtes

## Vue d'ensemble

Le système de quêtes constitue une couche de progression et de rétention utilisateur dans l'application MyMonster. Il propose deux catégories distinctes d'objectifs : les quêtes quotidiennes, qui se renouvellent chaque jour à minuit via un cron job, et les achievements permanents, qui marquent les étapes importantes du parcours joueur. Cette architecture encourage l'engagement récurrent tout en offrant des jalons de progression à long terme.

L'implémentation repose sur un modèle de données flexible permettant de tracker la progression de chaque utilisateur pour chaque quête individuellement. Un système de hooks Mongoose automatise la détection de complétion, tandis que des Maps optimisées garantissent des lookups en O(1) pour les 45 quêtes configurées. Les récompenses monétaires s'intègrent directement au système de portefeuille, créant une boucle économique cohérente avec les actions sur les monstres.

## Architecture du modèle de données

### Document MongoDB Quest

Le schéma Mongoose définit un document de progression par couple (utilisateur, quête) :

```typescript
export interface IQuestDocument extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  questId: string
  questObjective: QuestObjective
  progress: number
  completedAt?: Date
  claimedAt?: Date
  lastResetAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

**Champs structurels :**

- **`userId`** : référence à l'utilisateur propriétaire (index pour requêtes)
- **`questId`** : identifiant unique de la quête (référence à la configuration)
- **`questObjective`** : type d'objectif parmi 11 catégories (`feed_monsters`, `own_monsters`, etc.)
- **`progress`** : compteur de progression actuel (minimum 0)
- **`completedAt`** : timestamp de complétion (undefined si non complétée)
- **`claimedAt`** : timestamp de réclamation de récompense (undefined si non réclamée)
- **`lastResetAt`** : date du dernier reset (pour quêtes quotidiennes)

### Index composé unique

Un index composé garantit l'unicité de la progression par couple (utilisateur, quête) :

```typescript
questSchema.index({ userId: 1, questId: 1 }, { unique: true })
```

**Avantages de cet index :**
- **Lookup rapide** : recherche en O(1) via `findOne({ userId, questId })`
- **Contrainte d'unicité** : impossible de créer deux progressions pour la même quête
- **Performance des requêtes** : évite les scans de collection complets

**Implications :**
- Toute tentative de création d'un doublon lève une erreur MongoDB (`E11000 duplicate key`)
- Nécessité de gérer les cas "get or create" dans les Server Actions

### Hook pre-save : auto-complétion

Le hook Mongoose `pre('save')` implémente la logique de détection de complétion :

```typescript
questSchema.pre('save', function(next) {
  const questDef = questsIdMap.get(this.questId)
  if (questDef === undefined) {
    return next(new Error(`Quest definition not found for questId: ${this.questId}`))
  }
  
  if (this.progress >= questDef.target) {
    this.progress = questDef.target
    
    if (this.completedAt === undefined) {
      this.completedAt = new Date()
    }
  }
  
  next()
})
```

**Mécanisme d'auto-complétion :**

1. **Lookup de la définition** : récupération depuis `questsIdMap` (Map globale)
2. **Vérification du seuil** : comparaison `progress >= target`
3. **Capping de la progression** : `progress = target` (évite les débordements)
4. **Timestamp de complétion** : `completedAt` défini uniquement lors du premier franchissement

**Avantages :**
- **Automatisation** : le code appelant n'a pas à gérer la logique de complétion
- **Garantie de cohérence** : impossible d'avoir `progress > target`
- **Idempotence** : appels multiples à `save()` ne changent pas `completedAt`

**Limitation :**
- **Dépendance à la configuration** : erreur levée si `questId` invalide (questDef absente)

### Champ virtuel "completed"

Bien que le document stocke `completedAt`, un champ virtuel dérivé pourrait simplifier les checks :

```typescript
// Actuellement inexistant, mais mentionné dans les instructions
quest.completed = quest.completedAt !== undefined
```

Dans l'implémentation actuelle, les composants vérifient directement `completedAt !== undefined`.

## Configuration centralisée des quêtes

### Structure QuestDefinition

Chaque quête est définie par une interface standardisée (`src/types/quests.d.ts`) :

```typescript
export interface QuestDefinition {
  id: string
  type: QuestType // 'daily' | 'achievement'
  objective: QuestObjective
  target: number
  reward: number
  title: string
  description: string
  icon: string
}
```

**Exemple concret :**

```typescript
{
  id: 'daily_feed_3',
  type: 'daily',
  objective: 'feed_monsters',
  target: 3,
  reward: 5,
  title: 'Heure du goûter',
  description: 'Nourrir 3 fois vos monstres',
  icon: '🍖'
}
```

### Onze types d'objectifs

Le système supporte onze catégories d'objectifs (`src/config/quests.config.ts`) :

```typescript
export const questObjectives = [
  'feed_monsters',              // Nourrir X fois
  'play_monsters',              // Jouer X fois
  'comfort_monsters',           // Réconforter X fois
  'calm_monsters',              // Calmer X fois
  'lullaby_monsters',           // Bercer X fois
  'care_different_monsters',    // S'occuper de X monstres différents
  'own_monsters',               // Posséder X monstres
  'total_actions',              // Effectuer X actions au total
  'level_up_monster',           // Faire monter un monstre au niveau X
  'reach_coins',                // Atteindre X pièces
  'unlock_backgrounds'          // Débloquer X arrière-plans
] as const
```

**Classification des objectifs :**

| Catégorie | Objectifs | Mode de tracking |
|-----------|-----------|------------------|
| Actions spécifiques | feed, play, comfort, calm, lullaby | Incrémentation manuelle |
| Actions agrégées | total_actions, care_different_monsters | Incrémentation + comptage |
| Possession | own_monsters, unlock_backgrounds | Mise à jour absolue |
| Progression | level_up_monster, reach_coins | Hooks automatiques |

### Quêtes quotidiennes : 8 objectifs simples

Les quêtes quotidiennes visent l'engagement court terme avec des récompenses modestes (5-12 pièces) :

```typescript
export const dailyQuests: QuestDefinition[] = [
  // Nourrir 3 fois → 5 pièces
  { id: 'daily_feed_3', objective: 'feed_monsters', target: 3, reward: 5, ... },
  
  // Jouer 3 fois → 5 pièces
  { id: 'daily_play_3', objective: 'play_monsters', target: 3, reward: 5, ... },
  
  // Réconforter 5 fois → 7 pièces
  { id: 'daily_comfort_5', objective: 'comfort_monsters', target: 5, reward: 7, ... },
  
  // Calmer 3 fois → 5 pièces
  { id: 'daily_calm_3', objective: 'calm_monsters', target: 3, reward: 5, ... },
  
  // Bercer 3 fois → 5 pièces
  { id: 'daily_lullaby_3', objective: 'lullaby_monsters', target: 3, reward: 5, ... },
  
  // S'occuper de 3 monstres différents → 8 pièces
  { id: 'daily_care_3_different', objective: 'care_different_monsters', target: 3, reward: 8, ... },
  
  // Effectuer 5 actions → 6 pièces
  { id: 'daily_total_actions_5', objective: 'total_actions', target: 5, reward: 6, ... },
  
  // Effectuer 10 actions → 12 pièces
  { id: 'daily_total_actions_10', objective: 'total_actions', target: 10, reward: 12, ... }
]
```

**Design intentionnel :**
- **Objectifs accessibles** : 3-10 actions maximum
- **Récompenses limitées** : total cumulé ~50 pièces/jour
- **Encouragement à l'achat** : récompenses insuffisantes pour créer de nombreux monstres
- **Diversité** : couvre les 5 types d'actions + méta-objectifs

### Achievements : 37 jalons de progression

Les achievements récompensent l'engagement long terme avec des paliers progressifs :

**Actions spécifiques (5 catégories × 3 paliers = 15 achievements) :**

```typescript
// Exemple pour "feed_monsters"
{ id: 'achievement_feed_250', target: 250, reward: 50, ... },   // 250 actions
{ id: 'achievement_feed_500', target: 500, reward: 150, ... },  // 500 actions
{ id: 'achievement_feed_1000', target: 1000, reward: 250, ... } // 1000 actions
```

Idem pour `play`, `comfort`, `calm`, `lullaby`.

**Possession de monstres (3 paliers) :**

```typescript
{ id: 'achievement_own_5', target: 5, reward: 30, ... },    // 5 monstres
{ id: 'achievement_own_10', target: 10, reward: 75, ... },  // 10 monstres
{ id: 'achievement_own_15', target: 15, reward: 150, ... }  // 15 monstres
```

**Actions totales (3 paliers) :**

```typescript
{ id: 'achievement_total_actions_500', target: 500, reward: 50, ... },
{ id: 'achievement_total_actions_1000', target: 1000, reward: 100, ... },
{ id: 'achievement_total_actions_2000', target: 2000, reward: 175, ... }
```

**Richesse (4 paliers avec cashback 10%) :**

```typescript
{ id: 'achievement_coins_500', target: 500, reward: 50, ... },    // 10% cashback
{ id: 'achievement_coins_1000', target: 1000, reward: 100, ... }, // 10% cashback
{ id: 'achievement_coins_2500', target: 2500, reward: 200, ... }, // 8% cashback
{ id: 'achievement_coins_5000', target: 5000, reward: 350, ... }  // 7% cashback
```

**Déblocage de backgrounds (4 paliers) :**

```typescript
{ id: 'achievement_backgrounds_7', target: 7, reward: 15, ... },
{ id: 'achievement_backgrounds_15', target: 15, reward: 40, ... },
{ id: 'achievement_backgrounds_30', target: 30, reward: 100, ... },
{ id: 'achievement_backgrounds_50', target: 50, reward: 200, ... }
```

**Level-up (2 paliers) :**

```typescript
{ id: 'achievement_level_10', target: 10, reward: 100, ... },
{ id: 'achievement_level_20', target: 20, reward: 200, ... }
```

**Total : 37 achievements** avec récompenses cumulées de ~2500+ pièces.

### Maps d'indexation pour performance

La configuration exporte deux structures d'accès optimisé :

```typescript
// Map par objectif (pour incrémentation groupée)
export const questsObjectiveMap: Record<QuestObjective, QuestDefinition[]> = {
  feed_monsters: [...],
  play_monsters: [...],
  // ... etc
}

// Map par ID (pour lookup direct)
export const questsIdMap: Map<string, QuestDefinition> = new Map()

// Indexation au chargement du module
for (const quest of allQuests) {
  questsObjectiveMap[quest.objective].push(quest)
  questsIdMap.set(quest.id, quest)
}
```

**Avantages de cette double indexation :**

1. **`questsObjectiveMap`** : accès O(1) à toutes les quêtes d'un type
   - Utilisé par `incrementQuestProgress()` pour mettre à jour tous les paliers simultanément
   - Exemple : après une action `feed`, mise à jour de `achievement_feed_250/500/1000`

2. **`questsIdMap`** : accès O(1) à une quête par son ID
   - Utilisé par le hook pre-save pour récupérer la définition
   - Utilisé par `claimQuestReward()` pour valider l'existence

**Performance :**
- **Initialisation** : O(n) au chargement du module (45 quêtes)
- **Lookup** : O(1) pour toutes les opérations runtime
- **Mémoire** : ~10 KB pour 45 définitions en RAM

## Server Actions de gestion des quêtes

### Récupération avec progression : `getQuestsWithProgress()`

La fonction principale récupère toutes les quêtes avec leur état de progression :

```typescript
export async function getQuestsWithProgress(): Promise<QuestsPayload> {
  const session = await getSession()
  if (session === null) {
    throw new Error('User not authenticated')
  }
  
  const userId = session.user.id
  
  // Récupération de toutes les progressions existantes
  const progressRecords = await Quest.find({ userId }).exec()
  
  // Indexation par questId pour lookup rapide
  const progressMap = new Map<string, IQuestDocument>(
    progressRecords.map(pr => [pr.questId, pr])
  )
  
  const questsPayload: QuestsPayload = { daily: [], achievement: [] }
  
  // Itération sur toutes les quêtes définies
  for (const quest of allQuests) {
    const questId = quest.id
    let progress = progressMap.get(questId)
    
    // Création à la volée si progression absente
    if (progress === undefined) {
      progress = await Quest.create({
        userId,
        questId,
        questObjective: quest.objective
      })
    }
    
    // Ajout à la catégorie appropriée
    questsPayload[quest.type].push({
      definition: quest,
      progress: questSerializer(progress)
    })
  }
  
  return questsPayload
}
```

**Workflow de récupération :**

1. **Authentification** : vérification de session utilisateur
2. **Fetch initial** : récupération de TOUTES les progressions en une requête
3. **Indexation locale** : création d'une Map pour O(1) lookup
4. **Itération sur définitions** : 45 quêtes parcourues
5. **Création on-demand** : documents Quest créés si absents
6. **Sérialisation** : conversion en objets plain JavaScript
7. **Groupement par type** : séparation daily/achievement

**Optimisation key :**
- **Une seule requête DB** pour toutes les progressions
- **Création batch potentielle** : plusieurs `Quest.create()` en parallèle (non implémenté)
- **Pas de N+1 queries** : évite 45 appels `findOne()`

**Payload retourné :**

```typescript
interface QuestsPayload {
  daily: QuestWithProgress[]      // 8 quêtes quotidiennes
  achievement: QuestWithProgress[] // 37 achievements
}
```

Chaque `QuestWithProgress` combine définition + progression.

### Incrémentation de progression : `incrementQuestProgress()`

La fonction incrémente la progression de toutes les quêtes d'un type donné :

```typescript
export async function incrementQuestProgress(
  questObjective: QuestObjective,
  amount: number
): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }
  
  const userId = session.user.id
  
  // Itération sur toutes les quêtes de ce type
  for (const questDef of questsObjectiveMap[questObjective]) {
    const questId = questDef.id
    
    let quest = await Quest.findOne({ userId, questId }).exec()
    
    if (quest === null) {
      quest = new Quest({
        userId,
        questId,
        questObjective
      })
    }
    
    // Skip si déjà complété
    if (quest.completedAt !== undefined) {
      continue
    }
    
    // Incrémentation
    quest.progress += amount
    
    await quest.save() // Hook pre-save déclenché ici
  }
}
```

**Cas d'usage typique :**

Après une action `feed` sur un monstre :

```typescript
await incrementQuestProgress('feed_monsters', 1)
await incrementQuestProgress('total_actions', 1)
```

Cet appel met à jour :
- `daily_feed_3` (si < 3)
- `achievement_feed_250/500/1000` (selon progression)
- `daily_total_actions_5/10` (si < seuils)
- `achievement_total_actions_500/1000/2000` (selon progression)

**Optimisation manquante :**

Actuellement, chaque quête est mise à jour individuellement avec un `findOne()` + `save()`. Une optimisation possible serait le `bulkWrite()` :

```typescript
const bulkOps = questsObjectiveMap[questObjective].map(questDef => ({
  updateOne: {
    filter: { userId, questId: questDef.id },
    update: { $inc: { progress: amount } },
    upsert: true
  }
}))
await Quest.bulkWrite(bulkOps)
```

Cependant, cette approche court-circuite le hook pre-save (nécessaire pour `completedAt`).

### Vérification de possession : `checkOwnershipQuests()`

Pour les quêtes basées sur un état absolu (possession de monstres), une fonction dédiée recalcule la progression :

```typescript
export async function checkOwnershipQuests(): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }
  
  const userId = session.user.id
  
  // Comptage des monstres possédés
  const monsterCount = await Monster.countDocuments({ ownerId: userId }).exec()
  
  for (const questDef of questsObjectiveMap.own_monsters) {
    const questId = questDef.id
    
    let quest = await Quest.findOne({ userId, questId }).exec()
    
    if (quest === null) {
      quest = new Quest({
        userId,
        questId,
        questObjective: 'own_monsters'
      })
    }
    
    // Mise à jour avec le nombre réel
    quest.progress = monsterCount
    
    await quest.save()
  }
}
```

**Différence avec incrémentation :**
- **Pas d'ajout** : `progress = monsterCount` (valeur absolue)
- **Recalcul complet** : chaque appel reflète l'état actuel
- **Pas de skip** : même les quêtes complétées sont mises à jour (pour régression potentielle)

**Appelé par :**
- `createMonster()` : après création d'un nouveau monstre
- `deleteMonster()` : après suppression (si implémenté)

**Quêtes impactées :**
- `achievement_own_5` (5 monstres)
- `achievement_own_10` (10 monstres)
- `achievement_own_15` (15 monstres)

### Vérification de soins quotidiens : `checkCareDifferentMonstersProgress()`

La quête `care_different_monsters` nécessite un comptage de monstres uniques soignés dans la journée :

```typescript
export async function checkCareDifferentMonstersProgress(): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }
  
  const userId = session.user.id
  
  // Calcul du début de journée (minuit)
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  
  // Comptage des monstres soignés aujourd'hui
  const caredTodayCount = await Monster.countDocuments({
    ownerId: userId,
    lastCaredAt: { $gte: startOfDay }
  }).exec()
  
  for (const questDef of questsObjectiveMap.care_different_monsters) {
    const questId = questDef.id
    
    let quest = await Quest.findOne({ userId, questId }).exec()
    
    if (quest === null) {
      quest = new Quest({
        userId,
        questId,
        questObjective: 'care_different_monsters'
      })
    }
    
    quest.progress = caredTodayCount
    
    await quest.save()
  }
}
```

**Mécanique de comptage :**

1. **Calcul de minuit** : `startOfDay.setHours(0, 0, 0, 0)` (timezone locale)
2. **Requête MongoDB** : `lastCaredAt >= startOfDay`
3. **Comptage unique** : chaque monstre compte une fois (pas d'agrégation nécessaire)

**Intégration dans `performMonsterAction()` :**

```typescript
monster.lastCaredAt = new Date()
await monster.save()

await checkCareDifferentMonstersProgress()
```

Chaque action met à jour le timestamp `lastCaredAt`, permettant le comptage par `countDocuments()`.

**Quêtes impactées :**
- `daily_care_3_different` (3 monstres différents)

**Limitation connue :**
Le comptage utilise `countDocuments()` qui compte tous les monstres soignés, pas uniquement les distincts. Si un utilisateur soigne le même monstre 5 fois, cela compte comme 1 (car `lastCaredAt` est mis à jour). Le comportement est correct.

### Réclamation de récompense : `claimQuestReward()`

La fonction gère la réclamation sécurisée des récompenses :

```typescript
export async function claimQuestReward(questId: string): Promise<number> {
  const session = await getSession()
  if (session === null) {
    throw new Error('User not authenticated')
  }
  
  const userId = session.user.id
  
  // Validation de l'existence de la quête
  const questDef = questsIdMap.get(questId)
  if (questDef === undefined) {
    throw new Error('Quest not found')
  }
  
  // Récupération de la progression
  const progress = await Quest.findOne({ userId, questId }).exec()
  
  if (progress === null) {
    throw new Error('La quête est introuvable')
  }
  
  // Vérifications de complétion
  if (progress.completedAt === undefined) {
    throw new Error('La quête n\'est pas encore complétée')
  }
  
  // Vérification de non-réclamation
  if (progress.claimedAt !== undefined) {
    throw new Error('Vous avez déjà réclamé cette récompense')
  }
  
  // Marquage comme réclamé
  progress.claimedAt = new Date()
  await progress.save()
  
  // Crédit des pièces
  await updateWalletBalance(questDef.reward)
  
  // Revalidation des pages
  revalidatePath('/app/quests')
  revalidatePath('/app')
  
  return questDef.reward
}
```

**Workflow de sécurité :**

1. **Authentification** : vérification de session
2. **Validation de définition** : questId existe dans la config
3. **Récupération de progression** : vérification de l'enregistrement
4. **Vérification de complétion** : `completedAt !== undefined`
5. **Vérification de non-réclamation** : `claimedAt === undefined`
6. **Marquage atomique** : `claimedAt = new Date()`
7. **Crédit wallet** : appel à `updateWalletBalance()`
8. **Revalidation** : invalidation du cache Next.js

**Sécurité contre double réclamation :**

Même si deux requêtes simultanées atteignent l'étape 6, la première qui fait `save()` gagnera. La seconde requête, lors de son prochain `findOne()`, verrait `claimedAt !== undefined` et échouerait.

**Index unique** : l'index composé `{ userId: 1, questId: 1 }` empêche la création de progressions dupliquées.

## Cron Job de reset quotidien

### Architecture du webhook cron

Le reset des quêtes quotidiennes s'effectue via un endpoint protégé (`src/app/api/webhook/quest/route.ts`) :

```typescript
async function handleCronJob(): Promise<void> {
  try {
    await connectMongooseToDatabase()
    
    // Extraction des IDs de toutes les quêtes quotidiennes
    const dailyQuestIds = dailyQuests.map(quest => quest.id)
    
    console.log(`🗑️  Starting daily quests reset for ${dailyQuestIds.length} quest types`)
    
    // Préparation des opérations bulk
    const bulkOps = dailyQuestIds.map<AnyBulkWriteOperation<IQuestDocument>>(questId => ({
      deleteMany: {
        filter: { questId }
      }
    }))
    
    // Exécution des suppressions en batch
    const result = await Quest.bulkWrite(bulkOps, { ordered: false })
    
    console.log('✅ Daily quests reset successful:', {
      deleted: result.deletedCount,
      questTypes: dailyQuestIds.length
    })
  } catch (error) {
    console.error('❌ Error resetting daily quests in cron job:', error)
  }
}

export async function GET(req: Request): Promise<Response> {
  return await cronRoute(req, handleCronJob)
}
```

**Mécanisme de reset :**

1. **Connexion DB** : appel à `connectMongooseToDatabase()`
2. **Extraction des IDs** : mapping depuis `dailyQuests` (8 quêtes)
3. **Préparation bulkWrite** : une opération `deleteMany` par questId
4. **Exécution batch** : `bulkWrite({ ordered: false })` pour parallélisme
5. **Logging** : confirmation du nombre de documents supprimés

**Optimisation bulkWrite :**
- **Opérations parallèles** : `ordered: false` permet l'exécution simultanée
- **Une requête DB** : au lieu de 8 `deleteMany()` séparés
- **Performance** : O(n) avec n = nombre de documents à supprimer

**Impact du reset :**
- Toutes les progressions des quêtes quotidiennes sont supprimées
- Les achievements ne sont PAS supprimés (filtrage par `questId`)
- Les utilisateurs repartent de zéro le lendemain

### Protection par secret partagé

Le helper `cronRoute()` (`src/lib/cron.ts`) sécurise l'endpoint :

```typescript
export default async function cronRoute(
  req: Request,
  handleCronJob: () => Promise<void>
): Promise<Response> {
  // Vérification du secret
  if (req.headers.get('Authorization') !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Traitement asynchrone
  void handleCronJob()
  return Response.json({ success: true })
}
```

**Sécurité :**
- **Header Authorization** : `Bearer <CRON_SECRET>`
- **Validation côté serveur** : comparaison stricte
- **Rejet immédiat** : 401 Unauthorized si secret invalide

**Exécution asynchrone :**
- `void handleCronJob()` : fire-and-forget
- Retour immédiat de `{ success: true }`
- Pas d'attente de fin d'exécution

**Justification :**
Les cron jobs Vercel ont un timeout de 10 secondes pour la réponse HTTP. L'exécution asynchrone évite le timeout tout en permettant le traitement complet.

### Configuration Vercel Cron

Dans `vercel.json` (non fourni mais documenté) :

```json
{
  "crons": [
    {
      "path": "/api/webhook/quest",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Schedule cron :**
- **Expression** : `0 0 * * *` (minuit UTC chaque jour)
- **Path** : `/api/webhook/quest`
- **Authorization** : Vercel injecte automatiquement le header avec `CRON_SECRET`

**Variables d'environnement requises :**
- `CRON_SECRET` : secret partagé entre Vercel et l'application

**Alternative :**
Pour un reset quotidien à minuit heure locale (Paris), il faudrait ajuster le schedule ou implémenter une logique de timezone dans le handler.

## Interface utilisateur des quêtes

### Composant QuestCard

Le composant `QuestCard` affiche une carte de quête individuelle :

```typescript
export default function QuestCard({ quest, onQuestClaimed }: QuestCardProps): ReactNode {
  const { addBalance } = useWallet()
  const [isClaiming, setIsClaiming] = useState(false)
  
  const progress = quest.progress.progress
  const target = quest.definition.target
  const completed = quest.progress.completedAt !== undefined
  const claimed = quest.progress.claimedAt !== undefined
  const progressPercent = Math.min((progress / target) * 100, 100)
  
  const handleClaim = async (): Promise<void> => {
    setIsClaiming(true)
    
    try {
      const reward = await claimQuestReward(quest.definition.id)
      addBalance(reward) // Animation du CoinBadge
      toast.success(`🎉 Vous avez gagné ${reward} pièces !`)
      await onQuestClaimed() // Rechargement des quêtes
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsClaiming(false)
    }
  }
  
  // ... render
}
```

**États de la carte :**

| Condition | Affichage |
|-----------|-----------|
| En cours | Barre de progression + icône Lock |
| Complétée non réclamée | Ring doré + bouton "Réclamer" |
| Complétée réclamée | Icône Check + "Réclamé" |

**Barre de progression :**

```tsx
<div className='h-3 w-full overflow-hidden rounded-full bg-tolopea-100'>
  <div
    className='h-full bg-gradient-to-r from-tolopea-500 to-blood-500 transition-all duration-500'
    style={{ width: `${progressPercent}%` }}
  />
</div>
```

Gradient animé avec transition CSS de 500ms.

**Highlight visuel pour quêtes réclamables :**

```tsx
<Card className={cn(
  'relative transition-all duration-300 hover:shadow-xl',
  completed && !claimed && 'ring-2 ring-golden-fizz-500 ring-offset-2'
)}>
```

Le ring doré attire l'attention sur les quêtes terminées.

**Date de complétion :**

```tsx
{completedAt !== undefined && (
  <div className='mt-2 text-xs text-tolopea-500'>
    Terminée le {formatCompletedDate(completedAt)}
  </div>
)}
```

Affiche la date au format `DD/MM/YYYY` (français).

### Composant QuestsContent avec tabs

Le composant parent gère le système d'onglets :

```typescript
export default function QuestsContent({ dailyQuests, achievements, onQuestClaimed }: QuestsContentProps): ReactNode {
  const [activeTab, setActiveTab] = useState<QuestType>('daily')
  
  const currentQuests = activeTab === 'daily' ? dailyQuests : achievements
  
  // Comptage des quêtes réclamables
  const claimableDailyCount = count(dailyQuests, q => q.progress.completedAt !== undefined && q.progress.claimedAt === undefined)
  const claimableAchievementsCount = count(achievements, q => q.progress.completedAt !== undefined && q.progress.claimedAt === undefined)
  
  // ... render
}
```

**Fonction utilitaire `count()` :**

Définie dans `src/lib/utils.ts` :

```typescript
export function count<E, T = undefined>(
  array: E[],
  predicate: (this: T, item: E) => boolean,
  thisArg?: T
): number
```

Équivalent optimisé de `filter().length` sans créer d'array intermédiaire.

**Affichage des compteurs :**

```tsx
<button onClick={() => setActiveTab('daily')} className={...}>
  <Clock className='h-5 w-5' />
  Quêtes quotidiennes ({claimableDailyCount})
</button>

<button onClick={() => setActiveTab('achievement')} className={...}>
  <Trophy className='h-5 w-5' />
  Succès ({claimableAchievementsCount})
</button>
```

Les badges numériques indiquent combien de quêtes sont prêtes à être réclamées.

**Grille responsive :**

```tsx
<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
  {currentQuests.map((quest) => (
    <QuestCard key={quest.definition.id} quest={quest} onQuestClaimed={onQuestClaimed} />
  ))}
</div>
```

- Mobile : 1 colonne
- Tablette : 2 colonnes
- Desktop : 3 colonnes

### Skeleton loading pattern

La page de quêtes utilise un wrapper pour le chargement asynchrone :

```typescript
// src/app/app/quests/page.tsx
export default function QuestsPage(): ReactNode {
  return (
    <ProtectedAppLayout>
      <QuestsContentWrapper />
    </ProtectedAppLayout>
  )
}
```

Le `QuestsContentWrapper` (composant client) gère :
- Appel à `getQuestsWithProgress()` dans `useEffect`
- Affichage de `QuestsContentSkeleton` pendant le chargement
- Rendu de `QuestsContent` une fois les données chargées

**Pattern architectural :**
- **Server Component** : authentification + layout
- **Client Wrapper** : data fetching asynchrone
- **Client Content** : rendu avec interactivité
- **Skeleton** : feedback visuel pendant loading

## Intégration avec les autres systèmes

### Hook dans performMonsterAction()

Chaque action sur un monstre déclenche plusieurs mises à jour de quêtes :

```typescript
export async function performMonsterAction(monsterId: string, actionType: ActionType): Promise<PerformActionResult> {
  // ... logique de l'action
  
  // Mise à jour du monstre
  monster.lastCaredAt = new Date()
  await monster.save()
  
  // Mise à jour du wallet
  await updateWalletBalance(coinsEarned)
  
  // Progression des quêtes
  await incrementQuestProgress(`${actionType}_monsters`, 1)        // feed_monsters, play_monsters, etc.
  await incrementQuestProgress('total_actions', 1)                 // Compteur global
  await checkCareDifferentMonstersProgress()                       // Monstres différents soignés
  
  // Revalidation
  revalidatePath('/app/quests')
  
  // ...
}
```

**Ordre d'exécution critique :**
1. Mise à jour `lastCaredAt` (nécessaire pour `checkCareDifferentMonstersProgress`)
2. Crédit wallet (déclenche hook wallet → quêtes `reach_coins`)
3. Progression quêtes d'actions
4. Vérification quêtes de soins

### Hook dans createMonster()

Après création d'un monstre :

```typescript
export async function createMonster(name: string): Promise<number> {
  // ... création du monstre
  
  await monster.save()
  
  // Vérification des quêtes de possession
  await checkOwnershipQuests()
  
  revalidatePath('/app')
  
  return creationCost
}
```

Met à jour les achievements `own_monsters` (5/10/15 monstres).

### Hook post-save dans Wallet

Le modèle Wallet inclut un hook automatique :

```typescript
walletSchema.post('save', async function({ ownerId: userId, totalEarned }: IWalletDocument) {
  for (const coinsAchievement of questsObjectiveMap.reach_coins) {
    const questId = coinsAchievement.id
    
    let quest = await Quest.findOne({ userId, questId }).exec()
    if (quest === null) {
      quest = new Quest({ userId, questId, questObjective: 'reach_coins' })
    }
    
    quest.progress = totalEarned
    await quest.save()
  }
})
```

**Propagation automatique :**
- Chaque modification de `wallet.totalEarned` met à jour les 4 quêtes `reach_coins`
- Pas besoin d'appel explicite dans les Server Actions
- Couplage faible entre Wallet et Quest

**Quêtes impactées :**
- `achievement_coins_500/1000/2500/5000`

## Sérialisation des données

Le serializer `quest.serializer.ts` transforme les documents Mongoose :

```typescript
export interface ISerializedQuestProgress {
  id: string
  userId: string
  questId: string
  questObjective: QuestObjective
  progress: number
  completedAt?: string
  claimedAt?: string
  lastResetAt?: string
  createdAt: string
  updatedAt: string
}

export default function questSerializer(questProgress: IQuestDocument): ISerializedQuestProgress {
  return {
    id: questProgress._id.toString(),
    userId: questProgress.userId.toString(),
    questId: questProgress.questId,
    questObjective: questProgress.questObjective,
    progress: questProgress.progress,
    completedAt: questProgress.completedAt?.toISOString(),
    claimedAt: questProgress.claimedAt?.toISOString(),
    lastResetAt: questProgress.lastResetAt?.toISOString(),
    createdAt: questProgress.createdAt.toISOString(),
    updatedAt: questProgress.updatedAt.toISOString()
  }
}
```

**Transformations appliquées :**
- **ObjectId → string** : conversion pour JSON
- **Date → ISO string** : format standardisé
- **Optionnel préservé** : `completedAt`, `claimedAt`, `lastResetAt` peuvent être undefined

## Limitations et améliorations futures

### Limitations actuelles

#### 1. Reset des quêtes quotidiennes trop radical

**Problème :** Le cron job supprime toutes les progressions des quêtes quotidiennes sans distinction.

**Conséquence :**
- Une quête complétée à 23h59 mais non réclamée est perdue à minuit
- Pas de notification avant la suppression
- Pas de "grace period" pour réclamer les récompenses

**Impact utilisateur :**
- Frustration si oubli de réclamation avant minuit
- Perte de progression sans préavis

**Solution recommandée :**
Implémenter un système de "quêtes expirées réclamables" :

```typescript
// Au lieu de deleteMany, marquer comme expirées
const bulkOps = dailyQuestIds.map(questId => ({
  updateMany: {
    filter: { 
      questId,
      completedAt: { $ne: null },
      claimedAt: null
    },
    update: { 
      $set: { lastResetAt: new Date() }
    }
  }
}))

// Supprimer uniquement les quêtes non complétées
const deleteOps = dailyQuestIds.map(questId => ({
  deleteMany: {
    filter: { 
      questId,
      completedAt: null
    }
  }
}))
```

Permettre la réclamation pendant 24h après expiration.

#### 2. Quêtes de niveau non implémentées

**Problème :** Les achievements `level_up_monster` (niveau 10/20) ne sont jamais mis à jour.

**Cause :**
- Aucun appel à `incrementQuestProgress('level_up_monster', level)` après level-up
- Pas de hook dans `performMonsterAction()` pour ces quêtes

**Code manquant dans `performMonsterAction()` :**

```typescript
if (leveledUp) {
  // Vérifier les achievements de niveau
  for (const questDef of questsObjectiveMap.level_up_monster) {
    if (currentLevel >= questDef.target) {
      let quest = await Quest.findOne({ userId, questId: questDef.id }).exec()
      if (quest === null) {
        quest = new Quest({
          userId,
          questId: questDef.id,
          questObjective: 'level_up_monster'
        })
      }
      quest.progress = currentLevel
      await quest.save()
    }
  }
}
```

**Impact :**
- Achievements `achievement_level_10` et `achievement_level_20` impossibles à compléter

#### 3. Quêtes de backgrounds non implémentées

**Problème :** Les achievements `unlock_backgrounds` ne sont jamais mis à jour.

**Cause :**
- Aucun appel dans `unlockBackground()` ou équivalent
- Pas de fonction `checkBackgroundQuests()` similaire à `checkOwnershipQuests()`

**Solution :**
Créer une Server Action dédiée :

```typescript
export async function checkBackgroundQuests(): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }
  
  const userId = session.user.id
  
  // Compter les backgrounds débloqués
  const unlockedCount = await Background.countDocuments({ 
    [`unlockedBy.${userId}`]: true 
  }).exec()
  
  for (const questDef of questsObjectiveMap.unlock_backgrounds) {
    let quest = await Quest.findOne({ userId, questId: questDef.id }).exec()
    if (quest === null) {
      quest = new Quest({
        userId,
        questId: questDef.id,
        questObjective: 'unlock_backgrounds'
      })
    }
    quest.progress = unlockedCount
    await quest.save()
  }
}
```

Appeler cette fonction après chaque déblocage de background.

#### 4. Pas de notifications pour quêtes complétées

**Problème :** L'utilisateur n'est pas notifié lorsqu'une quête atteint 100%.

**État actuel :**
- Détection de complétion silencieuse via hook pre-save
- Pas de mécanisme de notification temps réel
- Utilisateur doit naviguer vers `/app/quests` pour voir l'état

**Solution idéale :**
Implémenter un système de notifications :

```typescript
// Dans le hook pre-save
questSchema.pre('save', async function(next) {
  const wasCompleted = this.completedAt !== undefined
  
  // ... logique existante
  
  if (this.progress >= questDef.target && !wasCompleted) {
    // Nouvelle complétion détectée
    await Notification.create({
      userId: this.userId,
      type: 'quest_completed',
      questId: this.questId,
      message: `Quête complétée : ${questDef.title}`,
      read: false
    })
  }
  
  next()
})
```

Afficher les notifications dans un dropdown du header.

#### 5. Performance des mises à jour de quêtes

**Problème :** Chaque action déclenche plusieurs appels DB séquentiels pour les quêtes.

**Exemple :** Une action `feed` génère :
1. `incrementQuestProgress('feed_monsters', 1)` : 4 queries (daily + 3 achievements)
2. `incrementQuestProgress('total_actions', 1)` : 5 queries (2 daily + 3 achievements)
3. `checkCareDifferentMonstersProgress()` : 2 queries (1 count + 1 update)

**Total : 11 queries DB** pour une seule action.

**Optimisation possible :**
Grouper toutes les mises à jour en un seul `bulkWrite()` :

```typescript
const allQuestUpdates = [
  ...questsObjectiveMap.feed_monsters.map(q => ({ filter: { userId, questId: q.id }, update: { $inc: { progress: 1 } } })),
  ...questsObjectiveMap.total_actions.map(q => ({ filter: { userId, questId: q.id }, update: { $inc: { progress: 1 } } })),
  // etc.
]

await Quest.bulkWrite(allQuestUpdates.map(u => ({
  updateOne: {
    ...u,
    upsert: true
  }
})))
```

**Compromis :** Perte du hook pre-save automatique (nécessiterait logique de complétion manuelle).

### Améliorations prioritaires

1. **Implémentation des quêtes de niveau** : compléter le système existant
2. **Implémentation des quêtes de backgrounds** : créer `checkBackgroundQuests()`
3. **Grace period de 24h** : permettre réclamation des quêtes expirées
4. **Notifications de complétion** : feedback temps réel
5. **Optimisation bulkWrite** : réduire le nombre de queries DB

## Conclusion

Le système de quêtes de MyMonster présente une architecture solide avec séparation claire entre définitions (configuration), progression (modèle Mongoose) et interface utilisateur (composants React). La double indexation via Maps garantit des performances optimales pour les 45 quêtes configurées, tandis que les hooks Mongoose automatisent les détections de complétion et les propagations inter-systèmes.

L'intégration avec le système de portefeuille via hooks post-save démontre un couplage intelligent entre domaines, et le cron job de reset quotidien assure le renouvellement mécanique des objectifs courts termes. Le pattern de sérialisation préserve une séparation stricte entre couches serveur et client, respectant les contraintes de React Server Components.

Les limitations identifiées (quêtes de niveau/backgrounds non implémentées, reset radical sans grace period, performance des updates) sont documentées avec des solutions techniques concrètes. L'architecture actuelle constitue néanmoins une fondation extensible pour un système de progression complet, capable de supporter l'ajout de nouvelles catégories de quêtes et l'implémentation de mécaniques plus sophistiquées de tracking et de notification.
