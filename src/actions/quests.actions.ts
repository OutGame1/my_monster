'use server'

import Quest, { type IQuestDocument } from '@/db/models/quest.model'
import Monster from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import questSerializer from '@/lib/serializers/quest.serializer'
import { allQuests, questsObjectiveMap, questsIdMap } from '@/config/quests.config'
import type { QuestObjective, QuestsPayload } from '@/types/quests'
import { updateWalletBalance } from './wallet.actions'

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

  for (const questDef of questsObjectiveMap[objective]) {
    const questData = {
      userId: session.user.id,
      questId: questDef.id
    }

    // Récupérer ou créer la progression
    let quest = await Quest.findOne(questData).exec()

    if (quest === null) {
      quest = new Quest(questData)
    }

    // Ne pas incrémenter si déjà complété
    if (quest.completedAt !== undefined) {
      continue
    }

    // Incrémenter la progression
    quest.progress = Math.min(quest.progress + amount, questDef.target)

    // Marquer comme complété si l'objectif est atteint
    if (quest.progress >= questDef.target) {
      quest.completedAt = new Date()
    }

    await quest.save()
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

  for (const questDef of questsObjectiveMap.own_monsters) {
    const questData = {
      userId: session.user.id,
      questId: questDef.id
    }

    let quest = await Quest.findOne(questData).exec()

    if (quest === null) {
      quest = new Quest(questData)
    }

    // Mettre à jour avec le nombre réel
    quest.progress = monsterCount

    if (monsterCount >= questDef.target && quest.completedAt === undefined) {
      quest.completedAt = new Date()
    }

    await quest.save()
  }
}

/**
 * Vérifie et met à jour la progression de la quête "care_different_monsters".
 * Compte le nombre de monstres uniques soignés aujourd'hui (lastCaredAt >= minuit).
 */
export async function checkCareDifferentMonstersProgress (): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }

  // Calculer le début de la journée (minuit)
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  // Compter les monstres soignés aujourd'hui
  const caredTodayCount = await Monster.countDocuments({
    ownerId: session.user.id,
    lastCaredAt: { $gte: startOfDay }
  }).exec()

  // Mettre à jour toutes les quêtes "care_different_monsters"
  for (const questDef of questsObjectiveMap.care_different_monsters) {
    const questData = {
      userId: session.user.id,
      questId: questDef.id
    }

    let quest = await Quest.findOne(questData).exec()

    if (quest === null) {
      quest = new Quest(questData)
    }

    // Mettre à jour avec le nombre réel de monstres différents soignés aujourd'hui
    quest.progress = caredTodayCount

    if (caredTodayCount >= questDef.target && quest.completedAt === undefined) {
      quest.completedAt = new Date()
    }

    await quest.save()
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

  const questDef = questsIdMap.get(questId)
  if (questDef === undefined) {
    throw new Error('Quest not found')
  }

  // Récupérer la progression
  const progress = await Quest.findOne({
    userId: session.user.id,
    questId
  }).exec()

  if (progress === null) {
    throw new Error('La quête est introuvable')
  }

  if (progress.completedAt === undefined) {
    throw new Error('La quête n\'est pas encore complétée')
  }

  if (progress.claimedAt !== undefined) {
    throw new Error('Vous avez déjà réclamé cette récompense')
  }

  // Marquer comme réclamé
  progress.claimedAt = new Date()
  await progress.save()

  // Ajouter les pièces
  await updateWalletBalance(questDef.reward)

  // Revalider les pages
  revalidatePath('/app/quests')
  revalidatePath('/app')

  return questDef.reward
}
