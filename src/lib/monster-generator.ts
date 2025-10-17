import { MonsterType, MonsterRarity, MonsterAbility, MonsterAppearance, MonsterEvolution } from '@/db/models/monster.model'

// ========================================
// CONSTANTES DE GÉNÉRATION
// ========================================

const TYPE_EMOJIS: Record<MonsterType, string> = {
  [MonsterType.FIRE]: '🔥',
  [MonsterType.WATER]: '💧',
  [MonsterType.NATURE]: '🌿',
  [MonsterType.ELECTRIC]: '⚡',
  [MonsterType.DARK]: '🌑',
  [MonsterType.LIGHT]: '✨',
  [MonsterType.NORMAL]: '⭐'
}

const TYPE_COLORS: Record<MonsterType, { primary: string, secondary: string }> = {
  [MonsterType.FIRE]: { primary: '#FF6B35', secondary: '#FF9F66' },
  [MonsterType.WATER]: { primary: '#4ECDC4', secondary: '#95E1D3' },
  [MonsterType.NATURE]: { primary: '#6BCF7F', secondary: '#A8E6B8' },
  [MonsterType.ELECTRIC]: { primary: '#FFD93D', secondary: '#FFE66D' },
  [MonsterType.DARK]: { primary: '#6C5B7B', secondary: '#A99FB0' },
  [MonsterType.LIGHT]: { primary: '#F8B500', secondary: '#FFD34E' },
  [MonsterType.NORMAL]: { primary: '#9333EA', secondary: '#C084FC' }
}

const ABILITY_TEMPLATES: Record<MonsterType, Array<{ name: string, description: string }>> = {
  [MonsterType.FIRE]: [
    { name: 'Boule de feu', description: 'Lance une boule de feu sur l\'ennemi' },
    { name: 'Rage incandescente', description: 'Augmente l\'attaque grâce à la chaleur' },
    { name: 'Souffle brûlant', description: 'Exhale des flammes dévastatrices' }
  ],
  [MonsterType.WATER]: [
    { name: 'Jet d\'eau', description: 'Projette un puissant jet d\'eau' },
    { name: 'Vague déferlante', description: 'Invoque une vague pour submerger l\'ennemi' },
    { name: 'Brume aquatique', description: 'Crée un brouillard protecteur' }
  ],
  [MonsterType.NATURE]: [
    { name: 'Fouet lianes', description: 'Attaque avec des lianes acérées' },
    { name: 'Photosynthèse', description: 'Récupère de l\'énergie grâce au soleil' },
    { name: 'Pluie de feuilles', description: 'Projette des feuilles tranchantes' }
  ],
  [MonsterType.ELECTRIC]: [
    { name: 'Éclair', description: 'Déclenche une décharge électrique' },
    { name: 'Cage tonnerre', description: 'Piège l\'ennemi dans l\'électricité' },
    { name: 'Onde de choc', description: 'Envoie une impulsion électrique' }
  ],
  [MonsterType.DARK]: [
    { name: 'Ombre mouvante', description: 'Se fond dans les ténèbres pour attaquer' },
    { name: 'Cauchemar', description: 'Plonge l\'ennemi dans un mauvais rêve' },
    { name: 'Griffes obscures', description: 'Lacère avec des griffes d\'ombre' }
  ],
  [MonsterType.LIGHT]: [
    { name: 'Rayon lumineux', description: 'Projette un rayon de lumière pure' },
    { name: 'Bouclier sacré', description: 'Crée une barrière de lumière' },
    { name: 'Aube radieuse', description: 'Illumine le champ de bataille' }
  ],
  [MonsterType.NORMAL]: [
    { name: 'Charge', description: 'Fonce sur l\'ennemi avec force' },
    { name: 'Cri perçant', description: 'Pousse un cri pour déstabiliser' },
    { name: 'Combo rapide', description: 'Enchaîne plusieurs coups rapides' }
  ]
}

const BODY_TYPES: Array<'small' | 'medium' | 'large' | 'giant'> = ['small', 'medium', 'large', 'giant']

