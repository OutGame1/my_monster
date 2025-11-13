# Galerie Publique de Monstres

## Vue d'ensemble

La galerie publique constitue l'espace communautaire de MyMonster, permettant aux utilisateurs de découvrir les créations d'autres dresseurs. Cette feature implémente un système de pagination avancé avec infinite scroll, des filtres multidimensionnels (niveau, état, arrière-plan), et plusieurs options de tri pour une navigation optimale dans des centaines de monstres publics.

L'architecture repose sur un pattern de cursor-based pagination pour des performances optimales, un Builder pattern pour la construction des requêtes MongoDB complexes, et le hook `useInfiniteScroll` pour gérer l'état de chargement progressif. La galerie adopte un style visuel "art gallery" avec des cartes esthétiques rappelant des plaques de musée.

---

## Architecture Globale

### Structure des composants

**Page serveur (`/src/app/app/gallery/page.tsx`)**
```typescript
import GalleryContent from '@/components/gallery/GalleryContent'
import ProtectedAppLayout from '@/components/navigation/ProtectedAppLayout'

export default function GalleryPage (): ReactNode {
  return (
    <ProtectedAppLayout>
      <GalleryContent />
    </ProtectedAppLayout>
  )
}
```

La page utilise le layout protégé standard et délègue toute la logique au composant client `GalleryContent`, permettant l'utilisation de hooks React et la gestion d'état côté client.

**Hiérarchie des composants**

```
GalleryContent (client)
├── SectionTitle
├── GalleryFiltersBar (client)
│   ├── Filtres de niveau (min/max)
│   ├── Filtres d'état (7 options)
│   ├── Sélecteur de tri (4 options)
│   └── Checkbox arrière-plan
└── InfiniteGalleryGrid (client)
    ├── GalleryMonsterCard × n
    │   ├── MonsterBackgroundDisplay
    │   └── MonsterAvatar
    ├── Indicateur de chargement
    └── Message de fin
```

---

## Composant Principal : GalleryContent

### Gestion de l'état et du chargement

Le composant `GalleryContent` (`/src/components/gallery/GalleryContent.tsx`) orchestre le chargement initial, la gestion des filtres, et le rechargement des données :

```typescript
export default function GalleryContent (): ReactNode {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [filters, setFilters] = useState<GalleryFilters>({
    sortBy: DEFAULT_SORT  // 'newest' par défaut
  })

  const [result, setResult] = useState<GetPublicMonstersPaginatedResult>({
    monsters: [],
    nextCursor: null,
    hasMore: false,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  // Chargement initial des données au montage du composant
  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      try {
        const result = await getPublicMonstersPaginated()
        setResult(result)
      } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    void fetchInitialData()
  }, [])

  // ...
}
```

**Distinction entre isInitialLoading et isLoading**

- **`isInitialLoading`** : Actif uniquement lors du tout premier chargement de la page
  - Affiche des squelettes de cartes (12 `GalleryMonsterCardSkeleton`)
  - Affiche des squelettes pour les filtres
  
- **`isLoading`** : Actif lors de l'application de nouveaux filtres
  - Affiche un message "Application des filtres..." avec spinner
  - Ne réaffiche pas les squelettes, conserve l'interface visible

Cette distinction offre une meilleure expérience utilisateur en évitant des transitions visuelles brusques lors du changement de filtres.

### Gestion des filtres

Le callback `handleFiltersChange` recharge les données depuis le début avec les nouveaux critères :

```typescript
const handleFiltersChange = useCallback(async (newFilters: GalleryFilters) => {
  setFilters(newFilters)

  // Validation de la plage de niveaux
  if (newFilters.minLevel !== undefined &&
      newFilters.maxLevel !== undefined &&
      newFilters.minLevel > newFilters.maxLevel) {
    // Ne pas appliquer les filtres si la plage est invalide
    setResult(prev => ({ ...prev, monsters: [] }))
    return
  }

  setIsLoading(true)

  // Conversion des filtres UI en filtres API
  const apiFilters: GalleryFiltersParams = {
    minLevel: newFilters.minLevel,
    maxLevel: newFilters.maxLevel,
    state: newFilters.state === 'all' ? undefined : newFilters.state,
    sortBy: newFilters.sortBy,
    hasBackground: newFilters.hasBackground
  }

  try {
    // Recharger depuis le début (pas de cursor) avec les nouveaux filtres
    const newResult = await getPublicMonstersPaginated(undefined, GALLERY_PAGE_SIZE, apiFilters)
    setResult(newResult)
  } catch (error) {
    console.error('Error applying filters:', error)
  } finally {
    setIsLoading(false)
  }
}, [])
```

**Validation de la plage de niveaux**

Si l'utilisateur définit un niveau minimum supérieur au niveau maximum, les résultats sont vidés immédiatement sans faire de requête serveur. Une alerte visuelle est affichée dans la barre de filtres.

**Conversion des filtres**

La valeur `'all'` pour l'état est convertie en `undefined` pour l'API, permettant de ne pas appliquer de filtre sur l'état lors de la requête MongoDB.

### Fonction fetchMore pour l'infinite scroll

Le callback `fetchMore` est passé au composant `InfiniteGalleryGrid` pour charger les pages suivantes :

