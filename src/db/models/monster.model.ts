import { Schema, model, models, Document, Model, Types } from 'mongoose'

// ========================================
// TYPES ET ENUMS
// ========================================

export enum MonsterType {
  FIRE = 'Feu',
  WATER = 'Aquatique',
  NATURE = 'Nature',
  ELECTRIC = 'Électrique',
  DARK = 'Ténèbres',
  LIGHT = 'Lumière',
  NORMAL = 'Normal'
}

export enum MonsterRarity {
  COMMON = 'Commun',
  UNCOMMON = 'Peu commun',
  RARE = 'Rare',
  EPIC = 'Épique',
  LEGENDARY = 'Légendaire'
}

export enum MonsterMood {
  HAPPY = 'Joyeux',
  HUNGRY = 'Affamé',
  TIRED = 'Fatigué',
  ENERGETIC = 'Énergique',
  SAD = 'Triste',
  EXCITED = 'Excité'
}

// ========================================
// INTERFACES
// ========================================

export interface MonsterStats {
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

export interface MonsterAbility {
  name: string
  description: string
  power: number
  energyCost: number
  type: MonsterType
}

export interface MonsterEvolution {
  level: number
  evolvesInto?: string
  requirements?: {
    minHappiness?: number
    minLevel?: number
    itemRequired?: string
  }
}

export interface MonsterAppearance {
  primaryColor: string
  secondaryColor: string
  emoji: string
  bodyType: 'small' | 'medium' | 'large' | 'giant'
}

// Interface principale du modèle Monster
export interface MonsterModel {
  name: string
  nickname?: string
  type: MonsterType
  rarity: MonsterRarity
  level: number
  experience: number
  experienceToNextLevel: number
  stats: MonsterStats
  abilities: MonsterAbility[]
  appearance: MonsterAppearance
  mood: MonsterMood
  description: string
  evolution?: MonsterEvolution
  ownerId: Types.ObjectId
  birthDate: Date
  lastFed?: Date
  lastPlayed?: Date
  isShiny: boolean
  achievements: string[]
  createdAt?: Date
  updatedAt?: Date
}

// Interface pour les méthodes d'instance
export interface MonsterMethods {
  feed: (amount?: number) => void
  play: () => void
  rest: (hours?: number) => void
  gainExperience: (amount: number) => boolean
  levelUp: () => boolean
  heal: (amount: number) => void
  canEvolve: () => boolean
}

// Interface pour les documents Mongoose
export type MonsterDocument = Document & MonsterModel & MonsterMethods

// Interface pour les méthodes statiques
export interface MonsterModelType extends Model<MonsterDocument> {
  findByOwner: (ownerId: string) => Promise<MonsterDocument[]>
  findByType: (type: MonsterType) => Promise<MonsterDocument[]>
  findShinyMonsters: () => Promise<MonsterDocument[]>
  findHighLevel: (minLevel?: number) => Promise<MonsterDocument[]>
}

// ========================================
// SCHÉMAS MONGOOSE
// ========================================

const MonsterStatsSchema = new Schema<MonsterStats>(
  {
    health: {
      type: Number,
      required: true,
      min: 0,
      default: 100
    },
    maxHealth: {
      type: Number,
      required: true,
      min: 1,
      default: 100
    },
    attack: {
      type: Number,
      required: true,
      min: 1,
      default: 10
    },
    defense: {
      type: Number,
      required: true,
      min: 1,
      default: 10
    },
    speed: {
      type: Number,
      required: true,
      min: 1,
      default: 10
    },
    energy: {
      type: Number,
      required: true,
      min: 0,
      default: 100
    },
    maxEnergy: {
      type: Number,
      required: true,
      min: 1,
      default: 100
    },
    happiness: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 50
    },
    hunger: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 50
    }
  },
  { _id: false }
)

const MonsterAbilitySchema = new Schema<MonsterAbility>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    description: {
      type: String,
      required: true,
      maxlength: 200
    },
    power: {
      type: Number,
      required: true,
      min: 1,
      max: 200
    },
    energyCost: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    type: {
      type: String,
      enum: Object.values(MonsterType),
      required: true
    }
  },
  { _id: false }
)

