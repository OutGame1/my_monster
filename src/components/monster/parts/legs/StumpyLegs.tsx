// ========================================
// STUMPY LEGS - SHORT STABLE STYLE
// ========================================

import type { ReactNode } from 'react'

interface StumpyLegsProps {
  primaryColor: string
  secondaryColor: string
  outlineColor: string
}

export default function StumpyLegs ({
  primaryColor,
  secondaryColor,
  outlineColor
}: StumpyLegsProps): ReactNode {
  return (
    <g>
      {/* Left leg */}
      <g>
        {/* Thigh */}
        <rect
          x='76'
          y='148'
          width='14'
          height='22'
          rx='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Foot - rounded */}
        <ellipse
          cx='83'
          cy='172'
          rx='11'
          ry='7'
          fill={secondaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Toe detail */}
        <circle cx='78' cy='174' r='2' fill={outlineColor} opacity='0.4' />
        <circle cx='88' cy='174' r='2' fill={outlineColor} opacity='0.4' />
      </g>

      {/* Right leg */}
      <g>
        {/* Thigh */}
        <rect
          x='110'
          y='148'
          width='14'
          height='22'
          rx='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Foot - rounded */}
        <ellipse
          cx='117'
          cy='172'
          rx='11'
          ry='7'
          fill={secondaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Toe detail */}
        <circle cx='112' cy='174' r='2' fill={outlineColor} opacity='0.4' />
        <circle cx='122' cy='174' r='2' fill={outlineColor} opacity='0.4' />
      </g>
    </g>
  )
}
