// ========================================
// LONG LEGS - blocky LANKY STYLE
// ========================================

import type { ReactNode } from 'react'

interface LongLegsProps {
  primaryColor: string
  secondaryColor: string
  outlineColor: string
}

export default function LongLegs ({
  primaryColor,
  secondaryColor,
  outlineColor
}: LongLegsProps): ReactNode {
  return (
    <g>
      {/* Left leg */}
      <g>
        {/* Upper leg */}
        <rect
          x='78'
          y='150'
          width='12'
          height='18'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Knee joint */}
        <circle
          cx='84'
          cy='168'
          r='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        {/* Lower leg */}
        <rect
          x='80'
          y='168'
          width='10'
          height='14'
          rx='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Foot - elongated */}
        <ellipse
          cx='85'
          cy='184'
          rx='12'
          ry='6'
          fill={secondaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Ankle detail */}
        <rect
          x='82'
          y='179'
          width='6'
          height='4'
          rx='1'
          fill={primaryColor}
          opacity='0.5'
        />
      </g>

      {/* Right leg */}
      <g>
        {/* Upper leg */}
        <rect
          x='110'
          y='150'
          width='12'
          height='18'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Knee joint */}
        <circle
          cx='116'
          cy='168'
          r='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        {/* Lower leg */}
        <rect
          x='110'
          y='168'
          width='10'
          height='14'
          rx='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Foot - elongated */}
        <ellipse
          cx='115'
          cy='184'
          rx='12'
          ry='6'
          fill={secondaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Ankle detail */}
        <rect
          x='112'
          y='179'
          width='6'
          height='4'
          rx='1'
          fill={primaryColor}
          opacity='0.5'
        />
      </g>
    </g>
  )
}
