import { Schema, models, model } from 'mongoose'
import Quest from './quest.model'
import type { IWalletModel, IWalletSchema } from '@/types/models/wallet.model'

const walletSchema: IWalletSchema = new Schema({
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
walletSchema.post('save', async function ({ ownerId, totalEarned }) {
  // Mise à jour asynchrone des quêtes de coins
  try {
    await Quest.updateQuests(ownerId, 'reach_coins', totalEarned)
  } catch (err) {
    console.error('❌ Error updating coin quests after wallet save:', err)
  }
})

const WalletModel: IWalletModel = models.Wallet as IWalletModel ?? model('Wallet', walletSchema)

export default WalletModel
