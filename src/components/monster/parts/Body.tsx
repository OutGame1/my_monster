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
  animation: MonsterState | null
}

export default function Body ({
  shape,
  primaryColor,
  secondaryColor,
  outlineColor,
  animation
}: BodyProps): ReactNode {
  // Animation could affect body posture in the future
  // For now, just route to the appropriate body component

  switch (shape) {
    case 'round':
      return (
        <RoundBody
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
        />
      )

    case 'pear':
      return (
        <PearBody
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
        />
      )

    case 'tall':
      return (
        <TallBody
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
        />
      )
  }
}
