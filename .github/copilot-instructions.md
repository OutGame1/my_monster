# Instructions Copilot pour My Monster

## 🏗️ Architecture et Principes

Ce projet suit **Clean Architecture** et **Clean Code** de manière stricte.

### 📁 Structure du Projet (RÉELLE - Janvier 2025)

```
src/
├── actions/                # ⚡ SERVER ACTIONS (Next.js)
│   └── monsters.actions.ts # Actions serveur pour les monstres
│
├── app/                    # 📱 NEXT.JS APP ROUTER
│   ├── page.tsx           # Page d'accueil
│   ├── layout.tsx         # Layout racine
│   ├── globals.css        # Styles globaux (Tailwind + couleurs)
│   ├── dashboard/         # Dashboard utilisateur
│   │   ├── page.tsx
│   │   └── monster/[id]/  # Détail d'un monstre
│   ├── sign-in/           # Authentification
│   ├── temp/              # Page temporaire (création monstre)
│   ├── test/              # Pages de test
│   │   └── monster-generator/  # Test génération visuelle
│   └── api/
│       └── auth/[...all]/ # Better-Auth endpoints
│
├── components/             # 🧩 TOUS LES COMPOSANTS UI
│   ├── ui/                # Composants de base réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── InputField.tsx
│   │   ├── Modal.tsx
│   │   └── MonsterCard.tsx
│   │
│   ├── monster/           # Composants spécifiques aux monstres
│   │   ├── MonsterAvatar.tsx        # Avatar SVG animé
│   │   ├── MonsterCardInteractive.tsx
│   │   └── parts/         # Parties du monstre (SVG)
│   │       ├── MonsterBody.tsx
│   │       ├── MonsterEyes.tsx
│   │       ├── MonsterMouth.tsx
│   │       └── MonsterAccessories.tsx
│   │
│   ├── dashboard/         # Composants dashboard
│   │   └── MonsterOverview.tsx  # Vue spotlight + grille
│   │
│   ├── forms/             # Formulaires
│   │   ├── AuthFormContent.tsx
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   │
│   ├── modals/            # Modales
│   │   └── AdoptMonsterModal.tsx
│   │
│   ├── sections/          # Sections de pages (homepage)
│   │   ├── HeroSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── MonstersSection.tsx
│   │   └── NewsletterSection.tsx
│   │
│   └── content/           # Contenus de pages complexes
│       ├── DashboardContent.tsx
│       └── MonsterDetailContent.tsx
│
├── core/                   # 🎯 LOGIQUE MÉTIER PURE
│   ├── models/            # Types et interfaces métier
│   │   └── monster-visual.model.ts
│   ├── services/          # Services métier
│   │   └── monster-visual.service.ts
│   ├── generators/        # Générateurs (visuel, random)
│   │   └── monster-visual.generator.ts
│   └── use-cases/         # Scénarios métier
│       └── create-monster.use-case.ts
│
├── db/                     # 📦 BASE DE DONNÉES
│   ├── index.ts           # Connexion MongoDB
│   └── models/            # Modèles Mongoose
│       └── monster.model.ts
│
├── hooks/                  # 🎣 CUSTOM HOOKS
│   ├── useMonsterVisual.ts    # Génération profil visuel
│   ├── useRandomMonster.ts    # Monstre aléatoire (homepage)
│   └── useStaticMonsters.ts   # Galerie statique
│
├── lib/                    # 🛠️ UTILITAIRES
│   ├── auth.ts            # Configuration Better-Auth
│   ├── auth-client.ts     # Client auth
│   ├── env.ts             # Variables d'environnement
│   ├── monster-generator.ts
│   ├── serializers/       # Sérializers type-safe
│   │   └── monster.serializer.ts
│   └── zod_schemas/       # Validation
│       ├── env.schema.ts
│       └── monster.schema.ts
│
└── types/                  # 📝 TYPES GLOBAUX
    └── monster.types.ts
```

### 🎯 Règle des Dépendances (SIMPLIFIÉE)

```
APP ROUTER → SERVER ACTIONS → COMPONENTS → CORE
                                ↓
                              HOOKS
```