```typescript
const fetchMore = useCallback(async (currentCursor: string) => {
  const apiFilters: GalleryFiltersParams = {
    minLevel: filters.minLevel,
    maxLevel: filters.maxLevel,
    state: filters.state === 'all' ? undefined : filters.state,
    sortBy: filters.sortBy,
    hasBackground: filters.hasBackground
  }

  const result = await getPublicMonstersPaginated(
    currentCursor, 
    GALLERY_PAGE_SIZE, 
    apiFilters
  )
  
  return {
    data: result.monsters,
    nextCursor: result.nextCursor,
    hasMore: result.hasMore
  }
}, [filters])
```

Cette fonction capture les filtres actuels dans sa closure, assurant que les pages suivantes respectent les mêmes critères de filtrage que la première page.

### Réinitialisation de la grille lors du changement de filtres

```typescript
<InfiniteGalleryGrid
  key={`${filters.sortBy ?? 'newest'}-${filters.state ?? 'all'}-${filters.minLevel ?? 0}-${filters.maxLevel ?? 0}-${String(filters.hasBackground ?? false)}`}
  initialResult={result}
  fetchMore={fetchMore}
/>
```

La `key` dynamique force le démontage et remontage du composant `InfiniteGalleryGrid` à chaque changement de filtres, réinitialisant ainsi son état interne (liste de monstres, cursor, etc.). Cela garantit qu'un changement de filtre commence toujours par une nouvelle requête depuis le début.

---

## Barre de Filtres : GalleryFiltersBar

### Structure et fonctionnalités

Le composant `GalleryFiltersBar` (`/src/components/gallery/GalleryFiltersBar.tsx`) offre une interface complète de filtrage organisée en trois sections :

**1. Filtre par niveau**

```typescript
<div className='flex items-center gap-3'>
  <div className='flex-1'>
    <label className='mb-1 block text-xs text-gray-600'>Min</label>
    <input
      type='number'
      value={filters.minLevel ?? ''}
      onChange={(e) => handleLevelChange('minLevel', e.target.value)}
      placeholder='1'
      className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
    />
  </div>
  <span className='text-gray-400'>-</span>
  <div className='flex-1'>
    <label className='mb-1 block text-xs text-gray-600'>Max</label>
    <input
      type='number'
      value={filters.maxLevel ?? ''}
      onChange={(e) => handleLevelChange('maxLevel', e.target.value)}
      placeholder='100'
      className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
    />
  </div>
</div>
```

La fonction `handleLevelChange` parse la valeur saisie et applique un minimum à 1 :

```typescript
const handleLevelChange = (type: 'minLevel' | 'maxLevel', rawValue: string): void => {
  const numValue = parseInt(rawValue, 10)
  const value = isNaN(numValue) ? undefined : Math.max(numValue, 1)

  onFiltersChange({
    ...filters,
    [type]: value
  })
}
```

**Validation visuelle de la plage invalide**

```typescript
const invalidLevelRange = filters.minLevel !== undefined &&
                          filters.maxLevel !== undefined &&
                          filters.minLevel > filters.maxLevel

{invalidLevelRange && (
  <p className='flex items-center gap-2 text-xs text-blood-700 font-medium'>
    <AlertCircle className='w-4 h-4 text-blood-600 flex-shrink-0' />
    Le niveau minimum est inférieur au niveau maximum
  </p>
)}
```

**2. Filtre par état**

```typescript
{MONSTER_STATE_OPTIONS.map(({ value, label }, index) => {
  const isActive = (filters.state ?? 'all') === value
  return (
    <button
      key={index}
      onClick={() => handleStateChange(value)}
      className={cn(
        'rounded-lg px-3 py-2 text-sm font-medium transition-all',
        isActive
          ? 'bg-tolopea-500 text-white shadow-md'
          : 'bg-gray-300 text-gray-700 hover:bg-gray-200'
      )}
    >
      {label}
    </button>
  )
})}
```

Les options d'états proviennent de la configuration (`/src/config/gallery.config.ts`) :

```typescript
export const MONSTER_STATE_OPTIONS: MonsterStateOption[] = [
  { value: 'all', label: 'Tous' },
  { value: 'happy', label: 'Heureux' },
  { value: 'sad', label: 'Triste' },
  { value: 'gamester', label: 'Joueur' },
  { value: 'angry', label: 'En colère' },
  { value: 'hungry', label: 'Affamé' },
  { value: 'sleepy', label: 'Endormi' }
]
```

**3. Tri et filtre arrière-plan**

```typescript
<select
  value={filters.sortBy ?? DEFAULT_SORT}
  onChange={(e) => handleSortChange(e.target.value)}
  className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
>
  {SORT_OPTIONS.map(({ value, label }, index) => (
    <option key={index} value={value}>
      {label}
    </option>
  ))}
</select>

{/* Checkbox arrière-plan */}
<label className='flex items-center gap-3 cursor-pointer group'>
  <input
    type='checkbox'
    checked={filters.hasBackground ?? false}
    onChange={(e) => handleBackgroundChange(e.target.checked)}
    className='h-5 w-5 rounded border-gray-300 text-tolopea-500'
  />
  <span className='text-sm font-medium text-gray-700'>
    Avec arrière-plan uniquement
  </span>
</label>
```

Les options de tri disponibles :

```typescript
export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'level-desc', label: 'Niveau décroissant' },
  { value: 'level-asc', label: 'Niveau croissant' }
]
```

