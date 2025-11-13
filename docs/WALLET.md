# Système de Portefeuille

## Vue d'ensemble

Le système de portefeuille constitue l'épine dorsale économique de l'application MyMonster. Il gère l'intégralité des transactions monétaires, depuis les récompenses d'actions sur les monstres jusqu'aux achats de pièces via Stripe. L'architecture repose sur un modèle de document MongoDB séparé par utilisateur, couplé à un contexte React global pour la synchronisation en temps réel des soldes et des animations de transactions.

Ce système intègre deux mécaniques de tracking distinctes : le solde courant (`balance`) utilisé pour les dépenses, et le total cumulé (`totalEarned`) qui ne décroît jamais et sert de base aux achievements de richesse. L'intégration Stripe permet l'achat de pièces via paiement sécurisé, avec validation webhook pour garantir l'intégrité des transactions.

## Architecture du modèle de données

### Document MongoDB du portefeuille

Le schéma Mongoose définit une structure documentaire dédiée séparée de l'utilisateur (`src/db/models/wallet.model.ts`) :

```typescript
export interface IWalletDocument extends Document {
  _id: Types.ObjectId
  ownerId: Types.ObjectId
  balance: number
  totalEarned: number
  createdAt: Date
  updatedAt: Date
}
```

**Champs structurels :**

- **`ownerId`** : référence unique vers l'utilisateur propriétaire (index unique)
- **`balance`** : solde disponible pour les dépenses (minimum 0)
- **`totalEarned`** : compteur cumulatif de toutes les pièces gagnées (jamais décrémenté)
- **Timestamps** : création et mise à jour automatiques via Mongoose

### Séparation Wallet vs User

La décision architecturale de séparer le portefeuille de l'utilisateur présente plusieurs avantages :

**1. Séparation des préoccupations**
- Le document `User` géré par Better Auth reste léger
- Les mutations monétaires n'affectent pas les tables d'authentification
- Isolation des transactions financières

**2. Performance des requêtes**
- Pas de nécessité de charger les données utilisateur pour les opérations de wallet
- Index dédié sur `ownerId` pour lookups O(1)
- Réduction de la contention sur les documents User

**3. Extensibilité**
- Facilité d'ajout de champs financiers (historique, transactions, etc.)
- Possibilité de multiple wallets par utilisateur (devises différentes)
- Audit trail séparé pour la comptabilité

**Contrainte :**
- Nécessité d'un index unique sur `ownerId` pour éviter les doublons
- Cohérence référentielle non garantie nativement (responsabilité applicative)

### Hook post-save : mise à jour automatique des quêtes

Le schéma Mongoose implémente un hook `post('save')` qui propage automatiquement les changements de `totalEarned` aux quêtes de richesse :

```typescript
walletSchema.post('save', async function({ ownerId: userId, totalEarned }: IWalletDocument) {
  try {
    for (const coinsAchievement of questsObjectiveMap.reach_coins) {
      const questId = coinsAchievement.id
      
      let quest = await Quest.findOne({ userId, questId }).exec()
      
      if (quest === null) {
        quest = new Quest({
          userId,
          questId,
          questObjective: 'reach_coins'
        })
      }
      
      quest.progress = totalEarned
      await quest.save()
    }
  } catch (err) {
    console.error('❌ Error updating coin quests after wallet save:', err)
  }
})
```

**Caractéristiques du hook :**

