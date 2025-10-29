// ========================================
// MONSTER MOUTH COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific mouth type sub-components

import type { ReactNode } from 'react'
import type { MonsterState, MonsterMouthType } from '@/db/models/monster.model'
import SimpleMouth from './mouths/SimpleMouth'
import ToothyMouth from './mouths/ToothyMouth'
import WavyMouth from './mouths/WavyMouth'
import SadMouth from './mouths/SadMouth'

interface MouthProps {
  type: MonsterMouthType
  outlineColor: string
  state: MonsterState | null
}

export default function Mouth ({ type, outlineColor, state }: MouthProps): ReactNode {
  const strokeWidth = 3.5

  // Sad state is the same for all mouth types
  if (state === 'sad') {
    return (
      <SadMouth
        outlineColor={outlineColor}
        strokeWidth={strokeWidth}
      />
    )
  }

  switch (type) {
    case 'simple':
      return <SimpleMouth outlineColor={outlineColor} state={state} />

    case 'toothy':
      return <ToothyMouth outlineColor={outlineColor} state={state} />

    case 'wavy':
      return <WavyMouth outlineColor={outlineColor} state={state} />
  }
}
