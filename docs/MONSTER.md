# Système de Monstres

## Vue d'ensemble

Le système de monstres constitue le cœur mécanique de l'application MyMonster, implémentant une mécanique de Tamagotchi digital. Chaque monstre possède une apparence générée procéduralement, un système d'états émotionnels, un système de progression par niveaux et un mécanisme d'actions interactives. Cette feature intègre également un système d'animations CSS pour donner vie aux créatures et un dashboard permettant la gestion de plusieurs monstres simultanément.

Bien que fonctionnelle, cette implémentation présente des limitations temporelles qui ont restreint certaines ambitions initiales. Les animations lors des actions utilisateur sont partielles, et les actions n'impactent pas réellement le comportement ou l'état à long terme du monstre au-delà des mécaniques de récompense (pièces et expérience).

## Architecture des monstres

### Modèle de données MongoDB

Le schéma Mongoose définit une structure documentaire riche pour chaque monstre (`src/db/models/monster.model.ts`) :

```typescript
export interface IMonsterDocument extends Document {
  _id: Types.ObjectId
  name: string
  level: number
  xp: number
  maxXp: number
  traits: IMonsterTraitsDocument
  state: MonsterState
  backgroundId: string | null
  isPublic: boolean
  ownerId: Types.ObjectId
  lastCaredAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

**Composants structurels :**
- **Identité** : `name` et `_id` unique
- **Progression** : `level`, `xp`, `maxXp` pour le système de niveaux
- **Apparence** : sous-document `traits` contenant les caractéristiques visuelles
- **État émotionnel** : `state` parmi six états possibles
- **Personnalisation** : `backgroundId` pour l'arrière-plan équipé
- **Visibilité** : `isPublic` pour la galerie publique
- **Propriété** : `ownerId` référence à l'utilisateur créateur
- **Tracking temporel** : `lastCaredAt` pour les quêtes quotidiennes

### Traits visuels des monstres

Le sous-document `IMonsterTraitsDocument` encapsule l'ensemble des caractéristiques visuelles générées procéduralement :

```typescript
export interface IMonsterTraitsDocument extends Document {
  bodyShape: MonsterBodyShape    // 'round' | 'pear' | 'blocky'
  eyeType: MonsterEyeShape        // 'dot' | 'round' | 'star'
  mouthType: MonsterMouthType     // 'simple' | 'toothy' | 'wavy'
  armType: MonsterArmType         // 'short' | 'long' | 'tiny'
  legType: MonsterLegType         // 'stumpy' | 'long' | 'feet'
  primaryColor: string            // Couleur principale (hex)
  secondaryColor: string          // Couleur des détails (hex)
  outlineColor: string            // Couleur des contours (hex)
  size: number                    // Échelle 80-120
}
```

Cette structure permet **3 × 3 × 3 × 3 × 3 = 243 combinaisons morphologiques** multipliées par **10 palettes de couleurs**, générant théoriquement 2430 variations distinctes.

### États émotionnels

Le système définit six états mutuellement exclusifs (configuration dans `src/config/monsters.config.ts`) :

```typescript
export const MONSTER_STATES = ['happy', 'sad', 'gamester', 'angry', 'hungry', 'sleepy'] as const
```

Chaque état :
- **Détermine l'animation** du monstre (bras, yeux, bouche)
- **Influence les récompenses** : une action correspondant à l'état octroie un bonus
- **Revient à `happy`** après toute action utilisateur

Cette mécanique encourage l'interaction contextuelle : nourrir un monstre affamé rapporte plus que nourrir un monstre triste par exemple.

## Génération procédurale des monstres

### Algorithme de génération déterministe

Le générateur de monstres (`src/monster/generator.ts`) implémente un algorithme de génération procédurale basé sur un seed textuel. Le nom du monstre sert de graine déterministe garantissant la reproductibilité :

```typescript
export function generateMonsterTraits(name: string): ISerializedMonsterTraits {
  const seed = stringToSeed(name)
  const random = seededRandom(seed)
  
  const colorPalette = pickRandom(COLOR_PALETTES, random)
  
  return {
    bodyShape: pickRandom(BODY_SHAPES, random),
    eyeType: pickRandom(EYE_TYPES, random),
    mouthType: pickRandom(MOUTH_TYPES, random),
    armType: pickRandom(ARM_TYPES, random),
    legType: pickRandom(LEG_TYPES, random),
    primaryColor: colorPalette.primary,
    secondaryColor: colorPalette.secondary,
    outlineColor: colorPalette.outline,
    size: Math.floor(random() * 40) + 80
  }
}
```

**Caractéristiques techniques :**

1. **Conversion nom → seed** : fonction de hashing transformant la chaîne en entier 32 bits
2. **PRNG seeded (LCG)** : générateur de nombres pseudo-aléatoires Linear Congruential Generator
3. **Sélection déterministe** : même nom produit toujours le même monstre
4. **Palettes harmonisées** : 10 palettes pré-définies inspirées d'Undertale

### Hashing du nom en seed

La fonction `stringToSeed()` implémente un algorithme de hashing simple mais efficace :

```typescript
function stringToSeed(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Conversion 32-bit
  }
  return Math.abs(hash)
}
```

Ce hashing garantit :
- **Déterminisme** : "Fluffy" génère toujours le seed 1847392847
- **Distribution uniforme** : collisions minimales sur l'espace des noms
- **Performance** : complexité O(n) avec n = longueur du nom

### Générateur pseudo-aléatoire (LCG)

Le PRNG utilise l'algorithme LCG (Linear Congruential Generator) standard :

```typescript
function seededRandom(seed: number): () => number {
  let current = seed
  return () => {
    current = (current * 1103515245 + 12345) % 2147483648
    return current / 2147483648
  }
}
```

**Paramètres LCG :**
- **Multiplicateur** : 1103515245 (constante POSIX)
- **Incrément** : 12345
- **Modulo** : 2³¹ (2147483648)

Cette implémentation produit une séquence pseudo-aléatoire déterministe avec une période maximale, garantissant une distribution uniforme des traits.

### Palettes de couleurs

Les dix palettes harmonisées s'inspirent de l'esthétique cartoonesque d'Undertale :

```typescript
const COLOR_PALETTES = [
  { primary: '#FF6B9D', secondary: '#C44569', outline: '#1B1464' }, // Pink/Purple
  { primary: '#4ECDC4', secondary: '#44A08D', outline: '#0B4F6C' }, // Teal/Green
  { primary: '#FFD93D', secondary: '#F6C90E', outline: '#3C3C3C' }, // Yellow/Gold
  // ... 7 autres palettes
]
```

Chaque palette garantit :
- **Contraste suffisant** entre `primaryColor` et `outlineColor`
- **Harmonie visuelle** entre `primaryColor` et `secondaryColor`
- **Lisibilité** des contours avec `outlineColor` sombre

## Système de progression

### Mécanisme d'expérience et de niveaux

Chaque action sur un monstre octroie **25 XP** (configuration dans `src/config/rewards.config.ts`). Le seuil de niveau suit une courbe exponentielle :

```typescript
export function calculateMaxXp(level: number): number {
  return Math.floor(MONSTER_BASE_XP * Math.pow(level, 1.5))
}
```

**Progression empirique :**
- Niveau 1 → 2 : 100 XP (4 actions)
- Niveau 2 → 3 : 283 XP (11 actions cumulées)
- Niveau 3 → 4 : 520 XP (21 actions cumulées)
- Niveau 5 → 6 : 1118 XP (45 actions cumulées)

Cette courbe en puissance 1.5 équilibre la progression :
- **Courts niveaux initiaux** pour gratification rapide
- **Paliers croissants** pour maintenir l'engagement long terme
- **Scaling maîtrisé** évitant une explosion exponentielle

### Gestion de la montée de niveau

La Server Action `performMonsterAction()` implémente la logique de level-up avec un système de débordement d'XP :

```typescript
let newXp = monster.xp + XP_REWARD
let currentLevel = monster.level ?? 1
let currentMaxXp = monster.maxXp ?? 100
let leveledUp = false

