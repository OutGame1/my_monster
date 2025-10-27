// ========================================
// SHORT ARMS FOR PEAR BODY
// ========================================

import type { ReactNode } from 'react'

interface ShortArmsWithPearBodyProps {
  primaryColor: string
  outlineColor: string
}

export default function ShortArmsWithPearBody ({
  primaryColor,
  outlineColor
}: ShortArmsWithPearBodyProps): ReactNode {
  // Pear body: narrow shoulders at y~86-90, arms attach to narrow chest
  return (
    <g>
      {/* Left arm */}
      <g>
        {/* Upper arm - attached to narrow pear chest */}
        <rect
          x='52'
          y='84'
          width='12'
          height='28'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand/paw */}
        <ellipse
          cx='58'
          cy='114'
          rx='9'
          ry='7'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Finger nubs */}
        <circle cx='54' cy='118' r='2.5' fill={outlineColor} opacity='0.4' />
        <circle cx='62' cy='118' r='2.5' fill={outlineColor} opacity='0.4' />
      </g>

      {/* Right arm */}
      <g>
        {/* Upper arm - attached to narrow pear chest */}
        <rect
          x='136'
          y='84'
          width='12'
          height='28'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand/paw */}
        <ellipse
          cx='142'
          cy='114'
          rx='9'
          ry='7'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Finger nubs */}
        <circle cx='138' cy='118' r='2.5' fill={outlineColor} opacity='0.4' />
        <circle cx='146' cy='118' r='2.5' fill={outlineColor} opacity='0.4' />
      </g>
    </g>
  )
}
