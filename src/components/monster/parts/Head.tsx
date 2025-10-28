// ========================================
// MONSTER HEAD COMPONENT - UNDERTALE PIXEL STYLE
// ========================================
// Separate head component for better structure

import type { ReactNode } from 'react'
import type { MonsterBodyShape } from '@/db/models/monster.model'

interface HeadProps {
  bodyShape: MonsterBodyShape
  primaryColor: string
  secondaryColor: string
  outlineColor: string
}

export default function Head ({
  bodyShape,
  primaryColor,
  secondaryColor,
  outlineColor
}: HeadProps): ReactNode {
  const strokeWidth = 4

  // Round head for round body
  if (bodyShape === 'round') {
    return (
      <g>
        {/* Main round head */}
        <circle
          cx='100'
          cy='50'
          r='26'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
        {/* Cheek spots */}
        <circle cx='80' cy='55' r='6' fill={secondaryColor} opacity='0.6' />
        <circle cx='120' cy='55' r='6' fill={secondaryColor} opacity='0.6' />
      </g>
    )
  }

  // Oval head for pear body
  if (bodyShape === 'pear') {
    return (
      <g>
        {/* Oval head */}
        <ellipse
          cx='100'
          cy='48'
          rx='24'
          ry='28'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
        {/* Ear nubs */}
        <circle
          cx='78'
          cy='40'
          r='8'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={strokeWidth * 0.8}
        />
        <circle
          cx='122'
          cy='40'
          r='8'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth={strokeWidth * 0.8}
        />
        {/* Inner ear color */}
        <circle cx='78' cy='40' r='4' fill={secondaryColor} />
        <circle cx='122' cy='40' r='4' fill={secondaryColor} />
      </g>
    )
  }

  // Square head for tall body
  return (
    <g>
      {/* Square head */}
      <rect
        x='76'
        y='24'
        width='48'
        height='48'
        rx='8'
        fill={primaryColor}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />
      {/* Forehead marking */}
      <rect
        x='88'
        y='32'
        width='24'
        height='8'
        rx='2'
        fill={secondaryColor}
        stroke={outlineColor}
        strokeWidth={strokeWidth * 0.6}
      />
      {/* Side details */}
      <circle cx='80' cy='50' r='5' fill={secondaryColor} />
      <circle cx='120' cy='50' r='5' fill={secondaryColor} />
    </g>
  )
}