while (newXp >= currentMaxXp) {
  leveledUp = true
  newXp -= currentMaxXp
  currentLevel += 1
  currentMaxXp = calculateMaxXp(currentLevel)
}
```

**Caractéristiques notables :**
- **Boucle while** : gère les montées de plusieurs niveaux simultanés (théoriquement impossible avec 25 XP/action)
- **Débordement d'XP** : l'excédent d'expérience est conservé pour le prochain niveau
- **Flag `leveledUp`** : déclenche la modal de célébration côté client

### Célébration visuelle du level-up

Le composant `LevelUpModal` (`src/components/monster/LevelUpModal.tsx`) affiche une célébration dramatique en plein écran lors d'une montée de niveau :

```typescript
export default function LevelUpModal({ isOpen, monsterName, newLevel, onClose }: LevelUpModalProps): ReactNode {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300)
      }, 3000)
      return () => { clearTimeout(timer) }
    }
  }, [isOpen, onClose])
  
  // ... render overlay avec animations
}
```

**Éléments visuels :**
- **Overlay sombre** avec `backdrop-blur-sm`
- **Gradient animé** avec pulse et glow effects
- **Particules** (émojis ✨) en animation bounce décalée
- **Badge de niveau** avec anneau doré
- **Fermeture automatique** après 3 secondes
- **Transitions fluides** entrée/sortie (300ms)

## Système d'actions interactives

### Cinq types d'actions

Le système définit cinq actions distinctes, chacune associée à un état spécifique :

| Action | État cible | Icône | Couleur |
|--------|-----------|-------|---------|
| `feed` | `hungry` | Utensils | golden-fizz |
| `play` | `gamester` | Gamepad2 | blood |
| `comfort` | `sad` | Heart | tolopea |
| `calm` | `angry` | Lightbulb | aqua-forest |
| `lullaby` | `sleepy` | Moon | seance |

Cette correspondance action-état permet le système de récompenses contextuelles.

### Implémentation de la Server Action

La fonction `performMonsterAction()` centralise toute la logique métier :

```typescript
export async function performMonsterAction(
  monsterId: string,
  actionType: ActionType
): Promise<PerformActionResult> {
  // 1. Validation session et monstre
  const session = await getSession()
  const monster = await Monster.findOne({ ownerId: session.user.id, _id: monsterId }).exec()
  
  // 2. Calcul des récompenses
  const isMatched = actionStateMap[actionType] === monster.state
  const coinsEarned = isMatched ? MATCHED_STATE_COIN_REWARD : BASE_COIN_REWARD
  
  // 3. Progression XP et level-up
  let newXp = monster.xp + XP_REWARD
  // ... logique de montée de niveau
  
  // 4. Mise à jour du monstre
  monster.xp = newXp
  monster.level = currentLevel
  monster.maxXp = currentMaxXp
  monster.state = 'happy' // Retour à l'état heureux
  monster.lastCaredAt = new Date() // Tracking pour quêtes
  await monster.save()
  
  // 5. Mise à jour du portefeuille
  const newCreditTotal = await updateWalletBalance(coinsEarned)
  
  // 6. Progression des quêtes
  await incrementQuestProgress(`${actionType}_monsters`, 1)
  await incrementQuestProgress('total_actions', 1)
  await checkCareDifferentMonstersProgress()
  
  // 7. Revalidation du cache
  revalidatePath(`/app/monster/${monsterId}`)
  revalidatePath('/app')
  revalidatePath('/app/quests')
  
  return { success: true, leveledUp, newLevel, newXp, maxXp, coinsEarned, newCreditTotal }
}
```

**Orchestration complexe :**
- **7 étapes séquentielles** garantissant la cohérence transactionnelle
- **3 appels de revalidation** pour synchroniser les caches Next.js
- **3 quêtes mises à jour** automatiquement
- **Retour structuré** avec toutes les données nécessaires au client

### Récompenses contextuelles

Le système de bonus d'état encourage l'interaction pertinente :

```typescript
const actionStateMap: Record<ActionType, MonsterState> = {
  feed: 'hungry',
  play: 'gamester',
  comfort: 'sad',
  calm: 'angry',
  lullaby: 'sleepy'
}

