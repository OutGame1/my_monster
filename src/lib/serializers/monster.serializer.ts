// ========================================
// SERIALIZER - MONSTER
// ========================================
// Convertit les documents Mongoose en objets sérialisés

import { Document } from 'mongoose'
import { SerializedMonster } from '@/types/monster.types'
import { IMonsterModel } from '@/db/models/monster.model'

/**
 * Convertit un document Mongoose Monster en SerializedMonster
 */
export function serializeMonster (
  doc: Document & IMonsterModel
): SerializedMonster {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    type: doc.type,
    rarity: doc.rarity,
    level: doc.level,
    experience: doc.experience,
    experienceToNextLevel: doc.experienceToNextLevel,
    stats: {
      health: doc.stats.health,
      maxHealth: doc.stats.maxHealth,
      attack: doc.stats.attack,
      defense: doc.stats.defense,
      speed: doc.stats.speed,
      energy: doc.stats.energy,
      maxEnergy: doc.stats.maxEnergy,
      happiness: doc.stats.happiness,
      hunger: doc.stats.hunger
    },
    abilities: doc.abilities.map(ability => ({
      name: ability.name,
      description: ability.description,
      power: ability.power,
      energyCost: ability.energyCost,
      type: ability.type
    })),
    appearance: {
      primaryColor: doc.appearance.primaryColor,
      secondaryColor: doc.appearance.secondaryColor,
      emoji: doc.appearance.emoji,
      bodyShape: doc.appearance.bodyShape
    },
    mood: doc.mood,
    description: doc.description,
    evolution: (doc.evolution != null)
      ? {
          level: doc.evolution.level,
          evolvesInto: doc.evolution.evolvesInto,
          requirements: (doc.evolution.requirements != null)
            ? {
                minHappiness: doc.evolution.requirements.minHappiness,
                minLevel: doc.evolution.requirements.minLevel,
                itemRequired: doc.evolution.requirements.itemRequired
              }
            : undefined
        }
      : undefined,
    ownerId: doc.ownerId.toString(),
    birthDate: doc.birthDate.toISOString(),
    lastFed: doc.lastFed?.toISOString(),
    lastPlayed: doc.lastPlayed?.toISOString(),
    isShiny: doc.isShiny,
    achievements: [...doc.achievements],
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString()
  }
}

/**
 * Convertit un tableau de documents Mongoose en tableau de SerializedMonster
 */
export function serializeMonsters (
  docs: Array<Document & IMonsterModel>
): SerializedMonster[] {
  return docs.map(serializeMonster)
}
