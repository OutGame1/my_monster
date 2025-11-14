# MyMonster

Application web de type Tamagotchi développée dans le cadre d'un projet scolaire à My Digital School. Les utilisateurs peuvent créer et prendre soin de monstres virtuels, gagner des pièces, accomplir des quêtes et faire évoluer leurs créatures.

## Technologies utilisées

- **Framework** : Next.js 16.0.0 avec App Router et Turbopack
- **Langage** : TypeScript (mode strict)
- **Styling** : Tailwind CSS 4 avec palette de couleurs personnalisée
- **Base de données** : MongoDB avec Mongoose ODM
- **Authentification** : Better Auth
- **Upload d'images** : Cloudinary pour les photos de profil
- **Paiements** : Stripe Checkout
- **UI/UX** : Framer Motion, Lucide React, React Toastify
- **Validation** : Zod
- **Linting** : ts-standard

## Prérequis

- Node.js 22+ et npm
- MongoDB (MongoDB Atlas ou instance locale) pour la base de données
- Compte Cloudinary pour l'upload d'images de profil
- Compte Stripe pour les paiements
- Compte Better Auth pour l'authentification

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/OutGame1/my_monster.git
cd my_monster
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement (voir section suivante)

4. Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Variables d'environnement

Créer un fichier `.env` à la racine du projet en utilisant `.env.example` comme modèle :

```bash
# Base de données MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mymonster

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Stripe (paiements)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (images de profil)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Configuration détaillée

**MongoDB** :
- Créer un cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Obtenir l'URI de connexion depuis le dashboard
- Remplacer `username`, `password` et `cluster` par vos valeurs

**Better Auth** :
- [Générer une clé secrète aléatoire sécurisée](https://www.better-auth.com/docs/installation#set-environment-variables)
- En production, définir `BETTER_AUTH_URL` avec votre domaine

**Stripe** :
- Créer un compte sur [Stripe Dashboard](https://dashboard.stripe.com)
- Récupérer les clés API dans Developers > API Keys
- Configurer le webhook (voir section Stripe ci-dessous)

**Cloudinary** :
- Créer un compte gratuit sur [Cloudinary](https://cloudinary.com)
- Récupérer les identifiants depuis le Dashboard :
  - Cloud Name
  - API Key
  - API Secret
- Les transformations d'images sont automatiquement appliquées par l'application

## Scripts disponibles

```bash
# Développement avec Turbopack
npm run dev

# Build de production avec Turbopack
npm run build

# Démarrer en production
npm start