### Compteur de filtres actifs et réinitialisation

```typescript
const activeFilters = [
  filters.minLevel !== undefined,
  filters.maxLevel !== undefined,
  filters.state !== undefined && filters.state !== 'all',
  filters.hasBackground === true
]

// Utilise la fonction count() de utils.ts
const activeFiltersCount = count(activeFilters, active => active)

const handleResetFilters = (): void => onFiltersChange({ sortBy: DEFAULT_SORT })

<div className='flex items-center justify-between'>
  <div className='flex items-center gap-3'>
    <h3 className='text-2xl font-semibold text-gray-700'>Filtres</h3>
    {activeFiltersCount > 0 && (
      <span className='rounded-full bg-tolopea-100 px-3 py-1 text-sm font-medium text-tolopea-700'>
        {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
      </span>
    )}
  </div>
  <Button
    onClick={handleResetFilters}
    width='fit'
    disabled={activeFiltersCount === 0}
  >
    Réinitialiser les filtres
  </Button>
</div>
```

Le compteur de filtres actifs utilise la fonction `count()` du fichier `/src/lib/utils.ts`, qui est plus performante que `filter().length` car elle ne crée pas de tableau intermédiaire.

---

## Infinite Scroll : InfiniteGalleryGrid

### Hook useInfiniteScroll

Le composant `InfiniteGalleryGrid` (`/src/components/gallery/InfiniteGalleryGrid.tsx`) utilise un hook personnalisé pour gérer la pagination :

```typescript
const { data: monsters, hasMore, isLoading, loadMore } = useInfiniteScroll({
  initialData: initialMonsters,
  initialCursor,
  initialHasMore,
  fetchMore
})
```

**Implémentation du hook (`/src/hooks/useInfiniteScroll.ts`)**

```typescript
export function useInfiniteScroll<T> ({
  initialData,
  initialCursor,
  initialHasMore,
  fetchMore
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>(initialData)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(async () => {
    // Gardes : ne rien faire si déjà en chargement, plus de données, ou pas de cursor
    if (isLoading || !hasMore || cursor === null) return

    setIsLoading(true)
    try {
      const result = await fetchMore(cursor)
      setData(prev => [...prev, ...result.data])  // Concaténation des résultats
      setCursor(result.nextCursor)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading more data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [cursor, hasMore, isLoading, fetchMore])

  return { data, cursor, hasMore, isLoading, loadMore }
}
```

**Avantages du hook personnalisé**

- **Généricité** : Fonctionne avec n'importe quel type de données grâce au type générique `<T>`
- **Gestion d'état centralisée** : Encapsule toute la logique de pagination (data, cursor, hasMore, isLoading)
- **Protection contre les doubles chargements** : Les gardes empêchent les appels multiples simultanés
- **Réutilisabilité** : Peut être utilisé pour d'autres features de pagination (quêtes, achievements, etc.)

### Détection du scroll avec react-intersection-observer

Le composant utilise `react-intersection-observer` pour détecter quand l'utilisateur atteint le bas de la liste :

```typescript
import { useInView } from 'react-intersection-observer'

const { ref: loadMoreRef } = useInView({
  threshold: 0.1,  // Déclenche quand 10% de l'élément est visible
  onChange: (inView) => {
    if (inView && hasMore && !isLoading) {
      void loadMore()
    }
  }
})

// ...

{hasMore && (
  <div ref={loadMoreRef} className='flex justify-center py-8'>
    {isLoading
      ? (
        <div className='flex items-center gap-3 text-tolopea-600'>
          <div className='h-6 w-6 animate-spin rounded-full border-4 border-tolopea-200 border-t-tolopea-600' />
          <span className='font-medium'>Chargement de plus de monstres...</span>
        </div>
        )
      : (
        <div className='text-sm text-gray-500'>
          Faites défiler pour charger plus • {monsters.length} / {totalCount} monstres affichés
        </div>
        )}
  </div>
)}
```

**Fonctionnement**

- Le callback `onChange` est déclenché quand l'élément `ref={loadMoreRef}` entre ou sort du viewport
- Si l'élément devient visible (`inView === true`) ET qu'il reste des données (`hasMore === true`) ET qu'aucun chargement n'est en cours (`isLoading === false`), alors `loadMore()` est appelé
- Le `threshold: 0.1` déclenche le chargement avant que l'utilisateur atteigne complètement le bas, offrant une transition fluide

### État vide et message de fin

```typescript
if (monsters.length === 0) {
  return (
    <div className='flex min-h-[400px] items-center justify-center rounded-2xl 
                    border-2 border-dashed border-tolopea-200 bg-tolopea-50/30 p-12'>
      <div className='text-center'>
        <p className='text-2xl font-bold text-tolopea-600'>Galerie vide</p>
        <p className='mt-2 text-gray-600'>
          Aucun monstre public pour le moment. Soyez le premier à partager votre création !
        </p>
      </div>
    </div>
  )
}

// ...

{!hasMore && monsters.length > 0 && (
  <div className='flex justify-center py-8 text-sm text-gray-500'>
    Vous avez vu tous les {totalCount} monstres publics
  </div>
)}
```

---

## Carte de Monstre : GalleryMonsterCard

### Design "art gallery"

Le composant `GalleryMonsterCard` (`/src/components/gallery/GalleryMonsterCard.tsx`) adopte un style esthétique rappelant les plaques de musée :

