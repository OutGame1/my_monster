// ========================================
// HOOK GÉNÉRATION VISUELLE - PRÉSENTATION
// ========================================
// Custom hook pour gérer la génération visuelle des monstres

'use client'

import { useState, useEffect, useMemo } from 'react'
import { MonsterVisualProfile } from '@/core/models/monster-visual.model'
import { MonsterVisualGenerator } from '@/core/generators/monster-visual.generator'
import { SerializedMonster } from '@/types/monster.types'

export function useMonsterVisual (monster: SerializedMonster | null) {
  const [visualProfile, setVisualProfile] = useState<MonsterVisualProfile | null>(null)

  const generator = useMemo(() => new MonsterVisualGenerator(), [])

  useEffect(() => {
    if (monster != null) {
      const profile = generator.generateFromMonster(monster)
      setVisualProfile(profile)
    }
  }, [monster, generator])

  return visualProfile
}

export function useMonsterPreview (name: string, type?: string) {
  const [visualProfile, setVisualProfile] = useState<MonsterVisualProfile | null>(null)

  const generator = useMemo(() => new MonsterVisualGenerator(), [])

  useEffect(() => {
    if (name.trim().length >= 2) {
      const profile = generator.generatePreview(name, type)
      setVisualProfile(profile)
    } else {
      setVisualProfile(null)
    }
  }, [name, type, generator])

  return visualProfile
}
