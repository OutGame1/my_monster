import { Schema, models, model, Types, Model } from 'mongoose'

export type MonsterState = 'happy' | 'sad' | 'gamester' | 'angry' | 'hungry' | 'sleepy'
export type MonsterBodyShape = 'round' | 'pear' | 'tall'
export type MonsterEyeShape = 'dot' | 'round' | 'star'
export type MonsterMouthType = 'smile' | 'neutral' | 'open'
export type MonsterArmType = 'short' | 'long' | 'tiny'
export type MonsterLegType = 'stumpy' | 'long' | 'feet'

export interface MonsterTraits {
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

export interface IDocumentMonster {
  _id: Types.ObjectId
  name: string
  level: number
  traits: MonsterTraits
  state: MonsterState
  ownerId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IMonster {
  _id: string
  name: string
  level: number
  traits: MonsterTraits
  state: MonsterState
  ownerId: string
  createdAt: string
  updatedAt: string
}

const monsterSchema = new Schema<IDocumentMonster>({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: false,
    default: 1
  },
  traits: {
    type: {
      bodyShape: {
        type: String,
        required: true,
        enum: ['round', 'pear', 'tall']
      },
      eyeType: {
        type: String,
        required: true,
        enum: ['dot', 'round', 'star']
      },
      mouthType: {
        type: String,
        required: true,
        enum: ['smile', 'neutral', 'open']
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
    },
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

const MonsterModel: Model<IDocumentMonster> = models.Monster ?? model('Monster', monsterSchema)

export default MonsterModel
