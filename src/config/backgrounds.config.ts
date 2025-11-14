import { rarityMap } from './rarity.config'
import type { Rarity } from '@/types/accessories'
import type { BackgroundDefinition } from '@/types/backgrounds'

export const commonBackgrounds: BackgroundDefinition[] = [
  {
    id: 'bg-sunset',
    name: 'Coucher de Soleil',
    rarity: 'common',
    basePrice: 10,
    description: 'Un magnifique coucher de soleil aux couleurs chaudes',
    imageUrl: '/backgrounds/sunset.svg'
  },
  {
    id: 'bg-forest',
    name: 'Forêt Verdoyante',
    rarity: 'common',
    basePrice: 10,
    description: 'Une forêt paisible avec des arbres majestueux',
    imageUrl: '/backgrounds/forest.svg'
  },
  {
    id: 'bg-ocean',
    name: 'Océan Bleu',
    rarity: 'common',
    basePrice: 10,
    description: 'Les vagues apaisantes de l\'océan',
    imageUrl: '/backgrounds/ocean.svg'
  }
]

const uncommonBackgrounds: BackgroundDefinition[] = [
  {
    id: 'bg-mountains',
    name: 'Montagnes Enneigées',
    rarity: 'uncommon',
    basePrice: 15,
    description: 'Des sommets majestueux recouverts de neige',
    imageUrl: '/backgrounds/mountains.svg'
  },
  {
    id: 'bg-desert',
    name: 'Désert Doré',
    rarity: 'uncommon',
    basePrice: 15,
    description: 'Les dunes infinies du désert au soleil couchant',
    imageUrl: '/backgrounds/desert.svg'
  },
  {
    id: 'bg-city',
    name: 'Métropole Nocturne',
    rarity: 'uncommon',
    basePrice: 15,
    description: 'Une ville moderne illuminée la nuit',
    imageUrl: '/backgrounds/city.svg'
  }
]

const rareBackgrounds: BackgroundDefinition[] = [
  {
    id: 'bg-space',
    name: 'Espace Étoilé',
    rarity: 'rare',
    basePrice: 20,
    description: 'L\'immensité de l\'espace et ses étoiles scintillantes',
    imageUrl: '/backgrounds/space.svg'
  },
  {
    id: 'bg-volcano',
    name: 'Volcan Actif',
    rarity: 'rare',
    basePrice: 20,
    description: 'Un volcan en éruption avec lave incandescente',
    imageUrl: '/backgrounds/volcano.svg'
  },
  {
    id: 'bg-crystal-cave',
    name: 'Grotte Cristalline',
    rarity: 'rare',
    basePrice: 20,
    description: 'Une caverne mystérieuse remplie de cristaux lumineux',
    imageUrl: '/backgrounds/crystal-cave.svg'
  }
]

const epicBackgrounds: BackgroundDefinition[] = [
  {
    id: 'bg-aurora',
    name: 'Aurore Boréale',
    rarity: 'epic',
    basePrice: 30,
    description: 'Les lumières magiques dansantes du nord',
    imageUrl: '/backgrounds/aurora.svg'
  },
  {
    id: 'bg-underwater',
    name: 'Fonds Marins',
    rarity: 'epic',
    basePrice: 30,
    description: 'Un récif corallien coloré sous la mer',
    imageUrl: '/backgrounds/underwater.svg'
  },
  {
    id: 'bg-portal',
    name: 'Portail Dimensionnel',
    rarity: 'epic',
    basePrice: 30,
    description: 'Un portail mystérieux vers d\'autres dimensions',
    imageUrl: '/backgrounds/portal.svg'
  }
]

const legendaryBackgrounds: BackgroundDefinition[] = [
  {
    id: 'bg-galaxy',
    name: 'Galaxie Spirale',
    rarity: 'legendary',
    basePrice: 50,
    description: 'Une galaxie majestueuse tournoyant dans le cosmos',
    imageUrl: '/backgrounds/galaxy.svg'
  },
  {
    id: 'bg-nebula',
    name: 'Nébuleuse Cosmique',
    rarity: 'legendary',
    basePrice: 50,
    description: 'Une nébuleuse colorée, berceau des étoiles',
    imageUrl: '/backgrounds/nebula.svg'
  },
  {
    id: 'bg-celestial',
    name: 'Royaume Céleste',
    rarity: 'legendary',
    basePrice: 50,
    description: 'Un royaume divin baigné de lumière stellaire',
    imageUrl: '/backgrounds/celestial.svg'
  }
]

/**
 * Catalogue complet des arrière-plans disponibles
 *
 * Images stockées dans: public/backgrounds/
 * Format recommandé: 512x512px ou 1024x1024px
 * Extensions acceptées: .jpg, .png, .webp
 */
export const allBackgrounds: BackgroundDefinition[] = [
  ...commonBackgrounds,
  ...uncommonBackgrounds,
  ...rareBackgrounds,
  ...epicBackgrounds,
  ...legendaryBackgrounds
]

export const backgroundsRarityMap: Record<Rarity, BackgroundDefinition[]> = {
  common: commonBackgrounds,
  uncommon: uncommonBackgrounds,
  rare: rareBackgrounds,
  epic: epicBackgrounds,
  legendary: legendaryBackgrounds
}

export const backgroundsIdMap: Map<string, BackgroundDefinition> = new Map(
  allBackgrounds.map(bg => [bg.id, bg])
)

export function calculateFinalPrice (background: BackgroundDefinition): number {
  return Math.round(background.basePrice * rarityMap[background.rarity].priceMultiplier)
}