**Principe de base : Les dépendances vont toujours vers l'intérieur**

- `core/` : Ne dépend de RIEN (logique métier pure, services, générateurs)
- `hooks/` : Dépend du `core/` (encapsule la logique réutilisable)
- `components/` : Dépend du `core/` et `hooks/` (UI pure + logique visuelle)
- `actions/` : Utilise `core/` + `db/` (Server Actions Next.js)
- `app/` : Utilise `actions/` + `components/` (orchestration des pages)

### ⚡ Server Actions - Règles Strictes

**❌ PAS D'API ROUTES** - Utiliser uniquement des Server Actions

```typescript
// ✅ BON - Server Action
'use server'

export async function createMonster(data: CreateMonsterInput) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: 'Not authenticated' }
  
  const repository = new MongoMonsterRepository()
  const monster = await repository.save(data)
  
  revalidatePath('/dashboard')
  return { success: true, monsterId: monster._id }
}

// ❌ MAUVAIS - API Route (ne plus utiliser)
export async function POST(request: Request) {
  // NE PLUS CRÉER DE ROUTES API
}
```

**Conventions Server Actions :**
- Toujours `'use server'` en première ligne
- Nom de fonction descriptif (verbe + nom)
- Retour type `{ success: boolean; data?: T; error?: string }`
- Gestion d'authentification dans chaque action
- `revalidatePath()` après modifications

### 📐 Principes SOLID (Application Stricte)

##### Single Responsibility Principle (SRP)
- **Règle** : Chaque module/classe/fonction a UNE SEULE raison de changer
- **Application pratique** :
  - Un composant = une responsabilité visuelle
  - Un hook = une logique métier isolée
  - Un service = une famille d'opérations cohérentes
  - Un repository = accès à une seule entité
- **Exemples à suivre** :
  ```typescript
  // ✅ BON - Responsabilité unique
  const useMonsterCreation = () => { /* logique de création */ }
  const MonsterForm = () => { /* affichage formulaire */ }
  
  // ❌ MAUVAIS - Multiples responsabilités
  const MonsterManager = () => { /* création + affichage + validation + API */ }
  ```

##### Open/Closed Principle (OCP)
- **Règle** : Ouvert à l'extension, fermé à la modification
- **Application pratique** :
  - Utiliser des interfaces/types pour définir des contrats
  - Stratégies via props ou configuration
  - Composition de composants plutôt que modification
- **Exemples** :
  ```typescript
  // ✅ BON - Extension via props
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }
  
  // ✅ BON - Extension via composition
  <Card>
    <CardHeader />
    <CardContent />
    <CardFooter />
  </Card>
  ```

##### Liskov Substitution Principle (LSP)
- **Règle** : Les sous-types doivent être substituables à leurs types de base
- **Application pratique** :
  - Respecter les contrats d'interface
  - Ne pas modifier le comportement attendu
  - Types génériques cohérents
- **Exemples** :
  ```typescript
  // ✅ BON - Contrat respecté
  interface Repository<T> {
    findById(id: string): Promise<T | null>;
    save(entity: T): Promise<T>;
  }
  
  class MonsterRepository implements Repository<MonsterModel> {
    // Implémentation qui respecte le contrat
  }
  ```

##### Interface Segregation Principle (ISP)
- **Règle** : Interfaces spécifiques plutôt qu'une interface générale
- **Application pratique** :
  - Props minimales et ciblées
  - Interfaces séparées pour différents cas d'usage
  - Pas de dépendances inutiles
- **Exemples** :
  ```typescript
  // ✅ BON - Interfaces spécifiques
  interface Readable {
    read(): Promise<Data>;
  }
  
  interface Writable {
    write(data: Data): Promise<void>;
  }
  
  // ❌ MAUVAIS - Interface trop large
  interface DataAccess {
    read(): Promise<Data>;
    write(data: Data): Promise<void>;
    delete(id: string): Promise<void>;
    update(id: string, data: Data): Promise<void>;
    // Force à implémenter tout même si besoin que read
  }
  ```

