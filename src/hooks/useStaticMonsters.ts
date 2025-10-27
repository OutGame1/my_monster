'use client'

import { useState, useEffect } from 'react'
import type { MonsterVisualProfile } from '@/core/models/monster-visual.model'
import { MonsterType } from '@/db/models/monster.model'
import { generateMonsterVisual } from '@/actions/monsters.actions'

interface StaticMonster {
  name: string
  type: MonsterType
  typeLabel: string
  description: string
  color: string
  stats: { attack: number, defense: number, speed: number }
}

const STATIC_MONSTERS: StaticMonster[] = [
  {
    name: 'Bloopy',
    type: MonsterType.WATER,
    typeLabel: 'Aquatique',
    description: 'Un monstre jovial qui adore les éclaboussures',
    color: 'bg-blue-50',
    stats: { attack: 45, defense: 60, speed: 70 }
  },
  {
    name: 'Leafy',
    type: MonsterType.NATURE,
    typeLabel: 'Nature',
    description: 'Un esprit de la forêt espiègle et attachant',
    color: 'bg-green-50',
    stats: { attack: 40, defense: 70, speed: 50 }
  },
  {
    name: 'Flammy',
    type: MonsterType.FIRE,
    typeLabel: 'Feu',
    description: "Une boule d'énergie chaleureuse et dynamique",
    color: 'bg-red-50',
    stats: { attack: 75, defense: 45, speed: 65 }
  }
]

interface MonsterWithProfile extends StaticMonster {
  visualProfile: MonsterVisualProfile
}

export function useStaticMonsters (): { monsters: MonsterWithProfile[], loading: boolean } {
  const [monsters, setMonsters] = useState<MonsterWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateMonsters = async (): Promise<void> => {
      try {
        const monstersWithProfiles = await Promise.all(
          STATIC_MONSTERS.map(async (monster) => {
            // Appel direct à l'action serveur
            const result = await generateMonsterVisual({
              name: monster.name,
              type: monster.type,
              level: 25,
              bodyType: 'medium',
              attack: monster.stats.attack,
              defense: monster.stats.defense,
              speed: monster.stats.speed,
              isShiny: false
            })

            if (result.success) {
              return {
                ...monster,
                visualProfile: result.data
              }
            }
            return null
          })
        )

        const validMonsters = monstersWithProfiles.filter((m): m is MonsterWithProfile => m !== null)
        setMonsters(validMonsters)
      } catch (error) {
        console.error('Erreur lors de la génération des monstres:', error)
      } finally {
        setLoading(false)
      }
    }

    void generateMonsters()
  }, [])

  return { monsters, loading }
}
