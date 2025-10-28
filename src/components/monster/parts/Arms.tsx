// ========================================
// MONSTER ARMS COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific arm type sub-components

import type { ReactNode } from 'react'
import type { MonsterArmType, MonsterBodyShape, MonsterState } from '@/db/models/monster.model'
import { invoke } from '@/lib/utilities'
import ShortArms from './arms/ShortArms'
import LongArms from './arms/LongArms'
import TinyArms from './arms/TinyArms'

interface ArmsProps {
  type: MonsterArmType
  bodyShape: MonsterBodyShape
  primaryColor: string
  outlineColor: string
  state: MonsterState | null
}

export interface SpecificArmsProps {
  bodyShape: MonsterBodyShape
  primaryColor: string
  outlineColor: string
  className?: string
}

export interface SpecificBodyArmsProps {
  armsXPos: number
  armsYPos: number
  armsSpacing: number
  armsRotationDegree: number
  primaryColor: string
  outlineColor: string
  className?: string
}

export default function Arms ({
  type,
  bodyShape,
  primaryColor,
  outlineColor,
  state
}: ArmsProps): ReactNode {
  // CSS animation class based on animation state
  const stateClass = invoke(() => {
    switch (state) {
      case 'happy':
        return 'animate-wave-arms'
      case 'gamester':
        return 'animate-wiggle-arms'
      case 'hungry':
        return 'animate-shake-arms-hungry'
    }
  })

  switch (type) {
    case 'tiny':
      return (
        <TinyArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={stateClass}
        />
      )
    case 'short':
      return (
        <ShortArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={stateClass}
        />
      )

    case 'long':
      return (
        <LongArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={stateClass}
        />
      )
  }
}
