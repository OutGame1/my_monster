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
  animation: MonsterState | null
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
  animation
}: ArmsProps): ReactNode {
  // CSS animation class based on animation state
  const animationClass = invoke(() => {
    switch (animation) {
      case 'happy':
        return 'animate-wave-arms'
      case 'gamester':
        return 'animate-wiggle-arms'
    }
  })

  switch (type) {
    case 'tiny':
      return (
        <TinyArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={animationClass}
        />
      )
    case 'short':
      return (
        <ShortArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={animationClass}
        />
      )

    case 'long':
      return (
        <LongArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={animationClass}
        />
      )
  }
}
