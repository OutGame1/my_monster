// ========================================
// SHORT ARMS FOR ROUND BODY
// ========================================

import type { ReactNode } from 'react'

interface ShortArmsWithRoundBodyProps {
  primaryColor: string
  outlineColor: string
}

export default function ShortArmsWithRoundBody ({
  primaryColor,
  outlineColor
}: ShortArmsWithRoundBodyProps): ReactNode {
  // Round body: shoulders at y~95, arms need to attach to sides of round body (x~60, x~140)
  return (
    <g>
      {/* Left arm */}
      <g>
        {/* Upper arm - attached to round body side */}
        <rect
          x='54'
          y='92'
          width='12'
          height='26'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand/paw */}
        <ellipse
          cx='60'
          cy='120'
          rx='9'
          ry='7'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Finger nubs */}
        <circle cx='56' cy='124' r='2.5' fill={outlineColor} opacity='0.4' />
        <circle cx='64' cy='124' r='2.5' fill={outlineColor} opacity='0.4' />
      </g>

      {/* Right arm */}
      <g>
        {/* Upper arm - attached to round body side */}
        <rect
          x='134'
          y='92'
          width='12'
          height='26'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand/paw */}
        <ellipse
          cx='140'
          cy='120'
          rx='9'
          ry='7'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Finger nubs */}
        <circle cx='136' cy='124' r='2.5' fill={outlineColor} opacity='0.4' />
        <circle cx='144' cy='124' r='2.5' fill={outlineColor} opacity='0.4' />
      </g>
    </g>
  )
}
