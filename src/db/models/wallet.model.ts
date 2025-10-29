import { type Document, Schema, Types, Model, models, model } from 'mongoose'

export interface IWalletDocument extends Document {
  _id: Types.ObjectId
  ownerId: Types.ObjectId
  balance: number
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
    default: 100,
    min: 0
  }
}, {
  versionKey: false,
  timestamps: true
})

const WalletModel: Model<IWalletDocument> = models.Wallet ?? model('Wallet', walletSchema)

export default WalletModel
