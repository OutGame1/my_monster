# Page Utilisateur (Profil)

## Vue d'ensemble

La page utilisateur constitue l'espace personnel de chaque membre de MyMonster. Elle centralise l'affichage des informations du compte, la gestion de la photo de profil, les statistiques du portefeuille, et les actions de gestion de session. L'interface adopte une structure en trois sections distinctes avec des cartes visuelles (Card components) pour une lisibilité optimale.

Cette feature repose sur Better Auth pour l'authentification, Cloudinary pour la gestion des images de profil, et sur les contextes React (SessionContext et WalletContext) pour l'accès aux données utilisateur sans prop drilling.

---

## Architecture

### Structure des composants

**Page serveur (`/src/app/profile/page.tsx`)**
```typescript
import ProfileContent from '@/components/profile/ProfileContent'
import ProtectedAppLayout from '@/components/navigation/ProtectedAppLayout'

export default function ProfilePage (): ReactNode {
  return (
    <ProtectedAppLayout>
      <ProfileContent />
    </ProtectedAppLayout>
  )
}
```

La page utilise le layout protégé `ProtectedAppLayout` qui vérifie automatiquement l'authentification avant de rendre le contenu. La délégation à un composant client (`ProfileContent`) permet l'utilisation de hooks React et d'événements utilisateur.

**Composant client principal (`/src/components/profile/ProfileContent.tsx`)**

Le composant `ProfileContent` est un composant client qui structure la page en trois sections fonctionnelles :

1. **Section Informations du compte**
   - Photo de profil avec uploader intégré
   - Nom d'utilisateur (session.user.name)
   - Adresse email (session.user.email)
   - Date d'inscription formatée en français

2. **Section Statistiques du portefeuille**
   - Solde actuel en pièces (wallet.balance)
   - Total cumulé de pièces gagnées (wallet.totalEarned)

3. **Section Gestion du compte**
   - Bouton de déconnexion avec état de chargement
   - Redirection automatique vers la page d'accueil après déconnexion

**Gestion des contextes**

```typescript
const session = useSession()  // SessionContext pour données utilisateur
const wallet = useWallet()    // WalletContext pour données portefeuille
```

Les hooks personnalisés `useSession()` et `useWallet()` fournissent un accès direct aux données sans avoir à les passer en props. Cela améliore la réutilisabilité des composants et réduit la complexité du code.

---

## Système de Photo de Profil

### Composant d'upload (`ProfileImageUploader`)

Le composant `ProfileImageUploader` offre une interface intuitive pour modifier la photo de profil avec les fonctionnalités suivantes :

**Workflow d'upload**

```typescript
const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
  const file = event.target.files?.item(0)
  if (!(file instanceof File)) return

  // 1. Validation du type de fichier (doit commencer par 'image/')
  if (!file.type.startsWith('image/')) {
    toast.error('Veuillez sélectionner une image valide')
    return
  }

  // 2. Validation de la taille (maximum 5 MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('L\'image ne doit pas dépasser 5 MB')
    return
  }

  setIsUploading(true)

  // 3. Conversion en data URL via FileReader
  const reader = new FileReader()
  reader.onloadend = async () => {
    try {
      await updateProfileImage(reader.result)  // Server Action
      router.refresh()                         // Rafraîchissement RSC
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error))
    } finally {
      setIsUploading(false)
    }
  }

  reader.readAsDataURL(file)
}
```

**Validations côté client**

Les validations côté client assurent une expérience utilisateur fluide en évitant des requêtes serveur inutiles :

