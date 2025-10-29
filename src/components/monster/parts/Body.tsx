// ========================================
// MONSTER BODY COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific body type sub-components

import type { ReactNode } from 'react'
import type { MonsterBodyShape, MonsterState } from '@/db/models/monster.model'
import RoundBody from './bodies/RoundBody'
import PearBody from './bodies/PearBody'
import TallBody from './bodies/TallBody'

interface BodyProps {
  shape: MonsterBodyShape
  primaryColor: string
  secondaryColor: string
  outlineColor: string
  state: MonsterState | null
}

export default function Body ({
  shape,
  primaryColor,
  secondaryColor,
  outlineColor,
  state
}: BodyProps): ReactNode {
  // Determine animation class based on state
  const stateClass = state === 'gamester' ? 'animate-bounce-body' : undefined

  switch (shape) {
    case 'round':
      return (
        <RoundBody
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
          className={stateClass}
        />
      )
    case 'pear':
      return (
        <PearBody
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
          className={stateClass}
        />
      )
    case 'blocky':
      return (
        <TallBody
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
          className={stateClass}
        />
      )
  }
}
