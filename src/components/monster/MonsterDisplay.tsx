import type { ReactNode } from 'react'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import MonsterBackgroundDisplay from '@/components/backgrounds/MonsterBackgroundDisplay'

interface MonsterDisplayProps {
  monster: ISerializedMonster
  onBackgroundChanged?: () => void
}

/**
 * Monster display component
 * Shows the monster's avatar with background and name
 */
export default function MonsterDisplay ({ monster, onBackgroundChanged }: MonsterDisplayProps): ReactNode {
  return (
    <MonsterBackgroundDisplay
      monsterId={monster._id}
      monsterName={monster.name}
      backgroundId={monster.backgroundId}
      onBackgroundChanged={onBackgroundChanged}
      showChangeButton
    >
      <MonsterAvatar
        traits={monster.traits}
        state={monster.state}
        size={200}
      />
    </MonsterBackgroundDisplay>
  )
}
