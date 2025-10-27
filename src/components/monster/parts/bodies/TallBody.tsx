// ========================================
// TALL BODY - ELONGATED STYLE
// ========================================

import type { ReactNode } from 'react'

interface TallBodyProps {
  primaryColor: string
  secondaryColor: string
  outlineColor: string
}

export default function TallBody ({
  primaryColor,
  secondaryColor,
  outlineColor
}: TallBodyProps): ReactNode {
  return (
    <g>
      {/* Neck connector - rectangular */}
      <rect
        x='88'
        y='68'
        width='24'
        height='16'
        rx='3'
        fill={primaryColor}
        stroke={outlineColor}
        strokeWidth='3'
      />

      {/* Main tall body - vertical rectangle with rounded corners */}
      <rect
        x='70'
        y='82'
        width='60'
        height='68'
        rx='12'
        fill={primaryColor}
        stroke={outlineColor}
        strokeWidth='4'
      />

      {/* Torso panel - vertical stripe */}
      <rect
        x='88'
        y='90'
        width='24'
        height='52'
        rx='6'
        fill={secondaryColor}
        opacity='0.6'
      />

      {/* Shoulder plates */}
      <rect
        x='68'
        y='82'
        width='28'
        height='14'
        rx='4'
        fill={secondaryColor}
        opacity='0.5'
      />
      <rect
        x='104'
        y='82'
        width='28'
        height='14'
        rx='4'
        fill={secondaryColor}
        opacity='0.5'
      />

      {/* Chest segments - horizontal lines for robotic look */}
      <line x1='75' y1='100' x2='125' y2='100' stroke={outlineColor} strokeWidth='2' opacity='0.3' />
      <line x1='75' y1='115' x2='125' y2='115' stroke={outlineColor} strokeWidth='2' opacity='0.3' />
      <line x1='75' y1='130' x2='125' y2='130' stroke={outlineColor} strokeWidth='2' opacity='0.3' />

      {/* Belt/waist accent */}
      <rect
        x='70'
        y='135'
        width='60'
        height='8'
        fill={secondaryColor}
        opacity='0.8'
      />
      <circle cx='100' cy='139' r='3' fill={outlineColor} />

      {/* Side panels for dimension */}
      <rect
        x='70'
        y='92'
        width='6'
        height='48'
        rx='2'
        fill={primaryColor}
        opacity='0.5'
      />
      <rect
        x='124'
        y='92'
        width='6'
        height='48'
        rx='2'
        fill={primaryColor}
        opacity='0.5'
      />
    </g>
  )
}