```typescript
export default function GalleryMonsterCard ({ monster }: GalleryMonsterCardProps): ReactNode {
  return (
    <div className='group relative overflow-hidden rounded-xl bg-white shadow-md 
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'>
      {/* Monster Avatar with Background */}
      <div className='relative'>
        <MonsterBackgroundDisplay
          monsterId={monster._id}
          monsterName={monster.name}
          backgroundId={monster.backgroundId}
          showChangeButton={false}  // Pas de bouton de modification dans la galerie
        >
          <MonsterAvatar
            traits={monster.traits}
            state={monster.state}
            size={240}
          />
        </MonsterBackgroundDisplay>

        {/* Level Badge - Top Right Corner */}
        <div className='absolute top-4 right-4 z-10'>
          <span className='rounded-full bg-blood-500 px-3 py-1 text-sm font-bold text-white shadow-lg'>
            Niv. {monster.level}
          </span>
        </div>
      </div>

      {/* Info Section - Gallery Plaque Style */}
      <div className='border-t-4 border-tolopea-200 bg-gradient-to-b from-white to-gray-50 p-6'>
        {/* Monster Name - Title */}
        <h3 className='mb-3 text-center text-2xl font-bold text-tolopea-800'>
          {monster.name}
        </h3>

        {/* Creator Info - Artist Signature Style */}
        <div className='flex items-center justify-center gap-2 text-gray-600'>
          <User className='h-4 w-4' />
          <p className='text-sm font-medium'>
            par <span className='font-semibold text-tolopea-600'>{monster.ownerName}</span>
          </p>
        </div>

        {/* Decorative Line */}
        <div className='mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-tolopea-300 to-aqua-forest-300' />
      </div>

      {/* Hover Overlay Effect */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-tolopea-900/0 to-tolopea-900/0 
                      transition-all duration-300 group-hover:from-tolopea-900/5 group-hover:to-transparent' />
    </div>
  )
}
```

**Éléments de design**

- **Badge de niveau** : Positionné en haut à droite avec ombre portée pour le détacher du fond
- **Bordure supérieure** : `border-t-4 border-tolopea-200` crée une séparation visuelle style "cadre de tableau"
- **Dégradé de fond** : `bg-gradient-to-b from-white to-gray-50` pour un effet de profondeur
- **Signature de l'artiste** : Section dédiée au nom du créateur avec icône User
- **Ligne décorative** : Trait horizontal avec dégradé pour clôturer la carte
- **Effet hover** : Translation vers le haut (`hover:-translate-y-2`) et augmentation de l'ombre (`hover:shadow-2xl`)
- **Overlay subtil au hover** : Légère teinte violette qui renforce l'effet de surélévation

---

## Server Action : getPublicMonstersPaginated

### Signature et paramètres

La Server Action `getPublicMonstersPaginated()` (`/src/actions/monsters.actions.ts`) gère la récupération paginée des monstres publics avec filtres :

```typescript
export async function getPublicMonstersPaginated (
  cursor?: string,
  limit: number = 12,
  filters?: GalleryFiltersParams
): Promise<GetPublicMonstersPaginatedResult>
```

**Paramètres**

- **`cursor`** : ID du dernier monstre de la page précédente (optionnel, undefined pour la première page)
- **`limit`** : Nombre de monstres par page (par défaut 12, défini dans `GALLERY_PAGE_SIZE`)
- **`filters`** : Critères de filtrage et de tri (optionnels)

**Retour**

```typescript
interface GetPublicMonstersPaginatedResult {
  monsters: ISerializedPublicMonster[]  // Monstres sérialisés pour le client
  nextCursor: string | null             // ID du dernier monstre de la page (null si fin)
  hasMore: boolean                      // true s'il reste des pages à charger
  total: number                         // Nombre total de monstres publics (avec filtres)
}
```

### Construction de la requête avec le Builder

La fonction utilise le `GalleryFilterBuilder` pour construire les filtres MongoDB :

```typescript
// Construire le filtre avec le builder (filtres passés au constructeur)
const builder = new GalleryFilterBuilder(filters)

// Ajouter le cursor si présent
if (cursor !== undefined) {
  const isReversedSort = GalleryFilterBuilder.isReversedSort(filters?.sortBy)
  builder.withCursor(cursor, isReversedSort)
}

// Récupérer le total de monstres publics avec filtres (sans cursor)
const totalPromise = Monster.countDocuments(builder.buildForCount())

// Récupérer les monstres avec pagination
const monstersPromise = Monster.aggregate<IPublicMonsterDocument>([
  // Filtrer les monstres publics (et après le cursor si présent)
  { $match: builder.build() },
  // Trier selon les critères choisis
  { $sort: GalleryFilterBuilder.buildSort(filters?.sortBy) },
  // Limiter le nombre de résultats (+ 1 pour savoir s'il y en a encore)
  { $limit: limit + 1 },
  // Jointure avec la collection user
  {
    $lookup: {
      from: 'user',
      localField: 'ownerId',
      foreignField: '_id',
      as: 'owner'
    }
  },
  // Dérouler le tableau owner
  { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
  // Projeter uniquement les champs nécessaires
  {
    $project: {
      _id: 1,
      name: 1,
      level: 1,
      traits: 1,
      state: 1,
      backgroundId: 1,
      createdAt: 1,
      ownerName: {
        $ifNull: ['$owner.name', 'Anonyme']
      }
    }
  }
]).exec()

const [total, publicMonsters] = await Promise.all([totalPromise, monstersPromise])
```

