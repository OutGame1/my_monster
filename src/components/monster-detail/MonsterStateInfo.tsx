import type { ReactNode } from 'react'
import type { MonsterState } from '@/db/models/monster.model'
import { stateInfoMap } from '@/components/dashboard/monster-state.utils'

interface MonsterStateInfoProps {
  name: string
  state: MonsterState
}

/**
 * Monster state information component
 * Displays the current emotional/physical state of the monster
 */
export default function MonsterStateInfo ({ name, state }: MonsterStateInfoProps): ReactNode {
  const {
    label,
    emoji
  } = stateInfoMap[state]

  return (
    <div className='rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
      <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>État actuel</h3>

      <div className='flex items-center gap-4'>
        <div className='text-5xl'>{emoji}</div>
        <p className='text-2xl font-bold text-gray-800'>
          {name} est <span className='text-tolopea-600'>{label.toLowerCase()}</span> !
        </p>
      </div>
    </div>
  )
}
