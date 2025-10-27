// ========================================
// COMPOSANT ACCESSOIRES - PRÉSENTATION
// ========================================
// Cornes, ailes, queue, pics, aura

'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TailStyle, ColorPalette, AnimationType } from '@/core/models/monster-visual.model'

interface MonsterAccessoriesProps {
  hasHorns: boolean
  hasWings: boolean
  hasTail: boolean
  tailStyle: TailStyle
  hasSpikes: boolean
  hasAura: boolean
  colors: ColorPalette
  animation: AnimationType
}

export default function MonsterAccessories ({
  hasHorns,
  hasWings,
  hasTail,
  tailStyle,
  hasSpikes,
  hasAura,
  colors,
  animation
}: MonsterAccessoriesProps): ReactNode {
  const isFlying = animation === 'celebrate' || animation === 'happy'
  const isAttack = animation === 'attack'

  return (
    <>
      {/* AURA - toujours animée avec valeurs explicites */}
      {hasAura && (
        <g id='aura'>
          <motion.circle
            cx='100'
            cy='110'
            initial={{ r: 70, opacity: 0.3 }}
            r={70}
            fill='none'
            stroke={colors.accent}
            strokeWidth='2'
            opacity={0.3}
            animate={{
              r: [70, 75, 70],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx='100'
            cy='110'
            initial={{ r: 80, opacity: 0.2 }}
            r={80}
            fill='none'
            stroke={colors.accent}
            strokeWidth='1'
            opacity={0.2}
            animate={{
              r: [80, 85, 80],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      )}

      {/* CORNES */}
      {hasHorns && (
        <g id='horns'>
          {isAttack
            ? (
              <>
                <motion.path
                  initial={{ d: 'M75 75 Q 70 60 72 50' }}
                  d='M75 75 Q 70 60 72 50'
                  stroke={colors.secondary}
                  strokeWidth='6'
                  fill='none'
                  strokeLinecap='round'
                  animate={{ rotate: [-5, 5, -5] }}
                  style={{ originX: '75px', originY: '75px' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.path
                  initial={{ d: 'M125 75 Q 130 60 128 50' }}
                  d='M125 75 Q 130 60 128 50'
                  stroke={colors.secondary}
                  strokeWidth='6'
                  fill='none'
                  strokeLinecap='round'
                  animate={{ rotate: [5, -5, 5] }}
                  style={{ originX: '125px', originY: '75px' }}
                  transition={{ duration: 0.3 }}
                />
              </>
              )
            : (
              <>
                <path
                  d='M75 75 Q 70 60 72 50'
                  stroke={colors.secondary}
                  strokeWidth='6'
                  fill='none'
                  strokeLinecap='round'
                />
                <path
                  d='M125 75 Q 130 60 128 50'
                  stroke={colors.secondary}
                  strokeWidth='6'
                  fill='none'
                  strokeLinecap='round'
                />
              </>
              )}
          <circle cx='72' cy='50' r='3' fill={colors.accent} />
          <circle cx='128' cy='50' r='3' fill={colors.accent} />
        </g>
      )}

      {/* AILES - toujours animées avec valeurs explicites */}
      {hasWings && (
        <motion.g
          id='wings'
          animate={isFlying ? { y: [-2, 2, -2] } : undefined}
          transition={{ duration: 0.5, repeat: isFlying ? Infinity : 0 }}
        >
          <motion.path
            initial={{ d: 'M60 90 Q 30 80 25 95 Q 30 110 60 100' }}
            d='M60 90 Q 30 80 25 95 Q 30 110 60 100'
            fill={colors.secondary}
            fillOpacity='0.7'
            stroke={colors.primary}
            strokeWidth='2'
            animate={{
              d: [
                'M60 90 Q 30 80 25 95 Q 30 110 60 100',
                'M60 90 Q 20 85 15 95 Q 25 115 60 100',
                'M60 90 Q 30 80 25 95 Q 30 110 60 100'
              ]
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            initial={{ d: 'M140 90 Q 170 80 175 95 Q 170 110 140 100' }}
            d='M140 90 Q 170 80 175 95 Q 170 110 140 100'
            fill={colors.secondary}
            fillOpacity='0.7'
            stroke={colors.primary}
            strokeWidth='2'
            animate={{
              d: [
                'M140 90 Q 170 80 175 95 Q 170 110 140 100',
                'M140 90 Q 180 85 185 95 Q 175 115 140 100',
                'M140 90 Q 170 80 175 95 Q 170 110 140 100'
              ]
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.g>
      )}

      {/* QUEUE */}
      {hasTail && (
        <motion.g
          id='tail'
          animate={{
            rotate: [0, -5, 0, 5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '100px', originY: '150px' }}
        >
          {tailStyle === 'flame' && (
            <g>
              <path
                d='M100 150 Q 95 165 100 180'
                stroke={colors.accent}
                strokeWidth='10'
                fill='none'
                strokeLinecap='round'
              />
              {/* Flamme toujours animée avec valeur explicite */}
              <motion.path
                initial={{ d: 'M100 175 Q 105 185 100 195' }}
                d='M100 175 Q 105 185 100 195'
                fill={colors.accent}
                animate={{
                  d: [
                    'M100 175 Q 105 185 100 195',
                    'M100 175 Q 110 188 105 198',
                    'M100 175 Q 105 185 100 195'
                  ]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </g>
          )}
          {tailStyle === 'leaf' && (
            <g>
              <path
                d='M100 150 Q 95 170 100 185'
                stroke={colors.secondary}
                strokeWidth='6'
                fill='none'
              />
              <ellipse
                cx='100'
                cy='188'
                rx='12'
                ry='18'
                fill={colors.primary}
                stroke={colors.secondary}
                strokeWidth='2'
              />
            </g>
          )}
          {tailStyle === 'lightning' && (
            <path
              d='M100 150 L 95 165 L 100 170 L 97 185'
              stroke={colors.accent}
              strokeWidth='6'
              fill='none'
              strokeLinejoin='miter'
            />
          )}
          {(tailStyle === 'long' || tailStyle === 'short') && (
            <path
              d={tailStyle === 'long'
                ? 'M100 150 Q 90 175 95 195'
                : 'M100 150 Q 95 160 100 170'}
              stroke={colors.secondary}
              strokeWidth='8'
              fill='none'
              strokeLinecap='round'
            />
          )}
        </motion.g>
      )}

      {/* PICS */}
      {hasSpikes && (
        <g id='spikes'>
          <path d='M85 70 L 80 60 L 85 65' fill={colors.secondary} />
          <path d='M100 65 L 100 55 L 103 62' fill={colors.secondary} />
          <path d='M115 70 L 120 60 L 115 65' fill={colors.secondary} />
        </g>
      )}
    </>
  )
}
