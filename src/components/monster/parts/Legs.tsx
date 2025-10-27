// ========================================
// MONSTER LEGS COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific leg type sub-components

import type { ReactNode } from 'react'
import { type LegType, type AnimationState } from '@/monster/types'
import StumpyLegs from './legs/StumpyLegs'
import LongLegs from './legs/LongLegs'
import BigFeetLegs from './legs/BigFeetLegs'

interface LegsProps {
  type: LegType
  primaryColor: string
  secondaryColor: string
  outlineColor: string
  animation: AnimationState
}

export default function Legs ({
  type,
  primaryColor,
  secondaryColor,
  outlineColor,
  animation
}: LegsProps): ReactNode {
  // Animation could affect leg position in the future
  // For now, just route to the appropriate leg component

  switch (type) {
    case 'stumpy':
      return (
        <StumpyLegs
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
        />
      )

    case 'long':
      return (
        <LongLegs
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
        />
      )

    case 'feet':
      return (
        <BigFeetLegs
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          outlineColor={outlineColor}
        />
      )
  }
}
