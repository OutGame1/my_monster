// ========================================
// ROUND EYES - CLASSIC CARTOON STYLE
// ========================================

import type { ReactNode } from 'react'
import { type AnimationState } from '@/monster/types'

interface RoundEyesProps {
  outlineColor: string
  animation: AnimationState
}

export default function RoundEyes ({
  outlineColor,
  animation
}: RoundEyesProps): ReactNode {
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

  const eyeY = isSad ? 50 : 48

  return (
    <g>
      {/* Left eye */}
      <circle cx='88' cy={eyeY} r='10' fill='#FFFFFF' stroke={outlineColor} strokeWidth='3' />
      <circle cx='90' cy={eyeY} r='6' fill={outlineColor} />
      <circle cx='92' cy={eyeY - 2} r='2.5' fill='#FFFFFF' />

      {/* Right eye */}
      <circle cx='112' cy={eyeY} r='10' fill='#FFFFFF' stroke={outlineColor} strokeWidth='3' />
      <circle cx='114' cy={eyeY} r='6' fill={outlineColor} />
      <circle cx='116' cy={eyeY - 2} r='2.5' fill='#FFFFFF' />
    </g>
  )
}