**Optimisations de la requête**

- **Promise.all** : Les requêtes de comptage et de récupération sont exécutées en parallèle pour réduire la latence
- **limit + 1** : Récupère un monstre supplémentaire pour déterminer s'il existe une page suivante sans faire une requête COUNT supplémentaire
- **$lookup avec $unwind** : Jointure efficace pour récupérer le nom du propriétaire en une seule requête
- **$project** : Projette uniquement les champs nécessaires pour réduire la taille des données transférées

### Détermination du cursor et hasMore

```typescript
// On vérifie s'il y a plus de résultats
const hasMore = publicMonsters.length > limit
const monsters = hasMore ? publicMonsters.slice(0, limit) : publicMonsters

const lastMonster = monsters.at(-1)

// On détermine le prochain curseur
const nextCursor = hasMore && lastMonster !== undefined
  ? lastMonster._id.toString()
  : null

return {
  monsters: monsters.map(publicMonsterSerializer),
  nextCursor,
  hasMore,
  total
}
```

Si on a récupéré `limit + 1` monstres, cela signifie qu'il reste au moins une page supplémentaire. On renvoie alors les `limit` premiers monstres et on utilise l'ID du dernier comme cursor pour la prochaine requête.

---

## Pattern Builder : GalleryFilterBuilder

### Principe et motivation

Le `GalleryFilterBuilder` (`/src/lib/builders/GalleryFilterBuilder.ts`) implémente le pattern Builder pour construire des filtres MongoDB complexes de manière fluide et lisible.

**Avantages du pattern Builder**

- **Lisibilité** : Construction progressive avec méthodes chaînées (`builder.withMinLevel(5).withState('happy')`)
- **Réutilisabilité** : Peut être utilisé dans différents contextes (API, tests, admin panel)
- **Encapsulation** : La logique de construction des filtres est centralisée et testable
- **Flexibilité** : Ajout facile de nouveaux filtres sans modifier les Server Actions

### Implémentation

**Interface du filtre MongoDB**

```typescript
interface GalleryMatchFilter {
  isPublic: true                                        // Toujours vrai pour la galerie
  _id?: { $lt: Types.ObjectId } | { $gt: Types.ObjectId }  // Cursor pour pagination
  level?: { $gte?: number, $lte?: number }              // Plage de niveaux
  state?: MonsterState                                  // État du monstre
  backgroundId?: { $ne: null }                          // Monstres avec arrière-plan uniquement
}
```

**Méthodes du Builder**

```typescript
export default class GalleryFilterBuilder {
  private readonly filter: GalleryMatchFilter = { isPublic: true }

  // Constructeur acceptant des filtres initiaux
  public constructor (filters?: GalleryFiltersParams) {
    if (filters !== undefined) {
      this.withFilters(filters)
    }
  }

  // Ajoute un filtre sur le niveau minimum
  public withMinLevel (minLevel: number): this {
    if (this.filter.level === undefined) {
      this.filter.level = {}
    }
    this.filter.level.$gte = minLevel
    return this
  }

  // Ajoute un filtre sur le niveau maximum
  public withMaxLevel (maxLevel: number): this {
    if (this.filter.level === undefined) {
      this.filter.level = {}
    }
    this.filter.level.$lte = maxLevel
    return this
  }

  // Ajoute un filtre sur la plage de niveaux
  public withLevelRange (minLevel?: number, maxLevel?: number): this {
    if (minLevel !== undefined) {
      this.withMinLevel(minLevel)
    }
    if (maxLevel !== undefined) {
      this.withMaxLevel(maxLevel)
    }
    return this
  }

  // Ajoute un filtre sur l'état du monstre
  public withState (state: MonsterState): this {
    this.filter.state = state
    return this
  }

  // Ajoute un filtre pour n'afficher que les monstres avec un arrière-plan
  public withBackground (): this {
    this.filter.backgroundId = { $ne: null }
    return this
  }

  // Ajoute un filtre de cursor pour la pagination
  public withCursor (cursor: string, isReversedSort: boolean): this {
    if (Types.ObjectId.isValid(cursor)) {
      this.filter._id = isReversedSort
        ? { $gt: new Types.ObjectId(cursor) }  // Tri croissant : après le cursor
        : { $lt: new Types.ObjectId(cursor) }  // Tri décroissant : avant le cursor
    }
    return this
  }

  // Construit et retourne le filtre MongoDB final
  public build (): GalleryMatchFilter {
    return this.filter
  }

  // Construit un filtre pour le comptage total (sans cursor)
  public buildForCount (): Omit<GalleryMatchFilter, '_id'> {
    const { _id, ...filterWithoutCursor } = this.filter
    return filterWithoutCursor
  }
}
```

**Méthodes statiques pour le tri**

