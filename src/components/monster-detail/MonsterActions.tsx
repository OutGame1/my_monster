'use client'

import type { ReactNode } from 'react'

/**
 * Monster action buttons component
 * Provides interactive buttons for monster care actions
 */
export default function MonsterActions (): ReactNode {
  const handleFeed = (): void => {
    console.log('Feed action')
    // TODO: Implement feed logic
  }

  const handlePlay = (): void => {
    console.log('Play action')
    // TODO: Implement play logic
  }

  const handleTrain = (): void => {
    console.log('Train action')
    // TODO: Implement train logic
  }

  return (
    <div className='rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
      <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Actions</h3>

      <div className='space-y-3'>
        {/* Feed Button */}
        <button
          onClick={handleFeed}
          className='flex w-full items-center gap-3 rounded-lg bg-tolopea-500 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-tolopea-600 active:scale-95'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          <span className='flex-1 text-left'>Nourrir</span>
          <span className='text-sm opacity-75'>🍔</span>
        </button>

        {/* Play Button */}
        <button
          onClick={handlePlay}
          className='flex w-full items-center gap-3 rounded-lg bg-aqua-forest-500 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-aqua-forest-600 active:scale-95'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <span className='flex-1 text-left'>Jouer</span>
          <span className='text-sm opacity-75'>🎮</span>
        </button>

        {/* Train Button */}
        <button
          onClick={handleTrain}
          className='flex w-full items-center gap-3 rounded-lg bg-blood-500 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-blood-600 active:scale-95'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
          </svg>
          <span className='flex-1 text-left'>Entraîner</span>
          <span className='text-sm opacity-75'>💪</span>
        </button>
      </div>

      <p className='mt-4 text-center text-sm text-gray-600'>
        Interagissez avec votre monstre pour le garder heureux !
      </p>
    </div>
  )
}
