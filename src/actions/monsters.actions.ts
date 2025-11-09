'use server'

import Monster, { IPublicMonsterDocument, type MonsterState } from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Types } from 'mongoose'
import {
  monsterSerializer, publicMonsterSerializer,
  type ISerializedMonster, type ISerializedPublicMonster
} from '@/lib/serializers/monster.serializer'
import { updateWalletBalance } from './wallet.actions'
import { generateMonsterTraits } from '@/monster/generator'
import { calculateMaxXp, calculateMonsterCreationCost } from '@/config/monsters.config'
import { BASE_COIN_REWARD, MATCHED_STATE_COIN_REWARD, XP_REWARD } from '@/config/rewards.config'
import { checkOwnershipQuests, incrementQuestProgress, checkCoinsQuests } from './quests.actions'

/**
 * Crée un nouveau monstre pour l'utilisateur actuellement authentifié.
 * Orchestration : vérifie l'authentification, calcule le coût, met à jour le portefeuille,
 * crée le document dans MongoDB puis revalide le cache du tableau de bord.
 *
 * @param {string} monsterName Nom choisi pour le monstre à générer.
 * @returns {Promise<number>} Coût effectivement débité lors de la création.
 * @throws {Error} Si l'utilisateur est inconnu ou si le solde est insuffisant.
 */
export async function createMonster (monsterName: string): Promise<number> {
  const session = await getSession()

  if (session === null) {
    throw new Error('User not authenticated')
  }

  // Comptage des monstres existants pour déterminer le coût
  const currentMonsterCount = await Monster.countDocuments({ ownerId: session.user.id }).exec()
  const creationCost = calculateMonsterCreationCost(currentMonsterCount)

  // Débit des pièces si ce n'est pas le premier monstre (validation côté serveur)
  if (creationCost > 0) {
    await updateWalletBalance(-creationCost) // Déclenche une erreur si le solde est insuffisant
  }

  // Création et sauvegarde du monstre
  const monster = new Monster({
    ownerId: session.user.id,
    name: monsterName,
    traits: generateMonsterTraits(monsterName)
  })

  await monster.save()

  // Vérifier les quêtes de possession
  await checkOwnershipQuests()

  // Revalidation du cache pour rafraîchir le dashboard
  revalidatePath('/app')

  return creationCost
}

/**
 * Récupère tous les monstres appartenant à l'utilisateur connecté.
 * Garantit que la base de données est jointe et renvoie toujours un tableau (vide en cas d'erreur).
 *
 * @returns {Promise<ISerializedMonster[]>} Liste sérialisée des monstres de l'utilisateur.
 */
