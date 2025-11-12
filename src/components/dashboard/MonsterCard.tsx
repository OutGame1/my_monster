'use client'

import type { ReactNode } from 'react'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import MonsterBackgroundDisplay from '@/components/backgrounds/MonsterBackgroundDisplay'
import { stateInfoMap } from './monster-state.utils'
import { useRouter } from 'next/navigation'
import cn from 'classnames'

interface MonsterCardProps {
  monster: ISerializedMonster
}

/**
 * Individual monster card component
 * Displays monster avatar, info, state badge and action buttons
 * Clickable to navigate to monster detail page
 */
export default function MonsterCard ({ monster }: MonsterCardProps): ReactNode {
  const router = useRouter()
  const {
    label,
    emoji,
    color
  } = stateInfoMap[monster.state]

  const handleCardClick = (): void => {
    router.push(`/app/monster/${monster._id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className='group relative cursor-pointer overflow-hidden rounded-2xl border border-tolopea-200 bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl'
    >
      {/* Monster Avatar with Background */}
      <div className='mb-4'>
        <MonsterBackgroundDisplay
          monsterId={monster._id}
          monsterName={monster.name}
          backgroundId={monster.backgroundId}
        >
          <MonsterAvatar
            traits={monster.traits}
            state={monster.state}
            size={180}
          />
        </MonsterBackgroundDisplay>
      </div>

      {/* Monster Information */}
      <div className='px-6 pb-6 text-center'>
        <h3 className='mb-2 text-2xl font-bold text-tolopea-800'>{monster.name}</h3>

        {/* Level Badge */}
        <div className='mb-4 flex items-center justify-center gap-2'>
          <span className='rounded-full bg-blood-100 px-3 py-1 text-sm font-semibold text-blood-700'>
            Niveau {monster.level}
          </span>

          {/* State Badge */}
          <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', color)}>
            {label} {emoji}
          </span>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className='absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-tolopea-300' />
    </div>
  )
}
