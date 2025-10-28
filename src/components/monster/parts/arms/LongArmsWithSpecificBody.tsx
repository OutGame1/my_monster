import type { ReactNode } from 'react'
import type { SpecificBodyArmsProps } from '@/components/monster/parts/Arms'

export default function LongArmsWithSpecificBody ({
  armsXPos,
  armsYPos,
  armsSpacing,
  armsRotationDegree,
  primaryColor,
  outlineColor,
  className
}: SpecificBodyArmsProps): ReactNode {
  // Specific values for long arms
  const armsCx = 8
  const armsCy = 20
  const armsStrokeWidth = 3
  const elbowsRadius = 6
  const handsRx = 10
  const handsRy = 8
  const fingersWidth = 3
  const fingersHeight = 6

  const leftArmCx = armsXPos - armsSpacing
  const rightArmCx = armsXPos + armsSpacing

  const elbowsCy = armsYPos + armsCy - armsStrokeWidth

  // Calculate rotated elbow positions
  const leftAngleRad = (armsRotationDegree * Math.PI) / 180
  const rightAngleRad = (-armsRotationDegree * Math.PI) / 180

  const localElbowOffset = elbowsCy - armsYPos
  const leftElbowX = leftArmCx - localElbowOffset * Math.sin(leftAngleRad)
  const leftElbowY = armsYPos + localElbowOffset * Math.cos(leftAngleRad)
  const rightElbowX = rightArmCx - localElbowOffset * Math.sin(rightAngleRad)
  const rightElbowY = armsYPos + localElbowOffset * Math.cos(rightAngleRad)

  const leftArmTransform = `rotate(${armsRotationDegree} ${leftArmCx} ${armsYPos})`
  const rightArmTransform = `rotate(${-armsRotationDegree} ${rightArmCx} ${armsYPos})`

  const forearmsRx = armsCx * 0.8
  const forearmsRy = armsCy * 0.75

  // Forearms positioned relative to rotated elbow
  const leftForearmCy = leftElbowY + forearmsRy + elbowsRadius - 2
  const rightForearmCy = rightElbowY + forearmsRy + elbowsRadius - 2

  const leftHandCy = leftElbowY + 2 * forearmsRy + armsStrokeWidth
  const rightHandCy = rightElbowY + 2 * forearmsRy + armsStrokeWidth

  const leftFingersY = leftHandCy + handsRy - 2
  const rightFingersY = rightHandCy + handsRy - 2

  const midleFingersHeight = fingersHeight + 1
  const leftFinger1X = leftElbowX - 7
  const leftFinger2X = leftFinger1X + 6
  const leftFinger3X = leftFinger2X + 6
  const rightFinger1X = rightElbowX - 7
  const rightFinger2X = rightFinger1X + 6
  const rightFinger3X = rightFinger2X + 6

  return (
    <g>
      {/* Left arm */}
      <g className={className}>
        {/* Upper arm segment */}
        <ellipse
          cx={leftArmCx}
          cy={armsYPos}
          rx={armsCx}
          ry={armsCy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={armsStrokeWidth}
          transform={leftArmTransform}
        />
        {/* Forearm segment */}
        <ellipse
          cx={leftElbowX}
          cy={leftForearmCy}
          rx={forearmsRx}
          ry={forearmsRy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={armsStrokeWidth}
        />
        {/* Elbow joint */}
        <circle
          cx={leftArmCx}
          cy={elbowsCy}
          r={elbowsRadius}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={2.5}
          transform={leftArmTransform}
        />
        {/* Hand with three fingers */}
        <ellipse
          cx={leftElbowX}
          cy={leftHandCy}
          rx={handsRx}
          ry={handsRy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={armsStrokeWidth}
        />
        <rect
          x={leftFinger1X}
          y={leftFingersY}
          width={fingersWidth}
          height={fingersHeight}
          rx={1.5}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <rect
          x={leftFinger2X}
          y={leftFingersY}
          width={fingersWidth}
          height={midleFingersHeight}
          rx={1.5}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <rect
          x={leftFinger3X}
          y={leftFingersY}
          width={fingersWidth}
          height={fingersHeight}
          rx={1.5}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={1.5}
        />
      </g>

      {/* Right arm */}
      <g className={className}>
        {/* Upper arm segment */}
        <ellipse
          cx={rightArmCx}
          cy={armsYPos}
          rx={armsCx}
          ry={armsCy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={armsStrokeWidth}
          transform={rightArmTransform}
        />
        {/* Forearm segment */}
        <ellipse
          cx={rightElbowX}
          cy={rightForearmCy}
          rx={forearmsRx}
          ry={forearmsRy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={armsStrokeWidth}
        />
        {/* Elbow joint */}
        <circle
          cx={rightArmCx}
          cy={elbowsCy}
          r={elbowsRadius}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={2.5}
          transform={rightArmTransform}
        />
        {/* Hand with three fingers */}
        <ellipse
          cx={rightElbowX}
          cy={rightHandCy}
          rx={handsRx}
          ry={handsRy}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={armsStrokeWidth}
        />
        <rect
          x={rightFinger1X}
          y={rightFingersY}
          width={fingersWidth}
          height={fingersHeight}
          rx={1.5}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <rect
          x={rightFinger2X}
          y={rightFingersY}
          width={fingersWidth}
          height={midleFingersHeight}
          rx={1.5}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <rect
          x={rightFinger3X}
          y={rightFingersY}
          width={fingersWidth}
          height={fingersHeight}
          rx={1.5}
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={1.5}
        />
      </g>
    </g>
  )
}
