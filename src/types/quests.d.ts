/**
 * Types et interfaces pour le système de quêtes
 * Définit les types de quêtes, leurs objectifs et leurs récompenses
 */

import type { questObjectives } from '@/config/quests.config'
import type { ISerializedQuestProgress } from '@/lib/serializers/quest.serializer'

/**
 * Type de quête (quotidienne ou achievement permanent)
 */
export type QuestType = 'daily' | 'achievement'

/**
 * Types d'objectifs possibles pour les quêtes
 */
export type QuestObjective = typeof questObjectives[number]

/**
 * Définition d'une quête
 */
export interface QuestDefinition {
  id: string
  type: QuestType
  objective: QuestObjective
  target: number // Nombre à atteindre
  reward: number // Pièces gagnées
  title: string
  description: string
  icon: string // Emoji ou icône
}

/**
 * Quête avec sa progression
 */
export interface QuestWithProgress {
  definition: QuestDefinition
  progress: ISerializedQuestProgress
}

/**
 * Payload de retour pour les quêtes groupées par type
 */
export interface QuestsPayload {
  daily: QuestWithProgress[]
  achievement: QuestWithProgress[]
}
