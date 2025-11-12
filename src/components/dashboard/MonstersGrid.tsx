import type { ReactNode } from 'react'
import EmptyMonstersState from './EmptyMonstersState'
import MonsterCard from './MonsterCard'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'

interface MonstersGridProps {
  monsters: ISerializedMonster[]
  onCreateMonster: () => void
}

/**
 * Monsters grid layout component
 * Displays all user monsters in a responsive grid or shows empty state
 */
export default function MonstersGrid ({ monsters, onCreateMonster }: MonstersGridProps): ReactNode {
  // Show empty state if no monsters
  if (monsters.length === 0) {
    return <EmptyMonstersState onCreateMonster={onCreateMonster} />
  }

  // Display monsters in responsive grid
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {monsters.map((monster) => (
        <MonsterCard key={monster._id} monster={monster} />
      ))}
    </div>
  )
}
