# Système d'Authentification

## Vue d'ensemble

Le système d'authentification de l'application MyMonster repose sur la bibliothèque **Better Auth**, une solution moderne et complète pour la gestion des sessions utilisateurs dans les applications Next.js. Cette implémentation privilégie une architecture en couches avec un découpage strict entre le code serveur et client, tout en optimisant les appels à la base de données.

L'authentification supporte deux modes principaux :
- **Authentification locale** : inscription et connexion via email et mot de passe
- **Authentification OAuth** : connexion via GitHub et Google

## Architecture technique

### Structure du système

Le système d'authentification s'articule autour de trois composants fondamentaux :

1. **Configuration serveur** (`src/lib/auth.ts`) : instance Better Auth avec adapter MongoDB
2. **Client d'authentification** (`src/lib/auth-client.ts`) : interface React pour les composants clients
3. **Routes API** (`src/app/api/auth/[...all]/route.ts`) : endpoints d'authentification automatiques

### Configuration Better Auth

L'instance Better Auth est configurée avec un adapter MongoDB personnalisé utilisant Mongoose comme ORM. Cette configuration centralise l'ensemble des paramètres d'authentification :

```typescript
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  }
})
```

Les variables d'environnement sont validées via un schéma Zod (`src/lib/zod_schemas/env.schema.ts`) garantissant la présence et la validité des clés OAuth avant le démarrage de l'application.

### Gestion des sessions côté serveur

La fonction `getSession()` constitue le point d'entrée unique pour l'authentification serveur. Son implémentation intègre plusieurs optimisations critiques :

```typescript
export async function getSession(): Promise<Session | null> {
  await connectMongooseToDatabase()
  
  return await auth.api.getSession({
    headers: await headers()
  })
}
```

**Optimisations clés :**
- **Connexion conditionnelle** : la base de données n'est connectée que si nécessaire via `connectMongooseToDatabase()`
- **Headers asynchrones** : utilisation de l'API Next.js 15 avec `await headers()` pour respecter le modèle de rendu serveur
- **Typage strict** : retour explicite `Session | null` pour faciliter les vérifications côté consommateur

### Client d'authentification React

Le client d'authentification expose des méthodes React pour les composants clients, avec une configuration centralisée de l'URL de base :

```typescript
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL
})
```

L'inférence de type TypeScript permet de dériver automatiquement le type `Session` depuis le client, garantissant la cohérence des types entre serveur et client.

## Flux d'authentification

### Inscription (Sign-up)

Le processus d'inscription suit un flux en quatre étapes :

1. **Saisie utilisateur** : le composant `SignUpForm` collecte le nom, l'email et le mot de passe
2. **Validation côté client** : les champs HTML `required` assurent une première validation
3. **Soumission** : appel à `authClient.signUp.email()` avec callbacks pour gérer les états
4. **Redirection** : après succès, redirection automatique vers `/app`

Le formulaire implémente des notifications utilisateur via React Toastify, avec des états de chargement progressifs :

```typescript
void authClient.signUp.email({
  ...credentials,
  callbackURL: '/app'
}, {
  onRequest: () => {
    toast.loading('Création de votre compte... 🐣', {
      toastId: 'signup'
    })
  },
  onSuccess: () => {
    toast.update('signup', {
      render: 'Compte créé avec succès ! 🎈',
      type: 'success',
      isLoading: false,
      autoClose: 3000
    })
    router.push('/app')
  },
  onError: (ctx) => {
    toast.update('signup', {
      render: `Erreur: ${ctx.error.message} 😿`,
      type: 'error',
      isLoading: false,
      autoClose: 5000
    })
    setIsLoading(false)
  }
})
```

### Connexion (Sign-in)

Le flux de connexion suit une architecture similaire avec `SignInForm`, en omettant le champ "nom" :

1. **Saisie des identifiants** : email et mot de passe
2. **Appel à `authClient.signIn.email()`** : authentification avec Better Auth
3. **Gestion des états** : notifications progressives (chargement, succès, erreur)
4. **Redirection automatique** : vers `/app` après connexion réussie

### Authentification OAuth

Les composants `GithubSignInButton` et `GoogleSignInButton` déclenchent un flux OAuth standard :

```typescript
const handleProviderSignIn = (provider: SocialProviders): void => {
  void authClient.signIn.social({
    provider,
    callbackURL: '/app'
  })
}
```

Better Auth gère automatiquement :
- La redirection vers le provider OAuth
- La récupération du token d'accès
- La création ou mise à jour du compte utilisateur
- Le retour vers l'application avec session active

## Protection des routes

### Redirection des utilisateurs authentifiés

Les pages d'inscription et de connexion implémentent une vérification préventive pour éviter les doubles sessions :

```typescript
export default async function SignInPage(): Promise<ReactNode> {
  const session = await getSession()
  
  if (session !== null) {
    redirect('/app')
  }
  
  return <SignInForm />
}
```

Cette approche permet de rediriger immédiatement les utilisateurs déjà connectés vers le dashboard, optimisant l'expérience utilisateur.

### Composant `ProtectedAppLayout`

Pour les pages nécessitant une authentification obligatoire, le composant `ProtectedAppLayout` centralise la logique de protection :

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

**Caractéristiques principales :**
- **Vérification de session** : redirection vers `/login` si non authentifié
- **Chargement du portefeuille** : récupération proactive des données utilisateur
- **Propagation du contexte** : injection de la session via `SessionProvider`
- **Layout unifié** : encapsulation dans `AppLayout` avec header et footer

