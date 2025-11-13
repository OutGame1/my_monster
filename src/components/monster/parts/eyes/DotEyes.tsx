// ========================================
// DOT EYES - SIMPLE MINIMAL STYLE
// ========================================

import type { ReactNode } from 'react'
import type { MonsterState } from '@/types/monsters'

interface DotEyesProps {
  outlineColor: string
  state: MonsterState | null
}

export default function DotEyes ({
  outlineColor,
  state
}: DotEyesProps): ReactNode {
  if (state === 'sleepy') {
    return (
      <g>
        <line x1='85' y1='48' x2='95' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
        <line x1='105' y1='48' x2='115' y2='48' stroke={outlineColor} strokeWidth='4' strokeLinecap='round' />
      </g>
    )
  }

  const dotY = state === 'sad' ? 50 : 48
  const animationClass = state === 'gamester' ? 'animate-gaming-eyes' : undefined

  return (
    <g className={animationClass}>
      <circle cx='90' cy={dotY} r='5' fill={outlineColor} />
      <circle cx='110' cy={dotY} r='5' fill={outlineColor} />

      {/* Tears for sad state */}
      {state === 'sad' && (
        <g className='animate-tears'>
          <ellipse cx='90' cy='57' rx='2' ry='3' fill='#4DB8E8' opacity='0.8' />
          <ellipse cx='110' cy='57' rx='2' ry='3' fill='#4DB8E8' opacity='0.8' />
        </g>
      )}
    </g>
  )
}
