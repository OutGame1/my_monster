// ========================================
// COMPOSANT CARTE MONSTRE - PRÉSENTATION
// ========================================
// Carte interactive affichant un monstre avec son avatar SVG

'use client'

import { ReactNode, useState } from 'react'
import { SerializedMonster } from '@/types/monster.types'
import { useMonsterVisual } from '@/hooks/useMonsterVisual'
import MonsterAvatar from '../monster/MonsterAvatar'
import Link from 'next/link'

interface MonsterCardProps {
  monster: SerializedMonster
  onClick?: () => void
}

export default function MonsterCard ({
  monster,
  onClick
}: MonsterCardProps): ReactNode {
  const visualProfile = useMonsterVisual(monster)
  const [isHovered, setIsHovered] = useState(false)

  if (visualProfile === null) {
    return (
      <div className='bg-white rounded-xl shadow-md p-4 animate-pulse'>
        <div className='h-48 bg-gray-200 rounded-lg mb-4' />
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    )
  }

  return (
    <Link
      className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105'
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      href={`/monsters/${monster._id}`}
    >
      {/* Avatar du monstre */}
      <div className='flex justify-center mb-4 relative'>
        <MonsterAvatar
          visualProfile={visualProfile}
          animation={isHovered ? 'happy' : 'idle'}
          size={180}
          interactive
        />
        {isHovered && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg'>
            <span className='text-sm font-medium text-gray-700 bg-white/90 px-3 py-1 rounded-full'>
              Cliquer pour plus de détails
            </span>
          </div>
        )}
      </div>

      {/* Informations */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex-1 min-w-0'>
          <h3 className='font-bold text-lg text-gray-800 truncate'>
            {monster.name}
          </h3>
          <p className='text-sm text-gray-500'>
            {monster.type} • Niveau {monster.level}
          </p>
        </div>

        {monster.isShiny && <span className='text-xl'>✨</span>}
      </div>

      {/* Humeur */}
      <div className='mt-4 pt-4 border-t border-gray-100 text-center'>
        <span className='text-sm text-gray-600'>
          Humeur: <span className='font-medium'>{monster.mood}</span>
        </span>
      </div>
    </Link>
  )
}
