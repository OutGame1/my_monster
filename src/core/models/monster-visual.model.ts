// ========================================
// MODÈLES VISUELS - CORE
// ========================================
// Définit les traits visuels d'un monstre
// Indépendant de toute implémentation technique

import { MonsterType } from '@/db/models/monster.model'

export type BodyShape = 'round' | 'oval' | 'serpent' | 'humanoid' | 'blob'

export type EyeStyle = 'round' | 'sharp' | 'cute' | 'fierce' | 'sleepy'

export type MouthStyle = 'smile' | 'fangs' | 'beak' | 'tiny' | 'open'

export type TailStyle = 'short' | 'long' | 'flame' | 'leaf' | 'lightning' | 'none'

export type PatternStyle = 'spots' | 'stripes' | 'scales' | 'smooth' | 'stars'

export type MonsterSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge'

export type AnimationType =
  | 'idle'
  | 'happy'
  | 'attack'
  | 'hurt'
  | 'celebrate'
  | 'sleep'
  | 'hungry'

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  eye: string
  shadow: string
}

export interface MonsterTraits {
  bodyShape: BodyShape
  eyeStyle: EyeStyle
  mouthStyle: MouthStyle
  hasHorns: boolean
  hasWings: boolean
  hasTail: boolean
  tailStyle: TailStyle
  pattern: PatternStyle
  hasSpikes: boolean
  hasAura: boolean
}

export interface MonsterVisualProfile {
  type: MonsterType
  size: MonsterSize
  level: number
  traits: MonsterTraits
  colorPalette: ColorPalette
  seed: number
  isShiny: boolean
}
