// ========================================
// TOOTHY MOUTH - MOUTH WITH VISIBLE TEETH
// ========================================

import type { ReactNode } from 'react'
import type { MonsterState } from '@/db/models/monster.model'

interface ToothyMouthProps {
  outlineColor: string
  state: MonsterState | null
}

export default function ToothyMouth ({
  outlineColor,
  state
}: ToothyMouthProps): ReactNode {
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

    // Hungry state - chomping with teeth visible
    case 'hungry':
      return (
        <g>
          {/* Mouth open state with teeth */}
          <g className='animate-chomp-mouth-open'>
            <ellipse cx='100' cy='63' rx='10' ry='6' fill='none' stroke={outlineColor} strokeWidth={strokeWidth} />
            <ellipse cx='100' cy='62' rx='7' ry='3' fill='#FFE5E5' />
            {/* Upper teeth */}
            <line x1='94' y1='60' x2='94' y2='63' stroke={outlineColor} strokeWidth='1.5' />
            <line x1='100' y1='59' x2='100' y2='63' stroke={outlineColor} strokeWidth='1.5' />
            <line x1='106' y1='60' x2='106' y2='63' stroke={outlineColor} strokeWidth='1.5' />
          </g>
          {/* Mouth closed state */}
          <g className='animate-chomp-mouth-closed'>
            <line x1='88' y1='63' x2='112' y2='63' stroke={outlineColor} strokeWidth={strokeWidth} strokeLinecap='round' />
            {/* Small visible teeth when closed */}
            <rect x='97' y='61' width='6' height='4' fill='#FFFFFF' stroke={outlineColor} strokeWidth='1' />
          </g>
        </g>
      )

    // Happy or gamester state - big toothy smile
    case 'happy':
    case 'gamester':
      return (
        <g>
          {/* Smile curve */}
          <path
            d='M 85 61 Q 100 71 115 61'
            fill='none'
            stroke={outlineColor}
            strokeWidth={strokeWidth}
            strokeLinecap='round'
          />
          {/* Teeth */}
          <g>
            <rect x='92' y='64' width='4' height='5' fill='#FFFFFF' stroke={outlineColor} strokeWidth='1' rx='1' />
            <rect x='98' y='66' width='4' height='5' fill='#FFFFFF' stroke={outlineColor} strokeWidth='1' rx='1' />
            <rect x='104' y='64' width='4' height='5' fill='#FFFFFF' stroke={outlineColor} strokeWidth='1' rx='1' />
          </g>
        </g>
      )

    // Default state - slight smile showing teeth
    default:
      return (
        <g>
          <line x1='88' y1='63' x2='112' y2='63' stroke={outlineColor} strokeWidth={strokeWidth} strokeLinecap='round' />
          {/* Central tooth visible */}
          <rect x='97' y='61' width='6' height='4' fill='#FFFFFF' stroke={outlineColor} strokeWidth='1' />
        </g>
      )
  }
}
