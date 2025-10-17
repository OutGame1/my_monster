'use client'

import { useState, useEffect } from 'react'
import type { MonsterVisualProfile } from '@/core/models/monster-visual.model'
import { MonsterType } from '@/db/models/monster.model'
import { generateMonsterVisual } from '@/actions/monsters.actions'

export function useRandomMonster () {
  const [monsterProfile, setMonsterProfile] = useState<MonsterVisualProfile | null>(null)

  useEffect(() => {
    // Générer un monstre aléatoire côté client
    const generateRandomMonster = async () => {
      try {
        const randomSeed = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const types = Object.values(MonsterType)
        const randomType = types[Math.floor(Math.random() * types.length)]

        // Appel direct à l'action serveur
        const result = await generateMonsterVisual({
          name: randomSeed,
          type: randomType,
          level: 30,
          bodyType: 'medium',
          attack: Math.floor(Math.random() * 40) + 60,
          defense: Math.floor(Math.random() * 40) + 50,
          speed: Math.floor(Math.random() * 40) + 50,
          isShiny: Math.random() > 0.95
        })

        if (result.success && (result.visualProfile != null)) {
          setMonsterProfile(result.visualProfile)
        }
      } catch (error) {
        console.error('Erreur lors de la génération du monstre:', error)
      }
    }

    generateRandomMonster()
  }, [])

  return monsterProfile
}
