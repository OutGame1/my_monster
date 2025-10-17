// ========================================
// GÉNÉRATEUR VISUEL - INFRASTRUCTURE
// ========================================
// Pont entre le modèle de données et le service visuel

import { MonsterVisualService } from '@/core/services/monster-visual.service'
import { MonsterVisualProfile } from '@/core/models/monster-visual.model'
import { SerializedMonster } from '@/types/monster.types'

export class MonsterVisualGenerator {
  private readonly visualService: MonsterVisualService

  constructor () {
    this.visualService = new MonsterVisualService()
  }

  generateFromMonster (monster: SerializedMonster): MonsterVisualProfile {
    return this.visualService.generateVisualProfile(
      monster.name,
      monster.type as any,
      monster.level,
      monster.appearance.bodyType as any,
      monster.stats.attack,
      monster.stats.defense,
      monster.stats.speed,
      monster.isShiny
    )
  }

  generatePreview (
    name: string,
    type: string = 'Normal'
  ): MonsterVisualProfile {
    return this.visualService.generateVisualProfile(
      name,
      type as any,
      1,
      'medium',
      50,
      50,
      50,
      false
    )
  }
}
