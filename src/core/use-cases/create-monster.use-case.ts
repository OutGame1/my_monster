// ========================================
// USE CASE : CRÉER UN MONSTRE - CORE
// ========================================
// Logique métier pour la création d'un monstre

import { IMonsterRepository } from '@/core/repositories/monster.repository.interface'
import type { SerializedMonster } from '@/types/monster.types'

export interface CreateMonsterInput {
  name: string
  ownerId: string
}

export type CreateMonsterOutput =
  | { success: true, monster: SerializedMonster }
  | { success: false, error: string }

export class CreateMonsterUseCase {
  constructor (private readonly repository: IMonsterRepository) {}

  async execute (input: CreateMonsterInput): Promise<CreateMonsterOutput> {
    try {
      // 1. Validation
      if (!this.validateInput(input)) {
        return {
          success: false,
          error: 'Le nom du monstre doit contenir entre 2 et 50 caractères'
        }
      }

      // 2. Génération des données du monstre
      const monsterData = await this.generateMonsterData(input)

      // 3. Persistance
      const monster = await this.repository.create(monsterData)

      return {
        success: true,
        monster
      }
    } catch (error) {
      console.error('Error in CreateMonsterUseCase:', error)
      return {
        success: false,
        error: 'Erreur lors de la création du monstre'
      }
    }
  }

  private validateInput (input: CreateMonsterInput): boolean {
    return input.name.trim().length >= 2 && input.name.trim().length <= 50
  }

  private async generateMonsterData (input: CreateMonsterInput): Promise<any> {
    // Utilisation du générateur existant
    const { generateRandomMonster } = await import('@/lib/monster-generator')
    return generateRandomMonster(input)
  }
}
