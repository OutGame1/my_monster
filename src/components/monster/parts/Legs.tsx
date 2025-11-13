// ========================================
// MONSTER LEGS COMPONENT - MAIN SWITCH
// ========================================
// Routes to specific leg type sub-components

import type { ReactNode } from 'react'
import StumpyLegs from './legs/StumpyLegs'
import LongLegs from './legs/LongLegs'
import BigFeetLegs from './legs/BigFeetLegs'
import type { MonsterLegType, MonsterState } from '@/types/monsters'

interface LegsProps {
  type: MonsterLegType
  primaryColor: string
  secondaryColor: string
  outlineColor: string
  state: MonsterState | null
}

export default function Legs ({
  type,
  primaryColor,
  secondaryColor,
  outlineColor,
  state
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
