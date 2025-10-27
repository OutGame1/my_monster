// ========================================
// STAR EYES - SPARKLY MAGICAL STYLE
// ========================================

import type { ReactNode } from 'react'
import { type AnimationState } from '@/monster/types'

interface StarEyesProps {
  outlineColor: string
  animation: AnimationState
}

export default function StarEyes ({
  outlineColor,
  animation
}: StarEyesProps): ReactNode {
  const isAsleep = animation === 'sleeping'
  const isSad = animation === 'sad'

  if (isAsleep) {
    return (
      <g>
        <line x1='82' y1='48' x2='98' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
        <line x1='102' y1='48' x2='118' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
      </g>
    )
  }

  const starY = isSad ? 50 : 48

  return (
    <g>
      {/* Left star eye */}
      <g transform={`translate(88, ${starY})`}>
        <path
          d='M 0,-7 L -2,-2 L -7,0 L -2,2 L 0,7 L 2,2 L 7,0 L 2,-2 Z'
          fill='#FFFFFF'
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        <circle cx='0' cy='0' r='2.5' fill={outlineColor} />
        <circle cx='1' cy='-1' r='1.2' fill='#FFFFFF' />
      </g>

      {/* Right star eye */}
      <g transform={`translate(112, ${starY})`}>
        <path
          d='M 0,-7 L -2,-2 L -7,0 L -2,2 L 0,7 L 2,2 L 7,0 L 2,-2 Z'
          fill='#FFFFFF'
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        <circle cx='0' cy='0' r='2.5' fill={outlineColor} />
        <circle cx='1' cy='-1' r='1.2' fill='#FFFFFF' />
      </g>
    </g>
  )
}
