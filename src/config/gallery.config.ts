/**
 * Constantes pour la feature Galerie
 */

import type { MonsterStateOption, SortOption } from '@/types/gallery'

/**
 * Nombre de monstres par page dans la galerie
 */
export const GALLERY_PAGE_SIZE = 12

/**
 * Options d'états de monstres disponibles dans les filtres
 */
export const MONSTER_STATE_OPTIONS: MonsterStateOption[] = [
  { value: 'all', label: 'Tous', emoji: '🌟' },
  { value: 'happy', label: 'Heureux', emoji: '😊' },
  { value: 'sad', label: 'Triste', emoji: '😢' },
  { value: 'gamester', label: 'Joueur', emoji: '🎮' },
  { value: 'angry', label: 'En colère', emoji: '😠' },
  { value: 'hungry', label: 'Affamé', emoji: '🍕' },
  { value: 'sleepy', label: 'Endormi', emoji: '😴' }
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
export const DEFAULT_SORT: SortOption['value'] = 'newest'

/**
 * Plage de niveaux min/max
 */
export const MIN_MONSTER_LEVEL = 1
export const MAX_MONSTER_LEVEL = 100
