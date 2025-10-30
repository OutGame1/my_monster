'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster, { type MonsterState } from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Types } from 'mongoose'
import monsterSerizalizer, { type ISerializedMonster } from '@/lib/serializers/monster.serializer'
import { updateWalletBalance } from './wallet.actions'
import { generateMonsterTraits } from '@/monster/generator'
import { calculateMaxXp, calculateMonsterCreationCost } from '@/config/monsters.config'
import { BASE_COIN_REWARD, MATCHED_STATE_COIN_REWARD, XP_REWARD } from '@/config/rewards.config'

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
  // Connexion à la base de données
  await connectMongooseToDatabase()

  // Vérification de l'authentification
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
 * Récupère un monstre identifié par son ObjectId en vérifiant la propriété utilisateur.
 * Retourne `null` si l'identifiant est invalide ou que le monstre n'appartient pas à l'utilisateur.
 *
 * @param {string} _id Identifiant MongoDB du monstre recherché.
 * @returns {Promise<ISerializedMonster | null>} Monstre sérialisé ou `null` s'il est introuvable.
 */
export async function getMonsterById (_id: string): Promise<ISerializedMonster | null> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
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

    return monster !== null ? monsterSerizalizer(monster) : null
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
    await connectMongooseToDatabase()

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

    revalidatePath(`/app/monster/${monsterId}`)
    revalidatePath('/app')

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
