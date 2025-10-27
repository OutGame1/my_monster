// ========================================
// SERVICE VISUEL - CORE
// ========================================
// Logique métier pure pour la génération visuelle
// Pas de dépendances externes

import { MonsterType } from '@/db/models/monster.model'
import {
  MonsterVisualProfile,
  MonsterTraits,
  ColorPalette,
  MonsterSize,
  BodyShape,
  EyeStyle,
  MouthStyle,
  TailStyle,
  PatternStyle
} from '@/core/models/monster-visual.model'

export class MonsterVisualService {
  private readonly TYPE_PALETTES: Record<MonsterType, ColorPalette> = {
    [MonsterType.FIRE]: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD23F',
      eye: '#FF4500',
      shadow: 'rgba(255, 107, 53, 0.3)'
    },
    [MonsterType.WATER]: {
      primary: '#4A90E2',
      secondary: '#7FCDFF',
      accent: '#00D9FF',
      eye: '#1E3A8A',
      shadow: 'rgba(74, 144, 226, 0.3)'
    },
    [MonsterType.NATURE]: {
      primary: '#2ECC71',
      secondary: '#27AE60',
      accent: '#A8E6CF',
      eye: '#145A32',
      shadow: 'rgba(46, 204, 113, 0.3)'
    },
    [MonsterType.ELECTRIC]: {
      primary: '#F1C40F',
      secondary: '#F39C12',
      accent: '#FFF700',
      eye: '#7D3C98',
      shadow: 'rgba(241, 196, 15, 0.3)'
    },
    [MonsterType.DARK]: {
      primary: '#34495E',
      secondary: '#2C3E50',
      accent: '#8E44AD',
      eye: '#C0392B',
      shadow: 'rgba(52, 73, 94, 0.5)'
    },
    [MonsterType.LIGHT]: {
      primary: '#ECF0F1',
      secondary: '#BDC3C7',
      accent: '#FFE5B4',
      eye: '#3498DB',
      shadow: 'rgba(236, 240, 241, 0.3)'
    },
    [MonsterType.NORMAL]: {
      primary: '#95A5A6',
      secondary: '#7F8C8D',
      accent: '#BDC3C7',
      eye: '#2C3E50',
      shadow: 'rgba(149, 165, 166, 0.3)'
    }
  }

  generateVisualProfile (
    name: string,
    type: MonsterType,
    level: number,
    bodyType: 'small' | 'medium' | 'large' | 'giant',
    attack: number,
    defense: number,
    speed: number,
    isShiny: boolean
  ): MonsterVisualProfile {
    const seed = this.generateSeed(name)

    return {
      type,
      size: this.mapBodyTypeToSize(bodyType),
      level,
      traits: this.generateTraits(type, seed, attack, defense, speed),
      colorPalette: this.generateColorPalette(type, isShiny, seed),
      seed,
      isShiny
    }
  }

  private generateSeed (name: string): number {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  private mapBodyTypeToSize (bodyType: string): MonsterSize {
    const mapping: Record<string, MonsterSize> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
      giant: 'huge'
    }
    return mapping[bodyType] ?? 'medium'
  }

  private generateTraits (
    type: MonsterType,
    seed: number,
    attack: number,
    defense: number,
    speed: number
  ): MonsterTraits {
    const random = this.seededRandom(seed)

    return {
      bodyShape: this.selectBodyShape(type, random),
      eyeStyle: this.selectEyeStyle(speed, random),
      mouthStyle: this.selectMouthStyle(attack, random),
      hasHorns: this.shouldHaveHorns(type, defense),
      hasWings: this.shouldHaveWings(type, speed),
      hasTail: true,
      tailStyle: this.selectTailStyle(type, random),
      pattern: this.selectPattern(type, random),
      hasSpikes: this.shouldHaveSpikes(type, defense),
      hasAura: this.shouldHaveAura(type, attack)
    }
  }

  private seededRandom (seed: number): () => number {
    let value = seed
    return () => {
      value = (value * 9301 + 49297) % 233280
      return value / 233280
    }
  }

  private selectBodyShape (type: MonsterType, random: () => number): BodyShape {
    const typeShapes: Record<MonsterType, BodyShape[]> = {
      [MonsterType.FIRE]: ['round', 'humanoid', 'blob'],
      [MonsterType.WATER]: ['oval', 'serpent', 'blob'],
      [MonsterType.NATURE]: ['round', 'oval', 'blob'],
      [MonsterType.ELECTRIC]: ['round', 'humanoid'],
      [MonsterType.DARK]: ['serpent', 'humanoid'],
      [MonsterType.LIGHT]: ['round', 'oval', 'humanoid'],
      [MonsterType.NORMAL]: ['round', 'oval', 'humanoid']
    }

    const shapes = typeShapes[type]
    const index = Math.floor(random() * shapes.length)
    return shapes[index]
  }

  private selectEyeStyle (speed: number, random: () => number): EyeStyle {
    if (speed > 80) return 'sharp'
    if (speed > 60) return random() > 0.5 ? 'round' : 'fierce'
    if (speed < 30) return 'sleepy'
    return random() > 0.5 ? 'cute' : 'round'
  }

  private selectMouthStyle (attack: number, random: () => number): MouthStyle {
    if (attack > 80) return 'fangs'
    if (attack > 60) return random() > 0.5 ? 'open' : 'fangs'
    if (attack < 30) return 'tiny'
    return random() > 0.5 ? 'smile' : 'beak'
  }

  private shouldHaveHorns (type: MonsterType, defense: number): boolean {
    const hornTypes = [MonsterType.FIRE, MonsterType.DARK, MonsterType.ELECTRIC]
    return hornTypes.includes(type) && defense > 50
  }

  private shouldHaveWings (type: MonsterType, speed: number): boolean {
    const wingTypes = [MonsterType.LIGHT, MonsterType.DARK, MonsterType.ELECTRIC]
    return wingTypes.includes(type) && speed > 60
  }

  private selectTailStyle (type: MonsterType, random: () => number): TailStyle {
    const typeTails: Record<MonsterType, TailStyle[]> = {
      [MonsterType.FIRE]: ['flame', 'long'],
      [MonsterType.WATER]: ['long', 'short'],
      [MonsterType.NATURE]: ['leaf', 'short'],
      [MonsterType.ELECTRIC]: ['lightning', 'short'],
      [MonsterType.DARK]: ['long', 'short'],
      [MonsterType.LIGHT]: ['long', 'short'],
      [MonsterType.NORMAL]: ['short', 'long']
    }

    const tails = typeTails[type]
    const index = Math.floor(random() * tails.length)
    return tails[index]
  }

  private selectPattern (type: MonsterType, random: () => number): PatternStyle {
    const typePatterns: Record<MonsterType, PatternStyle[]> = {
      [MonsterType.FIRE]: ['smooth', 'scales'],
      [MonsterType.WATER]: ['scales', 'smooth', 'stripes'],
      [MonsterType.NATURE]: ['spots', 'stripes', 'smooth'],
      [MonsterType.ELECTRIC]: ['stripes', 'stars'],
      [MonsterType.DARK]: ['smooth', 'spots'],
      [MonsterType.LIGHT]: ['stars', 'smooth'],
      [MonsterType.NORMAL]: ['spots', 'stripes', 'smooth']
    }

    const patterns = typePatterns[type]
    const index = Math.floor(random() * patterns.length)
    return patterns[index]
  }

  private shouldHaveSpikes (type: MonsterType, defense: number): boolean {
    const spikeTypes = [MonsterType.FIRE, MonsterType.DARK, MonsterType.NATURE]
    return spikeTypes.includes(type) && defense > 60
  }

  private shouldHaveAura (type: MonsterType, attack: number): boolean {
    const auraTypes = [MonsterType.LIGHT, MonsterType.DARK, MonsterType.ELECTRIC]
    return auraTypes.includes(type) && attack > 70
  }

  private generateColorPalette (
    type: MonsterType,
    isShiny: boolean,
    seed: number
  ): ColorPalette {
    const basePalette = this.TYPE_PALETTES[type]

    if (!isShiny) {
      return basePalette
    }

    return this.applyShinyEffect(basePalette, seed)
  }

  private applyShinyEffect (palette: ColorPalette, seed: number): ColorPalette {
    const hueShift = (seed % 360)

    return {
      primary: this.shiftHue(palette.primary, hueShift),
      secondary: this.shiftHue(palette.secondary, hueShift),
      accent: this.shiftHue(palette.accent, hueShift),
      eye: palette.eye,
      shadow: palette.shadow
    }
  }

  private shiftHue (color: string, shift: number): string {
    // Conversion hex vers HSL, shift, puis retour
    // Simplification pour l'exemple
    return color
  }
}
