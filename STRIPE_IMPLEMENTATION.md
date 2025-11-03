# Guide d'implémentation Stripe pour MyMonster

## 📋 Vue d'ensemble

Ce guide explique comment Stripe est intégré pour gérer les paiements de pièces dans MyMonster.

## 🔄 Flow de paiement

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ 1. Click "Acheter"
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  │
┌──────────────────┐                      │
│ createCheckout   │                      │
│ Session()        │                      │
│ (Server Action)  │                      │
└────────┬─────────┘                      │
         │ 2. Créer session Stripe        │
         ▼                                │
┌──────────────────┐                      │
│  Stripe API      │                      │
│  checkout.       │                      │
│  sessions.create │                      │
└────────┬─────────┘                      │
         │ 3. Retourner checkout URL      │
         ▼                                │
┌──────────────────┐                      │
│   Redirection    │◄─────────────────────┘
│   vers Stripe    │
│   Checkout       │
└────────┬─────────┘
         │ 4. Paiement par carte
         ▼
┌──────────────────┐
│  Paiement réussi │
└────────┬─────────┘
         │ 5. Stripe envoie webhook
         ▼
┌──────────────────┐
│  /api/webhook/   │
│  stripe          │
│  (Route Handler) │
└────────┬─────────┘
         │ 6. Vérifier signature
         │ 7. Mettre à jour wallet
         ▼
┌──────────────────┐
│  MongoDB         │
│  Wallet.balance  │
│  += coins        │
└────────┬─────────┘
         │ 8. Redirection success_url
         ▼
┌──────────────────┐
│  /app?payment=   │
│  success         │
└──────────────────┘
```

## 📁 Fichiers créés/modifiés

### 1. **`src/config/pricing.config.ts`**
- **Rôle** : Configuration centralisée des packages de coins
- **Structure** :
  ```typescript
  // Tableau source pour l'affichage UI
  pricingPackages: PricingPackage[] = [
    { coins: 150, productId, price, label, icon, color },
    { coins: 350, ... },
    ...
  ]
  
  // Maps pour accès rapide O(1)
  pricingByCoins: Map<number, PricingPackage>
  pricingByProductId: Map<string, PricingPackage>
  
  // Helper functions
  getPackageByCoins(coins): PricingPackage | null
  getCoinsByProductId(productId): number | null
  ```
- **Important** : Les `productId` doivent correspondre aux Product IDs créés dans Stripe Dashboard

### 2. **`src/actions/stripe.actions.ts`**
- **Rôle** : Server Action pour créer une session Stripe Checkout
- **Fonction principale** : `createCheckoutSession(coins: number)`
- **Process** :
  1. Vérifie l'authentification utilisateur
  2. Récupère le package correspondant aux coins
  3. Crée une session Stripe Checkout
  4. Retourne l'URL de paiement

### 3. **`src/app/api/webhook/stripe/route.ts`**
- **Rôle** : Endpoint pour recevoir les webhooks Stripe
- **URL** : `POST /api/webhook/stripe`
- **Events écoutés** :
  - `checkout.session.completed` : Paiement réussi
  - `payment_intent.succeeded` : Alternative pour Payment Element
  - `payment_intent.payment_failed` : Paiement échoué
- **Process** :
  1. Vérifie la signature du webhook (sécurité)
  2. Extrait userId et productId des metadata
  3. Met à jour le wallet MongoDB
  4. Répond 200 OK à Stripe

### 4. **`src/lib/stripe.ts`**
- **Rôle** : Instance Stripe configurée
- **Déjà existant** : ✅ Pas de modification nécessaire

### 5. **`src/components/shop/BuyCoinsContent.tsx`**
- **Rôle** : Interface utilisateur de la boutique
- **Modifications** :
  - Utilise `pricingPackages` depuis config (itération pour l'affichage)
  - Appelle `createCheckoutSession()` au click
  - Redirige vers Stripe Checkout

## 🔐 Variables d'environnement requises

Ajoute ces variables dans ton `.env` :

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_... # Depuis Stripe Dashboard > API Keys
STRIPE_WEBHOOK_SECRET=whsec_... # Depuis Stripe Dashboard > Webhooks

# App URL (pour les redirections Stripe)
NEXT_PUBLIC_APP_URL=http://localhost:3000 # ou ton domaine en prod
```

## 📝 Étapes de configuration Stripe

### 1. Créer les produits dans Stripe Dashboard

