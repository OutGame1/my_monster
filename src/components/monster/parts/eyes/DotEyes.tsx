// ========================================
// DOT EYES - SIMPLE MINIMAL STYLE
// ========================================

import type { ReactNode } from 'react'
import type { MonsterState } from '@/db/models/monster.model'

interface DotEyesProps {
  outlineColor: string
  animation: MonsterState | null
}

export default function DotEyes ({
  outlineColor,
  animation
}: DotEyesProps): ReactNode {
  if (animation === 'sleepy') {
    return (
      <g>
        <line x1='85' y1='48' x2='95' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
        <line x1='105' y1='48' x2='115' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
      </g>
    )
  }

  const dotY = animation === 'sad' ? 50 : 48

  return (
    <g>
      <circle cx='90' cy={dotY} r='5' fill={outlineColor} />
      <circle cx='110' cy={dotY} r='5' fill={outlineColor} />
    </g>
  )
}
