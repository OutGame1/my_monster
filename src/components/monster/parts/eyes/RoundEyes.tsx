// ========================================
// ROUND EYES - CLASSIC CARTOON STYLE
// ========================================

import type { ReactNode } from 'react'
import type { MonsterState } from '@/types/monsters'

interface RoundEyesProps {
  outlineColor: string
  state: MonsterState | null
}

export default function RoundEyes ({
  outlineColor,
  state
}: RoundEyesProps): ReactNode {
  if (state === 'sleepy') {
    return (
      <g>
        <line x1='82' y1='48' x2='98' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
        <line x1='102' y1='48' x2='118' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
      </g>
    )
  }

  const eyeY = state === 'sad' ? 50 : 48
  const animationClass = state === 'gamester' ? 'animate-gaming-eyes' : undefined

  return (
    <g className={animationClass}>
      {/* Left eye */}
      <circle cx='88' cy={eyeY} r='10' fill='#FFFFFF' stroke={outlineColor} strokeWidth='3' />
      <circle cx='90' cy={eyeY} r='6' fill={outlineColor} />
      <circle cx='92' cy={eyeY - 2} r='2.5' fill='#FFFFFF' />

      {/* Right eye */}
      <circle cx='112' cy={eyeY} r='10' fill='#FFFFFF' stroke={outlineColor} strokeWidth='3' />
      <circle cx='114' cy={eyeY} r='6' fill={outlineColor} />
      <circle cx='116' cy={eyeY - 2} r='2.5' fill='#FFFFFF' />

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
