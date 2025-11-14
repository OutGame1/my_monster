'use server'

import { getSession } from '@/lib/auth'
import Background from '@/db/models/background.model'
import Monster from '@/db/models/monster.model'
import { updateWalletBalance } from './wallet.actions'
import { backgroundsIdMap, calculateFinalPrice } from '@/config/backgrounds.config'
import { backgroundSerializer, type ISerializedBackground } from '@/lib/serializers/background.serializer'

/**
 * Perme d'acheter un background pour un monstre spécifique
 *
 * @param backgroundId - ID du background dans le catalogue
 * @param monsterId - ID du monstre pour lequel acheter
 * @returns Renvoie l'arrière plan
 */
export async function purchaseBackground (
  backgroundId: string,
  monsterId: string
): Promise<ISerializedBackground> {
  try {
    const session = await getSession()
    if (session === null) {
      throw new Error('Non authentifié')
    }

    // On vérifie que l'arrière plan existe dans le catalogue
    const background = backgroundsIdMap.get(backgroundId)
    if (background === undefined) {
      throw new Error('Cet arrière plan n\'existe pas dans le catalogue.')
    }

    const ownerId = session.user.id

    // On vérifie que le monstre appartient à l'utilisateur
    await Monster.exists({ _id: monsterId, ownerId })
      .orFail(new Error('Ce monstre n\'existe pas ou ne vous appartient pas.'))

    // On vérifie si le monstre possède déjà ce background
    const existingBackground = await Background.exists({
      ownerId,
      monsterId,
      backgroundId
    }).lean()

    if (existingBackground !== null) {
      throw new Error('Ce monstre possède déjà cet arrière plan.')
    }

    const price = calculateFinalPrice(background)

    // Débiter le wallet (lance une exception si solde insuffisant)
    await updateWalletBalance(-price)

    // Créer le background possédé
    const newBackground = new Background({
      backgroundId,
      ownerId,
      monsterId
    })

    await newBackground.save()

    return backgroundSerializer(newBackground)
  } catch (error) {
    console.error('Error purchasing background:', error)
    throw error
  }
}

/**
 * Équiper un background sur un monstre
 *
 * @param monsterId - ID du monstre
 * @param backgroundId - ID du background à équiper
 */
export async function equipBackground (
  monsterId: string,
  backgroundId: string | null
): Promise<void> {
  try {
    const session = await getSession()
    if (session === null) {
      throw new Error('Non authentifié')
    }

    const ownerId = session.user.id

    // On vérifie que le monstre appartient à l'utilisateur
    const monster = await Monster.findOne({ _id: monsterId, ownerId })
      .orFail(new Error('Ce monstre n\'existe pas ou ne vous appartient pas.'))

    if (backgroundId !== null) {
      // On vérifie si le monstre possède déjà ce background
      await Background.exists({ ownerId, monsterId, backgroundId })
        .orFail(new Error('Cet arrière plan n\'existe pas ou ce monstre ne possède pas cet arrière plan.'))
    }

    // On équipe le nouvel arrière plan
    monster.backgroundId = backgroundId

    await monster.save()
  } catch (error) {
    console.error('Error equipping background:', error)
    throw error
  }
}

/**
 * Récupérer tous les backgrounds possédés par un monstre
 *
 * @param monsterId - ID du monstre
 * @returns La liste des arrières plan du monstre
 */
export async function getMonsterBackgrounds (
  monsterId: string
): Promise<ISerializedBackground[]> {
  try {
    const session = await getSession()
    if (session === null) {
      throw new Error('Non authentifié')
    }

    const ownerId = session.user.id

    // On vérifie que le monstre appartient à l'utilisateur
    await Monster.exists({ _id: monsterId, ownerId })
      .orFail(new Error('Ce monstre n\'existe pas ou ne vous appartient pas.'))

    // Récupérer tous les backgrounds possédés par ce monstre
    const backgrounds = await Background.find({
      ownerId,
      monsterId
    })

    return backgrounds.map(backgroundSerializer)
  } catch (error) {
    console.error('Error getting monster backgrounds:', error)
    throw error
  }
}

/**
 * Récupérer tous les backgrounds possédés par l'utilisateur (tous monstres confondus)
 *
 * @returns {Promise<ISerializedBackground[]>}
 */
export async function getUserBackgrounds (): Promise<ISerializedBackground[]> {
  try {
    const session = await getSession()
    if (session === null) {
      throw new Error('Non authentifié')
    }

    const ownerId = session.user.id

    const backgrounds = await Background.find({ ownerId })

    return backgrounds.map(backgroundSerializer)
  } catch (error) {
    console.error('Error getting user backgrounds:', error)
    throw error
  }
}