export async function getMonsters (): Promise<ISerializedMonster[]> {
  try {
    const session = await getSession()
    if (session === null) {
      throw new Error('User not authenticated')
    }

    // Récupération des monstres de l'utilisateur
    const monsters = await Monster.find({ ownerId: session.user.id }).exec()

    return monsters.map(monsterSerializer)
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

/**
 * Récupère un monstre identifié par son ObjectId en vérifiant la propriété utilisateur.
 * Retourne `null` si l'identifiant est invalide ou que le monstre n'appartient pas à l'utilisateur.
 *
 * @param {string} _id Identifiant MongoDB du monstre recherché.
 * @returns {Promise<ISerializedMonster | null>} Monstre sérialisé ou `null` s'il est introuvable.
 */
export async function getMonsterById (_id: string): Promise<ISerializedMonster | null> {
  try {
    const session = await getSession()
    if (session === null) {
      return null
    }

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error('Invalid monster ID format')
      return null
    }

    // Récupération du monstre avec vérification de propriété
    const monster = await Monster.findOne({ ownerId: session.user.id, _id }).exec()

    return monster !== null ? monsterSerializer(monster) : null
  } catch (error) {
    console.error('Error fetching monster by ID:', error)
    return null
  }
}

export type ActionType = 'feed' | 'play' | 'comfort' | 'calm' | 'lullaby'

export interface PerformActionResult {
  success: boolean
  leveledUp: boolean
  newLevel: number
  newXp: number
  maxXp: number
  coinsEarned: number
  newCreditTotal: number
  message?: string
}

// Table de correspondance actions ↔ états pour détecter les bonus
const actionStateMap: Record<ActionType, MonsterState> = {
  feed: 'hungry',
  play: 'gamester',
  comfort: 'sad',
  calm: 'angry',
  lullaby: 'sleepy'
}

/**
 * Applique une action sur un monstre après validation de l'authentification et de la propriété.
 * Gère l'attribution d'XP, la montée en niveau, l'état du monstre et la récompense en pièces.
 *
 * @param {string} monsterId Identifiant du monstre ciblé.
 * @param {ActionType} actionType Type d'interaction réalisée (nourrir, jouer, etc.).
 * @returns {Promise<PerformActionResult>} Résultat agrégé contenant XP, niveau et gains.
 */
export async function performMonsterAction (
  monsterId: string,
  actionType: ActionType
): Promise<PerformActionResult> {
  try {
    const session = await getSession()
    if (session === null) {
      throw new Error('User not authenticated')
    }

    if (!Types.ObjectId.isValid(monsterId)) {
      throw new Error('Invalid monster ID format')
    }

    // Récupération du monstre ciblé
    const monster = await Monster.findOne({
      ownerId: session.user.id,
      _id: monsterId
    }).exec()

    if (monster === null) {
      throw new Error('Monster not found')
    }

    // Vérification de la correspondance action/état pour accorder le bonus
    const isMatched = actionStateMap[actionType] === monster.state
    const coinsEarned = isMatched ? MATCHED_STATE_COIN_REWARD : BASE_COIN_REWARD

    // Ajout des points d'expérience
    let newXp = monster.xp + XP_REWARD
    let currentLevel = monster.level ?? 1
    let currentMaxXp = monster.maxXp ?? 100
    let leveledUp = false

    // Vérification d'une montée de niveau potentielle
    while (newXp >= currentMaxXp) {
      leveledUp = true
      newXp -= currentMaxXp
      currentLevel += 1
      currentMaxXp = calculateMaxXp(currentLevel)
    }

    // Mise à jour du document monstre
    monster.xp = newXp
    monster.level = currentLevel
    monster.maxXp = currentMaxXp
    monster.state = 'happy'
    await monster.save()

    // Mise à jour du solde du portefeuille utilisateur
    const newCreditTotal = await updateWalletBalance(coinsEarned)

    // Incrémenter les quêtes appropriées
    await incrementQuestProgress(`${actionType}_monsters`, 1)
    await incrementQuestProgress('total_actions', 1)

    // Vérifier les quêtes de pièces
    await checkCoinsQuests()

    revalidatePath(`/app/monster/${monsterId}`)
    revalidatePath('/app')
    revalidatePath('/app/quests')

    return {
      success: true,
      leveledUp,
      newLevel: currentLevel,
      newXp,
      maxXp: currentMaxXp,
      coinsEarned,
      newCreditTotal
    }
  } catch (error) {
    console.error('Error performing monster action:', error)
    return {
      success: false,
      leveledUp: false,
      newLevel: 1,
      newXp: 0,
      maxXp: 100,
      coinsEarned: 0,
      newCreditTotal: 0,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Bascule le statut public/privé d'un monstre.
 * Vérifie que le monstre appartient bien à l'utilisateur authentifié.
 *
 * @param {string} monsterId Identifiant du monstre à modifier
 * @returns {Promise<void>} Résultat de l'opération
 */
export async function toggleMonsterPublicStatus (monsterId: string): Promise<void> {
  const session = await getSession()

  if (session === null) {
    throw new Error('User not authenticated')
  }

  // Validation de l'identifiant
  if (!Types.ObjectId.isValid(monsterId)) {
    throw new Error('Invalid monster ID')
  }

  // Récupération du monstre avec vérification de propriété
  const monster = await Monster.findOne({
    _id: monsterId,
    ownerId: session.user.id
  }).exec()

  if (monster === null) {
    throw new Error('Monster not found or access denied')
  }

  // Basculer le statut isPublic
  monster.isPublic = !monster.isPublic
  await monster.save()

  // Revalidation du cache
  revalidatePath(`/app/monster/${monsterId}`)
  revalidatePath('/app')
}

interface GetPublicMonstersPaginatedResult {
  monsters: ISerializedPublicMonster[]
  nextCursor: string | null
  hasMore: boolean
  total: number
}

/**
 * Récupère les monstres publics avec pagination (cursor-based)
 * @param cursor - ID du dernier monstre de la page précédente (optionnel)
 * @param limit - Nombre de monstres à récupérer (par défaut 12)
 */
export async function getPublicMonstersPaginated (
  cursor?: string,
  limit: number = 12
): Promise<GetPublicMonstersPaginatedResult> {
  try {
    // Construire le filtre de base
    const $match: {
      isPublic: true
      _id?: { $lt: Types.ObjectId }
    } = { isPublic: true }

    // Si un cursor est fourni, filtrer pour les monstres plus anciens
    if (cursor !== undefined && Types.ObjectId.isValid(cursor)) {
      $match._id = { $lt: new Types.ObjectId(cursor) }
    }

    // Récupérer le total de monstres publics (pour l'affichage)
    const totalPromise = Monster.countDocuments({ isPublic: true })

    // Récupérer les monstres avec pagination
    const monstersPromise = Monster.aggregate<IPublicMonsterDocument>([
      // Filtrer les monstres publics (et après le cursor si présent)
      { $match },
      // Trier par _id décroissant (équivalent à createdAt car ObjectId contient le timestamp)
      { $sort: { _id: -1 } },
      // Limiter le nombre de résultats (+ 1 pour savoir s'il y en a encore)
      { $limit: limit + 1 },
      // Jointure avec la collection user
      {
        $lookup: {
          from: 'user',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      // Dérouler le tableau owner
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },

      // ici on projette uniquement les champs nécessaires
      {
        $project: {
          _id: 1,
          name: 1,
          level: 1,
          traits: 1,
          state: 1,
          createdAt: 1,
          ownerName: {
            $ifNull: ['$owner.name', 'Anonyme']
          }
        }
      }
    ]).exec()

    const [total, publicMonsters] = await Promise.all([totalPromise, monstersPromise])

    // On vérifie s'il y a plus de résultats
    const hasMore = publicMonsters.length > limit
    const monsters = hasMore ? publicMonsters.slice(0, limit) : publicMonsters

    const lastMonster = monsters.at(-1)

    // On détermine le prochain curseur
    const nextCursor = hasMore && lastMonster !== undefined
      ? lastMonster._id.toString()
      : null

    return {
      monsters: monsters.map(publicMonsterSerializer),
      nextCursor,
      hasMore,
      total
    }
  } catch (error) {
    console.error('Error fetching paginated public monsters:', error)
    return {
      monsters: [],
      nextCursor: null,
      hasMore: false,
      total: 0
    }
  }
}
