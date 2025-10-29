import type { ReactNode } from 'react'
import type { SpecificArmsProps } from '@/components/monster/parts/Arms'
import LongArmsWithSpecificBody from './LongArmsWithSpecificBody'

export default function LongArms ({
  bodyShape,
  primaryColor,
  outlineColor,
  className
}: SpecificArmsProps): ReactNode {
  switch (bodyShape) {
    case 'round':
      return (
        <LongArmsWithSpecificBody
          armsXPos={100}
          armsYPos={105}
          armsSpacing={45}
          armsRotationDegree={25}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )

    case 'pear':
      return (
        <LongArmsWithSpecificBody
          armsXPos={100}
          armsYPos={100}
          armsSpacing={43}
          armsRotationDegree={45}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )

    case 'blocky':
      return (
        <LongArmsWithSpecificBody
          armsXPos={100}
          armsYPos={105}
          armsSpacing={40}
          armsRotationDegree={15}
          primaryColor={primaryColor}
          outlineColor={outlineColor}
          className={className}
        />
      )
  }
}