##### Dependency Inversion Principle (DIP)
- **Règle** : Dépendre d'abstractions, pas d'implémentations concrètes
- **Application pratique** :
  - Définir interfaces dans `core/models`
  - Implémenter dans `infrastructure`
  - Injecter les dépendances via props ou contexte
- **Exemples** :
  ```typescript
  // ✅ BON - Dépendance sur abstraction
  // core/repositories/monster.repository.interface.ts
  export interface IMonsterRepository {
    findAll(): Promise<MonsterModel[]>;
  }
  
  // infrastructure/repositories/monster.repository.ts
  export class MongoMonsterRepository implements IMonsterRepository {
    async findAll() { /* implémentation MongoDB */ }
  }
  
  // presentation/hooks/useMonsters.ts
  const useMonsters = (repository: IMonsterRepository) => {
    // Utilise l'interface, pas l'implémentation
  }
  ```

#### 2. **Clean Code - Règles Strictes**

##### Nommage
- **Variables** : substantifs descriptifs en camelCase
  - `monsterName`, `userProfile`, `isLoading`, `hasError`
- **Fonctions** : verbes en camelCase décrivant l'action
  - `createMonster()`, `validateEmail()`, `handleSubmit()`
- **Server Actions** : verbes d'action en camelCase
  - `createMonster()`, `updateMonsterStats()`, `feedMonster()`
- **Composants** : PascalCase, noms de choses
  - `MonsterCard`, `AuthForm`, `DashboardLayout`
- **Constantes** : UPPER_SNAKE_CASE
  - `MAX_MONSTER_LEVEL`, `API_BASE_URL`
- **Types/Interfaces** : PascalCase avec préfixe I pour interfaces
  - `IMonsterRepository`, `MonsterModel`, `UserCredentials`
- **Booléens** : préfixes is/has/can/should
  - `isValid`, `hasPermission`, `canEdit`, `shouldDisplay`

##### Fonctions
- **Taille** : Maximum 20 lignes (idéalement 5-10)
- **Paramètres** : Maximum 3 paramètres (sinon objet de configuration)
- **Niveaux d'abstraction** : Un seul niveau par fonction
- **Pas d'effets de bord** : Une fonction fait ce que son nom indique
- **Early returns** : Sortir tôt pour réduire l'imbrication
```typescript
// ✅ BON - Early return
function validateMonster(monster: MonsterModel): boolean {
  if (!monster.name) return false;
  if (monster.level < 1) return false;
  if (monster.level > 100) return false;
  return true;
}

// ❌ MAUVAIS - Imbrication profonde
function validateMonster(monster: MonsterModel): boolean {
  if (monster.name) {
    if (monster.level >= 1) {
      if (monster.level <= 100) {
        return true;
      }
    }
  }
  return false;
}
```

##### Code Organization
- **DRY** : Extraire code dupliqué dans des fonctions/hooks
- **KISS** : Solution la plus simple qui fonctionne
- **YAGNI** : Ne pas anticiper des besoins futurs
- **Strict Equality** : TOUJOURS === et !==, JAMAIS == ou !=
- **Commentaires** : Expliquer le "pourquoi", pas le "quoi"
```typescript
// ✅ BON - Commentaire utile
// Utilisation de setTimeout pour éviter le rate limiting de l'API (max 10 req/sec)
await delay(100);

// ❌ MAUVAIS - Commentaire inutile
// Incrémente le compteur de 1
counter++;

// ✅ BON - Strict equality
if (monster.level === 0) { /* ... */ }
if (user !== null) { /* ... */ }

// ❌ MAUVAIS - Loose equality
if (monster.level == 0) { /* ... */ }  // INTERDIT !
if (user != null) { /* ... */ }  // INTERDIT !
```

##### Gestion des Erreurs
- **Try/catch** : Toujours autour des appels async
- **Messages explicites** : Décrire ce qui s'est passé
- **Logging** : Console.error en développement
- **Feedback utilisateur** : Toast ou message d'erreur contextuel
```typescript
// ✅ BON
try {
  await createMonster(data);
  toast.success('Monstre créé avec succès');
} catch (error) {
  console.error('Erreur lors de la création du monstre:', error);
  toast.error('Impossible de créer le monstre. Veuillez réessayer.');
}
```

