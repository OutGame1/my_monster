// ========================================
// MONSTER EYES COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific eye type sub-components

import type { ReactNode } from 'react'
import { type EyeType, type AnimationState } from '@/monster/types'
import DotEyes from './eyes/DotEyes'
import RoundEyes from './eyes/RoundEyes'
import StarEyes from './eyes/StarEyes'

interface EyesProps {
  type: EyeType
  outlineColor: string
  animation: AnimationState
}

export default function Eyes ({ type, outlineColor, animation }: EyesProps): ReactNode {
  switch (type) {
    case 'dot':
      return <DotEyes outlineColor={outlineColor} animation={animation} />

    case 'round':
      return <RoundEyes outlineColor={outlineColor} animation={animation} />

    case 'star':
      return <StarEyes outlineColor={outlineColor} animation={animation} />
  }
}
