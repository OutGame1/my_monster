// ========================================
// SMILE MOUTH - HAPPY CURVED STYLE
// ========================================

import type { ReactNode } from 'react'
import { type AnimationState } from '@/monster/types'

interface SmileMouthProps {
  outlineColor: string
  animation: AnimationState
}

export default function SmileMouth ({
  outlineColor,
  animation
}: SmileMouthProps): ReactNode {
  const strokeWidth = 3.5

  if (animation === 'sad') {
    return (
      <path
        d='M 82 62 Q 100 56 118 62'
        fill='none'
        stroke={outlineColor}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
    )
  }

  if (animation === 'eating') {
    return (
      <g>
        <ellipse cx='100' cy='60' rx='10' ry='6' fill={outlineColor} />
        <ellipse cx='100' cy='59' rx='6' ry='3' fill='#FF6B9D' />
      </g>
    )
  }

  const curveY = animation === 'happy' ? 68 : 66

  return (
    <path
      d={`M 82 58 Q 100 ${curveY} 118 58`}
      fill='none'
      stroke={outlineColor}
      strokeWidth={strokeWidth}
      strokeLinecap='round'
    />
  )
}
