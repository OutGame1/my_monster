// ========================================
// NEUTRAL MOUTH - STRAIGHT/SLIGHT CURVE
// ========================================

import type { ReactNode } from 'react'
import { MonsterState } from '@/db/models/monster.model'

interface NeutralMouthProps {
  outlineColor: string
  animation: MonsterState | null
}

export default function NeutralMouth ({
  outlineColor,
  animation
}: NeutralMouthProps): ReactNode {
  const strokeWidth = 3.5

  switch (animation) {
    case 'sad':
      return (
        <path
          d='M 85 62 Q 100 57 115 62'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      )
    case 'hungry':
      return (
        <g>
          <ellipse cx='100' cy='60' rx='8' ry='5' fill={outlineColor} />
          <line x1='94' y1='60' x2='106' y2='60' stroke='#FFFFFF' strokeWidth='2' />
        </g>
      )
    case 'happy':
      return (
        <path
          d='M 88 60 Q 100 64 112 60'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      )
    default:
      return (
        <line
          x1='88'
          y1='60'
          x2='112'
          y2='60'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      )
  }
}
