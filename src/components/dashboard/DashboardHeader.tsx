import type { ReactNode } from 'react'

interface DashboardHeaderProps {
  userName: string | null
  onCreateMonster: () => void
}

/**
 * Dashboard welcome header
 * Displays personalized greeting to the user
 */
export default function DashboardHeader ({ userName, onCreateMonster }: DashboardHeaderProps): ReactNode {
  return (
    <div className='mb-8 flex items-center justify-between'>
      <div>
        <h1 className='mb-2 text-4xl font-bold text-tolopea-800'>
          Bienvenue, {userName ?? 'Dresseur de monstres'} ! 👋
        </h1>
        <p className='text-lg text-tolopea-600'>
          Voici votre collection de monstres adorables
        </p>
      </div>
      <button
        onClick={onCreateMonster}
        className='hidden rounded-lg bg-blood-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blood-600 active:scale-95 sm:block'
      >
        + Créer un monstre
      </button>
    </div>
  )
}