- **Déclenché automatiquement** après chaque `wallet.save()`
- **Propagation asynchrone** : erreurs loggées mais ne bloquent pas la transaction principale
- **Itération sur les achievements** : mise à jour de toutes les quêtes `reach_coins`
- **Création à la volée** : les documents Quest inexistants sont créés automatiquement
- **Progress absolu** : `quest.progress = totalEarned` (pas d'incrémentation)

**Avantages :**
- Découplage : le code appelant n'a pas à gérer les quêtes manuellement
- Cohérence : toutes les modifications de wallet propagent aux quêtes
- Centralisation : logique de mise à jour dans un seul endroit

**Inconvénients :**
- Performance : O(n) appels Quest par sauvegarde (n = nombre de quêtes `reach_coins`)
- Silencieux : erreurs dans le hook n'affectent pas le code appelant
- Debugging : plus difficile de tracer les modifications de quêtes

### Valeurs par défaut et contraintes

Le schéma définit des valeurs par défaut stratégiques :

```typescript
const walletSchema = new Schema<IWalletDocument>({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 25,
    min: 0
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  versionKey: false,
  timestamps: true
})
```

**Justifications des valeurs :**

- **`balance: 25`** : solde initial suffisant pour expérimenter les actions sans frustration
- **`totalEarned: 0`** : les pièces initiales ne comptent pas comme "gagnées"
- **`min: 0`** : contrainte de validation empêchant les soldes négatifs
- **`unique: true` sur `ownerId`** : garantit un wallet unique par utilisateur

**Cas limite :**
Le premier monstre étant gratuit, l'utilisateur peut commencer à jouer immédiatement avec son solde de 25 pièces pour des actions ou des achats mineurs.

## Server Actions de gestion du portefeuille

### Récupération ou création : `getWallet()`

La fonction publique `getWallet()` expose une interface simplifiée pour récupérer le portefeuille d'un utilisateur :

```typescript
export async function getWallet(ownerId: string): Promise<ISerializedWallet> {
  if (!Types.ObjectId.isValid(ownerId)) {
    throw new Error('Invalid owner ID format')
  }
  
  await connectMongooseToDatabase()
  const wallet = await getWalletByOwnerId(ownerId)
  return walletSerializer(wallet)
}
```

**Workflow :**
1. **Validation de l'ID** : vérification du format ObjectId MongoDB
2. **Connexion conditionnelle** : database connectée uniquement si nécessaire
3. **Délégation** : appel à la fonction privée `getWalletByOwnerId()`
4. **Sérialisation** : transformation en objet plain JavaScript pour le client

La fonction privée `getWalletByOwnerId()` implémente la logique de création à la volée :

```typescript
async function getWalletByOwnerId(ownerId: string): Promise<IWalletDocument> {
  let wallet = await Wallet.findOne({ ownerId }).exec()
  
  if (wallet === null) {
    wallet = new Wallet({ ownerId })
    await wallet.save()
  }
  
  return wallet
}
```

**Pattern "Get or Create" :**
- **Lookup d'abord** : tentative de récupération du wallet existant
- **Création si absent** : instanciation avec valeurs par défaut (25 coins, 0 totalEarned)
- **Sauvegarde immédiate** : persistence du nouveau wallet
- **Retour unifié** : toujours un document valide

**Implications :**
- Pas besoin de créer explicitement le wallet à l'inscription
- Premier accès déclenche la création automatiquement
- Simplifie la logique appelante (pas de gestion de null)

### Mise à jour du solde : `updateWalletBalance()`

La Server Action `updateWalletBalance()` gère toutes les transactions monétaires :

```typescript
export async function updateWalletBalance(amount: number): Promise<number> {
  if (amount === 0) {
    return 0
  }
  
  const session = await getSession()
  if (session === null) {
    throw new Error('Non authentifié')
  }
  
  const wallet = await getWalletByOwnerId(session.user.id)
  
  const newBalance = wallet.balance + amount
  if (newBalance < 0) {
    throw new Error('Votre solde est insuffisant.')
  }
  
  wallet.balance = newBalance
  
  // Incrémenter totalEarned uniquement pour les gains
  if (amount > 0) {
    wallet.totalEarned += amount
  }
  
  await wallet.save()
  
  return newBalance
}
```

**Étapes de validation :**

1. **Guard clause pour zéro** : optimisation early-return (évite DB hit inutile)
2. **Authentification obligatoire** : vérification de session utilisateur
3. **Récupération du wallet** : via `getWalletByOwnerId()` (création auto si besoin)
4. **Calcul du nouveau solde** : addition simple
5. **Validation de suffisance** : exception levée si `newBalance < 0`
6. **Mise à jour différenciée** :
   - `balance` : toujours mis à jour
   - `totalEarned` : incrémenté uniquement si `amount > 0`
7. **Persistence** : `wallet.save()` déclenche le hook post-save
8. **Retour du nouveau solde** : pour mise à jour UI

**Mécaniques de tracking :**

```typescript
if (amount > 0) {
  wallet.totalEarned += amount
}
```

Cette condition garantit que :
- **Les gains** (actions, level-up, achats Stripe) incrémentent `totalEarned`
- **Les dépenses** (création de monstres, achats futurs) ne décrémentent PAS `totalEarned`
- **Les achievements** basés sur `totalEarned` ne peuvent jamais régresser

**Cas d'usage :**

| Appelant | Montant | Balance | TotalEarned |
|----------|---------|---------|-------------|
| `performMonsterAction()` | +1 ou +2 | +1 ou +2 | +1 ou +2 |
| `createMonster()` | -100 à -332 | -coût | inchangé |
| Webhook Stripe | +150 à +2500 | +package | +package |

## Contexte React pour synchronisation client

### Architecture du WalletContext

Le contexte React (`src/contexts/WalletContext.tsx`) maintient un état global du portefeuille côté client :

```typescript
interface WalletContextType {
  balance: number
  totalEarned: number
  addBalance: (amount: number) => void
  removeBalance: (amount: number) => void
}

export function WalletProvider({ children, wallet }: WalletProviderProps): ReactNode {
  const [balance, setBalance] = useState<number>(wallet?.balance ?? 0)
  const totalEarned = wallet?.totalEarned ?? 0
  
  const addBalance = (amount: number): void => {
    setBalance(prev => prev + amount)
  }
  
  const removeBalance = (amount: number): void => {
    setBalance(prev => prev - amount)
  }
  
  return (
    <WalletContext.Provider value={{ balance, totalEarned, addBalance, removeBalance }}>
      {children}
    </WalletContext.Provider>
  )
}
```

**Caractéristiques du contexte :**

- **Balance réactive** : `useState` pour re-render automatique
- **TotalEarned statique** : pas de state car ne change pas après initial load
- **Mutations locales** : `addBalance` / `removeBalance` pour updates optimistes
- **Initialisation depuis props** : `wallet` passé depuis Server Component

**Justification de l'architecture :**

1. **Balance en state local** : permet animations sans re-fetch serveur
2. **TotalEarned figé** : valeur ne change que via refresh complet (acceptable)
3. **Mutations imperatives** : `addBalance()` appelé après Server Action success
4. **Pas de synchronisation bi-directionnelle** : source of truth reste le serveur

**Limitations connues :**

- **Désynchronisation possible** : si l'utilisateur ouvre deux onglets
- **Pas de WebSocket** : updates temps réel impossibles
- **Refresh requis** : pour synchroniser `totalEarned` après gains

### Hook personnalisé `useWallet()`

Le hook expose une API ergonomique pour les composants consommateurs :

```typescript
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext)
  if (context === null) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}
```

**Pattern de protection :**
- **Vérification de contexte** : exception explicite si hors Provider
- **Typage strict** : retour `WalletContextType` (jamais null)
- **Developer experience** : message d'erreur clair pour usage incorrect

**Utilisation typique :**

```tsx
function MonsterActions() {
  const { addBalance } = useWallet()
  
  const handleAction = async () => {
    const result = await performMonsterAction(monsterId, 'feed')
    if (result.success) {
      addBalance(result.coinsEarned) // Animation immédiate
    }
  }
}
```

### Injection du contexte dans le layout

Le `ProtectedAppLayout` initialise le contexte avec les données serveur :

```typescript
export default async function ProtectedAppLayout({ children }: PropsWithChildren): Promise<ReactNode> {
  const session = await getSession()
  if (session === null) {
    redirect('/login')
  }
  
  const wallet = await getWallet(session.user.id)
  
  return (
    <SessionProvider session={session}>
      <AppLayout session={session} wallet={wallet}>
        {children}
      </AppLayout>
    </SessionProvider>
  )
}
```

**Flux de données :**

```
Server Component (getWallet)
    ↓
AppLayout (props)
    ↓
WalletProvider (useState init)
    ↓
useWallet hook
    ↓
Client Components (CoinBadge, MonsterActions)
```

Cette architecture garantit :
- **Hydration correcte** : balance initiale depuis le serveur
- **Pas de flash** : données disponibles immédiatement
- **Scope approprié** : contexte limité aux pages protégées

## Composant CoinBadge : affichage et animation

### Architecture du CoinBadge

Le composant `CoinBadge` (`src/components/ui/CoinBadge.tsx`) affiche le solde avec animations fluides :

```typescript
export default function CoinBadge(): ReactNode {
  const { balance } = useWallet()
  const [displayCredit, setDisplayCredit] = useState(balance)
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    if (balance === displayCredit) {
      return
    }
    
    setIsAnimating(true)
    
    const startValue = displayCredit
    const endValue = balance
    const duration = 1000
    const steps = 30
    const increment = (endValue - startValue) / steps
    let currentStep = 0
    
    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayCredit(endValue)
        clearInterval(interval)
        setTimeout(() => { setIsAnimating(false) }, 500)
      } else {
        setDisplayCredit(Math.floor(startValue + (increment * currentStep)))
      }
    }, duration / steps)
    
    return () => { clearInterval(interval) }
  }, [balance, displayCredit])
  
  // ... render
}
```

**Système d'animation par interpolation :**

1. **Détection de changement** : `useEffect` trigger sur `balance`
2. **Early return** : pas d'animation si valeur identique
3. **Activation du flag** : `isAnimating = true` pour effets visuels
4. **Interpolation linéaire** : 30 étapes sur 1 seconde (33ms par step)
5. **Arrondi à l'entier** : `Math.floor()` pour cohérence visuelle
6. **Nettoyage** : `clearInterval()` dans le cleanup du useEffect
7. **Désactivation retardée** : `setTimeout(500ms)` pour persistance de l'effet

**Paramètres d'animation :**
- **Duration** : 1000ms (1 seconde)
- **Steps** : 30 frames (~33ms/frame = 30 FPS)
- **Delay après** : 500ms de maintien des effets visuels

### Rendu visuel et interactions

```tsx
return (
  <Link
    href='/buy-coins'
    className={cn(
      'group flex items-center gap-2 rounded-full bg-gradient-to-br from-golden-fizz-300 via-golden-fizz-400 to-golden-fizz-500 px-4 py-2 shadow-lg shadow-golden-fizz-500/30 ring-2 ring-golden-fizz-600/40 transition-all duration-300 hover:scale-110 hover:shadow-xl',
      isAnimating ? 'scale-110 ring-4' : 'scale-100'
    )}
  >
    <CoinIcon
      size={20}
      className={cn(
        'transition-transform group-hover:rotate-12',
        { 'animate-spin': isAnimating }
      )}
    />
    <span className='text-lg font-bold text-golden-fizz-900 transition-all group-hover:scale-105'>
      {displayCredit}
    </span>
  </Link>
)
```

**Effets visuels dynamiques :**

| État | Scale | Ring | Icône | Animation |
|------|-------|------|-------|-----------|
| Normal | 100% | ring-2 | static | - |
| Hover | 110% | ring-2 | rotate-12 | - |
| Animating | 110% | ring-4 | spin | 1s |

**Feedback utilisateur :**
- **Cliquable** : lien vers `/buy-coins`
- **Hover effect** : scale + rotation icône
- **Animation gain** : spin + ring élargi + scale
- **Gradient doré** : identité visuelle forte (golden-fizz)

**Intégration dans le Header :**
Le badge est affiché en permanence dans le header via `AppLayout`, assurant une visibilité constante du solde.

## Intégration Stripe pour achats monétaires

### Configuration Stripe

L'instance Stripe est configurée avec la dernière version de l'API (`src/lib/stripe.ts`) :

```typescript
import Stripe from 'stripe'
import env from './env'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
  apiVersion: '2025-10-29.clover'
})
```

**Variables d'environnement requises :**
- `STRIPE_SECRET_KEY` : clé secrète API Stripe
- `STRIPE_WEBHOOK_SECRET` : secret pour validation des webhooks
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : clé publique (non utilisée actuellement)

**Version API spécifique :**
L'utilisation de `2025-10-29.clover` garantit la stabilité du comportement de l'API malgré les évolutions futures de Stripe.

### Configuration des packages de pièces

Le fichier `src/config/pricing.config.ts` centralise les offres disponibles :

```typescript
export const pricingPackages: Record<string, PricingPackage> = {
  prod_TMDrndEWtgsT5V: {
    coins: 150,
    price: 1,
    label: 'Petit Sac',
    icon: 'Sparkles',
    popular: false,
    color: 'tolopea'
  },
  prod_TMDsMFnN4500jL: {
    coins: 350,
    price: 2,
    label: 'Sac Magique',
    icon: 'Zap',
    popular: true,
    color: 'blood'
  },
  prod_TMDsEpQ5TAwAjQ: {
    coins: 1000,
    price: 5,
    label: 'Coffre Royal',
    icon: 'Crown',
    popular: false,
    color: 'aqua-forest'
  },
  prod_TMDsMEGjIE32Rl: {
    coins: 2500,
    price: 10,
    label: 'Trésor Légendaire',
    icon: 'Flame',
    popular: false,
    color: 'golden-fizz'
  }
}
```

**Structure Record<productId, package> :**
- **Clés = Product IDs Stripe** : créés dans le dashboard Stripe
- **Valeurs = configuration complète** : coins, prix, métadonnées UI

**Avantages de cette structure :**
- **Lookup direct** : `pricingPackages[productId]` en O(1)
- **Centralisation** : une seule source de vérité
- **Facilité de modification** : ajout de packages sans toucher le code

**Important :**
Les `productId` (ex: `prod_TMDrndEWtgsT5V`) doivent correspondre exactement aux Product IDs créés dans le dashboard Stripe pour fonctionner correctement.

### Création de session Checkout

La Server Action `createCheckoutSession()` initialise le flux de paiement :

```typescript
export async function createCheckoutSession(productId: string): Promise<string | null> {
  const session = await getSession()
  if (session === null) {
    throw new Error('User not authenticated')
  }
  
  const pkg = pricingPackages[productId]
  if (pkg === undefined) {
    throw new Error('Invalid package')
  }
  
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product: productId,
            unit_amount: Math.round(pkg.price * 100)
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: session.user.id,
        productId,
        coins: pkg.coins
      },
      success_url: `${env.NEXT_PUBLIC_APP_URL}/app?payment=success`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/buy-coins?payment=cancelled`
    })
    
    return checkoutSession.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return null
  }
}
```

**Workflow de création :**

1. **Validation utilisateur** : session obligatoire
2. **Validation package** : vérification de l'existence du productId
3. **Création session Stripe** :
   - **Mode `payment`** : paiement unique (pas de subscription)
   - **Carte uniquement** : `payment_method_types: ['card']`
   - **Prix dynamique** : calculé depuis `pricing.config.ts`
   - **Conversion centimes** : `price * 100` pour l'API Stripe
4. **Métadonnées critiques** :
   - `userId` : pour identifier le bénéficiaire
   - `productId` : pour retrouver le package
   - `coins` : redondance pour sécurité (validation webhook)
5. **URLs de retour** :
   - Success : `/app?payment=success`
   - Annulation : `/buy-coins?payment=cancelled`

**Retour de l'URL Checkout :**
La fonction retourne l'URL de redirection Stripe ou `null` en cas d'erreur, laissant le composant client gérer la navigation.

### Webhook de validation des paiements

Le webhook Stripe (`src/app/api/webhook/stripe/route.ts`) sécurise le crédit des pièces :

```typescript
export async function POST(req: Request): Promise<Response> {
  const sig = (await headers()).get('stripe-signature')
  const payload = await req.text()
  
  if (sig === null) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(payload, sig, env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.metadata?.userId
      const productId = session.metadata?.productId
      
      if (userId === undefined || productId === undefined) {
        return new Response('Missing metadata', { status: 400 })
      }
      
      await connectMongooseToDatabase()
      
      const pkg = pricingPackages[productId]
      if (pkg === undefined) {
        return new Response('Unknown product', { status: 400 })
      }
      
      const wallet = await Wallet.findOne({ ownerId: userId }).exec()
      if (wallet === null) {
        return new Response('Wallet not found', { status: 404 })
      }
      
      const coinsToAdd = pkg.coins
      wallet.balance += coinsToAdd
      wallet.totalEarned += coinsToAdd
      
      await wallet.save()
      
      console.log(`💰 Added ${coinsToAdd} coins to user ${userId}`)
      break
    }
  }
  
  return new Response('ok', { status: 200 })
}
```

**Sécurité du webhook :**

1. **Vérification de signature** : `stripe.webhooks.constructEvent()` valide l'authenticité
2. **Rejection immédiate** : signature invalide = 400 Bad Request
3. **Gestion des erreurs** : try-catch avec logging détaillé

**Traitement de l'événement `checkout.session.completed` :**

1. **Extraction des métadonnées** : userId et productId depuis la session
2. **Validation des métadonnées** : rejection si manquantes
3. **Connexion database** : via `connectMongooseToDatabase()`
4. **Validation du package** : vérification de l'existence du productId
5. **Récupération du wallet** : lookup par userId
6. **Crédit des pièces** :
   - `balance += coins` : disponibles immédiatement
   - `totalEarned += coins` : tracking cumulatif
7. **Persistence** : `wallet.save()` déclenche hook post-save (maj quêtes)
8. **Logging** : confirmation console pour monitoring

**Gestion des autres événements :**
- `payment_intent.succeeded` : loggé mais pas traité (optionnel)
- `payment_intent.payment_failed` : loggé pour notification future
- Autres : ignorés avec log informatif

**Configuration requise dans Stripe Dashboard :**
1. Créer un webhook endpoint : `https://domaine.com/api/webhook/stripe`
2. Sélectionner l'événement : `checkout.session.completed`
3. Copier le Signing Secret dans `STRIPE_WEBHOOK_SECRET`

