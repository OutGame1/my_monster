// ========================================
// MONSTER ARMS COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific arm type sub-components

import type { ReactNode } from 'react'
import type { MonsterArmType, MonsterBodyShape, MonsterState } from '@/db/models/monster.model'
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

export type SpecificArmsProps = Omit<ArmsProps, 'type'>

export default function Arms ({
  type,
  bodyShape,
  primaryColor,
  outlineColor,
  animation
}: ArmsProps): ReactNode {
  switch (type) {
    case 'tiny':
      return (
        <TinyArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          animation={animation}
        />
      )
    case 'short':
      return (
        <ShortArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          animation={animation}
        />
      )

    case 'long':
      return (
        <LongArms
          bodyShape={bodyShape}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          animation={animation}
        />
      )
  }
}