```typescript
// Détermine si le tri est inversé (croissant)
public static isReversedSort (sortBy?: GallerySortBy): boolean {
  return sortBy === 'oldest' || sortBy === 'level-asc'
}

// Construit l'objet de tri MongoDB selon les critères
public static buildSort (sortBy?: GallerySortBy): Partial<Record<keyof ISerializedMonster, 1 | -1>> {
  switch (sortBy) {
    case 'oldest':
      return { _id: 1 }          // Plus anciens (croissant sur _id)
    case 'level-asc':
      return { level: 1, _id: 1 }  // Niveau croissant, puis _id croissant
    case 'level-desc':
      return { level: -1, _id: -1 }  // Niveau décroissant, puis _id décroissant
    default:
      return { _id: -1 }         // Plus récents (décroissant sur _id)
  }
}
```

**Explication du tri avec cursor**

Pour la pagination avec cursor, le tri doit être cohérent entre les pages. MongoDB utilise l'ObjectId `_id` qui contient un timestamp, permettant un tri chronologique naturel.

- **Tri décroissant (`newest`, `level-desc`)** : On veut les monstres **avant** le cursor → `{ _id: { $lt: cursor } }`
- **Tri croissant (`oldest`, `level-asc`)** : On veut les monstres **après** le cursor → `{ _id: { $gt: cursor } }`

Pour les tris par niveau, on ajoute `_id` comme critère secondaire pour garantir un ordre déterministe (éviter que des monstres de même niveau soient ignorés ou dupliqués entre les pages).

---

## Sérialisation des Monstres Publics

### Interface ISerializedPublicMonster

La galerie utilise une version allégée de l'interface `ISerializedMonster`, excluant les champs privés :

```typescript
export interface ISerializedPublicMonster {
  _id: string
  name: string
  level: number
  traits: ISerializedMonsterTraits
  state: MonsterState
  backgroundId: string | null
  createdAt: string
  ownerName: string  // Nom du propriétaire (depuis la jointure $lookup)
}
```

**Champs exclus par rapport à ISerializedMonster**

- `xp` : Information non pertinente pour les visiteurs
- `maxXp` : Information non pertinente pour les visiteurs
- `isPublic` : Toujours `true` dans la galerie
- `ownerId` : Remplacé par `ownerName` pour la confidentialité
- `updatedAt` : Date de dernière modification non affichée

### Fonction publicMonsterSerializer

```typescript
export function publicMonsterSerializer (rawMonster: IPublicMonsterDocument): ISerializedPublicMonster {
  return {
    _id: rawMonster._id.toString(),
    name: rawMonster.name,
    level: rawMonster.level,
    traits: monsterTraitsSerializer(rawMonster.traits),
    state: rawMonster.state,
    backgroundId: rawMonster.backgroundId,
    createdAt: rawMonster.createdAt.toISOString(),
    ownerName: rawMonster.ownerName  // Depuis $project de l'aggregation
  }
}
```

La fonction réutilise `monsterTraitsSerializer()` pour sérialiser les traits graphiques (couleurs, formes, taille).

---

## Configuration de la Galerie

### Fichier gallery.config.ts

Le fichier `/src/config/gallery.config.ts` centralise toutes les constantes de la galerie :

```typescript
/**
 * Nombre de monstres par page dans la galerie
 */
export const GALLERY_PAGE_SIZE = 12

/**
 * Options d'états de monstres disponibles dans les filtres
 */
export const MONSTER_STATE_OPTIONS: MonsterStateOption[] = [
  { value: 'all', label: 'Tous' },
  { value: 'happy', label: 'Heureux' },
  { value: 'sad', label: 'Triste' },
  { value: 'gamester', label: 'Joueur' },
  { value: 'angry', label: 'En colère' },
  { value: 'hungry', label: 'Affamé' },
  { value: 'sleepy', label: 'Endormi' }
]

/**
 * Options de tri disponibles dans les filtres
 */
export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'level-desc', label: 'Niveau décroissant' },
  { value: 'level-asc', label: 'Niveau croissant' }
]

/**
 * Tri par défaut
 */
export const DEFAULT_SORT: GallerySortBy = 'newest'
```

**Avantages de la centralisation**

- **Modification facile** : Changer `GALLERY_PAGE_SIZE` ajuste automatiquement toutes les requêtes
- **Cohérence** : Les options de filtres sont identiques partout où elles sont utilisées
- **Extensibilité** : Ajout d'une nouvelle option de tri en une seule ligne
- **Type-safety** : Les types TypeScript (`GallerySortBy`, `MonsterStateOption`) assurent la cohérence

---

## Types TypeScript : gallery.d.ts

### Interfaces principales

Le fichier `/src/types/gallery.d.ts` définit tous les types nécessaires à la feature :

```typescript
/**
 * Options de tri disponibles pour la galerie
 */
export type GallerySortBy = 'newest' | 'oldest' | 'level-asc' | 'level-desc'

export type GalleryStateFilter = MonsterState | 'all'

/**
 * Filtres de la galerie (utilisés dans l'UI)
 */
export interface GalleryFilters {
  minLevel?: number
  maxLevel?: number
  state?: GalleryStateFilter
  sortBy?: GallerySortBy
  hasBackground?: boolean
}

/**
 * Paramètres de filtres pour l'API server action
 * Similaire à GalleryFilters mais sans la valeur 'all' pour state
 */
export interface GalleryFiltersParams {
  minLevel?: number
  maxLevel?: number
  state?: MonsterState  // Pas de 'all', undefined si tous les états
  sortBy?: GallerySortBy
  hasBackground?: boolean
}

/**
 * Résultat paginé de la requête de monstres publics
 */
export interface GetPublicMonstersPaginatedResult {
  monsters: ISerializedPublicMonster[]
  nextCursor: string | null
  hasMore: boolean
  total: number
}

/**
 * Configuration d'une option de tri pour l'UI
 */
export interface SortOption {
  value: GallerySortBy
  label: string
}

/**
 * Configuration d'un état de monstre pour l'UI
 */
export interface MonsterStateOption {
  value: GalleryStateFilter
  label: string
}
```

