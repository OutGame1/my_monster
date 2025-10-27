// ========================================
// MONSTER MOUTH COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific mouth type sub-components

import type { ReactNode } from 'react'
import { type MouthType, type AnimationState } from '@/monster/types'
import SmileMouth from './mouths/SmileMouth'
import NeutralMouth from './mouths/NeutralMouth'
import OpenMouth from './mouths/OpenMouth'

interface MouthProps {
  type: MouthType
  outlineColor: string
  animation: AnimationState
}

export default function Mouth ({ type, outlineColor, animation }: MouthProps): ReactNode {
  switch (type) {
    case 'smile':
      return <SmileMouth outlineColor={outlineColor} animation={animation} />

    case 'neutral':
      return <NeutralMouth outlineColor={outlineColor} animation={animation} />

    case 'open':
      return <OpenMouth outlineColor={outlineColor} animation={animation} />
  }
}