const MonsterEvolutionSchema = new Schema<MonsterEvolution>(
  {
    level: {
      type: Number,
      required: true,
      min: 1
    },
    evolvesInto: {
      type: String,
      trim: true
    },
    requirements: {
      minHappiness: {
        type: Number,
        min: 0,
        max: 100
      },
      minLevel: {
        type: Number,
        min: 1
      },
      itemRequired: {
        type: String,
        trim: true
      }
    }
  },
  { _id: false }
)

const MonsterAppearanceSchema = new Schema<MonsterAppearance>(
  {
    primaryColor: {
      type: String,
      required: true,
      trim: true,
      default: '#9333EA'
    },
    secondaryColor: {
      type: String,
      required: true,
      trim: true,
      default: '#C084FC'
    },
    emoji: {
      type: String,
      required: true,
      default: '👾'
    },
    bodyType: {
      type: String,
      enum: ['small', 'medium', 'large', 'giant'],
      required: true,
      default: 'medium'
    }
  },
  { _id: false }
)

const monsterSchema = new Schema<MonsterDocument, MonsterModelType>(
  {
    name: {
      type: String,
      required: [true, 'Le nom du monstre est requis'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: [30, 'Le surnom ne peut pas dépasser 30 caractères']
    },
    type: {
      type: String,
      enum: Object.values(MonsterType),
      required: [true, 'Le type du monstre est requis'],
      default: MonsterType.NORMAL
    },
    rarity: {
      type: String,
      enum: Object.values(MonsterRarity),
      required: true,
      default: MonsterRarity.COMMON
    },
    level: {
      type: Number,
      required: true,
      min: [1, 'Le niveau minimum est 1'],
      max: [100, 'Le niveau maximum est 100'],
      default: 1
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    experienceToNextLevel: {
      type: Number,
      required: true,
      min: 1,
      default: 100
    },
    stats: {
      type: MonsterStatsSchema,
      required: true,
      default: () => ({})
    },
    abilities: {
      type: [MonsterAbilitySchema],
      default: []
    },
    appearance: {
      type: MonsterAppearanceSchema,
      required: true,
      default: () => ({})
    },
    mood: {
      type: String,
      enum: Object.values(MonsterMood),
      required: true,
      default: MonsterMood.HAPPY
    },
    description: {
      type: String,
      required: [true, 'La description du monstre est requise'],
      trim: true,
      minlength: [10, 'La description doit contenir au moins 10 caractères'],
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    evolution: {
      type: MonsterEvolutionSchema,
      required: false
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, "L'identifiant du propriétaire est requis"],
      index: true
    },
    birthDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    lastFed: {
      type: Date
    },
    lastPlayed: {
      type: Date
    },
    isShiny: {
      type: Boolean,
      required: true,
      default: false
    },
    achievements: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id?.toString()
        return ret
      }
    },
    toObject: {
      virtuals: true
    }
  }
)

// ========================================
// INDEXES
// ========================================

monsterSchema.index({ ownerId: 1, createdAt: -1 })
monsterSchema.index({ type: 1, rarity: 1 })
monsterSchema.index({ level: -1 })
monsterSchema.index({ isShiny: 1 })

// ========================================
// VIRTUALS
// ========================================

monsterSchema.virtual('age').get(function (this: MonsterDocument) {
  const now = new Date()
  const birth = new Date(this.birthDate)
  const diffInMs = now.getTime() - birth.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
})

monsterSchema.virtual('experienceProgress').get(function (this: MonsterDocument) {
  return Math.floor((this.experience / this.experienceToNextLevel) * 100)
})

monsterSchema.virtual('healthPercentage').get(function (this: MonsterDocument) {
  return Math.floor((this.stats.health / this.stats.maxHealth) * 100)
})

monsterSchema.virtual('needsCare').get(function (this: MonsterDocument) {
  return (
    this.stats.hunger > 80 ||
    this.stats.happiness < 30 ||
    this.stats.energy < 20 ||
    this.stats.health < this.stats.maxHealth * 0.5
  )
})

// ========================================
// MÉTHODES D'INSTANCE
// ========================================

monsterSchema.methods.feed = function (this: MonsterDocument, amount = 20): void {
  this.stats.hunger = Math.max(0, this.stats.hunger - amount)
  this.stats.happiness = Math.min(100, this.stats.happiness + 5)
  this.lastFed = new Date()

  if (this.stats.hunger < 20 && this.mood === MonsterMood.HUNGRY) {
    this.mood = MonsterMood.HAPPY
  }
}

