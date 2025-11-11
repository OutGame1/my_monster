# MyMonster

Application web de type Tamagotchi développée dans le cadre d'un projet scolaire à My Digital School. Les utilisateurs peuvent créer et prendre soin de monstres virtuels, gagner des pièces, accomplir des quêtes et faire évoluer leurs créatures.

## Technologies utilisées

- **Framework** : Next.js 16.0.0 avec App Router et Turbopack
- **Langage** : TypeScript (mode strict)
- **Styling** : Tailwind CSS 4 avec palette de couleurs personnalisée
- **Base de données** : MongoDB avec Mongoose ODM
- **Authentification** : Better Auth
- **Paiements** : Stripe Checkout
- **UI/UX** : Framer Motion, Lucide React, React Toastify
- **Validation** : Zod
- **Linting** : ts-standard

## Prérequis

- Node.js 22+ et npm
- MongoDB (MongoDB Atlas ou instance locale) pour la base de données
- Compte Stripe pour les paiements)
- Compte Better Auth pour l'authentification)

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
│   └── shop/            # Composants de la boutique
├── config/              # Fichiers de configuration
│   └── ...
├── db/                  # Modèles et connexion MongoDB
│   ├── index.ts
│   └── models/
├── lib/                 # Utilitaires et helpers
│   ├── serializers/     # Serializers pour MongoDB
│   ├── utils.ts
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