# Linting avec auto-correction
npm run lint
```

## Architecture du projet

```
src/
├── actions/             # Server Actions Next.js
├── app/                 # Pages Next.js (App Router)
│   ├── app/             # Dashboard principal
│   ├── profile/         # Profil utilisateur
│   ├── quests/          # Système de quêtes
│   ├── buy-coins/       # Boutique de pièces
│   └── sign-in/         # Authentification
├── components/          # Composants React réutilisables
│   ├── ui/              # Composants de base
│   ├── monster/         # Composants liés aux monstres
│   ├── dashboard/       # Composants du dashboard
│   ├── quests/          # Composants des quêtes
│   ├── shop/            # Composants de la boutique
│   └── profile/         # Composants du profil
├── config/              # Fichiers de configuration
│   └── ...
├── db/                  # Modèles et connexion MongoDB
│   ├── index.ts
│   └── models/
├── lib/                 # Utilitaires et helpers
│   ├── serializers/     # Serializers pour MongoDB
│   ├── utils.ts
│   ├── cloudinary.ts    # Configuration Cloudinary
│   └── stripe.ts
└── types/               # Types TypeScript
```

## Mécaniques de jeu

### Système de monstres

Les monstres possèdent :
- **États** : happy, sad, gamester, angry, hungry, sleepy
- **Actions** : feed, play, comfort, calm, lullaby
- **Expérience** : Les monstres gagnent 25 XP par action
- **Niveaux** : Formule de montée de niveau : `maxXp = 100 * (level ^ 1.5)`

### Système de pièces

- **Balance initiale** : 25 pièces à la création du compte
- **Récompenses** : 
  - 1 pièce par action normale
  - 2 pièces si l'action correspond à l'état du monstre
- **Achats** : Packages de pièces disponibles dans la boutique
- **Suivi** : Le champ `totalEarned` suit le total cumulé de pièces gagnées

### Système de quêtes

**Quêtes quotidiennes** (8 quêtes) :
- Se réinitialisent chaque jour
- Récompenses de 5 à 12 pièces
- Objectifs simples liés aux actions des monstres

**Succès permanents** (29 succès) :
- Paliers d'actions : 250/500/1000 pour chaque type d'action
- Possession de monstres : 1/3/5 monstres
- Jalons de pièces : 500/1000/2500/5000 pièces gagnées (10% de cashback)

## Configuration Stripe

### Créer les produits dans Stripe

1. Accéder à [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Créer 4 produits avec les caractéristiques suivantes :

| Pièces | Prix | Description |
|--------|------|-------------|
| 150    | 1€   | Petit package |
| 350    | 2€   | Package moyen |
| 1000   | 5€   | Gros package |
| 2500   | 10€  | Package premium |

3. Pour chaque produit :
   - Type : Paiement unique (one-time payment)
   - Devise : EUR
   - Copier le Product ID (format : `prod_XXXXX`)

4. Mettre à jour les Product IDs dans `src/config/pricing.config.ts`

### Configurer le webhook Stripe

1. Accéder à [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Créer un endpoint avec l'URL : `https://votre-domaine.com/api/webhook/stripe`
3. Sélectionner les événements :
   - `checkout.session.completed`
   - `payment_intent.succeeded` (optionnel)
   - `payment_intent.payment_failed` (optionnel)
4. Copier le Signing Secret (format : `whsec_XXXXX`)
5. Ajouter la valeur dans `.env` : `STRIPE_WEBHOOK_SECRET=whsec_...`

### Test en local avec Stripe CLI

```bash
# Installer Stripe CLI
# https://stripe.com/docs/stripe-cli

# Se connecter à Stripe
stripe login

# Rediriger les webhooks vers localhost
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Dans un autre terminal, lancer l'application
npm run dev
```

### Cartes de test Stripe

Pour tester les paiements en mode test :
- Numéro : `4242 4242 4242 4242`
- Date d'expiration : N'importe quelle date future
- CVC : N'importe quel code à 3 chiffres

### Flow de paiement

1. L'utilisateur clique sur "Acheter" dans `/buy-coins`
2. Server Action `createCheckoutSession()` crée une session Stripe
3. Redirection vers Stripe Checkout
4. Paiement par carte bancaire
5. Stripe envoie un webhook à `/api/webhook/stripe`
6. Vérification de la signature du webhook
7. Mise à jour automatique du wallet MongoDB
8. Redirection vers `/app?payment=success`

### Sécurité des paiements

Le système utilise les webhooks Stripe pour garantir la sécurité :
- Seuls les webhooks signés par Stripe sont acceptés
- Le wallet est mis à jour côté serveur uniquement
- Aucune manipulation client ne peut falsifier le solde
- Les métadonnées contiennent userId et productId pour validation

### Production

Pour le passage en production :

1. Remplacer les clés test par les clés live dans `.env` :
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Créer un nouveau webhook pour la prod
```

2. Mettre à jour l'URL publique :
```bash
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

3. Configurer le webhook de production avec l'URL publique

4. Tester avec une vraie carte bancaire

## Palette de couleurs personnalisée

Le projet utilise une palette de couleurs thématique définie dans `src/app/globals.css` :

- **blood** (`#ff2d34`) : Couleur principale rouge
- **tolopea** (`#5f47ff`) : Accent violet
- **aqua-forest** (`#428751`) : Accent vert
- **golden-fizz** (`#e3f401`) : Jaune pour l'énergie
- **seance** (`#ff16f4`) : Magenta pour les effets spéciaux

Chaque couleur possède 10 variantes (50 à 950) pour une flexibilité maximale.

## Conventions de code

### TypeScript