### Workflow complet d'achat

```
1. Utilisateur clique sur "Acheter" (CoinPackage)
       ↓
2. Composant client appelle createCheckoutSession(productId)
       ↓
3. Server Action crée session Stripe avec métadonnées
       ↓
4. Redirection vers Stripe Checkout (window.location.href)
       ↓
5. Utilisateur saisit carte bancaire
       ↓
6. Paiement traité par Stripe
       ↓
7. Stripe envoie webhook checkout.session.completed
       ↓
8. Webhook vérifie signature et métadonnées
       ↓
9. Crédite wallet.balance et wallet.totalEarned
       ↓
10. wallet.save() déclenche hook post-save
       ↓
11. Hook met à jour quêtes reach_coins
       ↓
12. Stripe redirige vers /app?payment=success
       ↓
13. BuyCoinsContent détecte query param et affiche toast
       ↓
14. Utilisateur refresh → nouveau solde visible
```

**Points de sécurité critiques :**
- **Webhook seul fait autorité** : le client ne peut pas tricher
- **Métadonnées signées** : impossibles à falsifier
- **Validation multi-niveaux** : productId vérifié côté serveur et webhook
- **Pas de crédit optimiste** : balance mise à jour uniquement après confirmation Stripe

## Page d'achat de pièces

### Composant BuyCoinsContent