#### 3. **Clean Architecture - Couches et Flux**

##### Règle des Dépendances
- **Flux** : `App Router → Server Actions → Components/Hooks → Core`
- **Core** : Ne dépend de RIEN (logique métier pure, services, générateurs)
- **Hooks** : Dépend du Core (logique réutilisable)
- **Components** : Dépend du Core et Hooks (UI + logique visuelle)
- **Actions** : Utilise Core + DB (Server Actions Next.js)
- **App** : Utilise Actions + Components (orchestration des pages)

##### Structure des Fichiers par Feature
```
feature/
  ├── core/
  │   ├── models/
  │   │   └── monster-visual.model.ts    # Types/Interfaces
  │   ├── services/
  │   │   └── monster-visual.service.ts   # Logique métier pure
  │   └── generators/
  │       └── monster-visual.generator.ts # Génération procédurale
  ├── db/
  │   └── models/
  │       └── monster.model.ts            # Modèle Mongoose
  ├── hooks/
  │   └── useMonsterVisual.ts             # Hook réutilisable
  ├── components/
  │   └── monster/
  │       ├── MonsterAvatar.tsx           # Composant UI
  │       └── MonsterCardInteractive.tsx
  └── actions/
      └── monsters.actions.ts             # Server Actions
```

##### Use Cases
- **Localisation** : `src/core/use-cases/`
- **Responsabilité** : Une action métier par use case
- **Signature** : `execute(input: Input): Promise<Output>`
- **Exemple** :
```typescript
// src/core/use-cases/create-monster.use-case.ts
export class CreateMonsterUseCase {
  constructor(private repository: IMonsterRepository) {}
  
  async execute(input: CreateMonsterInput): Promise<MonsterModel> {
    // 1. Validation
    this.validateInput(input);
    
    // 2. Logique métier
    const monster = this.buildMonster(input);
    
    // 3. Persistance
    return await this.repository.save(monster);
  }
  
  private validateInput(input: CreateMonsterInput): void {
    // Validation rules
  }
  
  private buildMonster(input: CreateMonsterInput): MonsterModel {
    // Business logic
  }
}
```

##### Repositories Pattern
- **Pas de couche Repository distincte** : Utilisation directe de Mongoose dans les Server Actions
- **Modèles** : `src/db/models/` (Mongoose schemas)
- **Serializers** : `src/lib/serializers/` (conversion Mongoose → Types)
- **Accès données** : Directement dans les Server Actions avec gestion d'erreurs

##### Services vs Use Cases
- **Services** : Dans `core/services/` - Logique métier pure réutilisable (génération visuelle, calculs)
- **Generators** : Dans `core/generators/` - Génération procédurale (monstres, avatars)
- **Use Cases** : Dans `core/use-cases/` - Scénarios métier complets (créer un monstre, combattre)
- **Hooks** : Dans `src/hooks/` - Logique réutilisable côté client (état, effets)

#### 4. **React/Next.js - Bonnes Pratiques**

##### Server Actions vs API Routes
- **❌ NE PLUS utiliser API Routes** pour la logique métier
- **✅ Utiliser Server Actions** pour toutes les mutations et requêtes
- **Appel depuis composants client** :
```typescript
'use client'

import { createMonster } from '@/actions/monsters.actions'

export default function MonsterForm() {
  const handleSubmit = async () => {
    const result = await createMonster({ name: 'Pikachu', type: 'electric' })
    if (result.success) {
      toast.success('Monstre créé !')
    }
  }
}
```

##### Params dynamiques (Next.js 15+)
```typescript
// ✅ BON - Await params
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params  // TOUJOURS await les params
  const data = await getData(id)
  return <div>{data.name}</div>
}

// ❌ MAUVAIS - Accès direct
export default async function Page({ params }: { params: { id: string } }) {
  const data = await getData(params.id)  // Erreur Next.js 15+
}
```

#### 5. **TypeScript - Typage Strict**

