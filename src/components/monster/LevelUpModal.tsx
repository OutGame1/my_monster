'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import cn from 'classnames'

interface LevelUpModalProps {
  isOpen: boolean
  monsterName: string
  newLevel: number
  onClose: () => void
}

/**
 * Level-up celebration modal
 * Displays a dramatic full-screen overlay when monster levels up
 */
export default function LevelUpModal ({ isOpen, monsterName, newLevel, onClose }: LevelUpModalProps): ReactNode {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300) // Wait for fade-out animation
      }, 3000)
      return () => { clearTimeout(timer) }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300',
        show ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Dark overlay */}
      <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' />

      {/* Content */}
      <div
        className={cn(
          'relative z-10 transform transition-all duration-500',
          show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        )}
      >
        <div className='relative'>
          {/* Glowing effect */}
          <div className='absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-r from-golden-fizz-500 via-tolopea-500 to-seance-500 blur-3xl opacity-50' />

          {/* Main card */}
          <div className='relative rounded-3xl border-4 border-golden-fizz-400 bg-gradient-to-br from-tolopea-600 via-tolopea-700 to-tolopea-800 p-12 shadow-2xl'>
            {/* Sparkles */}
            <div className='absolute -top-6 -left-6 text-6xl animate-bounce'>✨</div>
            <div className='absolute -top-6 -right-6 text-6xl animate-bounce delay-100'>✨</div>
            <div className='absolute -bottom-6 -left-6 text-6xl animate-bounce delay-200'>✨</div>
            <div className='absolute -bottom-6 -right-6 text-6xl animate-bounce delay-300'>✨</div>

            {/* Text content */}
            <div className='text-center'>
              <h2 className='mb-4 text-6xl font-bold text-golden-fizz-300 drop-shadow-lg'>
                NIVEAU SUPÉRIEUR !
              </h2>
              <p className='text-3xl font-semibold text-white drop-shadow-md'>
                {monsterName} est passé au niveau {newLevel} !
              </p>

              {/* Level badge */}
              <div className='mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-golden-fizz-400 to-golden-fizz-600 px-8 py-4 shadow-xl ring-4 ring-golden-fizz-300/50'>
                <span className='text-5xl font-black text-golden-fizz-900'>
                  Niv. {newLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