- **Type de fichier** : Vérifie que le MIME type commence par `image/` (accepte tous les formats d'image standards)
- **Taille maximale** : Limite à 5 MB pour des raisons de performance et de coûts Cloudinary
- **Notifications toast** : Retours visuels immédiats en cas d'erreur de validation

**États visuels interactifs**

```typescript
<div className='relative group cursor-pointer' onClick={handleImageClick}>
  {/* Avatar avec overlay au hover */}
  <div className='relative flex h-24 w-24 items-center justify-center rounded-full 
                  bg-gradient-to-br from-tolopea-500 to-blood-500 
                  text-3xl font-bold text-white shadow-lg overflow-hidden'>
    <ProfileImage session={session} width={96} height={96} />

    {/* Overlay au hover avec icône caméra */}
    {!isUploading && (
      <div className='absolute inset-0 bg-black/50 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity'>
        <Camera className='h-8 w-8 text-white' />
      </div>
    )}

    {/* Loader pendant l'upload */}
    {isUploading && (
      <div className='absolute inset-0 bg-black/70 flex items-center justify-center'>
        <Loader2 className='h-8 w-8 text-white animate-spin' />
      </div>
    )}
  </div>

  {/* Badge caméra permanent dans le coin inférieur droit */}
  <div className='absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center 
                  rounded-full bg-tolopea-600 border-2 border-white shadow-md'>
    {isUploading ? <Loader2 className='h-4 w-4 text-white animate-spin' />
                  : <Camera className='h-4 w-4 text-white' />}
  </div>
</div>
```

Les états visuels offrent un feedback clair :
- **Normal** : Avatar avec badge caméra permanent pour indiquer l'action possible
- **Hover** : Overlay semi-transparent avec icône caméra agrandie
- **Upload** : Loader animé avec fond sombre pour signaler le traitement en cours

### Composant d'affichage (`ProfileImage`)

Le composant `ProfileImage` gère l'affichage de la photo de profil avec un système de fallback robuste :

```typescript
export default function ProfileImage ({ session, width, height, onError }: ProfileImageProps): ReactNode {
  const src = session.user.image
  const [error, setError] = useState(false)

  if (typeof src !== 'string' || error) {
    // Fallback : icône User générique
    return <User className='p-2' width={width} height={height} />
  }

  const handleError = (): void => {
    setError(true)
    if (typeof src === 'string') {
      // Callback uniquement si l'utilisateur possède une URL mais qu'elle est cassée
      onError?.()
    }
  }

  return (
    <Image
      src={src}
      alt={session.user.name}
      loading='eager'
      width={width}
      height={height}
      className='object-cover'
      onError={handleError}
    />
  )
}
```

**Gestion d'erreur intelligente**

Le composant différencie deux cas de figure :
- **Pas d'image définie** (`src` n'est pas une string) : Affiche l'icône User sans déclencher le callback `onError`
- **Image cassée** (erreur de chargement) : Affiche l'icône User ET déclenche le callback `onError` pour notifier l'utilisateur

Cette distinction évite les notifications inutiles pour les utilisateurs n'ayant jamais défini de photo de profil.

**Optimisations d'affichage**

- **Loading eager** : L'image est chargée immédiatement car elle fait partie du contenu critique (Above The Fold)
- **Object-cover** : Maintient le ratio d'aspect de l'image en remplissant le cadre circulaire
- **État d'erreur persistant** : Via `useState`, évite les tentatives répétées de chargement en cas d'échec

---

## Server Action : Upload vers Cloudinary

### Fonction `updateProfileImage()`

La Server Action `updateProfileImage()` (`/src/actions/user.actions.ts`) orchestre l'upload complet de la photo de profil :

```typescript
export async function updateProfileImage (dataUrl: string | ArrayBuffer | null): Promise<string> {
  try {
    // 1. Validation du format (doit être une string data URL)
    if (typeof dataUrl !== 'string') {
      throw new Error('Une erreur s\'est produite lors de la lecture du fichier')
    }

    // 2. Vérification de la disponibilité de Cloudinary
    const cloudinaryConnected = await isCloudinaryConnected()
    if (!cloudinaryConnected) {
      throw new Error('Le service responsable des images de profil n\'est pas disponible. 
                       Veuillez réessayer plus tard.')
    }

    // 3. Vérification de l'authentification
    const session = await getSession()
    if (session === null) {
      throw new Error('Utilisateur non authentifié')
    }

    // 4. Upload sur Cloudinary avec transformations automatiques
    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: 'my_monster/profile_pictures',
      transformation: [
        { width: 96, height: 96, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    console.log('image uploaded successfully:', uploadResult)

    // 5. Mise à jour du champ `image` de l'utilisateur via Better Auth API
    await auth.api.updateUser({
      headers: await headers(),
      body: { image: uploadResult.secure_url },
      query: { userId: session.user.id }
    })

    console.log('profile image updated successfully')

    return uploadResult.secure_url
  } catch (error) {
    console.error('Error updating profile image:', error)
    throw error
  }
}
```

