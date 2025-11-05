'use server'

import { connectMongooseToDatabase } from '@/db'
import Quest, { type IQuestDocument } from '@/db/models/quest.model'
import Monster from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import questSerializer, { type ISerializedQuestProgress } from '@/lib/serializers/quest.serializer'
import { allQuests, dailyQuestIds, type QuestObjective, type QuestDefinition } from '@/config/quests.config'
import { updateWalletBalance, getWallet } from './wallet.actions'

export interface QuestWithProgress {
  definition: QuestDefinition
  progress: ISerializedQuestProgress
}

interface QuestsPayload {
  daily: QuestWithProgress[]
  achievement: QuestWithProgress[]
}

/**
 * Récupère les quêtes quotidiennes et achievements avec leur progression.
 *
 * @returns {Promise<QuestsPayload>}
 */
export async function getQuestsWithProgress (): Promise<QuestsPayload> {
  const session = await getSession()
  if (session === null) {
    throw new Error('User not authenticated')
  }

  // Récupération de toutes les progressions de l'utilisateur
  const progressRecords = await Quest.find({ userId: session.user.id }).exec()

  const progressMap = new Map<string, IQuestDocument>(
    progressRecords.map(pr => [pr.questId, pr])
  )

  const questsPayload: QuestsPayload = { daily: [], achievement: [] }

  for (const quest of allQuests) {
    let progress = progressMap.get(quest.id)

    if (progress === undefined) {
      progress = new Quest({
        userId: session.user.id,
        questId: quest.id
      })
      await progress.save()
    }

    questsPayload[quest.type].push({
      definition: quest,
      progress: questSerializer(progress)
    })
  }

  return questsPayload
}

/**
 * Incrémente la progression d'une quête pour l'utilisateur connecté.
 * Crée l'enregistrement si nécessaire.
 *
 * @param {QuestObjective} objective Type d'objectif de la quête.
 * @param {number} amount Montant à ajouter à la progression.
 */
export async function incrementQuestProgress (
  objective: QuestObjective,
  amount: number
): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }

  // Itérer sur toutes les quêtes et filtrer par objectif
  for (const quest of allQuests) {
    if (quest.objective !== objective) {
      continue
    }

    const questData = {
      userId: session.user.id,
      questId: quest.id
    }

    // Récupérer ou créer la progression
    let progress = await Quest.findOne(questData).exec()

    if (progress === null) {
      progress = new Quest(questData)
    }

    // Ne pas incrémenter si déjà complété
    if (progress.completed) {
      continue
    }

    // Incrémenter la progression
    progress.progress = Math.min(progress.progress + amount, quest.target)

    // Marquer comme complété si l'objectif est atteint
    if (progress.progress >= quest.target && !progress.completed) {
      progress.completedAt = new Date()
    }

    await progress.save()
  }
}

/**
 * Vérifie et incrémente les quêtes de type "own_monsters" basées sur le nombre actuel.
 */
export async function checkOwnershipQuests (): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }

  // Compter les monstres possédés
  const monsterCount = await Monster.countDocuments({ ownerId: session.user.id }).exec()

  // Itérer sur toutes les quêtes et filtrer par objectif
  for (const quest of allQuests) {
    if (quest.objective !== 'own_monsters') {
      continue
    }

    const questData = {
      userId: session.user.id,
      questId: quest.id
    }

    let progress = await Quest.findOne(questData).exec()

    if (progress === null) {
      progress = new Quest(questData)
    }

    // Mettre à jour avec le nombre réel
    progress.progress = monsterCount

    if (monsterCount >= quest.target && !progress.completed) {
      progress.completedAt = new Date()
    }

    await progress.save()
  }
}

/**
 * Vérifie et incrémente les quêtes de type "reach_coins" basées sur le total de pièces gagnées.
 */
export async function checkCoinsQuests (): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }

  // Récupérer le total de pièces gagnées
  const wallet = await getWallet(session.user.id)
  const totalEarned = wallet.totalEarned

  // Itérer sur toutes les quêtes et filtrer par objectif
  for (const quest of allQuests) {
    if (quest.objective !== 'reach_coins') {
      continue
    }
    let progress = await Quest.findOne({
      userId: session.user.id,
      questId: quest.id
    }).exec()

    if (progress === null) {
      progress = new Quest({
        userId: session.user.id,
        questId: quest.id
      })
    }

    // Mettre à jour avec le total de pièces gagnées
    progress.progress = totalEarned

    if (totalEarned >= quest.target && !progress.completed) {
      progress.completedAt = new Date()
    }

    await progress.save()
  }
}

/**
 * Réclame la récompense d'une quête complétée.
 *
 * @param {string} questId ID de la quête à réclamer.
 * @returns {Promise<number>} Montant de la récompense.
 */
export async function claimQuestReward (questId: string): Promise<number> {
  const session = await getSession()
  if (session === null) {
    throw new Error('User not authenticated')
  }

  const questDef = allQuests.find(q => q.id === questId)
  if (questDef === undefined) {
    throw new Error('Quest not found')
  }

  // Récupérer la progression
  const progress = await Quest.findOne({
    userId: session.user.id,
    questId
  }).exec()

  if (progress === null) {
    throw new Error('Quest progress not found')
  }

  if (!progress.completed) {
    throw new Error('Quest not completed yet')
  }

  if (progress.claimed) {
    throw new Error('Reward already claimed')
  }

  // Marquer comme réclamé
  progress.claimedAt = new Date()
  await progress.save()

  // Ajouter les pièces
  await updateWalletBalance(questDef.reward)

  // Revalider les pages
  revalidatePath('/quests')
  revalidatePath('/app')

  return questDef.reward
}

/**
 * Réinitialise toutes les quêtes quotidiennes pour un utilisateur.
 * À appeler via un cron job quotidien.
 *
 * @param {string} userId ID de l'utilisateur.
 */
export async function resetDailyQuests (userId: string): Promise<void> {
  await connectMongooseToDatabase()

  await Quest.updateMany(
    {
      userId,
      questId: { $in: dailyQuestIds }
    },
    {
      $set: {
        progress: 0,
        lastResetAt: new Date()
      },
      $unset: {
        completedAt: '',
        claimedAt: ''
      }
    }
  ).exec()
}