- Mode strict activé
- Interfaces explicites pour tous les props
- Annotations de type de retour explicites
- Utilisation stricte de `===` et `!==` (jamais `==` ou `!=`)
- **JSDoc sans annotations de type** : TypeScript gère déjà le typage, les JSDoc sont en français et décrivent uniquement la logique
  - ❌ Incorrect : `@param {string} name - Le nom du monstre`
  - ✅ Correct : `@param name - Le nom du monstre`

### Composants React

```tsx
import type { ReactNode } from 'react'

interface ComponentProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export default function Component({ 
  children, 
  variant = 'primary' 
}: ComponentProps): ReactNode {
  // Implementation
}
```

### Styling

- Utilisation de `classnames` (importé comme `cn`) pour les classes conditionnelles
- Pas de classes Tailwind dynamiques avec template literals
- Création d'objets de mapping pour les classes dynamiques
- Approche mobile-first avec breakpoints `sm:`

### Base de données

- Utilisation de `.lean()` pour convertir les documents Mongoose
- Serializers dédiés dans `src/lib/serializers/`
- Pattern : `getWallet()` crée automatiquement si manquant
- Mises à jour via `updateWalletBalance()` avec tracking `totalEarned`

## Structure des données

Le projet utilise un système de typage structuré pour les modèles Mongoose, avec une séparation claire entre les définitions de types (`src/types/models/`) et l'implémentation des modèles (`src/db/models/`).

### Architecture des types Mongoose

Chaque modèle est défini avec 3 types principaux dans `src/types/models/*.model.d.ts` :

#### 1. `IXxxDocument` - Interface du document
Interface principale qui étend `Document<Types.ObjectId>` et définit tous les champs du document :

```typescript
export interface IMonsterDocument extends Document<Types.ObjectId> {
  name: string
  level: number
  xp: number
  maxXp: number
  traits: IMonsterTraitsDocument
  state: MonsterState
  ownerId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
```

#### 2. `IXxxModel` - Type du modèle
Type qui étend `Model` et inclut les méthodes statiques via intersection :

```typescript
export type IMonsterModel = Model<IMonsterDocument>

// Avec méthodes statiques (exemple Quest)
export type IQuestModel = Model<
  IQuestDocument,
  {}, // QueryHelpers
  IQuestInstanceMethods,
  IQuestVirtuals
> & IQuestStaticsMethods
```

#### 3. `IXxxSchema` - Type du schéma
Alias de type utilisé lors de la définition du schéma avec `new Schema<...>()` :

```typescript
export type IMonsterSchema = Schema<IMonsterDocument, IMonsterModel>

// Avec génériques complets (exemple Quest)
export type IQuestSchema = Schema<
  IQuestDocument,
  IQuestModel,
  IQuestInstanceMethods,
  {}, // QueryHelpers
  IQuestVirtuals,
  IQuestStaticsMethods
>
```

### Interfaces additionnelles (si nécessaire)

Pour les modèles avec méthodes ou propriétés virtuelles :

```typescript
// Méthodes d'instance
interface IQuestInstanceMethods {
  claim: () => Promise<void>
}

// Méthodes statiques
interface IQuestStaticsMethods {
  updateQuests: (userId, objective, progress) => Promise<void>
}

// Propriétés virtuelles
interface IQuestVirtuals {
  readonly quest: QuestDefinition
}
```

### Utilisation dans les modèles

```typescript
// src/db/models/monster.model.ts
import type { IMonsterModel, IMonsterSchema } from '@/types/models/monster.model'

const monsterSchema: IMonsterSchema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, default: 1 }
  // ...
})

const MonsterModel: IMonsterModel = 
  models.Monster as IMonsterModel ?? model('Monster', monsterSchema)

export default MonsterModel
```

### Avantages de cette architecture

- **Sécurité des types** : Inférence TypeScript complète pour les requêtes et méthodes
- **Séparation des responsabilités** : Types séparés de l'implémentation
- **Réutilisabilité** : Interfaces utilisables dans les serializers et actions
- **Documentation** : Contrat clair des capacités de chaque modèle
- **Maintenabilité** : Changements de structure nécessitent une mise à jour explicite des types

### Schémas de données