**Étapes du workflow**

1. **Validation du type de données** : Vérifie que `dataUrl` est bien une string (format base64)
2. **Vérification du service Cloudinary** : Utilise `isCloudinaryConnected()` pour éviter les erreurs d'upload
3. **Authentification** : Récupère la session via `getSession()` pour identifier l'utilisateur
4. **Upload et transformation** : Envoie l'image à Cloudinary avec des transformations automatiques
5. **Mise à jour du profil** : Utilise l'API Better Auth pour persister l'URL de l'image en base de données

**Transformations Cloudinary**

```typescript
transformation: [
  { width: 96, height: 96, crop: 'fill', gravity: 'face' },
  { quality: 'auto', fetch_format: 'auto' }
]
```

Les transformations appliquées assurent une qualité optimale :
- **Recadrage intelligent (`crop: 'fill', gravity: 'face')** : Centre automatiquement le visage de l'utilisateur dans le cadre 96x96px
- **Optimisation qualité (`quality: 'auto')** : Cloudinary choisit automatiquement le meilleur compromis qualité/taille
- **Format automatique (`fetch_format: 'auto')** : Conversion en WebP pour les navigateurs compatibles, fallback JPEG/PNG sinon

**Stockage organisé**

Les images sont stockées dans le dossier `my_monster/profile_pictures` sur Cloudinary, permettant :
- Une organisation claire des assets
- Une gestion simplifiée des quotas
- Un nettoyage facilité des images orphelines

### Configuration Cloudinary

Le fichier `/src/lib/cloudinary.ts` configure l'instance Cloudinary et fournit une fonction de test de connectivité :

```typescript
import { v2 as cloudinary } from 'cloudinary'
import env from './env'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

export async function isCloudinaryConnected (): Promise<boolean> {
  try {
    await cloudinary.api.ping()
    console.log('Cloudinary connected and configured.')
    return true
  } catch (error) {
    console.log('Error connecting to cloudinary', error)
    return false
  }
}

export default cloudinary
```

La fonction `isCloudinaryConnected()` utilise la méthode `ping` de l'API Cloudinary pour tester la connectivité avant chaque upload, évitant ainsi des erreurs en production si le service est temporairement indisponible.

---

## Affichage des Statistiques

### Section Portefeuille

La section statistiques du portefeuille affiche deux métriques distinctes grâce au `WalletContext` :

```typescript
const wallet = useWallet()

<Card className='mb-6'>
  <div className='mb-6'>
    <h2 className='text-2xl font-bold text-tolopea-800 flex items-center gap-2'>
      <Coins className='h-6 w-6' />
      Statistiques de votre portefeuille
    </h2>
  </div>

  <div className='space-y-6'>
    {/* Solde actuel */}
    <div className='flex items-start gap-4'>
      <div className='flex h-12 w-12 items-center justify-center rounded-full 
                      bg-gradient-to-br from-golden-fizz-400 to-golden-fizz-600 shadow-lg'>
        <Coins className='h-6 w-6 text-tolopea-900' />
      </div>
      <div className='flex-1'>
        <p className='text-sm font-semibold text-tolopea-600'>Solde actuel</p>
        <p className='text-lg font-bold text-tolopea-900'>{wallet.balance} pièces</p>
      </div>
    </div>

    {/* Total cumulé de pièces gagnées */}
    <div className='flex items-start gap-4 border-t border-tolopea-100 pt-6'>
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-aqua-forest-100'>
        <TrendingUp className='h-6 w-6 text-aqua-forest-600' />
      </div>
      <div className='flex-1'>
        <p className='text-sm font-semibold text-tolopea-600'>Total de pièces gagnées</p>
        <p className='text-lg font-bold text-tolopea-900'>{wallet.totalEarned} pièces</p>
        <p className='text-xs text-tolopea-500 mt-1'>Depuis le début de votre aventure</p>
      </div>
    </div>
  </div>
</Card>
```

**Distinction entre balance et totalEarned**

- **`wallet.balance`** : Solde actuel en pièces, fluctue avec les dépenses (achats de monstres, futurs items)
- **`wallet.totalEarned`** : Total cumulé de pièces gagnées depuis l'inscription, **jamais décrémenté**, utilisé pour les achievements de progression

Cette distinction permet de récompenser les joueurs pour leur activité globale plutôt que leur richesse actuelle, ce qui encourage l'engagement à long terme.

### Formatage des dates

La fonction `formatDate()` utilise l'API `Intl.DateTimeFormat` pour un affichage localisé en français :

```typescript
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

// Exemple de rendu : "15 novembre 2024"
```

L'API `Intl` garantit une localisation correcte sans dépendance externe, en utilisant les paramètres régionaux du navigateur.

---

## Gestion de la Déconnexion

### Workflow de déconnexion

Le composant `ProfileContent` gère la déconnexion via le client Better Auth avec un état de chargement visuel :

```typescript
const [isSigningOut, setIsSigningOut] = useState(false)
const router = useRouter()

const handleSignOut = (): void => {
  setIsSigningOut(true)
  void authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push('/')      // Redirection vers la page d'accueil
        router.refresh()      // Rafraîchissement RSC
      },
      onError: () => {
        setIsSigningOut(false)  // Réinitialisation de l'état en cas d'erreur
      }
    }
  })
}
```

**Callbacks de gestion d'état**

- **`onSuccess`** : Déclenché après une déconnexion réussie
  - `router.push('/')` : Navigation vers la page d'accueil
  - `router.refresh()` : Force le rafraîchissement des Server Components pour mettre à jour l'état d'authentification
  
- **`onError`** : Déclenché en cas d'échec de la déconnexion
  - Réinitialise `isSigningOut` à `false` pour permettre une nouvelle tentative
  - Conserve l'utilisateur sur la page de profil

**Bouton avec état de chargement**

```typescript
<Button
  onClick={handleSignOut}
  variant='tertiary'
  color='blood'
  disabled={isSigningOut}