const DESCRIPTIONS_BY_TYPE: Record<MonsterType, string[]> = {
  [MonsterType.FIRE]: [
    'Un monstre ardent dont le corps dégage une chaleur intense',
    'Créature passionnée qui brûle d\'une énergie indomptable',
    'Être de flammes au tempérament fougueux et chaleureux'
  ],
  [MonsterType.WATER]: [
    'Un compagnon aquatique gracieux et fluide comme l\'eau',
    'Créature marine paisible qui apaise par sa présence',
    'Monstre des profondeurs au cœur pur et limpide'
  ],
  [MonsterType.NATURE]: [
    'Un gardien de la forêt empli de vie et de verdure',
    'Créature végétale douce qui prospère au contact de la nature',
    'Monstre sylvestre en harmonie avec les plantes'
  ],
  [MonsterType.ELECTRIC]: [
    'Une boule d\'énergie électrique vive et pétillante',
    'Créature foudroyante au caractère électrisant',
    'Monstre fulgurant qui crépite d\'électricité statique'
  ],
  [MonsterType.DARK]: [
    'Un être mystérieux enveloppé d\'ombres énigmatiques',
    'Créature nocturne silencieuse et contemplative',
    'Monstre des ténèbres au regard profond et mystique'
  ],
  [MonsterType.LIGHT]: [
    'Un ange lumineux qui rayonne de bienveillance',
    'Créature céleste éclatante au cœur pur',
    'Monstre radieux qui illumine tout sur son passage'
  ],
  [MonsterType.NORMAL]: [
    'Un compagnon ordinaire mais attachant et plein de surprises',
    'Créature équilibrée au potentiel encore inexploré',
    'Monstre polyvalent qui s\'adapte à toutes les situations'
  ]
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

function randomInt (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomElement<T> (array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomBoolean (probability = 0.5): boolean {
  return Math.random() < probability
}

// ========================================
// GÉNÉRATEURS SPÉCIFIQUES
// ========================================

export function generateRandomType (): MonsterType {
  const types = Object.values(MonsterType)
  return randomElement(types)
}

export function generateRandomRarity (): MonsterRarity {
  const random = Math.random()

  // Distribution pondérée
  if (random < 0.50) return MonsterRarity.COMMON // 50%
  if (random < 0.75) return MonsterRarity.UNCOMMON // 25%
  if (random < 0.90) return MonsterRarity.RARE // 15%
  if (random < 0.97) return MonsterRarity.EPIC // 7%
  return MonsterRarity.LEGENDARY // 3%
}

export function generateRandomStats (rarity: MonsterRarity): {
  health: number
  maxHealth: number
  attack: number
  defense: number
  speed: number
  energy: number
  maxEnergy: number
  happiness: number
  hunger: number
} {
  // Bonus selon la rareté
  const rarityBonus: Record<MonsterRarity, number> = {
    [MonsterRarity.COMMON]: 0,
    [MonsterRarity.UNCOMMON]: 5,
    [MonsterRarity.RARE]: 10,
    [MonsterRarity.EPIC]: 20,
    [MonsterRarity.LEGENDARY]: 35
  }

  const bonus = rarityBonus[rarity]
  const baseHealth = 100 + bonus * 2
  const baseEnergy = 100 + bonus

  return {
    health: baseHealth,
    maxHealth: baseHealth,
    attack: randomInt(8, 15) + bonus,
    defense: randomInt(8, 15) + bonus,
    speed: randomInt(8, 15) + bonus,
    energy: baseEnergy,
    maxEnergy: baseEnergy,
    happiness: randomInt(40, 70),
    hunger: randomInt(20, 40)
  }
}

export function generateRandomAbilities (type: MonsterType, rarity: MonsterRarity): MonsterAbility[] {
  const templates = ABILITY_TEMPLATES[type]
  const numAbilities = rarity === MonsterRarity.LEGENDARY ? 2 : 1

  const abilities: MonsterAbility[] = []
  const usedIndices = new Set<number>()

  for (let i = 0; i < numAbilities; i++) {
    let index: number
    do {
      index = Math.floor(Math.random() * templates.length)
    } while (usedIndices.has(index))

    usedIndices.add(index)
    const template = templates[index]

    abilities.push({
      name: template.name,
      description: template.description,
      power: randomInt(20, 40) + (rarity === MonsterRarity.LEGENDARY ? 20 : 0),
      energyCost: randomInt(15, 30),
      type
    })
  }

  return abilities
}

export function generateRandomAppearance (type: MonsterType): MonsterAppearance {
  const colors = TYPE_COLORS[type]

  return {
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    emoji: TYPE_EMOJIS[type],
    bodyType: randomElement(BODY_TYPES)
  }
}

export function generateRandomEvolution (type: MonsterType, rarity: MonsterRarity): MonsterEvolution | undefined {
  // Seulement 60% des monstres peuvent évoluer
  if (!randomBoolean(0.6)) {
    return undefined
  }

  const evolutionLevel = rarity === MonsterRarity.LEGENDARY
    ? randomInt(40, 50)
    : randomInt(20, 35)

  return {
    level: evolutionLevel,
    evolvesInto: `${type} Évolué`,
    requirements: {
      minHappiness: randomInt(60, 80),
      minLevel: evolutionLevel
    }
  }
}

export function isShiny (): boolean {
  // 5% de chance d'être shiny
  return randomBoolean(0.05)
}

export function generateRandomDescription (type: MonsterType): string {
  const descriptions = DESCRIPTIONS_BY_TYPE[type]
  return randomElement(descriptions)
}

// ========================================
// GÉNÉRATEUR PRINCIPAL
// ========================================

export interface GenerateMonsterInput {
  name: string
  ownerId: string
}

export interface GeneratedMonsterData {
  name: string
  type: MonsterType
  rarity: MonsterRarity
  level: number
  experience: number
  experienceToNextLevel: number
  stats: {
    health: number
    maxHealth: number
    attack: number
    defense: number
    speed: number
    energy: number
    maxEnergy: number
    happiness: number
    hunger: number
  }
  abilities: MonsterAbility[]
  appearance: MonsterAppearance
  mood: string
  description: string
  evolution?: MonsterEvolution
  ownerId: string
  birthDate: Date
  isShiny: boolean
  achievements: string[]
}

export function generateRandomMonster (input: GenerateMonsterInput): GeneratedMonsterData {
  const type = generateRandomType()
  const rarity = generateRandomRarity()
  const shiny = isShiny()

  return {
    name: input.name,
    type,
    rarity,
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    stats: generateRandomStats(rarity),
    abilities: generateRandomAbilities(type, rarity),
    appearance: generateRandomAppearance(type),
    mood: 'Joyeux',
    description: generateRandomDescription(type),
    evolution: generateRandomEvolution(type, rarity),
    ownerId: input.ownerId,
    birthDate: new Date(),
    isShiny: shiny,
    achievements: []
  }
}
