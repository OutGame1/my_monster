import type { Rarity, RarityConfig } from '@/types/accessories'

export const commonRarity: RarityConfig = {
  name: 'Commun',
  priceMultiplier: 1,
  style: {
    backgroundColor: 'bg-gray-500',
    badgeBackgroundColor: 'bg-gray-600',
    borderColor: 'border-gray-500'
  }
}

export const uncommonRarity: RarityConfig = {
  name: 'Peu Commun',
  priceMultiplier: 1.5,
  style: {
    backgroundColor: 'bg-green-500',
    badgeBackgroundColor: 'bg-green-600',
    borderColor: 'border-green-500'
  }
}

export const rareRarity: RarityConfig = {
  name: 'Rare',
  priceMultiplier: 2.5,
  style: {
    backgroundColor: 'bg-blue-500',
    badgeBackgroundColor: 'bg-blue-600',
    borderColor: 'border-blue-500'
  }
}

export const epicRarity: RarityConfig = {
  name: 'Épique',
  priceMultiplier: 4,
  style: {
    backgroundColor: 'bg-purple-500 animate-[epic-pulse_2s_ease-in-out_infinite]',
    badgeBackgroundColor: 'bg-purple-600',
    borderColor: 'border-purple-500'
  }
}

export const legendaryRarity: RarityConfig = {
  name: 'Légendaire',
  priceMultiplier: 10,
  style: {
    backgroundColor: 'bg-[length:200%_100%] animate-[legendary-shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400',
    badgeBackgroundColor: 'bg-orange-600',
    borderColor: 'border-orange-500'
  }
}

export const rarityMap: Record<Rarity, RarityConfig> = {
  common: commonRarity,
  uncommon: uncommonRarity,
  rare: rareRarity,
  epic: epicRarity,
  legendary: legendaryRarity
}
