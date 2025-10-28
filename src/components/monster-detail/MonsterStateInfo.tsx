import type { ReactNode } from 'react'
import type { MonsterState } from '@/db/models/monster.model'
import { getStateEmoji, getStateColor } from '@/components/dashboard/monster-state.utils'

interface MonsterStateInfoProps {
  name: string
  state: MonsterState
}

/**
 * Monster state information component
 * Displays the current emotional/physical state of the monster
 */
export default function MonsterStateInfo ({ name, state }: MonsterStateInfoProps): ReactNode {
  const stateEmoji = getStateEmoji(state)
  const stateColor = getStateColor(state)

  return (
    <div className='rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
      <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>État actuel</h3>

      <div className='flex items-center gap-4'>
        <div className='text-5xl'>{stateEmoji}</div>
        <div className='flex-1'>
          <p className='text-2xl font-bold text-gray-800'>
            {name} est <span className='text-tolopea-600'>{state}</span> !
          </p>
          <div className='mt-2'>
            <span className={`inline-block rounded-full border px-4 py-1 text-sm font-semibold ${stateColor}`}>
              {state.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
