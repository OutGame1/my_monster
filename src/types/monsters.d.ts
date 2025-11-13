/**
 * Types et interfaces pour le système de monstres
 * Inclut les actions, résultats d'actions et informations d'état
 */

import type {
  MONSTER_STATES,
  BODY_SHAPES,
  EYE_TYPES,
  MOUTH_TYPES,
  ARM_TYPES,
  LEG_TYPES
} from '@/config/monsters.config'

export type MonsterState = typeof MONSTER_STATES[number]
export type MonsterBodyShape = typeof BODY_SHAPES[number]
export type MonsterEyeShape = typeof EYE_TYPES[number]
export type MonsterMouthType = typeof MOUTH_TYPES[number]
export type MonsterArmType = typeof ARM_TYPES[number]
export type MonsterLegType = typeof LEG_TYPES[number]

/**
 * Types d'actions possibles sur un monstre
 */
export type ActionType = 'feed' | 'play' | 'comfort' | 'calm' | 'lullaby'

/**
 * Résultat d'une action effectuée sur un monstre
 */
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

/**
 * Informations d'affichage pour un état de monstre
 */
export interface StateInfo {
  label: string
  emoji: string
  color: string
}

/**
 * Map de correspondance entre actions et états pour détecter les bonus
 */
export type ActionStateMap = Record<ActionType, MonsterState>
