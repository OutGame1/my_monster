import { type Document, Schema, models, model, Types, Model } from 'mongoose'
import { MONSTER_BASE_XP } from '@/config/monsters.config'

export type MonsterState = 'happy' | 'sad' | 'gamester' | 'angry' | 'hungry' | 'sleepy'
export type MonsterBodyShape = 'round' | 'pear' | 'blocky'
export type MonsterEyeShape = 'dot' | 'round' | 'star'
export type MonsterMouthType = 'simple' | 'toothy' | 'wavy'
export type MonsterArmType = 'short' | 'long' | 'tiny'
export type MonsterLegType = 'stumpy' | 'long' | 'feet'

export interface IMonsterTraitsDocument extends Document {
  bodyShape: MonsterBodyShape
  eyeType: MonsterEyeShape
  mouthType: MonsterMouthType
  armType: MonsterArmType
  legType: MonsterLegType
  primaryColor: string // Hex color for body
  secondaryColor: string // Hex color for accents/details
  outlineColor: string // Hex color for outlines (usually dark)
  size: number // 80-120 scale percentage
}

export interface IMonsterDocument extends Document {
  _id: Types.ObjectId
  name: string
  level: number
  xp: number
  maxXp: number
  traits: IMonsterTraitsDocument
  state: MonsterState
  ownerId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const monsterTraitsSchema = new Schema<IMonsterTraitsDocument>({
  bodyShape: {
    type: String,
    required: true,
    enum: ['round', 'pear', 'blocky']
  },
  eyeType: {
    type: String,
    required: true,
    enum: ['dot', 'round', 'star']
  },
  mouthType: {
    type: String,
    required: true,
    enum: ['simple', 'toothy', 'wavy']
  },
  armType: {
    type: String,
    required: true,
    enum: ['short', 'long', 'tiny']
  },
  legType: {
    type: String,
    required: true,
    enum: ['stumpy', 'long', 'feet']
  },
  primaryColor: {
    type: String,
    required: true
  },
  secondaryColor: {
    type: String,
    required: true
  },
  outlineColor: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 80,
    max: 120
  }
}, { _id: false })

const monsterSchema = new Schema<IMonsterDocument>({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: false,
    default: 1
  },
  xp: {
    type: Number,
    required: false,
    default: 0
  },
  maxXp: {
    type: Number,
    required: false,
    default: MONSTER_BASE_XP
  },
  traits: {
    type: monsterTraitsSchema,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'gamester', 'angry', 'hungry', 'sleepy'],
    default: 'happy'
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
})

const MonsterModel: Model<IMonsterDocument> = models.Monster ?? model('Monster', monsterSchema)

export default MonsterModel