Le composant client (`src/components/shop/BuyCoinsContent.tsx`) gère l'interface d'achat :

```typescript
export default function BuyCoinsContent(): ReactNode {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    
    if (paymentStatus === 'success') {
      toast.success('🎉 Paiement réussi ! Vos pièces ont été ajoutées à votre compte.')
      router.replace('/buy-coins')
    } else if (paymentStatus === 'cancelled') {
      toast.info('Paiement annulé. Vous pouvez réessayer quand vous voulez.')
      router.replace('/buy-coins')
    }
  }, [searchParams, router])
  
  const handlePurchase = async (productId: string): Promise<void> => {
    const checkoutUrl = await createCheckoutSession(productId)
    if (checkoutUrl === null) {
      toast.error('Erreur lors de la création de la session de paiement')
      return
    }
    window.location.href = checkoutUrl
  }
  
  // ... render
}
```

**Détection du retour Stripe :**

1. **Lecture des query params** : `searchParams.get('payment')`
2. **Toast informatif** : feedback utilisateur selon le statut
3. **Nettoyage de l'URL** : `router.replace('/buy-coins')` retire le param

**Handler d'achat :**

1. **Appel Server Action** : `createCheckoutSession(productId)`
2. **Vérification URL** : gestion du cas `null`
3. **Redirection complète** : `window.location.href` (pas de router.push)