>
  {isSigningOut
    ? (
      <>
        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
        Déconnexion...
      </>
      )
    : (
      <>
        <LogOut className='mr-2 h-5 w-5' />
        Se déconnecter
      </>
      )}
</Button>
```

L'état `isSigningOut` contrôle à la fois l'apparence du bouton (icône + texte) et son état désactivé (`disabled`), empêchant les clics multiples pendant le traitement de la déconnexion.

---

## Optimisations et Performances

### Utilisation des contextes React

L'utilisation de `SessionContext` et `WalletContext` évite le prop drilling et permet une réactivité automatique :

```typescript
// SessionContext fournit les données utilisateur sans prop drilling
const session = useSession()

// WalletContext fournit balance et totalEarned avec réactivité
const wallet = useWallet()
```

Les contextes offrent plusieurs avantages :
- **Réduction de la complexité** : Pas besoin de passer les données à travers plusieurs niveaux de composants
- **Réactivité automatique** : Les composants se re-rendent automatiquement quand les données contextuelles changent
- **Partage d'état global** : Les mêmes données sont accessibles dans tous les composants de l'arbre (Header, Profile, Dashboard)

### Validation côté client

Les validations côté client (type de fichier, taille) évitent des requêtes serveur inutiles :
- Économise des appels API Cloudinary coûteux
- Améliore l'expérience utilisateur avec des retours instantanés
- Réduit la charge serveur en filtrant les fichiers invalides en amont

### Image loading strategy

```typescript
<Image
  src={src}
  loading='eager'  // Chargement immédiat (Above The Fold)
  width={96}
  height={96}
  className='object-cover'
/>
```

La stratégie `loading='eager'` garantit un affichage instantané de la photo de profil, critère important pour la perception de performance de l'application.

---

## Limitations et Améliorations Futures

### 1. Absence de prévisualisation avant upload

**Problème** : L'utilisateur ne peut pas prévisualiser l'image avant de la valider, ce qui peut entraîner des uploads non désirés.

**Solution proposée** :
```typescript
const [previewUrl, setPreviewUrl] = useState<string | null>(null)