### Hook `useSession` pour les composants clients

Le contexte React `SessionContext` expose un hook personnalisé pour accéder à la session côté client :

```typescript
export function useSession(): Session {
  const context = useContext(SessionContext)
  if (context === null) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}
```

Cette approche garantit que les composants clients utilisateurs de `useSession()` sont toujours enveloppés dans un `SessionProvider`, évitant les erreurs de contexte manquant.

## Sécurisation des Server Actions

Toutes les Server Actions critiques de l'application vérifient systématiquement la session utilisateur avant d'exécuter des mutations. Ce pattern de sécurité apparaît dans :

- **`monsters.actions.ts`** : création, suppression, actions sur les monstres
- **`quests.actions.ts`** : récupération et validation des quêtes
- **`wallet.actions.ts`** : transactions sur le portefeuille
- **`stripe.actions.ts`** : création de sessions de paiement
- **`user.actions.ts`** : mise à jour du profil et upload d'images

Exemple type dans `monsters.actions.ts` :

```typescript
export async function createMonster(name: string): Promise<ActionResult<ISerializedMonster>> {
  const session = await getSession()
  
  if (session === null) {
    throw new Error('Utilisateur non authentifié')
  }
  
  // ... logique métier
}
```

Cette vérification systématique empêche toute manipulation de données par des utilisateurs non authentifiés, même si les endpoints API sont exposés.

## Optimisations et performances

### Connexion conditionnelle à MongoDB

La fonction `connectMongooseToDatabase()` implémente un pattern singleton évitant les reconnexions multiples :

```typescript
let isConnected = false

export async function connectMongooseToDatabase(): Promise<void> {
  if (isConnected) {
    return
  }
  
  await mongoose.connect(env.MONGODB_HOST)
  isConnected = true
}
```

Ce mécanisme garantit qu'une seule connexion MongoDB est établie par instance de serveur Next.js, réduisant significativement la latence des requêtes d'authentification.

### Appels serveur groupés

Le composant `ProtectedAppLayout` illustre une optimisation d'appels serveur :

```typescript
const session = await getSession()
const wallet = await getWallet(session.user.id)
```

Au lieu de déléguer le chargement du portefeuille aux composants enfants, le layout le charge de manière anticipée. Cette approche réduit le nombre de round-trips serveur et améliore le temps de chargement initial.

### Validation des variables d'environnement au démarrage

Le schéma Zod dans `env.schema.ts` valide toutes les clés d'authentification au démarrage :

```typescript
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(z.prettifyError(parsed.error))
  process.exit(1)
}
```

Cette validation préventive empêche le démarrage de l'application avec une configuration OAuth incomplète, évitant des erreurs runtime difficiles à diagnostiquer.

## Routes API automatiques

Better Auth génère automatiquement l'ensemble des routes d'authentification via le catch-all route :

```typescript
// src/app/api/auth/[...all]/route.ts
export const { POST, GET } = toNextJsHandler(auth)
```

Cette configuration expose automatiquement les endpoints suivants :
- `POST /api/auth/sign-in` : connexion email/password
- `POST /api/auth/sign-up` : inscription
- `GET /api/auth/session` : récupération de session
- `POST /api/auth/sign-out` : déconnexion
- `GET /api/auth/callback/github` : callback OAuth GitHub
- `GET /api/auth/callback/google` : callback OAuth Google

Cette abstraction élimine le besoin d'implémenter manuellement les routes d'authentification, réduisant considérablement la surface de code à maintenir.

## Gestion des états de chargement

Les formulaires d'authentification implémentent des états de chargement locaux pour désactiver les boutons pendant les requêtes :

```typescript
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = (e: FormEvent): void => {
  e.preventDefault()
  setIsLoading(true)
  
  void authClient.signIn.email({
    // ...
  }, {
    onError: () => {
      setIsLoading(false) // Réactivation en cas d'erreur
    }
  })
}
```

Cette approche prévient les doubles soumissions et fournit un feedback visuel immédiat à l'utilisateur.

## Limitations et considérations

### Pas de gestion du "Forgot Password"

L'implémentation actuelle ne propose pas de mécanisme de récupération de mot de passe. Cette fonctionnalité nécessiterait :
- Configuration d'un service d'envoi d'emails
- Génération de tokens de réinitialisation
- Interface de réinitialisation

### Sessions persistantes uniquement via cookies

Better Auth utilise exclusivement des cookies HTTP-only pour stocker les tokens de session. Cette approche :
- **Avantage** : protection contre les attaques XSS
- **Inconvénient** : incompatibilité avec certains scénarios d'API stateless

### Pas de refresh token côté client

Les sessions sont validées uniquement côté serveur. Le client ne stocke aucun token, ce qui impose de revalider la session à chaque requête serveur.

## Conclusion

Le système d'authentification de MyMonster démontre une architecture réfléchie privilégiant :
- **Sécurité** : validation systématique des sessions dans les Server Actions
- **Performance** : connexions conditionnelles et appels serveur groupés
- **Maintenabilité** : abstraction via Better Auth et découpage client/serveur strict
- **Expérience utilisateur** : feedback progressif et redirections intelligentes

Cette implémentation constitue une base solide pour l'authentification d'applications Next.js modernes, en tirant profit des patterns serveur/client de React Server Components.
