// ========================================
// WAVY MOUTH - CURVED/UNDULATING STYLE
// ========================================

import type { ReactNode } from 'react'
import type { MonsterState } from '@/types/monsters'

interface WavyMouthProps {
  outlineColor: string
  state: MonsterState | null
}

export default function WavyMouth ({
  outlineColor,
  state
}: WavyMouthProps): ReactNode {
  const strokeWidth = 3.5

  switch (state) {
    // Sleepy state - small circle mouth
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

    // Hungry state - chomping wavy mouth
    case 'hungry':
      return (
        <g>
          {/* Mouth open state */}
          <g className='animate-chomp-mouth-open'>
            <ellipse cx='100' cy='65' rx='10' ry='8' fill={outlineColor} />
            <ellipse cx='100' cy='64' rx='7' ry='5' fill='#D84A76' />
            <ellipse cx='96' cy='65' rx='2' ry='3' fill='#FFFFFF' opacity='0.6' />
          </g>
          {/* Mouth closed state */}
          <g className='animate-chomp-mouth-closed'>
            <path
              d='M 90 64 Q 95 62 100 64 Q 105 62 110 64'
              fill='none'
              stroke={outlineColor}
              strokeWidth={strokeWidth}
              strokeLinecap='round'
            />
          </g>
        </g>
      )

    // Happy or gamester state - wavy smile
    case 'happy':
    case 'gamester':
      return (
        <path
          d='M 85 61 Q 92 69 100 68 Q 108 69 115 61'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      )

    // Default state - gentle wavy line
    default:
      return (
        <path
          d='M 88 63 Q 94 65 100 63 Q 106 65 112 63'
          fill='none'
          stroke={outlineColor}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      )
  }
}
