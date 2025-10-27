// ========================================
// SHORT ARMS FOR TALL BODY
// ========================================

import type { ReactNode } from 'react'

interface ShortArmsWithTallBodyProps {
  primaryColor: string
  outlineColor: string
}

export default function ShortArmsWithTallBody ({
  primaryColor,
  outlineColor
}: ShortArmsWithTallBodyProps): ReactNode {
  // Tall body: rectangular shoulders at y~82-96, more robotic attachment
  return (
    <g>
      {/* Left arm */}
      <g>
        {/* Upper arm - attached to tall rectangular body */}
        <rect
          x='50'
          y='88'
          width='13'
          height='24'
          rx='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand/paw - slightly blocky for tall body */}
        <rect
          x='52'
          y='112'
          width='9'
          height='10'
          rx='4'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Finger nubs */}
        <circle cx='54' cy='120' r='2' fill={outlineColor} opacity='0.4' />
        <circle cx='59' cy='120' r='2' fill={outlineColor} opacity='0.4' />
      </g>

      {/* Right arm */}
      <g>
        {/* Upper arm - attached to tall rectangular body */}
        <rect
          x='137'
          y='88'
          width='13'
          height='24'
          rx='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand/paw - slightly blocky for tall body */}
        <rect
          x='139'
          y='112'
          width='9'
          height='10'
          rx='4'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Finger nubs */}
        <circle cx='141' cy='120' r='2' fill={outlineColor} opacity='0.4' />
        <circle cx='146' cy='120' r='2' fill={outlineColor} opacity='0.4' />
      </g>
    </g>
  )
}
