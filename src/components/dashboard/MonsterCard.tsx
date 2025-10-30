'use client'

import type { ReactNode } from 'react'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
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
      className='group relative cursor-pointer overflow-hidden rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl'
    >
      {/* Monster Avatar - Center Display */}
      <div className='mb-4 flex justify-center'>
        <div className='rounded-full bg-gradient-to-br from-tolopea-50 to-aqua-forest-50 p-4'>
          <MonsterAvatar
            traits={monster.traits}
            state={monster.state}
            size={180}
          />
        </div>
      </div>

      {/* Monster Information */}
      <div className='text-center'>
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
