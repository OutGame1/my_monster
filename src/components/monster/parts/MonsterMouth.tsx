// ========================================
// COMPOSANT BOUCHE - PRÉSENTATION
// ========================================
// Rendu SVG de la bouche avec expressions

'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { MouthStyle, AnimationType } from '@/core/models/monster-visual.model'

interface MonsterMouthProps {
  style: MouthStyle
  color: string
  animation: AnimationType
}

export default function MonsterMouth ({ style, color, animation }: MonsterMouthProps): ReactNode {
  const isHappy = animation === 'happy' || animation === 'celebrate'
  const isHurt = animation === 'hurt'
  const isHungry = animation === 'hungry'
  const isAttack = animation === 'attack'

  const mouthGradientId = `mouth-gradient-${style}`
  const beakGradientId = `beak-gradient-${style}`
  const openMouthGradientId = `open-mouth-gradient-${style}`

  const renderOpenEllipse = (): ReactNode => {
    if (isAttack) {
      return (
        <motion.ellipse
          cx='100'
          cy='122'
          rx={isHungry ? 12 : 10}
          ry={isHungry ? 10 : 8}
          fill={`url(#${openMouthGradientId})`}
          stroke={color}
          strokeWidth='2'
          animate={{
            ry: [8, 15, 8],
            rx: [10, 13, 10]
          }}
          transition={{ duration: 0.3 }}
        />
      )
    }

    return (
      <ellipse
        cx='100'
        cy='122'
        rx={isHungry ? 12 : 10}
        ry={isHungry ? 10 : 8}
        fill={`url(#${openMouthGradientId})`}
        stroke={color}
        strokeWidth='2'
      />
    )
  }

  const mouthVariants: Record<MouthStyle, ReactNode> = {
    smile: (
      <g id='mouth-smile'>
        {isHappy
          ? (
            <motion.path
              d='M 85 120 Q 100 130 115 120'
              stroke={color}
              strokeWidth='3'
              fill='none'
              strokeLinecap='round'
              animate={{
                d: [
                  'M 85 120 Q 100 130 115 120',
                  'M 85 118 Q 100 135 115 118',
                  'M 85 120 Q 100 130 115 120'
                ]
              }}
              transition={{ duration: 0.5, repeat: 3 }}
            />
            )
          : (
            <path
              d={isHurt ? 'M 85 120 Q 100 125 115 120' : 'M 85 120 Q 100 130 115 120'}
              stroke={color}
              strokeWidth='3'
              fill='none'
              strokeLinecap='round'
            />
            )}
        {isHappy && (
          <ellipse
            cx='100'
            cy='128'
            rx='8'
            ry='4'
            fill='#FF69B4'
            opacity='0.7'
          />
        )}
        {isHappy && (
          <>
            <circle cx='78' cy='123' r='3' fill={color} opacity='0.2' />
            <circle cx='122' cy='123' r='3' fill={color} opacity='0.2' />
          </>
        )}
      </g>
    ),
    fangs: (
      <g id='mouth-fangs'>
        {isAttack
          ? (
            <motion.path
              d='M 85 118 Q 100 125 115 118'
              stroke={color}
              strokeWidth='3'
              fill='none'
              strokeLinecap='round'
              animate={{
                d: [
                  'M 85 118 Q 100 125 115 118',
                  'M 85 115 Q 100 135 115 115',
                  'M 85 118 Q 100 125 115 118'
                ]
              }}
              transition={{ duration: 0.2 }}
            />
            )
          : (
            <path
              d='M 85 118 Q 100 125 115 118'
              stroke={color}
              strokeWidth='3'
              fill='none'
              strokeLinecap='round'
            />
            )}

        {isAttack && (
          <ellipse
            cx='100'
            cy='125'
            rx='12'
            ry='8'
            fill={`url(#${mouthGradientId})`}
          />
        )}

        {isAttack
          ? (
            <motion.g
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 0.2 }}
            >
              <path
                d='M 90 120 L 92 120 L 91 130 Z'
                fill='white'
                stroke={color}
                strokeWidth='1'
              />
              <path
                d='M 108 120 L 110 120 L 109 130 Z'
                fill='white'
                stroke={color}
                strokeWidth='1'
              />
            </motion.g>
            )
          : (
            <g>
              <path
                d='M 90 120 L 92 120 L 91 130 Z'
                fill='white'
                stroke={color}
                strokeWidth='1'
              />
              <path
                d='M 108 120 L 110 120 L 109 130 Z'
                fill='white'
                stroke={color}
                strokeWidth='1'
              />
            </g>
            )}

        <g opacity='0.8'>
          <rect x='94' y='119' width='3' height='6' fill='white' rx='1' />
          <rect x='103' y='119' width='3' height='6' fill='white' rx='1' />
        </g>
      </g>
    ),
    beak: (
      <g id='mouth-beak'>
        {isHungry
          ? (
            <motion.path
              d='M 95 118 L 100 125 L 105 118 Z'
              fill={`url(#${beakGradientId})`}
              stroke={color}
              strokeWidth='2'
              strokeLinejoin='round'
              animate={{
                d: [
                  'M 95 118 L 100 125 L 105 118 Z',
                  'M 95 118 L 100 130 L 105 118 Z',
                  'M 95 118 L 100 125 L 105 118 Z'
                ]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
            )
          : (
            <path
              d='M 95 118 L 100 125 L 105 118 Z'
              fill={`url(#${beakGradientId})`}
              stroke={color}
              strokeWidth='2'
              strokeLinejoin='round'
            />
            )}

        {isHungry
          ? (
            <motion.path
              d='M 97 126 L 100 128 L 103 126'
              fill={color}
              opacity='0.6'
              animate={{
                d: [
                  'M 97 126 L 100 128 L 103 126',
                  'M 97 131 L 100 133 L 103 131',
                  'M 97 126 L 100 128 L 103 126'
                ]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
            )
          : (
            <path
              d='M 97 126 L 100 128 L 103 126'
              fill={color}
              opacity='0.6'
            />
            )}

        <line x1='100' y1='118' x2='100' y2='125' stroke={color} strokeWidth='1' opacity='0.5' />
      </g>
    ),
    tiny: (
      <g id='mouth-tiny'>
        {isHungry
          ? (
            <motion.circle
              cx='100'
              cy='120'
              r='3'
              fill={color}
              animate={{
                r: [3, 6, 3]
              }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            )
          : (
            <circle
              cx='100'
              cy='120'
              r='3'
              fill={color}
            />
            )}
        <circle cx='101' cy='119' r='1' fill='white' opacity='0.6' />

        {isHungry && (
          <>
            <text x='85' y='125' fontSize='10' opacity='0.5'>💧</text>
            <text x='110' y='125' fontSize='10' opacity='0.5'>💧</text>
          </>
        )}
      </g>
    ),
    open: (
      <g id='mouth-open'>
        {renderOpenEllipse()}

        <ellipse
          cx='100'
          cy='125'
          rx='7'
          ry='4'
          fill='#FF69B4'
          opacity='0.8'
        />

        <g opacity='0.9'>
          <rect x='92' y='115' width='3' height='5' fill='white' rx='1' />
          <rect x='97' y='115' width='3' height='5' fill='white' rx='1' />
          <rect x='102' y='115' width='3' height='5' fill='white' rx='1' />
        </g>

        <ellipse cx='95' cy='120' rx='3' ry='2' fill='white' opacity='0.3' />
      </g>
    )
  }

  return (
    <g>
      <defs>
        <radialGradient id={mouthGradientId}>
          <stop offset='0%' stopColor='rgba(0,0,0,0.5)' />
          <stop offset='100%' stopColor='rgba(0,0,0,0.8)' />
        </radialGradient>

        <linearGradient id={beakGradientId} x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor={color} />
          <stop offset='100%' stopColor={color} stopOpacity='0.7' />
        </linearGradient>

        <radialGradient id={openMouthGradientId}>
          <stop offset='0%' stopColor='rgba(139, 0, 0, 0.8)' />
          <stop offset='100%' stopColor='rgba(0, 0, 0, 0.9)' />
        </radialGradient>
      </defs>

      {mouthVariants[style]}
    </g>
  )
}