##### Configuration
- **strict**: true dans tsconfig.json
- **noImplicitAny**: true
- **strictNullChecks**: true

##### Bonnes Pratiques
- **❌ JAMAIS de 'any'** : Utiliser types appropriés ou 'unknown'
- **❌ JAMAIS de 'as' (type assertion)** : Créer des fonctions de conversion
- **❌ JAMAIS de JSON.parse(JSON.stringify())** : Utiliser serializers
- **❌ JAMAIS de == ou !=** : TOUJOURS utiliser === ou !== (strict equality)
- **✅ Serializers dédiés** : Pour convertir documents Mongoose
- **✅ TypeScript Standard Linting** : Suivre strictement les règles ESLint/TypeScript
- **Types explicites** : Pour paramètres et retours de fonction
- **Interfaces pour objets** : Types pour unions/primitives
- **Génériques** : Pour composants/fonctions réutilisables

```typescript
// ✅ BON - Serializer type-safe
export function serializeMonster(doc: Document & IMonsterModel): SerializedMonster {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    type: doc.type,
    // ... mappage explicite de tous les champs
  }
}

const monsters = await Monster.find({ ownerId: userId })
return serializeMonsters(monsters)  // Type-safe !

// ❌ MAUVAIS - Type assertion ou any
return JSON.parse(JSON.stringify(monsters)) as Monster[]  // Pas de vérification !
return monsters as any  // Très mauvais !

// ✅ BON - Strict equality
if (value === null) { /* ... */ }
if (monster.level !== 0) { /* ... */ }

// ❌ MAUVAIS - Loose equality (JAMAIS utiliser)
if (value == null) { /* ... */ }  // NON !
if (monster.level != 0) { /* ... */ }  // NON !
```

#### 6. **Testing - À Implémenter**

##### Structure
```
__tests__/
  ├── unit/           # Tests unitaires (fonctions pures)
  ├── integration/    # Tests d'intégration (API, DB)
  └── e2e/           # Tests end-to-end (Playwright)
```

##### Principes
- **AAA** : Arrange, Act, Assert
- **Un test = un scénario**
- **Noms descriptifs** : Décrire le comportement testé
- **Indépendance** : Tests isolés les uns des autres

## Style Guide
- **TailwindCSS**
  - Utiliser les classes utilitaires
  - Couleurs définies dans globals.css :
    - tolopea : violet (marque)
    - blood : rouge (CTA)
    - aqua-forest : vert (succès)
  - Préfixer les classes personnalisées
  - Mobile-first approach

- **Composants UI**
  - Card : conteneur avec ombre et bordure
  - Button : variants primary/secondary
  - InputField : style cohérent des formulaires
  - Animations douces (transition-all)

## Features
### Implémentées
- Page d'accueil avec métadonnées SEO
  - Hero section avec CTA
  - Bénéfices avec icônes
  - Galerie de monstres
  - Actions possibles
  - Newsletter (10% promo)
  - Header navigation
  - Footer légal

- Authentification (Better-Auth)
  - Page de connexion/inscription
  - Formulaires stylisés
  - Feedback avec Toasts
  - Animations de monstres

- Dashboard utilisateur
  - Vue d'ensemble des monstres
  - Liens vers les pages de détails
  - Utilise Server Actions