1. Va sur [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Clique "Add product"
3. Pour chaque package (150, 350, 1000, 2500 coins) :
   - **Name** : "150 Coins", "350 Coins", etc.
   - **Description** : "Package de 150 pièces pour MyMonster"
   - **Pricing** : Prix unique (one-time payment)
   - **Price** : 1€, 2€, 5€, 10€
   - **Currency** : EUR
4. Copie le `Product ID` (format: `prod_XXXXX`)
5. Colle-le dans `pricing.config.ts`

### 2. Configurer le webhook

1. Va sur [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Clique "Add endpoint"
3. **Endpoint URL** : `https://ton-domaine.com/api/webhook/stripe`
   - En local avec Stripe CLI : `stripe listen --forward-to localhost:3000/api/webhook/stripe`
4. **Events to send** : Sélectionne uniquement :
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded` (optionnel)
   - ✅ `payment_intent.payment_failed` (optionnel)
5. Copie le **Signing secret** (format: `whsec_XXXXX`)
6. Ajoute-le dans `.env` → `STRIPE_WEBHOOK_SECRET`

### 3. Tester en local avec Stripe CLI

```bash
# Installer Stripe CLI
# https://stripe.com/docs/stripe-cli

# Se connecter
stripe login

# Écouter les webhooks en local
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Dans un autre terminal, lancer l'app
npm run dev

# Tester un paiement
stripe trigger checkout.session.completed
```

## 🧪 Test du flow complet

1. **Lance l'app** : `npm run dev`
2. **Lance Stripe CLI** : `stripe listen --forward-to localhost:3000/api/webhook/stripe`
3. **Va sur** : `http://localhost:3000/buy-coins`
4. **Clique sur un package** → Redirigé vers Stripe Checkout
5. **Utilise une carte test** :
   - Numéro : `4242 4242 4242 4242`
   - Expiration : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres
6. **Valide le paiement** → Redirigé vers `/app?payment=success`
7. **Vérifie** :
   - Logs webhook dans le terminal Stripe CLI
   - Balance mise à jour dans MongoDB
   - Coins affichés dans le header

## 🔒 Sécurité

### ⚠️ Pourquoi le webhook est crucial

**JAMAIS mettre à jour le wallet côté client !**

❌ **Mauvaise approche** :
```typescript
// NE JAMAIS FAIRE ÇA !
const handlePurchase = () => {
  // Paiement Stripe...
  await updateWalletBalance(coins) // ❌ Peut être falsifié
}
```

✅ **Bonne approche (implémentée)** :
```typescript
// Webhook Stripe (serveur sécurisé)
export async function POST(req: Request) {
  // Stripe vérifie la signature
  const event = stripe.webhooks.constructEvent(...)
  
  // Stripe confirme que le paiement est réel
  if (event.type === 'checkout.session.completed') {
    await wallet.save() // ✅ Sécurisé
  }
}
```

### 🛡️ Vérification de signature

Le webhook vérifie que la requête vient **vraiment** de Stripe :
```typescript
stripe.webhooks.constructEvent(
  payload,        // Corps de la requête
  signature,      // Header stripe-signature
  webhookSecret   // Secret partagé
)
```

Si la signature est invalide → Requête rejetée (protection contre attaques)

## 🚀 Passage en production

1. **Remplace les clés test par les clés live** :
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (créer un nouveau webhook pour prod)

2. **Configure l'URL publique** :
   - `NEXT_PUBLIC_APP_URL=https://mymonster.com`

3. **Active le webhook en production** :
   - URL : `https://mymonster.com/api/webhook/stripe`
   - Vérifie que le endpoint est accessible publiquement

4. **Teste avec une vraie carte** (en mode live)

## 📊 Monitoring

- **Stripe Dashboard > Payments** : Voir tous les paiements
- **Stripe Dashboard > Logs** : Logs webhook en temps réel
- **MongoDB** : Vérifier les balances wallet
- **Logs serveur** : Console logs dans le webhook handler

## 🐛 Debugging

### Le webhook ne se déclenche pas

1. Vérifie que l'URL est accessible publiquement
2. Vérifie les logs dans Stripe Dashboard > Webhooks
3. En local, utilise Stripe CLI : `stripe listen`

### Signature invalide

1. Vérifie `STRIPE_WEBHOOK_SECRET` dans `.env`
2. Assure-toi d'utiliser `req.text()` (corps brut, pas JSON)
3. Le secret doit correspondre au webhook créé

### Paiement réussi mais coins non ajoutés

1. Vérifie les logs du webhook
2. Vérifie que `metadata.userId` et `metadata.productId` sont présents
3. Vérifie que le `productId` existe dans `pricing.config.ts`

## 💡 Améliorations futures

- [ ] Gérer les remboursements (event `charge.refunded`)
- [ ] Notifications email après achat (via webhook)
- [ ] Historique des achats dans le profil
- [ ] Promotions/codes promo
- [ ] Bundles saisonniers
