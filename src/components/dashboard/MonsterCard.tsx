'use client'

import type { ReactNode } from 'react'
import type { IMonster } from '@/db/models/monster.model'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import { getStateEmoji, getStateColor } from './monster-state.utils'

interface MonsterCardProps {
  monster: IMonster
}

/**
 * Individual monster card component
 * Displays monster avatar, info, state badge and action buttons
 */
export default function MonsterCard ({ monster }: MonsterCardProps): ReactNode {
  const stateEmoji = getStateEmoji(monster.state)
  const stateColor = getStateColor(monster.state)

  return (
    <div className='group relative overflow-hidden rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
      {/* State Badge - Top Right Corner */}
      <div className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold ${stateColor}`}>
        {stateEmoji} {monster.state}
      </div>

      {/* Monster Avatar - Center Display */}
      <div className='mb-4 flex justify-center'>
        <div className='rounded-full bg-gradient-to-br from-tolopea-50 to-aqua-forest-50 p-4'>
          <MonsterAvatar
            traits={monster.traits}
            animation={monster.state}
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
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <button className='flex-1 rounded-lg bg-tolopea-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-tolopea-600 active:scale-95'>
            Nourrir
          </button>
          <button className='flex-1 rounded-lg bg-aqua-forest-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-aqua-forest-600 active:scale-95'>
            Jouer
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className='absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-tolopea-300' />
    </div>
  )
}
