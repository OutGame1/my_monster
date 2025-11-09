import { type Document, Schema, Types, Model, models, model } from 'mongoose'

export interface IQuestDocument extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  questId: string // ID de la quête depuis la config
  progress: number // Progression actuelle
  completedAt?: Date // Date de complétion
  claimedAt?: Date // Date de réclamation
  lastResetAt?: Date // Pour les quêtes quotidiennes
  createdAt: Date
  updatedAt: Date
}

const questSchema = new Schema<IQuestDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  questId: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: {
    type: Date
  },
  claimedAt: {
    type: Date
  },
  lastResetAt: {
    type: Date
  }
}, {
  versionKey: false,
  timestamps: true
})

// Index composé pour retrouver rapidement les quêtes d'un utilisateur
questSchema.index({ userId: 1, questId: 1 }, { unique: true })

const QuestModel: Model<IQuestDocument> = models.Quest ?? model('Quest', questSchema)

export default QuestModel
