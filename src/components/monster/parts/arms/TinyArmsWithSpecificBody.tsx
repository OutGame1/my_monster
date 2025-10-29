import type { ReactNode } from 'react'
import type { SpecificBodyArmsProps } from '@/components/monster/parts/Arms'

export default function TinyArmsWithSpecificBody ({
  armsXPos,
  armsYPos,
  armsSpacing,
  armsRotationDegree,
  primaryColor,
  outlineColor,
  className
}: SpecificBodyArmsProps): ReactNode {
  // Specific values for tiny arms
  const armsCx = 8
  const armsCy = 18
  const handRadius = 5
  const fingersRadius = 2.5

  const leftArmCx = armsXPos - armsSpacing
  const leftArmTransform = `rotate(${-armsRotationDegree} ${leftArmCx} ${armsYPos})`
  const rightArmCx = armsXPos + armsSpacing
  const rightArmTransform = `rotate(${armsRotationDegree} ${rightArmCx} ${armsYPos})`

  const handsCy = armsYPos - armsCy

  const leftFinger1Cx = leftArmCx - handRadius + 1
  const leftFinger2Cx = leftArmCx + handRadius - 1
  const leftFingersCy = handsCy - handRadius

  const rightFinger1Cx = rightArmCx - handRadius + 1
  const rightFinger2Cx = rightArmCx + handRadius - 1
  const rightFingersCy = handsCy - handRadius

  return (
    <g>
      {/* Left tiny arm */}
      <g className={className}>
        {/* Arm nub - positioned on round body side */}
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
        {/* Little hand */}
        <circle
          cx={leftArmCx}
          cy={handsCy}
          r={handRadius}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={2}
          transform={leftArmTransform}
        />
        {/* Tiny finger dots */}
        <circle
          cx={leftFinger1Cx}
          cy={leftFingersCy}
          r={fingersRadius}
          fill={outlineColor}
          transform={leftArmTransform}
        />
        <circle
          cx={leftFinger2Cx}
          cy={leftFingersCy}
          r={fingersRadius}
          fill={outlineColor}
          transform={leftArmTransform}
        />
      </g>

      {/* Right tiny arm */}
      <g className={className}>
        {/* Arm nub - positioned on round body side */}
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
        {/* Little hand */}
        <circle
          cx={rightArmCx}
          cy={handsCy}
          r={handRadius}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={2.5}
          transform={rightArmTransform}
        />
        {/* Tiny finger dots */}
        <circle
          cx={rightFinger1Cx}
          cy={rightFingersCy}
          r={fingersRadius}
          fill={outlineColor}
          transform={rightArmTransform}
        />
        <circle
          cx={rightFinger2Cx}
          cy={rightFingersCy}
          r={fingersRadius}
          fill={outlineColor}
          transform={rightArmTransform}
        />
      </g>
    </g>
  )
}
