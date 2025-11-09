/**
 * Types centralisés pour la feature Galerie
 */

import type { MonsterState } from '@/db/models/monster.model'
import type { ISerializedPublicMonster } from '@/lib/serializers/monster.serializer'

/**
 * Options de tri disponibles pour la galerie
 */
export type GallerySortBy = 'newest' | 'oldest' | 'level-asc' | 'level-desc'

/**
 * Filtres de la galerie (utilisés dans l'UI)
 * Permet de filtrer et trier les monstres publics
 */
export interface GalleryFilters {
  minLevel?: number
  maxLevel?: number
  state?: MonsterState | 'all'
  sortBy?: GallerySortBy
}

/**
 * Paramètres de filtres pour l'API server action
 * Similaire à GalleryFilters mais sans la valeur 'all' pour state
 */
export interface GalleryFiltersParams {
  minLevel?: number
  maxLevel?: number
  state?: MonsterState
  sortBy?: GallerySortBy
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
 * Props du composant GalleryContent
 */
export interface GalleryContentProps {
  initialMonsters: ISerializedPublicMonster[]
  initialCursor: string | null
  initialHasMore: boolean
  initialTotal: number
}

/**
 * Props du composant GalleryFiltersBar
 */
export interface GalleryFiltersBarProps {
  filters: GalleryFilters
  onFiltersChange: (filters: GalleryFilters) => void
  totalCount: number
}

/**
 * Props du composant InfiniteGalleryGrid
 */
export interface InfiniteGalleryGridProps {
  initialMonsters: ISerializedPublicMonster[]
  initialCursor: string | null
  initialHasMore: boolean
  totalCount: number
  fetchMore?: (cursor: string) => Promise<{
    data: ISerializedPublicMonster[]
    nextCursor: string | null
    hasMore: boolean
  }>
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
  value: MonsterState | 'all'
  label: string
  emoji: string
}
