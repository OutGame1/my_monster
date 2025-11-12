import { type Document, Schema, models, model, Types, Model } from 'mongoose'

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

const BackgroundModel: Model<IBackgroundDocument> = models.Background ?? model('Background', backgroundSchema)

export default BackgroundModel