const isMatched = actionStateMap[actionType] === monster.state
const coinsEarned = isMatched ? MATCHED_STATE_COIN_REWARD : BASE_COIN_REWARD
```

**Mécanique de récompenses :**
- **Action non-matching** : 1 pièce + 25 XP
- **Action matching** : 2 pièces + 25 XP
- **Retour à `happy`** : systématique après toute action

Cette mécanique simple crée une boucle de gameplay :
1. Observer l'état du monstre
2. Choisir l'action appropriée pour le bonus
3. Recevoir la récompense doublée
4. Attendre le prochain état (géré ailleurs, non implémenté actuellement)

### Composant `MonsterActions`

Le composant client affiche une grille 2×3 de boutons d'action colorés :

```tsx
export default function MonsterActions({ monsterId, monsterName, onCoinsEarned, onActionComplete }: MonsterActionsProps): ReactNode {
  const [isProcessing, setIsProcessing] = useState(false)
  const [levelUpState, setLevelUpState] = useState({ isOpen: false, newLevel: 1 })
  
  const handleAction = async (actionType: ActionType): Promise<void> => {
    setIsProcessing(true)
    const result = await performMonsterAction(monsterId, actionType)
    
    if (result.success) {
      onCoinsEarned?.(result.coinsEarned)
      if (result.leveledUp) {
        setLevelUpState({ isOpen: true, newLevel: result.newLevel })
      }
      onActionComplete?.()
      router.refresh()
    }
    
    setIsProcessing(false)
  }
  
  // ... render de 5 boutons
}
```

**Gestion des états :**
- **`isProcessing`** : désactive tous les boutons pendant l'action
- **`levelUpState`** : contrôle l'affichage de la modal de célébration
- **Callbacks optionnels** : `onCoinsEarned` pour l'animation de pièces, `onActionComplete` pour rafraîchissement
- **`router.refresh()`** : force le rechargement des Server Components

## Système d'animations

### Définition des animations CSS

Le fichier `src/app/globals.css` définit huit animations keyframes pour donner vie aux monstres :

```css
@keyframes wave-arms {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
}

