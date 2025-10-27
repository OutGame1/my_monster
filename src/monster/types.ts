// ========================================
// MONSTER DOMAIN TYPES
// ========================================
// Core interfaces for monster visual traits and states

export type BodyShape = 'round' | 'pear' | 'tall'
export type EyeType = 'dot' | 'round' | 'star'
export type MouthType = 'smile' | 'neutral' | 'open'
export type ArmType = 'short' | 'long' | 'tiny'
export type LegType = 'stumpy' | 'long' | 'feet'

export type AnimationState = 'idle' | 'happy' | 'eating' | 'playing' | 'sleeping' | 'sad'

/**
 * MonsterTraits defines the visual appearance of a monster.
 * This structure is stored as JSON string in the database (traits field).
 */
export interface MonsterTraits {
  bodyShape: BodyShape
  eyeType: EyeType
  mouthType: MouthType
  armType: ArmType
  legType: LegType
  primaryColor: string // Hex color for body
  secondaryColor: string // Hex color for accents/details
  outlineColor: string // Hex color for outlines (usually dark)
  size: number // 80-120 scale percentage
}

/**
 * Monster entity matching the database model schema
 */
export interface Monster {
  _id: string
  name: string
  level: number
  traits: string // JSON stringified MonsterTraits
  state: 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy'
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Parsed monster with traits as object for easier manipulation
 */
export interface MonsterWithTraits extends Omit<Monster, 'traits'> {
  traits: MonsterTraits
}
