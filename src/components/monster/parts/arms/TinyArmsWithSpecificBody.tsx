import { invoke } from '@/lib/utilities'
import type { ReactNode } from 'react'

interface TinyArmsWithSpecificBodyProps {
  armsXPos: number
  armsYPos: number
  armsSpacing: number
  armsRotationDegree: number
  primaryColor: string
  outlineColor: string
  animation: string
}

export default function TinyArmsWithSpecificBody ({
  armsXPos,
  armsYPos,
  armsSpacing,
  armsRotationDegree,
  primaryColor,
  outlineColor,
  animation
}: TinyArmsWithSpecificBodyProps): ReactNode {
  // Specific values for tiny arms
  const armsRx = 8
  const armsRy = 18
  const handRadius = 5
  const fingerRadius = 2.5

  const leftArmCx = armsXPos - armsSpacing
  const leftArmTransform = `rotate(${-armsRotationDegree} ${leftArmCx} ${armsYPos})`
  const rightArmCx = armsXPos + armsSpacing
  const rightArmTransform = `rotate(${armsRotationDegree} ${rightArmCx} ${armsYPos})`

  // CSS animation class based on animation state
  const animationClass = invoke(() => {
    switch (animation) {
      case 'happy':
        return 'animate-wave-arms'
      case 'playing':
        return 'animate-wiggle-arms'
    }
  })

  const leftHandCy = armsYPos - armsRy
  const rightHandCy = armsYPos - armsRy

  const leftFinger1Cx = leftArmCx - handRadius + 1
  const leftFinger2Cx = leftArmCx + handRadius - 1
  const leftFingersCy = leftHandCy - handRadius

  const rightFinger1Cx = rightArmCx - handRadius + 1
  const rightFinger2Cx = rightArmCx + handRadius - 1
  const rightFingersCy = rightHandCy - handRadius

  return (
    <g>
      {/* Left tiny arm */}
      <g className={animationClass}>
        {/* Arm nub - positioned on round body side */}
        <ellipse
          cx={leftArmCx}
          cy={armsYPos}
          rx={armsRx}
          ry={armsRy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={3}
          transform={leftArmTransform}
        />
        {/* Little hand */}
        <circle
          cx={leftArmCx}
          cy={leftHandCy}
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
          r={fingerRadius}
          fill={outlineColor}
          transform={leftArmTransform}
        />
        <circle
          cx={leftFinger2Cx}
          cy={leftFingersCy}
          r={fingerRadius}
          fill={outlineColor}
          transform={leftArmTransform}
        />
      </g>

      {/* Right tiny arm */}
      <g className={animationClass}>
        {/* Arm nub - positioned on round body side */}
        <ellipse
          cx={rightArmCx}
          cy={armsYPos}
          rx={armsRx}
          ry={armsRy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={3}
          transform={rightArmTransform}
        />
        {/* Little hand */}
        <circle
          cx={rightArmCx}
          cy={rightHandCy}
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
          r={fingerRadius}
          fill={outlineColor}
          transform={rightArmTransform}
        />
        <circle
          cx={rightFinger2Cx}
          cy={rightFingersCy}
          r={fingerRadius}
          fill={outlineColor}
          transform={rightArmTransform}
        />
      </g>
    </g>
  )
}
