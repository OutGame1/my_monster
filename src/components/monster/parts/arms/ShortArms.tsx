// ========================================
// SHORT ARMS - MAIN SWITCH
// ========================================
// Routes to body-specific short arm variations

import type { ReactNode } from 'react'
import type { SpecificArmsProps } from '@/components/monster/parts/Arms'
import ShortArmsWithSpecificBody from './ShortArmsWithSpecificBody'

export default function ShortArms ({
  bodyShape,
  primaryColor,
  outlineColor,
  className
}: SpecificArmsProps): ReactNode {
  switch (bodyShape) {
    case 'round':
      return (
        <ShortArmsWithSpecificBody
          armsXPos={100}
          armsYPos={105}
          armsSpacing={50}
          armsRotationDegree={30}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )

    case 'pear':
      return (
        <ShortArmsWithSpecificBody
          armsXPos={100}
          armsYPos={97}
          armsSpacing={40}
          armsRotationDegree={50}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )

    case 'tall':
      return (
        <ShortArmsWithSpecificBody
          armsXPos={100}
          armsYPos={105}
          armsSpacing={40}
          armsRotationDegree={25}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )
  }
}
