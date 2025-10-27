// ========================================
// COMPOSANT YEUX - PRÉSENTATION
// ========================================
// Rendu SVG des yeux avec animations

'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EyeStyle, AnimationType } from '@/core/models/monster-visual.model'

interface MonsterEyesProps {
  style: EyeStyle
  color: string
  animation: AnimationType
}

export default function MonsterEyes ({ style, color, animation }: MonsterEyesProps): ReactNode {
  const isBlinking = animation === 'sleep'
  const isHappy = animation === 'happy' || animation === 'celebrate'
  const isFierce = animation === 'attack'

  const eyeGradientId = `eye-gradient-${Math.random().toString(36).substring(2, 9)}`

  const eyeVariants: Record<EyeStyle, ReactNode> = {
    round: (
      <g id='eyes-round'>
        <defs>
          <radialGradient id={eyeGradientId}>
            <stop offset='0%' stopColor={color} stopOpacity='1' />
            <stop offset='70%' stopColor={color} stopOpacity='0.8' />
            <stop offset='100%' stopColor='#000' stopOpacity='1' />
          </radialGradient>
        </defs>

        <motion.g
          animate={isBlinking ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
        >
          <circle cx='85' cy='95' r='10' fill='white' stroke='#E0E0E0' strokeWidth='1' />
          <circle cx='85' cy='95' r='5' fill={`url(#${eyeGradientId})`} />
          <circle cx='83' cy='93' r='2.5' fill='white' opacity='0.9' />
          <circle cx='86' cy='96' r='1' fill='white' opacity='0.6' />
        </motion.g>

        <motion.g
          animate={isBlinking ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
        >
          <circle cx='115' cy='95' r='10' fill='white' stroke='#E0E0E0' strokeWidth='1' />
          <circle cx='115' cy='95' r='5' fill={`url(#${eyeGradientId})`} />
          <circle cx='113' cy='93' r='2.5' fill='white' opacity='0.9' />
          <circle cx='116' cy='96' r='1' fill='white' opacity='0.6' />
        </motion.g>
      </g>
    ),
    sharp: (
      <g id='eyes-sharp'>
        <defs>
          <linearGradient id={`${eyeGradientId}-sharp`} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor={color} />
            <stop offset='100%' stopColor='#000' />
          </linearGradient>
        </defs>

        <motion.g
          animate={isBlinking ? { scaleY: [1, 0.1, 1] } : isFierce ? { x: [-2, 0] } : {}}
          transition={{ duration: 0.3, repeat: isBlinking ? Infinity : 0, repeatDelay: 3 }}
        >
          <path
            d='M 77 95 L 85 88 L 93 95 L 85 100 Z'
            fill='white'
            stroke='#E0E0E0'
            strokeWidth='1'
          />
          <path
            d='M 81 95 L 85 91 L 89 95 L 85 97 Z'
            fill={`url(#${eyeGradientId}-sharp)`}
          />
          <circle cx='84' cy='93' r='1.5' fill='white' opacity='0.8' />
        </motion.g>

        <motion.g
          animate={isBlinking ? { scaleY: [1, 0.1, 1] } : isFierce ? { x: [2, 0] } : {}}
          transition={{ duration: 0.3, repeat: isBlinking ? Infinity : 0, repeatDelay: 3 }}
        >
          <path
            d='M 107 95 L 115 88 L 123 95 L 115 100 Z'
            fill='white'
            stroke='#E0E0E0'
            strokeWidth='1'
          />
          <path
            d='M 111 95 L 115 91 L 119 95 L 115 97 Z'
            fill={`url(#${eyeGradientId}-sharp)`}
          />
          <circle cx='114' cy='93' r='1.5' fill='white' opacity='0.8' />
        </motion.g>

        <g opacity='0.7'>
          <line x1='75' y1='85' x2='90' y2='87' stroke={color} strokeWidth='2.5' strokeLinecap='round' />
          <line x1='110' y1='87' x2='125' y2='85' stroke={color} strokeWidth='2.5' strokeLinecap='round' />
        </g>
      </g>
    ),
    cute: (
      <g id='eyes-cute'>
        {isHappy
          ? (
            <>
              <path d='M 77 95 Q 85 88 93 95' stroke={color} strokeWidth='3' fill='none' strokeLinecap='round' />
              <path d='M 107 95 Q 115 88 123 95' stroke={color} strokeWidth='3' fill='none' strokeLinecap='round' />
              <text x='70' y='92' fontSize='8' fill={color} opacity='0.6'>✦</text>
              <text x='124' y='92' fontSize='8' fill={color} opacity='0.6'>✦</text>
            </>
            )
          : (
            <>
              <motion.g
                animate={isBlinking ? { scaleY: [1, 0.1, 1] } : {}}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <circle cx='85' cy='95' r='12' fill='white' stroke='#E0E0E0' strokeWidth='1' />
                <circle cx='85' cy='97' r='6' fill={color} />
                <circle cx='82' cy='94' r='3.5' fill='white' opacity='1' />
                <circle cx='87' cy='98' r='1.5' fill='white' opacity='0.7' />
              </motion.g>

              <motion.g
                animate={isBlinking ? { scaleY: [1, 0.1, 1] } : {}}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <circle cx='115' cy='95' r='12' fill='white' stroke='#E0E0E0' strokeWidth='1' />
                <circle cx='115' cy='97' r='6' fill={color} />
                <circle cx='112' cy='94' r='3.5' fill='white' opacity='1' />
                <circle cx='117' cy='98' r='1.5' fill='white' opacity='0.7' />
              </motion.g>

              <g opacity='0.5'>
                <path d='M 96 88 Q 97 85 98 88' stroke={color} strokeWidth='1' fill='none' />
                <path d='M 126 88 Q 127 85 128 88' stroke={color} strokeWidth='1' fill='none' />
              </g>
            </>
            )}
      </g>
    ),
    fierce: (
      <g id='eyes-fierce'>
        <defs>
          <radialGradient id={`${eyeGradientId}-fierce`}>
            <stop offset='0%' stopColor='#FF0000' stopOpacity='0.3' />
            <stop offset='100%' stopColor='transparent' />
          </radialGradient>
        </defs>

        {isFierce && (
          <>
            <circle cx='85' cy='95' r='15' fill={`url(#${eyeGradientId}-fierce)`} />
            <circle cx='115' cy='95' r='15' fill={`url(#${eyeGradientId}-fierce)`} />
          </>
        )}

        <motion.g
          animate={isBlinking ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 4 }}
        >
          <ellipse cx='85' cy='95' rx='10' ry='7' fill='white' stroke='#E0E0E0' strokeWidth='1' />
          <rect x='79' y='92' width='12' height='5' fill={color} rx='1' />
          <rect x='81' y='93' width='2' height='3' fill='white' opacity='0.7' />
        </motion.g>

        <motion.g
          animate={isBlinking ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 4 }}
        >
          <ellipse cx='115' cy='95' rx='10' ry='7' fill='white' stroke='#E0E0E0' strokeWidth='1' />
          <rect x='109' y='92' width='12' height='5' fill={color} rx='1' />
          <rect x='117' y='93' width='2' height='3' fill='white' opacity='0.7' />
        </motion.g>

        <g opacity='0.8'>
          <line x1='73' y1='86' x2='92' y2='90' stroke={color} strokeWidth='3' strokeLinecap='round' />
          <line x1='108' y1='90' x2='127' y2='86' stroke={color} strokeWidth='3' strokeLinecap='round' />
        </g>
      </g>
    ),
    sleepy: (
      <g id='eyes-sleepy'>
        <path d='M 77 98 Q 85 95 93 98' stroke={color} strokeWidth='2.5' fill='none' strokeLinecap='round' />
        <path d='M 107 98 Q 115 95 123 98' stroke={color} strokeWidth='2.5' fill='none' strokeLinecap='round' />

        <g opacity='0.4'>
          <path d='M 77 99 L 75 102' stroke={color} strokeWidth='1' />
          <path d='M 93 99 L 95 102' stroke={color} strokeWidth='1' />
          <path d='M 107 99 L 105 102' stroke={color} strokeWidth='1' />
          <path d='M 123 99 L 125 102' stroke={color} strokeWidth='1' />
        </g>

        {[0, 1, 2].map((value) => (
          <motion.text
            key={value}
            x={95 + value * 10}
            y={value * -5}
            fontSize={12 - value * 2}
            fill={color}
            opacity={0.6 - value * 0.1}
            animate={{ y: [85 - value * 5, 75 - value * 5], opacity: [0.6 - value * 0.1, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, delay: value * 0.3 }}
          >
            z
          </motion.text>
        ))}
      </g>
    )
  }

  return eyeVariants[style]
}