@keyframes wiggle-arms {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(5deg); }
  20% { transform: rotate(-5deg); }
  /* ... alternances rapides */
}

@keyframes shake-arms-hungry {
  0%, 85%, 100% { transform: rotate(0deg); }
  86%-99% { /* tremblements rapides */ }
}

@keyframes gaming-eyes {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes bounce-body {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes tears {
  0%, 100% { opacity: 0.7; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(5px); }
}
```

**Correspondance états-animations :**

| État | Bras | Yeux | Bouche | Corps |
|------|------|------|--------|-------|
| `happy` | wave-arms | - | - | - |
| `gamester` | wiggle-arms | gaming-eyes | - | bounce-body |
| `hungry` | shake-arms-hungry | - | chomp-mouth | - |
| `sad` | - | - | - | tears |
| `angry` | - | - | - | - |
| `sleepy` | - | - | - | - |

### Application conditionnelle des animations

Le composant `Arms` applique dynamiquement les classes d'animation selon l'état :

```tsx
const stateClassMap: Map<MonsterState | null, string> = new Map([
  ['happy', 'animate-wave-arms'],
  ['gamester', 'animate-wiggle-arms'],
  ['hungry', 'animate-shake-arms-hungry']
])

export default function Arms({ type, bodyShape, primaryColor, outlineColor, state }: ArmsProps): ReactNode {
  const stateClass = stateClassMap.get(state)
  
  switch (type) {
    case 'tiny':
      return <TinyArms className={stateClass} {...props} />
    case 'short':
      return <ShortArms className={stateClass} {...props} />
    case 'long':
      return <LongArms className={stateClass} {...props} />
  }
}
```

**Pattern utilisé :**
- **Map au lieu d'objet** : lookups O(1) performants
- **Propagation de `className`** : ajoutée aux classes de base du SVG
- **Propriété `transform-origin`** : centrée pour rotations naturelles
- **Animations infinies** : `animation: ... infinite`

### Architecture SVG compositionnelle

Le composant `MonsterAvatar` assemble les différentes parties dans un ordre de superposition précis :

```tsx
export default function MonsterAvatar({ traits, state, size = 200 }: MonsterAvatarProps): ReactNode {
  const scale = traits.size / 100
  
  return (
    <svg width={size} height={size} viewBox='0 0 200 200'>
      <g transform={`scale(${scale}) translate(...)`}>
        <Legs />          {/* Arrière-plan */}
        <Arms />          {/* Derrière le corps */}
        <Body />          {/* Corps principal */}
        <Head />          {/* Tête sur le corps */}
        <Eyes />          {/* Yeux sur la tête */}
        <Mouth />         {/* Bouche sur la tête */}
      </g>
    </svg>
  )
}
```

**Avantages de l'architecture :**
- **Composants SVG purs** : pas de dépendances externes
- **Layering précis** : ordre de rendu contrôlé
- **Scaling uniforme** : `traits.size` appliqué via transform
- **Réutilisabilité** : chaque partie est un composant indépendant

## Dashboard et gestion des monstres

### Création de monstres

Le formulaire de création (`CreateMonsterForm`) intègre une prévisualisation en temps réel :

```tsx
export default function CreateMonsterForm({ onNameChange, monsterName }: CreateMonsterFormProps): ReactNode {
  return (
    <div className='space-y-6'>
      <InputField
        type='text'
        name='monster-name'
        label='Nom de votre monstre'
        value={monsterName}
        onChangeText={onNameChange}
        placeholder='Ex: Fluffy, Sparkle, Shadow...'
        required
      />
      <p className='mt-2 text-sm text-gray-600'>
        💡 Le nom détermine l'apparence unique de votre monstre !
      </p>
    </div>
  )
}
```

**Workflow de création :**

1. **Saisie du nom** : input contrôlé avec `onNameChange`
2. **Génération preview** : traits calculés côté client via `generateMonsterTraits()`
3. **Validation formulaire** : champ requis + nom non vide
4. **Calcul du coût** : affichage dynamique selon le nombre de monstres existants
5. **Soumission** : appel à la Server Action `createMonster()`
6. **Débit du portefeuille** : via `updateWalletBalance(-cost)`
7. **Sauvegarde MongoDB** : création du document monstre
8. **Mise à jour quêtes** : `checkOwnershipQuests()` automatique
9. **Revalidation** : `revalidatePath('/app')`

### Système de coût logarithmique

Le coût de création augmente logarithmiquement avec le nombre de monstres possédés :

```typescript
export function calculateMonsterCreationCost(currentMonsterCount: number): number {
  if (currentMonsterCount === 0) {
    return 0 // Premier monstre gratuit
  }
  return Math.floor(MONSTER_CREATION_BASE_COST * Math.log2(currentMonsterCount + 1))
}
```

**Progression des coûts :**
- 1er monstre : **0 pièce** (gratuit)
- 2e monstre : **100 pièces**
- 3e monstre : **158 pièces**
- 4e monstre : **200 pièces**
- 5e monstre : **232 pièces**
- 10e monstre : **332 pièces**

Cette courbe logarithmique :
- **Encourage la collection** : coûts initiaux accessibles
- **Freine l'accumulation infinie** : croissance ralentie
- **Crée une économie équilibrée** : synergise avec les gains d'actions

### Affichage des cartes de monstres

Le composant `MonsterCard` affiche chaque monstre dans une grille responsive :

```tsx
export default function MonsterCard({ monster }: MonsterCardProps): ReactNode {
  const router = useRouter()
  const { label, emoji, color } = stateInfoMap[monster.state]
  
  const handleCardClick = (): void => {
    router.push(`/app/monster/${monster._id}`)
  }
  
  return (
    <div onClick={handleCardClick} className='group cursor-pointer ...'>
      <div className='mb-4'>
        <MonsterBackgroundDisplay backgroundId={monster.backgroundId}>
          <MonsterAvatar traits={monster.traits} state={monster.state} size={180} />
        </MonsterBackgroundDisplay>
      </div>
      
      <div className='px-6 pb-6 text-center'>
        <h3>{monster.name}</h3>
        
        <div className='flex items-center justify-center gap-2'>
          <span className='rounded-full bg-blood-100'>Niveau {monster.level}</span>
          <span className={cn('rounded-full', color)}>{label} {emoji}</span>
        </div>
      </div>
    </div>
  )
}
```

**Interactions :**
- **Carte cliquable** : navigation vers `/app/monster/[id]`
- **Hover effect** : scale 1.05 + border tolopea
- **Background personnalisé** : via `MonsterBackgroundDisplay`
- **Badges d'état** : niveau + état émotionnel

### Grille responsive

Le composant `MonstersGrid` organise les cartes en grille adaptive :

```tsx
<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
  {monsters.map(monster => (
    <MonsterCard key={monster._id} monster={monster} />
  ))}
</div>
```

**Breakpoints Tailwind :**
- Mobile (`< 640px`) : 1 colonne
- Tablette (`640px - 1024px`) : 2 colonnes
- Desktop (`1024px - 1280px`) : 3 colonnes
- Large desktop (`> 1280px`) : 4 colonnes

## Limitations et améliorations futures

### Limitations actuelles

Bien que fonctionnel, le système de monstres présente plusieurs lacunes dues aux contraintes temporelles du projet :

#### 1. Animations partielles lors des actions

**Problème :** Lorsqu'un utilisateur clique sur un bouton d'action (Nourrir, Jouer, etc.), le monstre ne réagit pas visuellement de manière spécifique à l'action.

**État actuel :**
- Les animations sont liées uniquement à l'état du monstre (`state`)
- Toutes les actions ramènent immédiatement l'état à `happy`
- Aucune animation transitoire n'est déclenchée au moment du clic

**Impact :**
- Feedback visuel limité pour l'utilisateur
- Pas de différenciation entre les actions
- Transition brutale état → happy sans phase intermédiaire

**Amélioration idéale :**
- Animation dédiée par type d'action (bouche qui s'ouvre pour feed, sauts pour play)
- Délai de 1-2 secondes avant le retour à l'état happy
- Particules ou effets visuels au moment de l'interaction

#### 2. Actions sans impact comportemental

**Problème :** Les actions ne modifient que les métriques numériques (XP, pièces) sans influencer le comportement du monstre.

**État actuel :**
- `performMonsterAction()` retourne toujours le monstre à `happy`
- Aucun système de dégradation d'état au fil du temps
- Pas de mécanique de "besoin" croissant

**Impact :**
- Gameplay répétitif sans variation
- Pas de conséquence à l'inaction
- Absence de mécanisme de Tamagotchi authentique (soin régulier nécessaire)

**Amélioration idéale :**
- Système de dégradation temporelle des états
- Notifications quand un monstre nécessite des soins
- États "critique" si ignoré trop longtemps
- Cycle de vie émotionnel autonome

#### 3. Système de niveaux sans impact gameplay

**Problème :** Le niveau d'un monstre est purement cosmétique.

**État actuel :**
- Niveau affiché comme badge
- Montée de niveau déclenche une célébration visuelle
- Aucun unlock, bonus ou modification de gameplay

**Impact :**
- Progression non gratifiante à long terme
- Pas d'incitation à maximiser le niveau
- Sentiment de futilité après plusieurs montées de niveau

**Amélioration idéale :**
- Déblocage de nouveaux backgrounds par niveau
- Augmentation des récompenses de pièces avec le niveau
- Apparition de nouvelles animations ou traits visuels
- Quêtes débloquées par paliers de niveau

#### 4. États émotionnels non persistants

**Problème :** L'état émotionnel est réinitialisé à `happy` après chaque action, rendant les autres états éphémères.

**État actuel :**
- Transition unique : `any_state → action → happy`
- Pas de système de gestion d'état intelligent
- L'état actuel semble aléatoire pour l'utilisateur

**Impact :**
- Difficulté à observer les animations non-happy
- Pas de stratégie dans le timing des actions
- Bonus d'état matching rarement observable

**Amélioration idéale :**
- États aléatoires avec durée minimum (5-10 minutes)
- Transitions d'état cohérentes (hungry → happy après feed, mais pas après play)
- Indicateur de temps restant avant changement d'état
- Historique des états pour tracking utilisateur

### Contraintes de développement

Ces limitations résultent principalement de :

- **Contraintes temporelles** : projet académique avec deadline fixe
- **Priorisation des features** : focus sur l'architecture et les systèmes fondamentaux
- **Complexité technique** : animations SVG conditionnelles complexes
- **Scope creep** : ajout tardif de nouvelles features (backgrounds, galerie)

### Pistes d'amélioration prioritaires

Par ordre de priorité décroissante :

1. **Système de dégradation temporelle** : cron job changeant l'état toutes les heures
2. **Animations d'actions** : 5 animations courtes déclenchées au clic
3. **Bonus de niveau** : multiplicateur de pièces basé sur le niveau
4. **Persistence d'état** : durée minimum de 10 minutes par état
5. **Notifications** : alertes quand un monstre nécessite des soins

## Architecture de rendu

### Composants Server vs Client

Le système monstres utilise intelligemment le pattern Server/Client de React 19 :

**Server Components :**
- `MonsterCard` : rendu initial statique
- Page `/app/monster/[id]` : fetch des données serveur
- `MonstersGrid` : liste des monstres

**Client Components :**
- `MonsterActions` : interactions utilisateur (useState, onClick)
- `LevelUpModal` : animations et transitions
- `CreateMonsterForm` : input contrôlé
- `MonsterPageClient` : orchestration client-side

**Justification :**
- **Performance** : rendu serveur pour contenu statique
- **Interactivité** : composants clients pour mutations
- **SEO** : contenu indexable côté serveur
- **Bundle size** : JavaScript réduit côté client

### Flux de données

```
Page serveur (getData)
    ↓
Server Component (MonsterCard)
    ↓
Client Component (MonsterActions)
    ↓
Server Action (performMonsterAction)
    ↓
Database mutation
    ↓
revalidatePath → refresh
    ↓
Server Component re-render
```

Ce flux garantit :
- **Single source of truth** : données serveur
- **Optimistic updates impossibles** : évite les désynchronisations
- **Refresh explicite** : `router.refresh()` après mutation

## Conclusion

Le système de monstres représente une implémentation solide des fondamentaux d'un Tamagotchi digital, avec une architecture technique élaborée pour la génération procédurale, la progression par niveaux et le rendu SVG compositionnel. Le découpage serveur/client respecte les best practices Next.js, et l'orchestration avec les systèmes de portefeuille et quêtes démontre une cohésion architecturale maîtrisée.

Cependant, les contraintes temporelles du projet ont limité l'approfondissement des mécaniques de gameplay. Les animations restent partielles, les actions manquent d'impact comportemental et le système de niveaux demeure purement cosmétique. Ces limitations sont documentées et comprises, mais ne diminuent pas la valeur de l'architecture mise en place, qui constitue une fondation extensible pour de futures itérations.

Les priorités d'amélioration identifiées (dégradation temporelle, animations d'actions, bonus de niveau) pourraient transformer ce système fonctionnel en une expérience de Tamagotchi complète et engageante, fidèle à la vision initiale du projet.
