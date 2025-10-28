// ========================================
// OPEN MOUTH - SURPRISED/HAPPY OVAL
// ========================================

import type { ReactNode } from 'react'
import type { MonsterState } from '@/db/models/monster.model'

interface OpenMouthProps {
  outlineColor: string
  animation: MonsterState | null
}

export default function OpenMouth ({
  outlineColor,
  animation
}: OpenMouthProps): ReactNode {
  const strokeWidth = 3.5

  switch (animation) {
    case 'sad':
      return (
        <ellipse
          cx='100'
          cy='62'
          rx='6'
          ry='4'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      )
    case 'hungry':
      return (
        <g>
          <ellipse cx='100' cy='62' rx='10' ry='8' fill={outlineColor} />
          <ellipse cx='100' cy='61' rx='7' ry='5' fill='#D84A76' />
          <ellipse cx='96' cy='62' rx='2' ry='3' fill='#FFFFFF' opacity='0.6' />
        </g>
      )
    case 'happy':
      return (
        <ellipse
          cx='100'
          cy='62'
          rx='9'
          ry='7'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      )
    default:
      return (
        <ellipse
          cx='100'
          cy='62'
          rx='7'
          ry='5'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      )
  }
}