**Pourquoi `window.location.href` et pas `router.push()` :**
- Stripe Checkout est un domaine externe (`checkout.stripe.com`)
- Navigation Next.js ne fonctionne que pour routes internes
- Redirection complète nécessaire pour quitter l'application

### Grille de packages

```tsx
<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
  {Object.entries(pricingPackages).map(([productId, pkg]) => (
    <CoinPackage
      key={productId}
      pkg={pkg}
      onPurchase={() => { void handlePurchase(productId) }}
    />
  ))}
</div>
```

**Responsive design :**
- Mobile (`< 640px`) : 1 colonne
- Tablette (`640px - 1024px`) : 2 colonnes
- Desktop (`> 1024px`) : 4 colonnes

### Indicateurs de confiance

```tsx
<div className='flex items-center gap-2 text-sm text-tolopea-700'>
  <Shield className='h-5 w-5 text-aqua-forest-600' />
  <span className='font-semibold'>Paiement sécurisé par Stripe</span>
</div>
```

**3 indicateurs affichés :**
1. **Sécurité Stripe** : rassure sur la protection des données bancaires
2. **Aucun abonnement** : clarification du modèle (paiement unique)
3. **Ajout instantané** : promesse de délai minimal

Ces éléments réduisent la friction psychologique à l'achat.