- Création de monstre
  - Via Server Action (pas d'API)
  - Validation des entrées
  - Feedback utilisateur
  - Génération visuelle automatique

- Système de génération visuelle SVG
  - 7 animations fluides
  - Génération procédurale basée sur le nom
  - Traits variables selon type et stats
  - bodyShape (round, oval, serpent, humanoid, blob)

- Page dédiée par monstre
  - Détails complets avec couleurs lisibles
  - Statistiques visuelles
  - Boutons d'interaction

### En cours
- Interactions avec les monstres (nourrir, caresser) via Server Actions
- Système de combat
- Évolution des monstres

## Base de données
- MongoDB Atlas comme BDD principale
- Connexion optimisée avec cache
- Serializers type-safe pour conversion Mongoose → Types
- Modèles avec enums français (MonsterType, MonsterRarity, MonsterMood)
- bodyShape stocké en base (pas bodyType)

## Workflows

### Workflow de Développement d'une Feature

1. **Core - Définir les Modèles et Services**
```typescript
// core/models/feature.model.ts
export interface FeatureProfile {
  id: string
  name: string
}

// core/services/feature.service.ts
export class FeatureService {
  generateProfile(input: Input): FeatureProfile {
    // Logique métier pure
  }
}
```

2. **Database - Modèle Mongoose**
```typescript
// db/models/feature.model.ts
import mongoose from 'mongoose'

const FeatureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // ... autres champs
})

export const Feature = mongoose.model('Feature', FeatureSchema)
```

3. **Actions - Server Action**
```typescript
// actions/features.actions.ts
'use server'

import { Feature } from '@/db/models/feature.model'
import { serializeFeature } from '@/lib/serializers/feature.serializer'

export async function createFeature(input: Input) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: 'Not authenticated' }
  
  const feature = await Feature.create(input)
  
  revalidatePath('/features')
  return { success: true, data: serializeFeature(feature) }
}
```

4. **Hooks - Custom Hook**
```typescript
// hooks/useFeature.ts
import { useEffect, useState } from 'react'
import { FeatureService } from '@/core/services/feature.service'

export function useFeature(input: Input) {
  const [profile, setProfile] = useState<FeatureProfile | null>(null)
  
  useEffect(() => {
    const service = new FeatureService()
    setProfile(service.generateProfile(input))
  }, [input])
  
  return profile
}
```

5. **Components - UI**
```typescript
// components/feature/FeatureCard.tsx
'use client'

import { createFeature } from '@/actions/features.actions'
import { useFeature } from '@/hooks/useFeature'

export default function FeatureCard() {
  const profile = useFeature(data)
  
  const handleCreate = async () => {
    const result = await createFeature(profile)
    if (result.success) {
      toast.success('Feature created!')
    }
  }
  
  return <div>{/* UI */}</div>
}
```

### 📋 Checklist Avant Commit (MISE À JOUR 2025)

- [ ] **Architecture** : Respect du flux de dépendances
- [ ] **Server Actions** : Toutes les mutations via actions (pas d'API routes)
- [ ] **Typage strict** : Pas de `any`, pas de `as`, serializers pour Mongoose
- [ ] **Equality** : TOUJOURS === et !==, JAMAIS == ou !=
- [ ] **TypeScript Standard** : Suivre strictement les règles ESLint (explicit return types, indent, etc.)
- [ ] **Params Next.js 15** : Toujours await les params dynamiques
- [ ] **Services** : Logique métier pure dans `core/services/`
- [ ] **Generators** : Génération procédurale dans `core/generators/`
- [ ] **Hooks** : Logique réutilisable dans `hooks/`
- [ ] **Components** : UI dans `components/`, organisés par fonctionnalité
- [ ] **SOLID** : Chaque principe vérifié
- [ ] **Clean Code** : Fonctions < 20 lignes, nommage explicite
- [ ] **Erreurs** : Try/catch avec messages explicites
- [ ] **Sérialisation** : Utiliser serializers au lieu de JSON.parse(stringify())
- [ ] **Lisibilité** : Couleurs de texte avec bon contraste (gray-700+, variants -800/-900)
- [ ] **Tests** : Logique métier critique testée

### 🚫 Anti-Patterns à Éviter

❌ **Créer des API Routes**
```typescript
// MAUVAIS - Ne plus faire
export async function POST(request: Request) {
  // NE PLUS UTILISER
}
```

✅ **Utiliser Server Actions**
```typescript
// BON
'use server'

export async function createMonster(data: CreateMonsterInput) {
  // Logique ici
}
```

❌ **Type assertion ou any**
```typescript
// MAUVAIS
const monsters = await Monster.find({})
return monsters as any
return JSON.parse(JSON.stringify(monsters)) as Monster[]
```

✅ **Serializers type-safe**
```typescript
// BON
const monsters = await Monster.find({})
return serializeMonsters(monsters)  // Conversion explicite
```

❌ **Accès direct aux params (Next.js 15+)**
```typescript
// MAUVAIS
export default async function Page({ params }: { params: { id: string } }) {
  const data = await getData(params.id)
}
```

✅ **Await params**
```typescript
// BON
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getData(id)
}
```

### 🔧 Structure Actuelle Validée

✅ **Bien organisés**
- `actions/` : Server Actions Next.js (remplacement des API routes)
- `core/models/` : Interfaces métier
- `core/services/` : Services métier
- `core/generators/` : Générateurs procéduraux
- `core/use-cases/` : Scénarios métier complets
- `components/monster/` : Composants métier spécifiques aux monstres
- `components/dashboard/` : Composants dashboard
- `components/ui/` : Composants UI génériques
- `components/sections/` : Sections de pages
- `components/content/` : Contenus de pages complexes
- `hooks/` : Custom hooks réutilisables
- `lib/serializers/` : Fonctions de sérialisation type-safe
- `db/models/` : Modèles Mongoose

✅ **Nouvellement ajoutés**
- `actions/monsters.actions.ts` : Toutes les Server Actions pour monstres
- `lib/serializers/monster.serializer.ts` : Sérialisation Mongoose → Types
- `components/monster/` : MonsterAvatar, MonsterCardInteractive, parts (SVG)
- `components/monstersOverview.tsx` : Vue spotlight + grille
- Suppression complète de `app/api/monsters/` (remplacé par actions)
- Suppression de `presentation/` (fonctionnalités intégrées dans components/ et hooks/)

### 🎨 Design System

**Couleurs (définies dans globals.css) :**
- `tolopea` : Violet principal (marque)
- `blood` : Rouge (CTA)
- `aqua-forest` : Vert (succès)

**Lisibilité des textes :**
- Titres : `text-gray-900` (noir intense)
- Labels : `text-gray-700` ou `text-gray-800`
- Badges/Pills : Utiliser variants `-800` ou `-900` sur fonds clairs
- Éviter `-500` ou `-600` sur fonds colorés (mauvais contraste)

**Exemples de bon contraste :**
```typescript
// ✅ BON - Badges lisibles
<span className="bg-purple-100 text-purple-900">Niveau 5</span>
<span className="bg-blue-100 text-blue-900">Feu</span>
<span className="bg-tolopea/20 text-tolopea-800">Rare</span>

// ❌ MAUVAIS - Faible contraste
<span className="bg-purple-100 text-purple-500">Niveau 5</span>
<span className="text-tolopea">Rare</span>  // Sur fond blanc = trop clair
```

### 📝 Modèle Monster - Champs importants

```typescript
interface IMonsterModel {
  name: string              // Nom unique (pas de nickname)
  type: MonsterType         // Enum français (Feu, Aquatique, etc.)
  rarity: MonsterRarity     // Enum français (Commun, Rare, etc.)
  mood: MonsterMood         // Enum français (Joyeux, Affamé, etc.)
  appearance: {
    bodyShape: 'round' | 'oval' | 'serpent' | 'humanoid' | 'blob'  // Forme visuelle
    primaryColor: string
    secondaryColor: string
  }
  // ... autres champs
}
```

---

**⚠️ IMPORTANT** : Cette structure est maintenant la référence. Tout nouveau code doit suivre cette organisation. Si un fichier est mal placé, le déplacer avant d'ajouter du code.

## 🆕 Changements Récents (Janvier 2025)

1. ✅ Migration complète vers Server Actions (suppression des API routes)
2. ✅ Typage strict sans `any` ni `as` (serializers dédiés)
3. ✅ Fix Next.js 15 (await params dans routes dynamiques)
4. ✅ Suppression du champ `nickname` (simplification)
5. ✅ Correction `bodyShape` vs `bodyType` (cohérence visuelle)
6. ✅ Amélioration lisibilité (couleurs de texte ajustées)
7. ✅ Métadonnées SEO sur page d'accueil
8. ✅ **STRICT EQUALITY ONLY** : Interdiction totale de == et !=, uniquement === et !==
9. ✅ **TypeScript Standard Linting** : Respect strict des règles ESLint (return types explicites, indentation correcte, ternaires formatés)
