// ========================================
// TINY ARMS - MAIN SWITCH
// ========================================
// Routes to body-specific tiny arm variations

import type { ReactNode } from 'react'
import type { SpecificArmsProps } from '@/components/monster/parts/Arms'
import TinyArmsWithSpecificBody from './TinyArmsWithSpecificBody'

export default function TinyArms ({
  bodyShape,
  primaryColor,
  outlineColor,
  className
}: SpecificArmsProps): ReactNode {
  switch (bodyShape) {
    case 'round':
      return (
        <TinyArmsWithSpecificBody
          armsXPos={100}
          armsYPos={85}
          armsSpacing={40}
          armsRotationDegree={45}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )

    case 'pear':
      return (
        <TinyArmsWithSpecificBody
          armsXPos={100}
          armsYPos={95}
          armsSpacing={30}
          armsRotationDegree={75}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )

    case 'blocky':
      return (
        <TinyArmsWithSpecificBody
          armsXPos={100}
          armsYPos={105}
          armsSpacing={35}
          armsRotationDegree={155}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )
  }
}
