/**
 * Types et interfaces pour le système d'arrière-plans
 */

import type { Rarity } from './accessories'

/**
 * Arrière-plan disponible dans le catalogue de configuration
 */
export interface Background {
  /** Identifiant unique du background */
  id: string
  /** Nom affiché */
  name: string
  /** Niveau de rareté */
  rarity: Rarity
  /** Prix de base en pièces (sera multiplié par le multiplicateur de rareté) */
  basePrice: number
  /** Description courte */
  description: string
  /** Chemin relatif vers l'image du background (ex: '/backgrounds/sunset.jpg') */
  imageUrl: string
}
