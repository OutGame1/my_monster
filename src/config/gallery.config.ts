/**
 * Constantes pour la feature Galerie
 */

import type { GallerySortBy, MonsterStateOption, SortOption } from '@/types/gallery'

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

/**
 * Plage de niveaux min/max
 */
export const MIN_MONSTER_LEVEL = 1
export const MAX_MONSTER_LEVEL = 100