### Monster
```typescript
{
  name: string
  ownerId: string
  state: 'happy' | 'sad' | 'gamester' | 'angry' | 'hungry' | 'sleepy'
  level: number
  xp: number
  maxXp: number
  traits: MonsterTraits
  createdAt: Date
}
```

### Wallet
```typescript
{
  ownerId: string
  balance: number
  totalEarned: number
  createdAt: Date
  updatedAt: Date
}
```

### Quest
```typescript
{
  ownerId: string
  questId: string
  progress: number
  completedAt: Date | null
  claimedAt: Date | null
}
```

## Système de chargement progressif

Le projet utilise un système de skeleton loading pour améliorer l'expérience utilisateur :

### Principes

- **Bibliothèque** : `react-loading-skeleton` pour les effets de chargement
- **Architecture** : Les skeletons sont organisés par fonctionnalité
- **Pattern** : Chargement des données côté client avec affichage instantané de la page

### Organisation des fichiers

Les composants skeleton sont placés dans un dossier `skeletons/` au sein de chaque fonctionnalité :

```
src/components/quests/
├── QuestCard.tsx
├── QuestsContent.tsx
├── QuestsContentWrapper.tsx    # Gère le chargement client
└── skeletons/
    ├── QuestCardSkeleton.tsx
    └── QuestsContentSkeleton.tsx
```

### Implémentation

1. **Composant Skeleton** : Réplique la structure visuelle du composant réel
2. **Wrapper Component** : Composant client qui gère le fetch des données
3. **Page Component** : Serveur component qui vérifie l'auth et affiche le wrapper

```tsx
// QuestsContentWrapper.tsx
'use client'

export default function QuestsContentWrapper() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData().then(result => {
      setData(result)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return <QuestsContentSkeleton />
  return <QuestsContent data={data} />
}
```

### Avantages

- Affichage instantané de la page
- Feedback visuel pendant le chargement
- Possibilité de cache statique
- Meilleure perception de performance

## Gestion des photos de profil

Le projet intègre un système complet d'upload et de gestion de photos de profil via Cloudinary.

### Fonctionnalités

**Interface utilisateur** :
- Modification de la photo via la page `/profile`
- Clic sur l'avatar pour sélectionner une nouvelle image
- Overlay au hover indiquant la possibilité de modification
- Badge caméra permanent dans le coin inférieur droit
- Loader animé pendant l'upload

**Validations côté client** :
- Type de fichier : uniquement les images (MIME type `image/*`)
- Taille maximale : 5 MB
- Messages d'erreur explicites via toast notifications

**Traitement d'image automatique** :
- Recadrage intelligent centré sur le visage : 96x96 pixels
- Optimisation automatique de la qualité et du format
- Stockage organisé dans le dossier `my_monster/profile_pictures`

**Gestion des erreurs** :
- Fallback vers une icône User générique en cas d'échec
- Notification utilisateur en cas d'erreur de chargement
- État d'erreur persistant pour éviter les tentatives répétées

### Architecture technique

**Composants** :

1. **`ProfileImageUploader`** (`src/components/profile/ProfileImageUploader.tsx`) :
   - Composant principal de gestion de l'upload
   - Gère la sélection de fichier via input caché
   - Effectue les validations côté client
   - Convertit le fichier en data URL via FileReader
   - Appelle le server action `updateProfileImage()`
   - Affiche les états de chargement et d'erreur

2. **`ProfileImage`** (`src/components/profile/ProfileImage.tsx`) :
   - Composant d'affichage de la photo de profil
   - Gestion du fallback vers l'icône User
   - Détection et signalement des erreurs de chargement
   - Optimisé avec Next.js Image (eager loading)

3. **`ProfileContent`** (`src/components/profile/ProfileContent.tsx`) :
   - Page de profil complète intégrant ProfileImageUploader
   - Affiche les informations du compte et statistiques du portefeuille

**Server Action** :

`updateProfileImage()` (`src/actions/user.actions.ts`) :
- Reçoit l'image au format data URL (base64)
- Vérifie la disponibilité du service Cloudinary
- Authentifie l'utilisateur via session Better Auth
- Upload l'image sur Cloudinary avec transformations
- Met à jour le champ `image` de l'utilisateur via Better Auth API
- Retourne l'URL sécurisée de l'image