**Distinction GalleryFilters vs GalleryFiltersParams**

- **`GalleryFilters`** : Interface UI permettant la valeur `'all'` pour l'état (représente "tous les états")
- **`GalleryFiltersParams`** : Interface API où `state` est de type `MonsterState` (pas de `'all'`), `undefined` signifie "tous les états"

Cette séparation évite la pollution de l'API avec des valeurs métier de l'UI.

---

## Optimisations et Performances

### 1. Cursor-based pagination

La pagination par cursor offre de meilleures performances que l'offset-based pagination :

**Offset-based (évité)**
```javascript
// Page 100 : MongoDB doit parcourir 10,000 documents pour les ignorer
{ skip: 10000, limit: 100 }
```

**Cursor-based (implémenté)**
```javascript
// Page suivante : MongoDB utilise l'index sur _id pour commencer directement au bon endroit
{ _id: { $lt: lastSeenId }, limit: 100 }
```

Avantages :
- **Performance constante** : Peu importe la page, le temps de requête reste stable
- **Pas de doublons** : Si de nouveaux monstres sont ajoutés pendant la navigation, pas de décalage
- **Scalabilité** : Fonctionne efficacement avec des millions de documents

### 2. Requêtes parallèles avec Promise.all

```typescript
const [total, publicMonsters] = await Promise.all([totalPromise, monstersPromise])
```

Les requêtes de comptage et de récupération s'exécutent en parallèle, réduisant la latence globale de ~50% par rapport à une exécution séquentielle.

### 3. Limit +1 technique

```typescript
{ $limit: limit + 1 }

const hasMore = publicMonsters.length > limit
const monsters = hasMore ? publicMonsters.slice(0, limit) : publicMonsters
```

Cette technique évite une requête COUNT supplémentaire pour déterminer s'il existe une page suivante. Si on reçoit `limit + 1` documents, on sait qu'il y en a au moins un de plus.

### 4. Projection MongoDB

```typescript
{
  $project: {
    _id: 1,
    name: 1,
    level: 1,
    traits: 1,
    state: 1,
    backgroundId: 1,
    createdAt: 1,
    ownerName: { $ifNull: ['$owner.name', 'Anonyme'] }
  }
}
```

La projection limite les champs transférés depuis MongoDB, réduisant la bande passante et le temps de parsing JSON.

### 5. Index MongoDB

Le champ `isPublic` dans le modèle Monster possède un index :

```typescript
isPublic: {
  type: Boolean,
  required: false,
  default: false,
  index: true  // Index pour les requêtes de galerie
}
```

Cet index accélère considérablement les requêtes `{ isPublic: true }` qui sont le filtre de base de toutes les requêtes de galerie.

### 6. Hook useInfiniteScroll générique

Le hook `useInfiniteScroll` est réutilisable pour d'autres features, évitant la duplication de logique de pagination :

```typescript
// Réutilisable pour n'importe quelle pagination
export function useInfiniteScroll<T> ({
  initialData,
  initialCursor,
  initialHasMore,
  fetchMore
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T>
```

### 7. Squelettes de chargement

L'affichage de squelettes pendant le chargement initial améliore la perception de performance :

```typescript
{isInitialLoading
  ? (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 12 }).map((_, i) => (
        <GalleryMonsterCardSkeleton key={i} />
      ))}
    </div>
    )
  : (
    <InfiniteGalleryGrid ... />
    )}
```

Les utilisateurs perçoivent l'application comme plus rapide quand du contenu (même provisoire) s'affiche immédiatement.

---

## Limitations et Améliorations Futures

### 1. Filtres multiples pour l'état

**Problème** : L'utilisateur ne peut sélectionner qu'un seul état à la fois (boutons radio).

**Solution proposée** : Remplacer par des checkboxes permettant la sélection multiple :

```typescript
interface GalleryFilters {
  states?: MonsterState[]  // Tableau d'états au lieu d'un seul
  // ...
}

// Dans GalleryFilterBuilder
public withStates (states: MonsterState[]): this {
  if (states.length > 0) {
    this.filter.state = { $in: states }  // MongoDB $in operator
  }
  return this
}
```

### 2. Recherche par nom de monstre ou de créateur

**Problème** : Aucun système de recherche textuelle n'est implémenté.

**Solution proposée** : Ajouter un champ de recherche dans la barre de filtres :

```typescript
interface GalleryFilters {
  searchQuery?: string
  // ...
}

// Dans MongoDB (nécessite un index textuel)
monsterSchema.index({ name: 'text', ownerName: 'text' })

// Dans GalleryFilterBuilder
public withSearch (query: string): this {
  this.filter.$text = { $search: query }
  return this
}
```

### 3. Tri par popularité ou par nombre de vues

**Problème** : Seuls les tris par date et niveau sont disponibles, pas de métriques d'engagement.

