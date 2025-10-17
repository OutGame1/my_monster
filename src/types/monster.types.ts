export interface SerializedMonster {
  _id: string
  name: string
  nickname?: string
  type: string
  rarity: string
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
  abilities: Array<{
    name: string
    description: string
    power: number
    energyCost: number
    type: string
  }>
  appearance: {
    primaryColor: string
    secondaryColor: string
    emoji: string
    bodyType: string
  }
  mood: string
  description: string
  evolution?: {
    level: number
    evolvesInto?: string
    requirements?: {
      minHappiness?: number
      minLevel?: number
      itemRequired?: string
    }
  }
  ownerId: string
  birthDate: string
  lastFed?: string
  lastPlayed?: string
  isShiny: boolean
  achievements: string[]
  createdAt?: string
  updatedAt?: string
}

