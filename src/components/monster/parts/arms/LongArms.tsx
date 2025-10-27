// ========================================
// LONG ARMS - MAIN SWITCH
// ========================================
// Routes to body-specific long arm variations

import type { ReactNode } from 'react'
import type { SpecificArmsProps } from '../Arms'
import LongArmsWithRoundBody from './long/LongArmsWithRoundBody'
import LongArmsWithPearBody from './long/LongArmsWithPearBody'
import LongArmsWithTallBody from './long/LongArmsWithTallBody'

export default function LongArms ({
  bodyShape,
  primaryColor,
  outlineColor,
  animation
}: SpecificArmsProps): ReactNode {
  switch (bodyShape) {
    case 'round':
      return (
        <LongArmsWithRoundBody
          primaryColor={primaryColor}
          outlineColor={outlineColor}
        />
      )

    case 'pear':
      return (
        <LongArmsWithPearBody
          primaryColor={primaryColor}
          outlineColor={outlineColor}
        />
      )

    case 'tall':
      return (
        <LongArmsWithTallBody
          primaryColor={primaryColor}
          outlineColor={outlineColor}
        />
      )
  }
}
