'use client'

import type { ReactNode } from 'react'
import Button from '@/components/ui/Button'

/**
 * Monster action buttons component
 * Provides interactive buttons for monster care actions
 * Maps each monster state to an appropriate action:
 * - hungry → Nourrir (Feed)
 * - gamester → Jouer (Play)
 * - sad → Réconforter (Comfort)
 * - angry → Apaiser (Calm)
 * - sleepy → Bercer (Lull to sleep)
 */
export default function MonsterActions (): ReactNode {
  const handleFeed = (): void => {
    console.log('Feed action - for hungry state')
    // TODO: Implement feed logic
  }

  const handlePlay = (): void => {
    console.log('Play action - for gamester state')
    // TODO: Implement play logic
  }

  const handleComfort = (): void => {
    console.log('Comfort action - for sad state')
    // TODO: Implement comfort logic
  }

  const handleCalm = (): void => {
    console.log('Calm action - for angry state')
    // TODO: Implement calm logic
  }

  const handleLullaby = (): void => {
    console.log('Lullaby action - for sleepy state')
    // TODO: Implement lullaby logic
  }

  return (
    <div className='rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
      <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Actions</h3>

      <div className='space-y-3'>
        {/* Feed Button - for hungry state */}
        <Button
          onClick={handleFeed}
          className='flex items-center gap-3 bg-tolopea-500 hover:bg-tolopea-600 py-4'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          <span className='flex-1 text-left'>Nourrir</span>
          <span className='text-sm opacity-75'>🍔</span>
        </Button>

        {/* Play Button - for gamester state */}
        <Button
          onClick={handlePlay}
          className='flex items-center gap-3 bg-aqua-forest-500 hover:bg-aqua-forest-600 py-4'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <span className='flex-1 text-left'>Jouer</span>
          <span className='text-sm opacity-75'>🎮</span>
        </Button>

        {/* Comfort Button - for sad state */}
        <Button
          onClick={handleComfort}
          className='flex items-center gap-3 bg-blue-500 hover:bg-blue-600 py-4'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
          </svg>
          <span className='flex-1 text-left'>Réconforter</span>
          <span className='text-sm opacity-75'>💙</span>
        </Button>

        {/* Calm Button - for angry state */}
        <Button
          onClick={handleCalm}
          variant='primary'
          className='flex items-center gap-3 py-4'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
          </svg>
          <span className='flex-1 text-left'>Apaiser</span>
          <span className='text-sm opacity-75'>🧘</span>
        </Button>

        {/* Lullaby Button - for sleepy state */}
        <Button
          onClick={handleLullaby}
          className='flex items-center gap-3 bg-purple-500 hover:bg-purple-600 py-4'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
          </svg>
          <span className='flex-1 text-left'>Bercer</span>
          <span className='text-sm opacity-75'>🌙</span>
        </Button>
      </div>

      <p className='mt-4 text-center text-sm text-gray-600'>
        Interagissez avec votre monstre pour le garder heureux !
      </p>
    </div>
  )
}
