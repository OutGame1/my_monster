import { Schema, models, model } from 'mongoose'
import Quest from './quest.model'
import {
  MONSTER_STATES, BODY_SHAPES, EYE_TYPES,
  MOUTH_TYPES, ARM_TYPES, LEG_TYPES,
  MONSTER_BASE_XP
} from '@/config/monsters.config'
import type { IMonsterModel, IMonsterSchema, IMonsterTraitsSchema } from '@/types/models/monster.model'

const monsterTraitsSchema: IMonsterTraitsSchema = new Schema({
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

const monsterSchema: IMonsterSchema = new Schema({
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

monsterSchema.post('save', async function ({ ownerId }) {
  try {
    // 1. Mettre à jour les quêtes de possession (own_monsters)
    const monsterCount = await MonsterModel.countDocuments({ ownerId }).exec()
    await Quest.updateQuests(ownerId, 'own_monsters', monsterCount)

    // 2. Mettre à jour les quêtes de montée de niveau (level_up_monster)
    // Trouver le niveau maximum parmi tous les monstres de l'utilisateur
    const maxLevelMonster = await MonsterModel
      .findOne({ ownerId })
      .sort({ level: -1 })
      .select('level')
      .lean()
      .exec()

    if (maxLevelMonster !== null) {
      await Quest.updateQuests(ownerId, 'level_up_monster', maxLevelMonster.level)
    }
  } catch (error) {
    console.error('❌ Error in monster post-save hook:', error)
  }
})

const MonsterModel: IMonsterModel = models.Monster as IMonsterModel ?? model('Monster', monsterSchema)

export default MonsterModel
