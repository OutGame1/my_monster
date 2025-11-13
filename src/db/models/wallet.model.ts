import { type Document, Schema, Types, Model, models, model } from 'mongoose'
import Quest from './quest.model'
import { questsObjectiveMap } from '@/config/quests.config'

export interface IWalletDocument extends Document {
  _id: Types.ObjectId
  ownerId: Types.ObjectId
  balance: number
  totalEarned: number
  createdAt: Date
  updatedAt: Date
}

const walletSchema = new Schema<IWalletDocument>({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true // L'index est déjà construit ici
  },
  balance: {
    type: Number,
    default: 25,
    min: 0
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  versionKey: false,
  timestamps: true
})

/**
 * Hook post-save : Met à jour automatiquement les quêtes de coins
 * après chaque modification du wallet
 */
walletSchema.post('save', async function ({ ownerId: userId, totalEarned }: IWalletDocument) {
  // Mise à jour asynchrone des quêtes de coins
  try {
    // Itérer sur toutes les quêtes et filtrer par objectif "reach_coins"
    for (const coinsAchievement of questsObjectiveMap.reach_coins) {
      const questId = coinsAchievement.id

      let quest = await Quest.findOne({ userId, questId }).exec()

      if (quest === null) {
        quest = new Quest({
          userId,
          questId,
          questObjective: 'reach_coins'
        })
      }

      // Mettre à jour avec le total de pièces gagnées
      quest.progress = totalEarned

      await quest.save()
    }
  } catch (err) {
    console.error('❌ Error updating coin quests after wallet save:', err)
  }
})

const WalletModel: Model<IWalletDocument> = models.Wallet ?? model('Wallet', walletSchema)

export default WalletModel
