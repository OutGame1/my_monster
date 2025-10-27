// ========================================
// BIG FEET - CLOWN/DUCK STYLE
// ========================================

import type { ReactNode } from 'react'

interface BigFeetLegsProps {
  primaryColor: string
  secondaryColor: string
  outlineColor: string
}

export default function BigFeetLegs ({
  primaryColor,
  secondaryColor,
  outlineColor
}: BigFeetLegsProps): ReactNode {
  return (
    <g>
      {/* Left leg */}
      <g>
        {/* Short leg */}
        <rect
          x='78'
          y='148'
          width='13'
          height='26'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Massive foot */}
        <ellipse
          cx='84'
          cy='178'
          rx='16'
          ry='9'
          fill={secondaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Toes - three big ones */}
        <ellipse cx='74' cy='182' rx='4' ry='5' fill={secondaryColor} stroke={outlineColor} strokeWidth='2' />
        <ellipse cx='84' cy='184' rx='4' ry='6' fill={secondaryColor} stroke={outlineColor} strokeWidth='2' />
        <ellipse cx='94' cy='182' rx='4' ry='5' fill={secondaryColor} stroke={outlineColor} strokeWidth='2' />
        {/* Toe nails */}
        <ellipse cx='74' cy='180' rx='2' ry='1.5' fill={outlineColor} opacity='0.6' />
        <ellipse cx='84' cy='182' rx='2' ry='1.5' fill={outlineColor} opacity='0.6' />
        <ellipse cx='94' cy='180' rx='2' ry='1.5' fill={outlineColor} opacity='0.6' />
      </g>

      {/* Right leg */}
      <g>
        {/* Short leg */}
        <rect
          x='109'
          y='148'
          width='13'
          height='26'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Massive foot */}
        <ellipse
          cx='116'
          cy='178'
          rx='16'
          ry='9'
          fill={secondaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Toes - three big ones */}
        <ellipse cx='106' cy='182' rx='4' ry='5' fill={secondaryColor} stroke={outlineColor} strokeWidth='2' />
        <ellipse cx='116' cy='184' rx='4' ry='6' fill={secondaryColor} stroke={outlineColor} strokeWidth='2' />
        <ellipse cx='126' cy='182' rx='4' ry='5' fill={secondaryColor} stroke={outlineColor} strokeWidth='2' />
        {/* Toe nails */}
        <ellipse cx='106' cy='180' rx='2' ry='1.5' fill={outlineColor} opacity='0.6' />
        <ellipse cx='116' cy='182' rx='2' ry='1.5' fill={outlineColor} opacity='0.6' />
        <ellipse cx='126' cy='180' rx='2' ry='1.5' fill={outlineColor} opacity='0.6' />
      </g>
    </g>
  )
}