monsterSchema.methods.play = function (this: MonsterDocument): void {
  this.stats.happiness = Math.min(100, this.stats.happiness + 15)
  this.stats.energy = Math.max(0, this.stats.energy - 20)
  this.stats.hunger = Math.min(100, this.stats.hunger + 10)
  this.lastPlayed = new Date()

  if (this.stats.energy < 30) {
    this.mood = MonsterMood.TIRED
  } else if (this.stats.happiness > 80) {
    this.mood = MonsterMood.EXCITED
  }
}

monsterSchema.methods.rest = function (this: MonsterDocument, hours = 8): void {
  const energyRecovered = hours * 10
  this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + energyRecovered)

  if (this.stats.energy > 70) {
    this.mood = MonsterMood.ENERGETIC
  }
}

monsterSchema.methods.gainExperience = function (this: MonsterDocument, amount: number): boolean {
  this.experience += amount

  if (this.experience >= this.experienceToNextLevel) {
    return this.levelUp()
  }

  return false
}

monsterSchema.methods.levelUp = function (this: MonsterDocument): boolean {
  if (this.level >= 100) {
    return false
  }

  this.level += 1
  this.experience = this.experience - this.experienceToNextLevel
  this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5)

  // Augmentation des stats
  this.stats.maxHealth += 10
  this.stats.health = this.stats.maxHealth
  this.stats.attack += Math.floor(Math.random() * 3) + 2
  this.stats.defense += Math.floor(Math.random() * 3) + 2
  this.stats.speed += Math.floor(Math.random() * 2) + 1
  this.stats.maxEnergy += 5
  this.stats.energy = this.stats.maxEnergy

  this.mood = MonsterMood.EXCITED

  return true
}

monsterSchema.methods.heal = function (this: MonsterDocument, amount: number): void {
  this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount)
}

monsterSchema.methods.canEvolve = function (this: MonsterDocument): boolean {
  // Pas d'évolution définie
  if (!this.evolution) {
    return false
  }

  // Niveau insuffisant pour évoluer
  if (this.level < this.evolution.level) {
    return false
  }

  // Pas de requirements : peut évoluer
  const requirements = this.evolution.requirements
  if (!requirements) {
    return true
  }

  // Vérification minHappiness si défini (et non zéro)
  if (typeof requirements.minHappiness === 'number' &&
      !isNaN(requirements.minHappiness) &&
      this.stats.happiness < requirements.minHappiness) {
    return false
  }

  // Vérification minLevel si défini (et non zéro)
  if (typeof requirements.minLevel === 'number' &&
    !isNaN(requirements.minLevel) &&
    this.level < requirements.minLevel) {
    return false
  }

  // Toutes les conditions sont remplies
  return true
}

// ========================================
// MÉTHODES STATIQUES
// ========================================

monsterSchema.statics.findByOwner = function (ownerId: string) {
  return this.find({ ownerId } as any).sort({ createdAt: -1 })
}

monsterSchema.statics.findByType = function (type: MonsterType) {
  return this.find({ type })
}

monsterSchema.statics.findShinyMonsters = function () {
  return this.find({ isShiny: true })
}

monsterSchema.statics.findHighLevel = function (minLevel = 50) {
  return this.find({ level: { $gte: minLevel } }).sort({ level: -1 })
}

// ========================================
// MIDDLEWARE
// ========================================

// Avant sauvegarde : vérifier la cohérence des stats
monsterSchema.pre('save', function (this: MonsterDocument, next) {
  // S'assurer que health ne dépasse pas maxHealth
  if (this.stats.health > this.stats.maxHealth) {
    this.stats.health = this.stats.maxHealth
  }

  // S'assurer que energy ne dépasse pas maxEnergy
  if (this.stats.energy > this.stats.maxEnergy) {
    this.stats.energy = this.stats.maxEnergy
  }

  // Ajuster mood en fonction des stats
  if (this.stats.hunger > 80) {
    this.mood = MonsterMood.HUNGRY
  } else if (this.stats.energy < 20) {
    this.mood = MonsterMood.TIRED
  } else if (this.stats.happiness < 30) {
    this.mood = MonsterMood.SAD
  } else if (this.stats.happiness > 80 && this.stats.energy > 70) {
    this.mood = MonsterMood.EXCITED
  }

  next()
})

// ========================================
// EXPORT DU MODÈLE
// ========================================

const Monster = (models.Monster as MonsterModelType) || model<MonsterDocument, MonsterModelType>('Monster', monsterSchema)

export default Monster
