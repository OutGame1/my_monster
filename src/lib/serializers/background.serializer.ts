import type { IBackgroundDocument } from '@/types/models/background.model'

/**
 * Arrière-plan possédé par un utilisateur pour un monstre spécifique
 * (Représentation sérialisée depuis MongoDB)
 */
export interface ISerializedBackground {
  /** ID du document MongoDB (string après sérialisation) */
  _id: string
  /** ID du background dans le catalogue */
  backgroundId: string
  /** ID du propriétaire */
  ownerId: string
  /** ID du monstre qui a débloqué ce background */
  monsterId: string
  /** Date d'acquisition */
  acquiredAt: string
}

/**
 * Convertit un document Mongoose Background en objet sérialisé pour le client
 *
 * Transformations:
 * - Conversion des ObjectId en strings
 * - Préservation de la date acquiredAt
 *
 * @param doc - Document Mongoose à sérialiser
 * @returns Objet sérialisé safe pour le client
 *
 * @example
 * const backgrounds = await BackgroundModel.find({ ownerId }).lean()
 * return backgrounds.map(backgroundSerializer)
 */
export function backgroundSerializer (doc: IBackgroundDocument): ISerializedBackground {
  return {
    _id: doc._id.toString(),
    backgroundId: doc.backgroundId,
    ownerId: doc.ownerId.toString(),
    monsterId: doc.monsterId.toString(),
    acquiredAt: doc.acquiredAt.toISOString()
  }
}