const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
  const file = event.target.files?.item(0)
  if (!(file instanceof File)) return

  // Validations...

  const reader = new FileReader()
  reader.onloadend = () => {
    setPreviewUrl(reader.result as string)
    // Afficher un modal avec prévisualisation et boutons Confirmer/Annuler
  }
  reader.readAsDataURL(file)
}
```

### 2. Pas de suppression de photo de profil

**Problème** : Un utilisateur ne peut pas supprimer sa photo de profil une fois définie, seulement la remplacer.

**Solution proposée** :
```typescript
async function removeProfileImage (): Promise<void> {
  await auth.api.updateUser({
    headers: await headers(),
    body: { image: null },
    query: { userId: session.user.id }
  })
}
```

Ajouter un bouton "Supprimer la photo" dans le composant `ProfileImageUploader`.

### 3. Absence de recadrage personnalisé

**Problème** : Le recadrage automatique de Cloudinary (`gravity: 'face'`) peut ne pas convenir à toutes les photos.

**Solution proposée** : Intégrer une bibliothèque de recadrage d'image côté client (par exemple `react-easy-crop`) permettant à l'utilisateur de choisir la zone à conserver avant l'upload.

### 4. Manque de statistiques détaillées

**Problème** : La section portefeuille n'affiche que deux métriques (balance et totalEarned), sans historique ou graphiques de progression.

**Solution proposée** : Créer un système de transactions avec historique :
```typescript
interface Transaction {
  type: 'earn' | 'spend'
  amount: number
  source: string  // 'monster_action', 'quest_reward', 'purchase', etc.
  createdAt: Date
}
```

Afficher un graphique de l'évolution du solde et un tableau des dernières transactions.

### 5. Pas de modification du nom d'utilisateur

**Problème** : L'utilisateur ne peut pas modifier son nom d'utilisateur après inscription.

**Solution proposée** :
```typescript
async function updateUsername (newName: string): Promise<void> {
  await auth.api.updateUser({
    headers: await headers(),
    body: { name: newName },
    query: { userId: session.user.id }
  })
}
```

Ajouter un formulaire d'édition avec validation (longueur minimale, caractères autorisés, unicité optionnelle).

### 6. Rafraîchissement complet de la page après upload

**Problème** : L'appel à `router.refresh()` après l'upload de l'image provoque un rafraîchissement complet de la page, ce qui n'est pas optimal pour l'UX.

**Solution proposée** : Utiliser une mutation optimiste ou un système de cache côté client pour mettre à jour immédiatement l'image sans rechargement.

---

## Résumé des Fichiers Clés

| Fichier | Rôle |
|---------|------|
| `/src/app/profile/page.tsx` | Page serveur protégée par `ProtectedAppLayout` |
| `/src/components/profile/ProfileContent.tsx` | Composant client principal structurant les 3 sections |
| `/src/components/profile/ProfileImageUploader.tsx` | Interface d'upload avec validations et états visuels |
| `/src/components/profile/ProfileImage.tsx` | Affichage de l'image avec fallback et gestion d'erreur |
| `/src/actions/user.actions.ts` | Server Action `updateProfileImage()` pour l'upload |
| `/src/lib/cloudinary.ts` | Configuration Cloudinary et test de connectivité |
| `/src/contexts/SessionContext.tsx` | Context pour les données utilisateur Better Auth |
| `/src/contexts/WalletContext.tsx` | Context pour les données de portefeuille |

---

## Conclusion

La page utilisateur de MyMonster offre une interface complète et intuitive pour la gestion du profil. L'intégration de Cloudinary permet une gestion professionnelle des images de profil avec transformations automatiques, tandis que les contextes React assurent une réactivité optimale sans complexité architecturale.

Les validations côté client et les états visuels clairs offrent une expérience utilisateur fluide, bien que des améliorations puissent être apportées (prévisualisation, recadrage personnalisé, historique des transactions). La structure en trois sections distinctes facilite la navigation et la compréhension des informations présentées.
