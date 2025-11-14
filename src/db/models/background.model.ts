import { Schema, models, model } from 'mongoose'
import Quest from './quest.model'
import type { IBackgroundModel, IBackgroundSchema } from '@/types/models/background.model'

/**
 * Schéma Mongoose pour les backgrounds possédés
 */
const backgroundSchema: IBackgroundSchema = new Schema({
  backgroundId: {
    type: String,
    required: true,
    index: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  monsterId: {
    type: Schema.Types.ObjectId,
    ref: 'Monster',
    required: true,
    index: true
  }
}, {
  versionKey: false,
  timestamps: {
    // On renomme 'createdAt' en 'acquiredAt'
    // pour mieux réfléter le principe "d'acquisition" d'un background
    createdAt: 'acquiredAt'
  }
})

/**
 * Index composé pour garantir l'unicité :
 * Un monstre ne peut posséder qu'une seule fois le même background
 */
backgroundSchema.index(
  { ownerId: 1, monsterId: 1, backgroundId: 1 },
  { unique: true }
)

/**
 * Hook post-save: vérifie automatiquement la progression des quêtes
 * d'arrière-plans après chaque création/mise à jour.
 */
backgroundSchema.post('save', async function () {
  try {
    await Quest.updateQuests(this.ownerId, 'unlock_backgrounds', (progress) => progress + 1)
  } catch (error) {
    console.error('❌ Error updating unlock backgrounds quests after background save:', error)
  }
})

const BackgroundModel: IBackgroundModel = models.Background as IBackgroundModel ?? model('Background', backgroundSchema)

export default BackgroundModel
