import type { ReactNode } from 'react'
import type { IMonster } from '@/db/models/monster.model'
import MonsterAvatar from '@/components/monster/MonsterAvatar'

interface MonsterDisplayProps {
  monster: IMonster
}

/**
 * Monster display component
 * Shows the monster's avatar and name
 */
export default function MonsterDisplay ({ monster }: MonsterDisplayProps): ReactNode {
  return (
    <div className='sticky top-8 rounded-2xl border border-tolopea-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm'>
      {/* Monster Avatar */}
      <div className='mb-6 flex justify-center'>
        <div className='rounded-full bg-gradient-to-br from-tolopea-50 to-aqua-forest-50 p-8'>
          <MonsterAvatar
            traits={monster.traits}
            state={monster.state}
            size={320}
          />
        </div>
      </div>

      {/* Monster Name */}
      <h1 className='text-center text-4xl font-bold text-tolopea-800'>{monster.name}</h1>

      {/* Level Badge */}
      <div className='mt-4 flex justify-center'>
        <span className='rounded-full bg-blood-100 px-6 py-2 text-xl font-semibold text-blood-700'>
          Niveau {monster.level}
        </span>
      </div>
    </div>
  )
}
