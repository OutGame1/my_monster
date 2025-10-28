import type { ReactNode } from 'react'

interface MonsterXPBarProps {
  currentXP: number
  maxXP: number
}

/**
 * Monster XP progress bar component
 * Displays the monster's experience points progress
 */
export default function MonsterXPBar ({ currentXP, maxXP }: MonsterXPBarProps): ReactNode {
  const percentage = (currentXP / maxXP) * 100

  return (
    <div className='rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-tolopea-800'>Expérience</h3>
        <span className='text-sm font-medium text-tolopea-600'>
          {currentXP} / {maxXP} XP
        </span>
      </div>

      {/* Progress Bar */}
      <div className='relative h-6 overflow-hidden rounded-full bg-gray-200'>
        <div
          className='h-full rounded-full bg-gradient-to-r from-tolopea-500 to-aqua-forest-500 transition-all duration-500'
          style={{ width: `${percentage}%` }}
        />
        {/* Shine effect */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
      </div>

      {/* XP percentage */}
      <p className='mt-2 text-center text-sm text-gray-600'>
        {percentage.toFixed(0)}% jusqu'au prochain niveau
      </p>
    </div>
  )
}
