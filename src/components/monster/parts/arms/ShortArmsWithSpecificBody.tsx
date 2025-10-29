import type { ReactNode } from 'react'
import type { SpecificBodyArmsProps } from '@/components/monster/parts/Arms'

export default function ShortArmsWithSpecificBody ({
  armsXPos,
  armsYPos,
  armsSpacing,
  armsRotationDegree,
  primaryColor,
  outlineColor,
  className
}: SpecificBodyArmsProps): ReactNode {
  // Specific values for short arms
  const armsCx = 8
  const armsCy = 20
  const handsRx = 9
  const handsRy = 7
  const fingersRadius = 3

  const leftArmCx = armsXPos - armsSpacing
  const leftArmTransform = `rotate(${armsRotationDegree} ${leftArmCx} ${armsYPos})`
  const rightArmCx = armsXPos + armsSpacing
  const rightArmTransform = `rotate(${-armsRotationDegree} ${rightArmCx} ${armsYPos})`

  const leftHandCx = armsXPos - armsSpacing
  const rightHandCx = armsXPos + armsSpacing
  const handsCy = armsYPos + armsCy + handsRy - 2

  const leftFinger1Cx = leftArmCx - handsRy + 1
  const leftFinger2Cx = leftArmCx + handsRy - 1
  const rightFinger1Cx = rightArmCx - handsRy + 1
  const rightFinger2Cx = rightArmCx + handsRy - 1
  const fingersCy = handsCy + handsRx

  return (
    <g>
      {/* Left arm */}
      <g className={className}>
        {/* Upper arm - attached to round body side */}
        <ellipse
          cx={leftArmCx}
          cy={armsYPos}
          rx={armsCx}
          ry={armsCy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={3}
          transform={leftArmTransform}
        />
        {/* Hand/paw */}
        <ellipse
          cx={leftHandCx}
          cy={handsCy}
          rx={handsRx}
          ry={handsRy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={3}
          transform={leftArmTransform}
        />
        {/* Finger nubs */}
        <circle
          cx={leftFinger1Cx}
          cy={fingersCy}
          r={fingersRadius}
          fill={outlineColor}
          opacity={0.4}
          transform={leftArmTransform}
        />
        <circle
          cx={leftFinger2Cx}
          cy={fingersCy}
          r={fingersRadius}
          fill={outlineColor}
          opacity={0.4}
          transform={leftArmTransform}
        />
      </g>

      {/* Right arm */}
      <g className={className}>
        {/* Upper arm - attached to round body side */}
        <ellipse
          cx={rightArmCx}
          cy={armsYPos}
          rx={armsCx}
          ry={armsCy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={3}
          transform={rightArmTransform}
        />
        {/* Hand/paw */}
        <ellipse
          cx={rightHandCx}
          cy={handsCy}
          rx={handsRx}
          ry={handsRy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={3}
          transform={rightArmTransform}
        />
        {/* Finger nubs */}
        <circle
          cx={rightFinger1Cx}
          cy={fingersCy}
          r={fingersRadius}
          fill={outlineColor}
          opacity={0.4}
          transform={rightArmTransform}
        />
        <circle
          cx={rightFinger2Cx}
          cy={fingersCy}
          r={fingersRadius}
          fill={outlineColor}
          opacity={0.4}
          transform={rightArmTransform}
        />
      </g>
    </g>
  )
}
