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
      progress = await Quest.create({
        userId,
        questId,
        questObjective: quest.objective
      })
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
 * @param {QuestObjective} questObjective Type d'objectif de la quête.
 * @param {number} amount Montant à ajouter à la progression.
 */
export async function incrementQuestProgress (
  questObjective: QuestObjective,
  amount: number
): Promise<void> {
  const session = await getSession()
  if (session === null) {
    return
  }

  const userId = session.user.id

  for (const questDef of questsObjectiveMap[questObjective]) {
    const questId = questDef.id

    // Récupérer ou créer la progression
    let quest = await Quest.findOne({ userId, questId }).exec()

    if (quest === null) {
      quest = new Quest({
        userId,
        questId,
        questObjective
      })
    }

    // Ne pas incrémenter si déjà complété
    if (quest.completedAt !== undefined) {
      continue
    }

    // Incrémenter la progression
    quest.progress += amount

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

  const userId = session.user.id

  // Compter les monstres possédés
  const monsterCount = await Monster.countDocuments({ ownerId: userId }).exec()

  for (const questDef of questsObjectiveMap.own_monsters) {
    const questId = questDef.id

    let quest = await Quest.findOne({ userId, questId }).exec()

    if (quest === null) {
      quest = new Quest({
        userId,
        questId,
        questObjective: 'own_monsters'
      })
    }

    // Mettre à jour avec le nombre réel
    quest.progress = monsterCount

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

  const userId = session.user.id

  // Calculer le début de la journée (minuit)
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  // Compter les monstres soignés aujourd'hui
  const caredTodayCount = await Monster.countDocuments({
    ownerId: userId,
    lastCaredAt: { $gte: startOfDay }
  }).exec()

  // Mettre à jour toutes les quêtes "care_different_monsters"
  for (const questDef of questsObjectiveMap.care_different_monsters) {
    const questId = questDef.id

    let quest = await Quest.findOne({ userId, questId }).exec()

    if (quest === null) {
      quest = new Quest({
        userId,
        questId,
        questObjective: 'care_different_monsters'
      })
    }

    // Mettre à jour avec le nombre réel de monstres différents soignés aujourd'hui
    quest.progress = caredTodayCount

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

  const userId = session.user.id

  const questDef = questsIdMap.get(questId)
  if (questDef === undefined) {
    throw new Error('Quest not found')
  }

  // Récupérer la progression
  const progress = await Quest.findOne({
    userId,
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