## Composant CoinPackage

Le composant `CoinPackage` affiche une carte d'achat stylisée :

```typescript
export default function CoinPackage({ pkg, onPurchase }: CoinPackageProps): ReactNode {
  const iconColorClasses = {
    tolopea: 'bg-gradient-to-br from-tolopea-400 to-tolopea-600',
    blood: 'bg-gradient-to-br from-blood-400 to-blood-600',
    'aqua-forest': 'bg-gradient-to-br from-aqua-forest-400 to-aqua-forest-600',
    'golden-fizz': 'bg-gradient-to-br from-golden-fizz-400 to-golden-fizz-600'
  }
  
  return (
    <div className='relative'>
      {pkg.popular && (
        <div className='absolute -top-3 left-1/2 z-10 -translate-x-1/2'>
          <div className='rounded-full bg-gradient-to-r from-blood-500 to-blood-600 px-4 py-1'>
            ⭐ POPULAIRE
          </div>
        </div>
      )}
      
      <Card className={cn({ 'ring-4 ring-blood-400': pkg.popular })}>
        {/* Icon */}
        <div className={cn('flex h-20 w-20 items-center justify-center rounded-full', iconColorClasses[pkg.color])}>
          {iconMap[pkg.icon]}
        </div>
        
        {/* Label */}
        <h3>{pkg.label}</h3>
        
        {/* Coins Amount */}
        <div className='flex items-center gap-2'>
          <CoinIcon />
          <span className='text-4xl font-black'>{pkg.coins.toLocaleString()}</span>
        </div>
        
        {/* Price */}
        <div className='text-4xl font-semibold'>{pkg.price.toFixed(2)}€</div>
        
        {/* Button */}
        <Button onClick={onPurchase} variant='primary' color={pkg.color}>
          Acheter
        </Button>
      </Card>
    </div>
  )
}
```

**Hiérarchie visuelle :**
1. **Badge populaire** : positionnement absolu hors du flux
2. **Icône thématique** : grande, colorée, identité du package
3. **Label descriptif** : nom évocateur (Petit Sac, Coffre Royal)
4. **Quantité de pièces** : taille XXL, mise en avant maximale
5. **Prix** : secondaire mais visible
6. **Bouton CTA** : couleur assortie au package

