import { type Document, Schema, models, model, Types, Model } from 'mongoose'
import Quest from './quest.model'
import { questsObjectiveMap } from '@/config/quests.config'

/**
 * Interface pour un arrière-plan possédé par un utilisateur pour un monstre spécifique
 *
 * Logique métier:
 * - Un background est acheté pour UN monstre spécifique
 * - Si l'utilisateur possède 2 monstres, il doit acheter le background 2 fois
 * - Chaque monster peut équiper uniquement les backgrounds qu'il a débloqués
 */
export interface IBackgroundDocument extends Document {
  /** ID unique du document MongoDB */
  _id: Types.ObjectId
  /** ID du background dans le catalogue de configuration (ex: 'bg-sunset') */
  backgroundId: string
  /** ID de l'utilisateur propriétaire */
  ownerId: Types.ObjectId
  /** ID du monstre qui a débloqué ce background */
  monsterId: Types.ObjectId
  /** Date d'acquisition du background */
  acquiredAt: Date
}

/**
 * Schéma Mongoose pour les backgrounds possédés
 */
const backgroundSchema = new Schema<IBackgroundDocument>({
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
backgroundSchema.post('save', async function ({ ownerId: userId }: IBackgroundDocument) {
  try {
    // Mettre à jour toutes les quêtes "unlock_backgrounds"
    for (const questDef of questsObjectiveMap.unlock_backgrounds) {
      const questId = questDef.id

      let quest = await Quest.findOne({ userId, questId }).exec()

      if (quest === null) {
        quest = new Quest({
          userId,
          questId,
          questObjective: 'unlock_backgrounds'
        })
      }

      // Mettre à jour avec le nombre réel de backgrounds débloqués
      quest.progress++

      await quest.save()
    }
  } catch (error) {
    console.error('❌ Error updating unlock backgrounds quests after background save:', error)
  }
})

const BackgroundModel: Model<IBackgroundDocument> = models.Background ?? model('Background', backgroundSchema)

export default BackgroundModel
