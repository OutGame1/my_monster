// ========================================
// COMPOSANT CARTE MONSTRE - PRÉSENTATION
// ========================================
// Carte interactive affichant un monstre avec son avatar SVG

'use client'

import { MouseEvent, useState } from 'react'
import { SerializedMonster } from '@/types/monster.types'
import { useMonsterVisual } from '@/presentation/hooks/useMonsterVisual'
import MonsterAvatar from '@/presentation/components/monster/MonsterAvatar'
import { AnimationType } from '@/core/models/monster-visual.model'

interface MonsterCardInteractiveProps {
  monster: SerializedMonster
  onClick?: () => void
}

export default function MonsterCardInteractive ({
  monster,
  onClick
}: MonsterCardInteractiveProps) {
  const visualProfile = useMonsterVisual(monster)
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>('idle')
  const [isHovered, setIsHovered] = useState(false)

  const handleInteraction = (e: MouseEvent, animation: AnimationType) => {
    e.stopPropagation()
    setCurrentAnimation(animation)
    setTimeout(() => setCurrentAnimation('idle'), 1500)
  }

  if (visualProfile == null) {
    return (
      <div className='bg-white rounded-xl shadow-md p-4 animate-pulse'>
        <div className='h-48 bg-gray-200 rounded-lg mb-4' />
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    )
  }

  return (
    <div
      className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105'
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar du monstre */}
      <div className='flex justify-center mb-4 relative'>
        <MonsterAvatar
          visualProfile={visualProfile}
          animation={isHovered ? 'happy' : currentAnimation}
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
      <div className='p-4 space-y-2'>
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

        {/* Barre d'expérience */}
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-tolopea h-2 rounded-full transition-all duration-300'
            style={{
              width: `${(monster.experience / monster.experienceToNextLevel) * 100}%`
            }}
          />
        </div>

        {/* Stats rapides */}
        <div className='grid grid-cols-3 gap-2 text-xs mt-3'>
          <div className='text-center'>
            <div className='font-semibold text-gray-700'>❤️ {monster.stats.health}</div>
            <div className='text-gray-500'>PV</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-gray-700'>⚔️ {monster.stats.attack}</div>
            <div className='text-gray-500'>ATQ</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-gray-700'>🛡️ {monster.stats.defense}</div>
            <div className='text-gray-500'>DEF</div>
          </div>
        </div>

        {/* Boutons d'interaction rapide */}
        <div className='flex gap-2 mt-4'>
          <button
            onClick={(e) => handleInteraction(e, 'happy')}
            className='flex-1 py-2 px-3 bg-aqua-forest/10 hover:bg-aqua-forest/20
                     text-aqua-forest rounded-lg transition-colors text-sm font-medium'
            title='Caresser'
          >
            😊
          </button>
          <button
            onClick={(e) => handleInteraction(e, 'hungry')}
            className='flex-1 py-2 px-3 bg-blood/10 hover:bg-blood/20
                     text-blood rounded-lg transition-colors text-sm font-medium'
            title='Nourrir'
          >
            🍖
          </button>
        </div>
      </div>

      {/* Humeur */}
      <div className='mt-4 pt-4 border-t border-gray-100 text-center'>
        <span className='text-sm text-gray-600'>
          Humeur: <span className='font-medium'>{monster.mood}</span>
        </span>
      </div>
    </div>
  )
}
