import type { ReactNode } from 'react'
import type { IMonster } from '@/db/models/monster.model'

interface DashboardStatsProps {
  monsters: IMonster[]
}

/**
 * Dashboard statistics overview
 * Displays key metrics about the user's monster collection
 */
export default function DashboardStats ({ monsters }: DashboardStatsProps): ReactNode {
  const totalMonsters = monsters.length
  const totalLevels = monsters.reduce((sum, m) => sum + m.level, 0)
  const happyMonsters = monsters.filter(m => m.state === 'happy').length

  return (
    <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3'>
      {/* Total Monsters Count */}
      <div className='rounded-2xl border border-aqua-forest-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105'>
        <div className='text-3xl font-bold text-aqua-forest-600'>{totalMonsters}</div>
        <div className='text-sm text-aqua-forest-700'>Monstres collectés</div>
      </div>

      {/* Cumulative Levels */}
      <div className='rounded-2xl border border-tolopea-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105'>
        <div className='text-3xl font-bold text-tolopea-600'>{totalLevels}</div>
        <div className='text-sm text-tolopea-700'>Niveaux cumulés</div>
      </div>

      {/* Happy Monsters Count */}
      <div className='rounded-2xl border border-blood-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105'>
        <div className='text-3xl font-bold text-blood-600'>{happyMonsters}</div>
        <div className='text-sm text-blood-700'>Monstres heureux</div>
      </div>
    </div>
  )
}
