// ========================================
// SIMPLE MOUTH - FLAT/LINE STYLE
// ========================================

import type { ReactNode } from 'react'
import type { MonsterState } from '@/types/monsters'

interface SimpleMouthProps {
  outlineColor: string
  state: MonsterState | null
}

export default function SimpleMouth ({
  outlineColor,
  state
}: SimpleMouthProps): ReactNode {
  const strokeWidth = 3.5

  switch (state) {
    case 'sleepy':
      return (
        <circle
          cx='100'
          cy='65'
          r='4'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
        />
      )

    case 'hungry':
      return (
        <g>
          {/* Mouth open state */}
          <g className='animate-chomp-mouth-open'>
            <line
              x1='90'
              y1='61'
              x2='110'
              y2='61'
              stroke={outlineColor}
              strokeWidth={strokeWidth * 2}
              strokeLinecap='round'
            />
            <line
              x1='90'
              y1='67'
              x2='110'
              y2='67'
              stroke={outlineColor}
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap='round'
            />
          </g>
          {/* Mouth closed state */}
          <g className='animate-chomp-mouth-closed'>
            <line
              x1='90'
              y1='64'
              x2='110'
              y2='64'
              stroke={outlineColor}
              strokeWidth={strokeWidth}
              strokeLinecap='round'
            />
          </g>
        </g>
      )

    case 'happy':
    case 'gamester':
      return (
        <path
          d='M 85 61 Q 100 69 115 61'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      )

    default:
      // Default state - straight line
      return (
        <line
          x1='88'
          y1='63'
          x2='112'
          y2='63'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      )
  }
}
