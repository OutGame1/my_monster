/**
 * Types et interfaces pour le système de quêtes
 * Définit les types de quêtes, leurs objectifs et leurs récompenses
 */

import type { ISerializedQuestProgress } from '@/lib/serializers/quest.serializer'

/**
 * Type de quête (quotidienne ou achievement permanent)
 */
export type QuestType = 'daily' | 'achievement'

/**
 * Types d'objectifs possibles pour les quêtes
 */
export type QuestObjective =
  | 'feed_monsters' // Nourrir X fois
  | 'play_monsters' // Jouer X fois
  | 'comfort_monsters' // Réconforter X fois
  | 'calm_monsters' // Calmer X fois
  | 'lullaby_monsters' // Bercer X fois
  | 'care_different_monsters' // S'occuper de X monstres différents
  | 'own_monsters' // Posséder X monstres
  | 'total_actions' // Effectuer X actions au total
  | 'level_up_monster' // Faire monter un monstre au niveau X
  | 'reach_coins' // Atteindre X pièces

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
