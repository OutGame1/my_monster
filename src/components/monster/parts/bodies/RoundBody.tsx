// ========================================
// ROUND BODY - CUTE CHUBBY STYLE
// ========================================

import type { ReactNode } from 'react'

interface RoundBodyProps {
  primaryColor: string
  secondaryColor: string
  outlineColor: string
}

export default function RoundBody ({
  primaryColor,
  secondaryColor,
  outlineColor
}: RoundBodyProps): ReactNode {
  return (
    <g>
      {/* Neck connector */}
      <ellipse
        cx='100'
        cy='70'
        rx='16'
        ry='12'
        fill={primaryColor}
        stroke={outlineColor}
        strokeWidth='3'
      />

      {/* Main round body with slight bottom bulge */}
      <ellipse
        cx='100'
        cy='110'
        rx='42'
        ry='45'
        fill={primaryColor}
        stroke={outlineColor}
        strokeWidth='4'
      />

      {/* Belly patch - offset oval for depth */}
      <ellipse
        cx='100'
        cy='118'
        rx='26'
        ry='28'
        fill={secondaryColor}
        opacity='0.7'
      />

      {/* Chest markings - small circles for pattern */}
      <circle cx='88' cy='95' r='4' fill={secondaryColor} opacity='0.5' />
      <circle cx='112' cy='95' r='4' fill={secondaryColor} opacity='0.5' />

      {/* Side curves for roundness emphasis */}
      <ellipse
        cx='65'
        cy='110'
        rx='8'
        ry='22'
        fill={primaryColor}
        opacity='0.3'
      />
      <ellipse
        cx='135'
        cy='110'
        rx='8'
        ry='22'
        fill={primaryColor}
        opacity='0.3'
      />
    </g>
  )
}
