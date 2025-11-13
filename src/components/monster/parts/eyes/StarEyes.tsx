// ========================================
// STAR EYES - SPARKLY MAGICAL STYLE
// ========================================

import type { ReactNode } from 'react'
import type { MonsterState } from '@/types/monsters'

interface StarEyesProps {
  outlineColor: string
  state: MonsterState | null
}

export default function StarEyes ({
  outlineColor,
  state
}: StarEyesProps): ReactNode {
  if (state === 'sleepy') {
    return (
      <g>
        <line x1='82' y1='48' x2='98' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
        <line x1='102' y1='48' x2='118' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
      </g>
    )
  }

  const starY = state === 'sad' ? 50 : 48
  const animationClass = state === 'gamester' ? 'animate-gaming-eyes' : undefined

  return (
    <g className={animationClass}>
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

      {/* Tears for sad state */}
      {state === 'sad' && (
        <g className='animate-tears'>
          <ellipse cx='88' cy='57' rx='2' ry='3' fill='#4DB8E8' opacity='0.8' />
          <ellipse cx='112' cy='57' rx='2' ry='3' fill='#4DB8E8' opacity='0.8' />
        </g>
      )}
    </g>
  )
}
