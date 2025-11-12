/**
 * Types centralisés pour la feature Galerie
 */

import type { MonsterState } from '@/db/models/monster.model'
import type { ISerializedPublicMonster } from '@/lib/serializers/monster.serializer'

/**
 * Options de tri disponibles pour la galerie
 */
export type GallerySortBy = 'newest' | 'oldest' | 'level-asc' | 'level-desc'

export type GalleryStateFilter = MonsterState | 'all'

/**
 * Filtres de la galerie (utilisés dans l'UI)
 * Permet de filtrer et trier les monstres publics
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
  state?: MonsterState
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
