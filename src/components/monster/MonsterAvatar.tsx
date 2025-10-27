// ========================================
// COMPOSANT AVATAR PRINCIPAL - PRÉSENTATION
// ========================================
// Orchestration des parties du monstre avec animations

'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { MonsterVisualProfile, AnimationType } from '@/core/models/monster-visual.model'
import MonsterBody from './parts/MonsterBody'
import MonsterEyes from './parts/MonsterEyes'
import MonsterMouth from './parts/MonsterMouth'
import MonsterAccessories from './parts/MonsterAccessories'

interface MonsterAvatarProps {
  visualProfile: MonsterVisualProfile
  animation?: AnimationType
  interactive?: boolean
  size?: number
  className?: string
}

export default function MonsterAvatar ({
  visualProfile,
  animation = 'idle',
  interactive = false,
  size = 200,
  className = ''
}: MonsterAvatarProps): ReactNode {
  const animations: Record<AnimationType, any> = {
    idle: {
      y: [0, -5, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    },
    happy: {
      scale: [1, 1.1, 1],
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.6, repeat: 2 }
    },
    attack: {
      x: [0, 10, -5, 0],
      scale: [1, 1.15, 1],
      transition: { duration: 0.4 }
    },
    hurt: {
      x: [-5, 5, -5, 5, 0],
      filter: [
        'brightness(1)',
        'brightness(1.5) hue-rotate(180deg)',
        'brightness(1)'
      ],
      transition: { duration: 0.5 }
    },
    celebrate: {
      y: [0, -20, 0],
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: { duration: 1, repeat: 2 }
    },
    sleep: {
      y: [0, 2, 0],
      opacity: [1, 0.8, 1],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    },
    hungry: {
      scale: [1, 0.98, 1],
      transition: { duration: 1.5, repeat: Infinity }
    }
  }

  return (
    <div className={`inline-block ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox='0 0 200 200'
        className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
        animate={animations[animation]}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Accessoires derrière (aura, ailes arrière) */}
        <g id='back-accessories'>
          {visualProfile.traits.hasAura && (
            <MonsterAccessories
              hasHorns={false}
              hasWings={false}
              hasTail={false}
              tailStyle='none'
              hasSpikes={false}
              hasAura={visualProfile.traits.hasAura}
              colors={visualProfile.colorPalette}
              animation={animation}
            />
          )}
        </g>

        {/* Queue */}
        {visualProfile.traits.hasTail && (
          <MonsterAccessories
            hasHorns={false}
            hasWings={false}
            hasTail={visualProfile.traits.hasTail}
            tailStyle={visualProfile.traits.tailStyle}
            hasSpikes={false}
            hasAura={false}
            colors={visualProfile.colorPalette}
            animation={animation}
          />
        )}

        {/* Corps principal */}
        <MonsterBody
          shape={visualProfile.traits.bodyShape}
          colors={visualProfile.colorPalette}
          pattern={visualProfile.traits.pattern}
          size={visualProfile.size}
        />

        {/* Yeux */}
        <MonsterEyes
          style={visualProfile.traits.eyeStyle}
          color={visualProfile.colorPalette.eye}
          animation={animation}
        />

        {/* Bouche */}
        <MonsterMouth
          style={visualProfile.traits.mouthStyle}
          color={visualProfile.colorPalette.secondary}
          animation={animation}
        />

        {/* Accessoires devant (cornes, ailes, pics) */}
        <MonsterAccessories
          hasHorns={visualProfile.traits.hasHorns}
          hasWings={visualProfile.traits.hasWings}
          hasTail={false}
          tailStyle='none'
          hasSpikes={visualProfile.traits.hasSpikes}
          hasAura={false}
          colors={visualProfile.colorPalette}
          animation={animation}
        />

        {/* Badge Shiny */}
        {visualProfile.isShiny && (
          <g id='shiny-indicator'>
            <motion.text
              x='170'
              y='30'
              fontSize='20'
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✨
            </motion.text>
          </g>
        )}
      </motion.svg>
    </div>
  )
}
