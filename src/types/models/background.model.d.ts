import type { Document, Model, Schema, Types } from 'mongoose'

/**
 * Interface pour un document mongoose représentant un arrière-plan
 * possédé par un utilisateur pour un monstre spécifique
 *
 * Logique métier:
 * - Un background est acheté pour UN monstre spécifique
 * - Si l'utilisateur possède 2 monstres, il doit acheter le background 2 fois
 * - Chaque monster peut équiper uniquement les backgrounds qu'il a débloqués
 */
export interface IBackgroundDocument extends Document<Types.ObjectId> {
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
 * Type du modèle Mongoose pour les arrière-plans
 */
export type IBackgroundModel = Model<IBackgroundDocument>

/**
 * Type du schéma Mongoose pour les arrière-plans
 */
export type IBackgroundSchema = Schema<IBackgroundDocument, IBackgroundModel>
