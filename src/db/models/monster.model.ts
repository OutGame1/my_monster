import { type Document, Schema, models, model, Types, Model } from 'mongoose'
import {
  MONSTER_STATES,
  BODY_SHAPES,
  EYE_TYPES,
  MOUTH_TYPES,
  ARM_TYPES,
  LEG_TYPES,
  MONSTER_BASE_XP
} from '@/config/monsters.config'
import type {
  MonsterArmType, MonsterBodyShape, MonsterEyeShape,
  MonsterLegType, MonsterMouthType, MonsterState
} from '@/types/monsters'

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
  backgroundId: string | null // ID du background équipé (référence au catalogue)
  isPublic: boolean
  ownerId: Types.ObjectId
  lastCaredAt?: Date // Dernière fois qu'on s'est occupé du monstre (pour quête daily)
  createdAt: Date
  updatedAt: Date
}

export interface IPublicMonsterDocument extends Document {
  _id: Types.ObjectId
  name: string
  level: number
  traits: IMonsterTraitsDocument
  state: MonsterState
  backgroundId: string | null
  createdAt: Date
  ownerName: string // Nom de l'utilisateur propriétaire (jointure sur 'user')
}

const monsterTraitsSchema = new Schema<IMonsterTraitsDocument>({
  bodyShape: {
    type: String,
    required: true,
    enum: BODY_SHAPES
  },
  eyeType: {
    type: String,
    required: true,
    enum: EYE_TYPES
  },
  mouthType: {
    type: String,
    required: true,
    enum: MOUTH_TYPES
  },
  armType: {
    type: String,
    required: true,
    enum: ARM_TYPES
  },
  legType: {
    type: String,
    required: true,
    enum: LEG_TYPES
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
    enum: MONSTER_STATES,
    default: 'happy'
  },
  backgroundId: {
    type: String,
    required: false,
    default: null,
    index: true
  },
  isPublic: {
    type: Boolean,
    required: false,
    default: false
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  lastCaredAt: {
    type: Date,
    required: false
  }
}, {
  versionKey: false,
  timestamps: true
})

const MonsterModel: Model<IMonsterDocument> = models.Monster ?? model('Monster', monsterSchema)

export default MonsterModel