**Map de couleurs complètes :**
Les classes Tailwind doivent être complètes (pas de template literals) pour que le purge Tailwind les détecte lors du build.

## Affichage des statistiques de portefeuille

### Section dans le profil utilisateur

Le composant `ProfileContent` affiche deux statistiques de wallet :

```tsx
<Card className='mb-6'>
  <h2>Statistiques de votre portefeuille</h2>
  
  <div className='space-y-6'>
    {/* Current Balance */}
    <div className='flex items-start gap-4'>
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-golden-fizz-400 to-golden-fizz-600'>
        <Coins className='h-6 w-6' />
      </div>
      <div>
        <p className='text-sm font-semibold text-tolopea-600'>Solde actuel</p>
        <p className='text-lg font-bold text-tolopea-900'>{wallet.balance} pièces</p>
      </div>
    </div>
    
    {/* Total Earned */}
    <div className='flex items-start gap-4 border-t pt-6'>
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-aqua-forest-100'>
        <TrendingUp className='h-6 w-6 text-aqua-forest-600' />
      </div>
      <div>
        <p className='text-sm font-semibold text-tolopea-600'>Total de pièces gagnées</p>
        <p className='text-lg font-bold text-tolopea-900'>{wallet.totalEarned} pièces</p>
        <p className='text-xs text-tolopea-500 mt-1'>Depuis le début de votre aventure</p>
      </div>
    </div>
  </div>
</Card>
```

**Distinction visuelle :**
- **Balance** : icône Coins, gradient doré (pièces actuelles)
- **TotalEarned** : icône TrendingUp, fond vert (progression historique)

**Sous-texte explicatif :**
"Depuis le début de votre aventure" clarifie que `totalEarned` est cumulatif et ne décroît jamais.

### Hook useWallet dans le profil

```typescript
const wallet = useWallet()
// Accès direct à wallet.balance et wallet.totalEarned
```

Le hook fournit l'état global du wallet sans besoin de props drilling.

## Sérialisation des données

### Serializer wallet

Le serializer (`src/lib/serializers/wallet.serializer.ts`) transforme les documents Mongoose :

```typescript
export interface ISerializedWallet {
  _id: string
  ownerId: string
  balance: number
  totalEarned: number
  createdAt: string
  updatedAt: string
}

export default function walletSerializer(rawWallet: IWalletDocument): ISerializedWallet {
  return {
    _id: rawWallet._id.toString(),
    ownerId: rawWallet.ownerId.toString(),
    balance: rawWallet.balance,
    totalEarned: rawWallet.totalEarned,
    createdAt: rawWallet.createdAt.toISOString(),
    updatedAt: rawWallet.updatedAt.toISOString()
  }
}
```

**Transformations appliquées :**
- **ObjectId → string** : conversion pour sérialisation JSON
- **Date → ISO string** : format standardisé pour le client
- **Nombres inchangés** : balance et totalEarned restent number

Cette sérialisation garantit la compatibilité avec le transfert Server Component → Client Component.

## Cas d'usage et flux de données

### Flux 1 : Action sur un monstre

```
Utilisateur clique "Nourrir"
    ↓
MonsterActions.handleAction()
    ↓
Server Action: performMonsterAction(monsterId, 'feed')
    ↓
Calcul coinsEarned (1 ou 2 selon matching)
    ↓
updateWalletBalance(coinsEarned)
    ↓
wallet.balance += coinsEarned
wallet.totalEarned += coinsEarned
    ↓
wallet.save() → hook post-save
    ↓
Maj automatique des quêtes reach_coins
    ↓
Retour newCreditTotal à MonsterActions
    ↓
addBalance(coinsEarned) → WalletContext
    ↓
CoinBadge re-render avec animation
    ↓
Compteur s'incrémente de startValue à endValue
```

### Flux 2 : Création d'un monstre

```
Utilisateur soumet CreateMonsterForm
    ↓
Server Action: createMonster(name)
    ↓
Comptage monstres existants
    ↓
Calcul coût: calculateMonsterCreationCost(count)
    ↓
updateWalletBalance(-cost)
    ↓
Vérification solde suffisant
    ↓
wallet.balance -= cost
(totalEarned inchangé car amount < 0)
    ↓
wallet.save()
    ↓
Création du monstre
    ↓
revalidatePath('/app')
    ↓
Page dashboard re-render avec nouveau solde
    ↓
CoinBadge anime la décrémentation
```

### Flux 3 : Achat Stripe

