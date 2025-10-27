// ========================================
// MONSTER ARMS COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific arm type sub-components

import type { ReactNode } from 'react'
import type { ArmType, AnimationState, BodyShape } from '@/monster/types'
import ShortArms from './arms/ShortArms'
import LongArms from './arms/LongArms'
import TinyArms from './arms/TinyArms'

interface ArmsProps {
  type: ArmType
  bodyShape: BodyShape
  primaryColor: string
  outlineColor: string
  animation: AnimationState
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