**Configuration Cloudinary** :

`src/lib/cloudinary.ts` :
- Configuration du SDK Cloudinary avec les identifiants d'environnement
- Fonction `isCloudinaryConnected()` pour tester la connectivité
- Export de l'instance configurée pour les uploads

### Workflow d'upload

1. L'utilisateur clique sur son avatar dans `/profile`
2. Un input file caché s'ouvre pour sélectionner une image
3. Validations côté client (type + taille)
4. Conversion du fichier en data URL via FileReader
5. Appel du server action `updateProfileImage(dataUrl)`
6. Server action :
   - Vérifie la connectivité Cloudinary
   - Authentifie l'utilisateur
   - Upload l'image avec transformations automatiques
   - Met à jour le profil utilisateur
7. Rafraîchissement de la page pour afficher la nouvelle image
8. Toast de succès ou d'erreur selon le résultat

### Sécurité

- **Validations doubles** : client (UX) + serveur (sécurité)
- **Authentification requise** : vérification de session avant tout upload
- **Transformation côté serveur** : impossible pour le client de contourner le recadrage
- **URLs sécurisées** : Cloudinary génère des URLs HTTPS avec CDN
- **Limites de taille** : protection contre les uploads massifs

### Configuration requise

Variables d'environnement nécessaires dans `.env` :

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Pour obtenir ces identifiants :
1. Créer un compte sur [Cloudinary](https://cloudinary.com)
2. Accéder au Dashboard
3. Copier les valeurs depuis la section "Account Details"

### Transformations appliquées

Lors de l'upload, Cloudinary applique automatiquement :

```javascript
{
  folder: 'my_monster/profile_pictures',
  transformation: [
    { 
      width: 96, 
      height: 96, 
      crop: 'fill', 
      gravity: 'face' // Centrage intelligent sur le visage
    },
    { 
      quality: 'auto',      // Optimisation qualité
      fetch_format: 'auto'  // Format optimal (WebP si supporté)
    }
  ]
}
```

### Gestion en production

**Performance** :
- CDN Cloudinary pour distribution mondiale rapide
- Formats modernes (WebP) pour réduire la bande passante
- Transformation au vol (pas de stockage multiples versions)
- Cache-Control headers automatiques

**Monitoring** :
- Console logs des uploads (succès/échec)
- Notifications toast pour feedback utilisateur
- Cloudinary Dashboard pour statistiques d'utilisation

**Quotas Cloudinary gratuit** :
- 25 crédits/mois (largement suffisant pour un usage raisonnable)
- Stockage : 25 GB
- Bande passante : 25 GB
- Transformations : illimitées

## Déploiement

### Vercel (recommandé)

1. Connecter le dépôt GitHub à Vercel
2. Configurer les variables d'environnement dans le dashboard
3. Déployer automatiquement à chaque push

### Autre hébergeur

1. Builder le projet :
```bash
npm run build
```

2. Démarrer le serveur :
```bash
npm start
```

3. S'assurer que les variables d'environnement sont configurées

## Dépannage

### Le webhook ne fonctionne pas

- Vérifier que l'URL est accessible publiquement
- Consulter les logs dans Stripe Dashboard > Webhooks
- En local, utiliser Stripe CLI : `stripe listen --forward-to localhost:3000/api/webhook/stripe`

### Erreur de signature invalide

- Vérifier que `STRIPE_WEBHOOK_SECRET` correspond au webhook créé
- S'assurer d'utiliser `req.text()` et non `req.json()` dans le handler
- Le secret doit être celui du webhook spécifique (test ou production)

### Paiement réussi mais pièces non ajoutées

- Vérifier les logs du webhook
- S'assurer que `metadata.userId` et `metadata.productId` sont présents
- Vérifier que le `productId` existe dans `pricing.config.ts`

### Erreur de connexion MongoDB

- Vérifier l'URI de connexion dans `.env`
- S'assurer que l'IP est autorisée dans MongoDB Atlas (Network Access)
- Vérifier les identifiants de connexion

## Licence

Projet développé dans le cadre d'un cursus académique à My Digital School.
