'use server'

import Quest from '@/db/models/quest.model'
import type { IQuestDocument } from '@/types/models/quest.model'
import Monster from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import questSerializer from '@/lib/serializers/quest.serializer'
import { allQuests } from '@/config/quests.config'
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

  const userId = session.user.id

  // Récupération de toutes les progressions de l'utilisateur
  const progressRecords = await Quest.find({ userId }).exec()

  const progressMap = new Map<string, IQuestDocument>(
    progressRecords.map(pr => [pr.questId, pr])
  )

  const questsPayload: QuestsPayload = { daily: [], achievement: [] }

  for (const quest of allQuests) {
    const questId = quest.id
    let progress = progressMap.get(questId)

    if (progress === undefined) {
      progress = new Quest({
        userId,
        questId,
        questObjective: quest.objective
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
 * @param questObjective Type d'objectif de la quête.
 * @param amount Montant à ajouter à la progression.
 */
export async function incrementQuestProgress (
  questObjective: QuestObjective,
  amount: number
): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }

  await Quest.updateQuests(session.user.id, questObjective, (progress) => progress + amount)
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

  const userId = session.user.id

  // Calculer le début de la journée (minuit)
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  // Compter les monstres soignés aujourd'hui
  const caredTodayCount = await Monster.countDocuments({
    ownerId: userId,
    lastCaredAt: { $gte: startOfDay }
  }).exec()

  await Quest.updateQuests(userId, 'care_different_monsters', caredTodayCount)
}

/**
 * Réclame la récompense d'une quête complétée.
 *
 * @param questId ID de la quête à réclamer.
 * @returns Montant de la récompense.
 */
export async function claimQuestReward (questId: string): Promise<number> {
  const session = await getSession()
  if (session === null) {
    throw new Error('User not authenticated')
  }

  const userId = session.user.id

  // Récupérer la progression
  const progress = await Quest.findOne({
    userId,
    questId
  }).exec()

  if (progress === null) {
    throw new Error('La quête est introuvable')
  }

  await progress.claim()

  // Ajouter les pièces
  await updateWalletBalance(progress.quest.reward)

  // Revalider les pages
  revalidatePath('/app/quests')
  revalidatePath('/app')

  return progress.quest.reward
}
