/**
 * Types et interfaces pour le système d'accessoires
 */

/**
 * Niveau de rareté d'un item (accessoire ou background)
 */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface RarityStyle {
  backgroundColor: string
  badgeBackgroundColor: string
  borderColor: string
}

/**
 * Configuration d'une rareté
 */
export interface RarityConfig {
  /** Nom français de la rareté */
  name: string

  /** Style CSS associé à la rareté */
  style: RarityStyle

  /** Multiplicateur de prix (1 = prix de base) */
  priceMultiplier: number
}