```
Utilisateur clique "Acheter" sur package
    ↓
BuyCoinsContent.handlePurchase(productId)
    ↓
Server Action: createCheckoutSession(productId)
    ↓
stripe.checkout.sessions.create() avec métadonnées
    ↓
Redirection window.location.href vers Stripe
    ↓
Utilisateur paie sur checkout.stripe.com
    ↓
Stripe traite paiement
    ↓
Webhook POST /api/webhook/stripe
    ↓
Vérification signature
    ↓
Extraction métadonnées (userId, productId)
    ↓
Lookup wallet via userId
    ↓
wallet.balance += pkg.coins
wallet.totalEarned += pkg.coins
    ↓
wallet.save() → hook post-save
    ↓
Maj quêtes reach_coins
    ↓
Stripe redirige vers /app?payment=success
    ↓
BuyCoinsContent détecte param et affiche toast
    ↓
Utilisateur refresh → CoinBadge affiche nouveau solde
```

## Limitations et améliorations futures

### Limitations actuelles

#### 1. Désynchronisation multi-onglets

**Problème :** Si l'utilisateur ouvre deux onglets, les soldes affichés peuvent diverger.

**Scénario :**
1. Onglet A : balance = 100
2. Onglet B : balance = 100
3. Onglet A : action (+2 pièces) → balance locale = 102
4. Onglet B : affiche toujours 100

**Cause :**
- Le `WalletContext` est local à chaque instance de l'application
- Pas de synchronisation cross-tab (localStorage events, BroadcastChannel)

**Impact :**
- Confusion utilisateur si plusieurs onglets ouverts
- Risque de double-dépense si validation côté client

**Solution :**
Implémentation d'un système de synchronisation via `localStorage` :

```typescript
// Dans WalletProvider
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'wallet_balance' && e.newValue !== null) {
      setBalance(parseInt(e.newValue))
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [])

// Dans addBalance/removeBalance
const addBalance = (amount: number) => {
  setBalance(prev => {
    const newBalance = prev + amount
    localStorage.setItem('wallet_balance', newBalance.toString())
    return newBalance
  })
}
```

#### 2. Pas d'historique de transactions

**Problème :** Aucun historique des gains et dépenses n'est conservé.

**État actuel :**
- Seules `balance` et `totalEarned` sont stockées
- Impossible de consulter les transactions passées
- Pas d'audit trail pour le support client

**Amélioration idéale :**
Ajout d'un modèle `Transaction` :

```typescript
interface ITransactionDocument {
  walletId: ObjectId
  type: 'earn' | 'spend' | 'purchase'
  amount: number
  source: string // 'monster_action', 'monster_creation', 'stripe_purchase'
  metadata: any
  createdAt: Date
}
```

**Bénéfices :**
- Page "Historique" pour transparence utilisateur
- Debug facilité pour le support
- Analytics sur les comportements d'achat
- Possibilité de remboursements ciblés

#### 3. Pas de gestion des remboursements Stripe

**Problème :** Si un utilisateur demande un remboursement, le webhook ne gère pas l'événement `charge.refunded`.

**Conséquence :**
- Les pièces restent dans le wallet même après remboursement
- Nécessité d'intervention manuelle en base de données

**Solution :**
Ajout d'un handler dans le webhook :

```typescript
case 'charge.refunded': {
  const charge = event.data.object
  const userId = charge.metadata?.userId
  const coins = parseInt(charge.metadata?.coins ?? '0')
  
  const wallet = await Wallet.findOne({ ownerId: userId }).exec()
  wallet.balance = Math.max(0, wallet.balance - coins)
  // Ne pas toucher à totalEarned (historique)
  await wallet.save()
  
  console.log(`↩️  Refunded ${coins} coins from user ${userId}`)
  break
}
```

### Améliorations prioritaires

1. **Synchronisation multi-onglets** : localStorage events pour cohérence
2. **Historique de transactions** : modèle Transaction pour audit trail
3. **Gestion des remboursements** : handler `charge.refunded` dans webhook
4. **Notifications en temps réel** : WebSocket ou SSE pour updates immédiates

## Conclusion

Le système de portefeuille de MyMonster démontre une architecture robuste combinant persistance MongoDB, contexte React global et intégration paiement Stripe. La séparation du document wallet permet une gestion financière isolée et performante, tandis que le tracking dual (`balance` / `totalEarned`) offre une flexibilité pour les mécaniques de jeu et les achievements.

L'intégration Stripe via webhook sécurisé garantit l'intégrité des transactions monétaires, avec validation multi-niveaux des métadonnées et des packages. Le système d'animations du `CoinBadge` améliore significativement l'expérience utilisateur en fournissant un feedback immédiat et fluide lors des transactions.

Les limitations identifiées (absence de mise à jour temps réel post-achat, désynchronisation multi-onglets, historique manquant) sont comprises et documentées, avec des solutions techniques claires pour de futures itérations. L'architecture actuelle constitue néanmoins une fondation solide et extensible pour un système économique complet dans une application de gaming.
