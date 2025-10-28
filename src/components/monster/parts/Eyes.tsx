// ========================================
// MONSTER EYES COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific eye type sub-components

import type { ReactNode } from 'react'
import type { MonsterEyeShape, MonsterState } from '@/db/models/monster.model'
import DotEyes from './eyes/DotEyes'
import RoundEyes from './eyes/RoundEyes'
import StarEyes from './eyes/StarEyes'

interface EyesProps {
  type: MonsterEyeShape
  outlineColor: string
  state: MonsterState | null
}

export default function Eyes ({ type, outlineColor, state }: EyesProps): ReactNode {
  switch (type) {
    case 'dot':
      return <DotEyes outlineColor={outlineColor} state={state} />

    case 'round':
      return <RoundEyes outlineColor={outlineColor} state={state} />

    case 'star':
      return <StarEyes outlineColor={outlineColor} state={state} />
  }
}
