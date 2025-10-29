'use client'

import type { ReactNode } from 'react'

interface EmptyMonstersStateProps {
  onCreateMonster: () => void
}

/**
 * Empty state component
 * Displayed when user has no monsters yet
 */
export default function EmptyMonstersState ({ onCreateMonster }: EmptyMonstersStateProps): ReactNode {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-tolopea-300 bg-white/50 p-12 text-center backdrop-blur-sm'>
      {/* Empty State Icon */}
      <div className='mb-4 text-6xl'>🥚</div>

      {/* Empty State Message */}
      <h2 className='mb-2 text-2xl font-bold text-tolopea-800'>
        Aucun monstre pour le moment
      </h2>
      <p className='mb-6 text-tolopea-600'>
        Créez votre premier monstre pour commencer l'aventure !
      </p>

      {/* Call to Action Button */}
      <button
        onClick={onCreateMonster}
        className='rounded-lg bg-blood-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blood-600 active:scale-95'
      >
        Créer mon premier monstre
      </button>
    </div>
  )
}
