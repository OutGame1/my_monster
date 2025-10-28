'use client'

import type { ReactNode } from 'react'
import { Utensils, Gamepad2, Heart, Lightbulb, Moon } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Monster action buttons component
 * Provides interactive buttons for monster care actions in a 2x3 grid
 * Maps each monster state to an appropriate action with specific colors:
 * - hungry → Nourrir (Feed) - golden-fizz
 * - gamester → Jouer (Play) - blood
 * - sad → Réconforter (Comfort) - tolopea
 * - angry → Apaiser (Calm) - aqua-forest
 * - sleepy → Bercer (Lull to sleep) - seance
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

      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
        {/* Feed Button - for hungry state */}
        <Button
          onClick={handleFeed}
          color='golden-fizz'
          variant='primary'
        >
          Nourrir
          <Utensils size={32} />
          {/* <span className='text-base font-bold'>Nourrir</span> */}
        </Button>

        {/* Play Button - for gamester state */}
        <Button
          onClick={handlePlay}
          color='blood'
          variant='primary'
        >
          Jouer
          <Gamepad2 size={32} />
        </Button>

        {/* Comfort Button - for sad state */}
        <Button
          onClick={handleComfort}
          color='tolopea'
          variant='primary'
        >
          Réconforter
          <Heart size={32} />
        </Button>

        {/* Calm Button - for angry state */}
        <Button
          onClick={handleCalm}
          color='aqua-forest'
          variant='primary'
        >
          Apaiser
          <Lightbulb size={32} />
        </Button>

        {/* Lullaby Button - for sleepy state */}
        <Button
          onClick={handleLullaby}
          color='seance'
          variant='primary'
        >
          Bercer
          <Moon size={32} />
        </Button>
      </div>

      <p className='mt-4 text-center text-sm text-gray-600'>
        Interagissez avec votre monstre pour le garder heureux !
      </p>
    </div>
  )
}
