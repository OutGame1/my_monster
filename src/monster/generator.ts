// ========================================
// MONSTER TRAIT GENERATOR
// ========================================
// Generates consistent, reproducible monster traits from a name seed

import type {
  MonsterTraits,
  BodyShape,
  EyeType,
  MouthType,
  ArmType,
  LegType
} from './types'

/**
 * Simple seeded random number generator (LCG algorithm)
 * Always produces the same sequence for the same seed
 */
function seededRandom (seed: number): () => number {
  let current = seed
  return () => {
    current = (current * 1103515245 + 12345) % 2147483648
    return current / 2147483648
  }
}

/**
 * Convert string to numeric seed
 */
function stringToSeed (str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Pick random element from array using seeded RNG
 */
function pickRandom<T> (array: T[], random: () => number): T {
  const index = Math.floor(random() * array.length)
  return array[index]
}

const BODY_SHAPES: BodyShape[] = ['round', 'pear', 'tall']
const EYE_TYPES: EyeType[] = ['dot', 'round', 'star']
const MOUTH_TYPES: MouthType[] = ['smile', 'neutral', 'open']
const ARM_TYPES: ArmType[] = ['short', 'long', 'tiny']
const LEG_TYPES: LegType[] = ['stumpy', 'long', 'feet']

// Undertale-inspired color palettes - vibrant, cartoonish colors
const COLOR_PALETTES = [
  { primary: '#FF6B9D', secondary: '#C44569', outline: '#1B1464' }, // Pink/Purple
  { primary: '#4ECDC4', secondary: '#44A08D', outline: '#0B4F6C' }, // Teal/Green
  { primary: '#FFD93D', secondary: '#F6C90E', outline: '#3C3C3C' }, // Yellow/Gold
  { primary: '#A8E6CF', secondary: '#56C596', outline: '#2C5F2D' }, // Mint/Green
  { primary: '#FF8B94', secondary: '#E84855', outline: '#5C2751' }, // Coral/Red
  { primary: '#95E1D3', secondary: '#38ADA9', outline: '#1A535C' }, // Aqua/Teal
  { primary: '#C7CEEA', secondary: '#8B97CD', outline: '#3D5A80' }, // Lavender/Blue
  { primary: '#FFA07A', secondary: '#FF6347', outline: '#8B4513' }, // Orange/Brown
  { primary: '#DDA15E', secondary: '#BC6C25', outline: '#3C2A21' }, // Brown/Tan
  { primary: '#B8B8FF', secondary: '#6C63FF', outline: '#2E294E' } // Light Purple
]

/**
 * Generate monster traits from a name seed
 * Same name will always produce the same monster
 */
export function generateMonsterTraits (name: string): MonsterTraits {
  const seed = stringToSeed(name)
  const random = seededRandom(seed)

  const colorPalette = pickRandom(COLOR_PALETTES, random)

  return {
    bodyShape: pickRandom(BODY_SHAPES, random),
    eyeType: pickRandom(EYE_TYPES, random),
    mouthType: pickRandom(MOUTH_TYPES, random),
    armType: pickRandom(ARM_TYPES, random),
    legType: pickRandom(LEG_TYPES, random),
    primaryColor: colorPalette.primary,
    secondaryColor: colorPalette.secondary,
    outlineColor: colorPalette.outline,
    size: Math.floor(random() * 40) + 80 // 80-120
  }
}

/**
 * Parse traits from database JSON string
 */
export function parseTraits (traitsJson: string): MonsterTraits {
  return JSON.parse(traitsJson) as MonsterTraits
}

/**
 * Stringify traits for database storage
 */
export function stringifyTraits (traits: MonsterTraits): string {
  return JSON.stringify(traits)
}
