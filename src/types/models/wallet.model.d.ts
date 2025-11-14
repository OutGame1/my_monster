import type { Document, Model, Types, Schema } from 'mongoose'

/**
 * Interface du document Mongoose pour le wallet
 */
export interface IWalletDocument extends Document<Types.ObjectId> {
  ownerId: Types.ObjectId
  balance: number
  totalEarned: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Type du modèle Mongoose pour le wallet
 */
export type IWalletModel = Model<IWalletDocument>

/**
 * Type du schéma Mongoose pour le wallet
 */
export type IWalletSchema = Schema<IWalletDocument, IWalletModel>