**Solution proposée** : Ajouter des champs `views` et `likes` au modèle Monster :

```typescript
interface IMonsterDocument {
  // ...
  views: number
  likes: number
}

// Nouvelles options de tri
export const SORT_OPTIONS: SortOption[] = [
  // ... options existantes
  { value: 'most-viewed', label: 'Plus vus' },
  { value: 'most-liked', label: 'Plus appréciés' }
]
```

### 4. Cache côté client pour les filtres fréquents

**Problème** : Chaque changement de filtre déclenche une nouvelle requête serveur, même pour des filtres récemment consultés.

**Solution proposée** : Implémenter un cache LRU (Least Recently Used) côté client :

```typescript
const filterCache = new Map<string, GetPublicMonstersPaginatedResult>()

const cacheKey = JSON.stringify(filters)
if (filterCache.has(cacheKey)) {
  setResult(filterCache.get(cacheKey)!)
  return
}

// Faire la requête et mettre en cache
const result = await getPublicMonstersPaginated(...)
filterCache.set(cacheKey, result)
```

### 5. Pagination par numéros de page

**Problème** : L'infinite scroll ne permet pas de sauter directement à une page spécifique (ex: page 5).

**Solution proposée** : Ajouter une navigation par numéros de page en bas de la galerie :

```typescript
<div className='flex items-center gap-2'>
  <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
    Précédent
  </Button>
  
  {pageNumbers.map(num => (
    <Button
      key={num}
      onClick={() => goToPage(num)}
      variant={num === currentPage ? 'primary' : 'ghost'}
    >
      {num}
    </Button>
  ))}
  
  <Button onClick={() => goToPage(currentPage + 1)} disabled={!hasMore}>
    Suivant
  </Button>
</div>
```

### 6. Détails du monstre en modal

**Problème** : Cliquer sur une carte de monstre ne fait rien actuellement.

**Solution proposée** : Ouvrir un modal avec des détails complets :

```typescript
<GalleryMonsterCard
  monster={monster}
  onClick={() => setSelectedMonster(monster)}
/>

{selectedMonster && (
  <Modal onClose={() => setSelectedMonster(null)}>
    <MonsterDetailsModal monster={selectedMonster} />
  </Modal>
)}
```

Le modal pourrait afficher :
- Statistiques complètes (XP, niveau, état)
- Historique du monstre (date de création, évolutions)
- Profil du créateur avec lien vers ses autres monstres
- Bouton pour "aimer" le monstre

### 7. Filtres avancés (rareté, couleurs)

**Problème** : Impossible de filtrer par rareté ou par couleurs du monstre.

**Solution proposée** : Ajouter des filtres supplémentaires :

```typescript
interface GalleryFilters {
  // ...
  rarity?: MonsterRarity
  primaryColor?: string
  secondaryColor?: string
}

// Dans GalleryFilterBuilder
public withRarity (rarity: MonsterRarity): this {
  this.filter.rarity = rarity
  return this
}

public withColors (primary?: string, secondary?: string): this {
  if (primary !== undefined) {
    this.filter['traits.primaryColor'] = primary
  }
  if (secondary !== undefined) {
    this.filter['traits.secondaryColor'] = secondary
  }
  return this
}
```

---

## Résumé des Fichiers Clés

| Fichier | Rôle |
|---------|------|
| `/src/app/app/gallery/page.tsx` | Page serveur protégée par `ProtectedAppLayout` |
| `/src/components/gallery/GalleryContent.tsx` | Composant client orchestrant chargement et filtres |
| `/src/components/gallery/GalleryFiltersBar.tsx` | Barre de filtres avec niveau, état, tri, arrière-plan |
| `/src/components/gallery/InfiniteGalleryGrid.tsx` | Grille avec infinite scroll via `useInfiniteScroll` |
| `/src/components/gallery/GalleryMonsterCard.tsx` | Carte de monstre style "art gallery" |
| `/src/hooks/useInfiniteScroll.ts` | Hook générique pour la pagination cursor-based |
| `/src/actions/monsters.actions.ts` | Server Action `getPublicMonstersPaginated()` |
| `/src/lib/builders/GalleryFilterBuilder.ts` | Builder pattern pour filtres MongoDB |
| `/src/lib/serializers/monster.serializer.ts` | Sérialisation `publicMonsterSerializer()` |
| `/src/config/gallery.config.ts` | Configuration (page size, options de tri/filtres) |
| `/src/types/gallery.d.ts` | Types TypeScript de la galerie |

---

## Conclusion

La galerie publique de MyMonster démontre une architecture robuste et performante pour la gestion de listes paginées complexes. L'utilisation de la cursor-based pagination, du pattern Builder, et du hook `useInfiniteScroll` réutilisable garantit des performances optimales même avec des milliers de monstres publics.

Les filtres multidimensionnels offrent une navigation flexible, tandis que le design "art gallery" crée une expérience visuelle agréable mettant en valeur les créations de la communauté. Le système de squelettes de chargement et les requêtes parallèles assurent une perception de rapidité constante.

Bien que des améliorations soient possibles (recherche textuelle, tri par popularité, cache côté client), la fondation actuelle est solide et extensible. La séparation claire entre les interfaces UI (`GalleryFilters`) et API (`GalleryFiltersParams`), ainsi que la centralisation de la configuration, facilitent l'évolution future de la feature.
