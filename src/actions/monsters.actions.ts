'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster, { monsterBaseXp, type MonsterState } from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import { Types } from 'mongoose'
import monsterSerizalizer, { type ISerializedMonster } from '@/lib/serializers/monster.serializer'
import { updateWalletBalance } from './wallet.actions'

/**
 * Crée un nouveau monstre pour l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Crée un nouveau document Monster dans MongoDB
 * 3. Revalide le cache de la page dashboard
 *
 * Responsabilité unique : orchestrer la création d'un monstre
 * en coordonnant l'authentification, la persistence et le cache.
 *
 * @async
 * @param {CreateMonsterFormValues} monsterData - Données validées du monstre à créer
 * @returns {Promise<void>} Promise résolue une fois le monstre créé
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * await createMonster({
 *   name: "Pikachu",
 *   traits: '{"bodyColor": "#FFB5E8", ...}',
 *   state: "happy",
 *   level: 1
 * })
 */
export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
  // Connexion à la base de données
  await connectMongooseToDatabase()

  // Vérification de l'authentification
  const session = await getSession()

  if (session === null) {
    throw new Error('User not authenticated')
  }

  // Création et sauvegarde du monstre
  const monster = new Monster({
    ownerId: session.user.id,
    name: monsterData.name,
    traits: monsterData.traits,
    state: monsterData.state,
    level: monsterData.level
  })

  await monster.save()

  // Revalidation du cache pour rafraîchir le dashboard
  revalidatePath('/dashboard')
}

/**
 * Récupère tous les monstres de l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Récupère tous les monstres appartenant à l'utilisateur
 * 3. Retourne un tableau vide en cas d'erreur (résilience)
 *
 * Responsabilité unique : récupérer la liste complète des monstres
 * de l'utilisateur depuis la base de données.
 *
 * @async
 * @returns {Promise<IMonster[]>} Liste des monstres ou tableau vide en cas d'erreur
 *
 * @example
 * const monsters = await getMonsters()
 * // [{ _id: "...", name: "Pikachu", ... }, ...]
 */
export async function getMonsters (): Promise<ISerializedMonster[]> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await getSession()

    if (session === null) {
      throw new Error('User not authenticated')
    }

    // Récupération des monstres de l'utilisateur
    const monsters = await Monster.find({ ownerId: session.user.id }).exec()

    return monsters.map(monsterSerizalizer)
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

/**
 * Récupère un monstre spécifique par son identifiant
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Valide le format de l'identifiant MongoDB
 * 3. Récupère le monstre s'il appartient à l'utilisateur
 * 4. Retourne null si le monstre n'existe pas ou n'appartient pas à l'utilisateur
 *
 * Responsabilité unique : récupérer un monstre spécifique
 * en garantissant la propriété et l'existence.
 *
 * @async
 * @param {string} _id - Identifiant du monstre (premier élément du tableau de route dynamique)
 * @returns {Promise<IMonster | null>} Le monstre trouvé ou null
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * const monster = await getMonsterById("507f1f77bcf86cd799439011")
 * // { _id: "507f1f77bcf86cd799439011", name: "Pikachu", ... }
 *
 * const notFound = await getMonsterById("invalid-id")
 * // null
 */
export async function getMonsterById (_id: string): Promise<ISerializedMonster | null> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await getSession()

    if (session === null) {
      throw new Error('User not authenticated')
    }

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error('Invalid monster ID format')
      return null
    }

    // Récupération du monstre avec vérification de propriété
    const monster = await Monster.findOne({ ownerId: session.user.id, _id }).exec()

    return monster !== null ? monsterSerizalizer(monster) : null
  } catch (error) {
    console.error('Error fetching monster by ID:', error)
    return null
  }
}

/**
 * Calculate max XP required for a given level
 * Uses formula: maxXp = monsterBaseXp * (level ^ 1.5)
 */
function calculateMaxXp (level: number): number {
  return Math.floor(monsterBaseXp * Math.pow(level, 1.5))
}

/**
 * Coin rewards for actions
 * Base reward: 10 coins
 * Matched state reward: 20 coins (double)
 */
const BASE_COIN_REWARD = 10
const MATCHED_STATE_COIN_REWARD = 20

/**
 * XP reward per action
 */
const XP_REWARD = 25

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

// Map actions to states for bonus detection
const actionStateMap: Record<ActionType, MonsterState> = {
  feed: 'hungry',
  play: 'gamester',
  comfort: 'sad',
  calm: 'angry',
  lullaby: 'sleepy'
}

/**
 * Perform an action on a monster
 *
 * This server action:
 * 1. Validates authentication and monster ownership
 * 2. Awards XP to the monster
 * 3. Awards coins to the user (double if action matches state)
 * 4. Handles level-up logic if XP threshold is reached
 * 5. Updates monster state based on the action
 *
 * @async
 * @param {string} monsterId - The monster's ID
 * @param {ActionType} actionType - The type of action performed
 * @returns {Promise<PerformActionResult>} Result of the action
 */
export async function performMonsterAction (
  monsterId: string,
  actionType: ActionType
): Promise<PerformActionResult> {
  try {
    await connectMongooseToDatabase()

    const session = await getSession()
    if (session === null) {
      throw new Error('User not authenticated')
    }

    if (!Types.ObjectId.isValid(monsterId)) {
      throw new Error('Invalid monster ID format')
    }

    // Get the monster
    const monster = await Monster.findOne({
      ownerId: session.user.id,
      _id: monsterId
    }).exec()

    if (monster === null) {
      throw new Error('Monster not found')
    }

    // Check if action matches current state for bonus
    const isMatched = actionStateMap[actionType] === monster.state
    const coinsEarned = isMatched ? MATCHED_STATE_COIN_REWARD : BASE_COIN_REWARD

    // Add XP
    let newXp = monster.xp + XP_REWARD
    let currentLevel = monster.level ?? 1
    let currentMaxXp = monster.maxXp ?? 100
    let leveledUp = false

    // Check for level up
    while (newXp >= currentMaxXp) {
      leveledUp = true
      newXp -= currentMaxXp
      currentLevel += 1
      currentMaxXp = calculateMaxXp(currentLevel)
    }

    // Update monster
    monster.xp = newXp
    monster.level = currentLevel
    monster.maxXp = currentMaxXp
    monster.state = 'happy'
    await monster.save()

    // Update user wallet balance
    const newCreditTotal = await updateWalletBalance(coinsEarned)

    revalidatePath(`/monster/${monsterId}`)
    revalidatePath('/dashboard')

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
