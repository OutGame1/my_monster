// ========================================
// SHORT ARMS - MAIN SWITCH
// ========================================
// Routes to body-specific short arm variations

import type { ReactNode } from 'react'
import type { SpecificArmsProps } from '../Arms'
import ShortArmsWithRoundBody from './short/ShortArmsWithRoundBody'
import ShortArmsWithPearBody from './short/ShortArmsWithPearBody'
import ShortArmsWithTallBody from './short/ShortArmsWithTallBody'

export default function ShortArms ({
  bodyShape,
  primaryColor,
  outlineColor,
  animation
}: SpecificArmsProps): ReactNode {
  switch (bodyShape) {
    case 'round':
      return (
        <ShortArmsWithRoundBody
          primaryColor={primaryColor}
          outlineColor={outlineColor}
        />
      )

    case 'pear':
      return (
        <ShortArmsWithPearBody
          primaryColor={primaryColor}
          outlineColor={outlineColor}
        />
      )

    case 'tall':
      return (
        <ShortArmsWithTallBody
          primaryColor={primaryColor}
          outlineColor={outlineColor}
        />
      )
  }
}
