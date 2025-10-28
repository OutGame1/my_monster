// ========================================
// MONSTER AVATAR COMPONENT
// ========================================
// Main monster renderer composing all trait parts

import type { ReactNode } from 'react'
import type { MonsterState, MonsterTraits } from '@/db/models/monster.model'
import Body from './parts/Body'
import Head from './parts/Head'
import Eyes from './parts/Eyes'
import Mouth from './parts/Mouth'
import Arms from './parts/Arms'
import Legs from './parts/Legs'

interface MonsterAvatarProps {
  traits: MonsterTraits
  animation: MonsterState | null
  size?: number // SVG container size in pixels
  className?: string
}

export default function MonsterAvatar ({
  traits,
  animation,
  size = 200,
  className = ''
}: MonsterAvatarProps): ReactNode {
  // Use size as a scale factor for all body parts to maintain proportions
  const scale = traits.size / 100

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 200 200'
      className={`block ${className}`}
    >
      <g transform={`scale(${scale}) translate(${(100 - 100 * scale) / scale}, ${(100 - 100 * scale) / scale})`}>
        {/* Legs behind body */}
        <Legs
          type={traits.legType}
          primaryColor={traits.primaryColor}
          secondaryColor={traits.secondaryColor}
          outlineColor={traits.outlineColor}
          animation={animation}
        />

        {/* Arms behind body */}
        <Arms
          type={traits.armType}
          bodyShape={traits.bodyShape}
          primaryColor={traits.primaryColor}
          outlineColor={traits.outlineColor}
          animation={animation}
        />

        {/* Body in middle */}
        <Body
          shape={traits.bodyShape}
          primaryColor={traits.primaryColor}
          secondaryColor={traits.secondaryColor}
          outlineColor={traits.outlineColor}
          animation={animation}
        />

        {/* Head with facial features on top */}
        <Head
          bodyShape={traits.bodyShape}
          primaryColor={traits.primaryColor}
          secondaryColor={traits.secondaryColor}
          outlineColor={traits.outlineColor}
        />

        {/* Eyes and mouth render on the head */}
        <Eyes
          type={traits.eyeType}
          outlineColor={traits.outlineColor}
          animation={animation}
        />

        <Mouth
          type={traits.mouthType}
          outlineColor={traits.outlineColor}
          animation={animation}
        />
      </g>
    </svg>
  )
}
