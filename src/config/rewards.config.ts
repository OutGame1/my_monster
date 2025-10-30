/**
 * Configuration des récompenses liées aux actions sur les monstres.
 * Centralise les valeurs de gains en pièces et en expérience.
 */

/**
 * Récompense de base en pièces pour une action sur un monstre.
 */
export const BASE_COIN_REWARD = 10

/**
 * Récompense en pièces lorsque l'action correspond à l'état actuel du monstre.
 * Double la récompense de base pour encourager les actions pertinentes.
 */
export const MATCHED_STATE_COIN_REWARD = 20

/**
 * Points d'expérience accordés à chaque action effectuée sur un monstre.
 */
export const XP_REWARD = 25
