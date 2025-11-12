import type { ReactNode } from 'react'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import MonsterBackgroundDisplay from '@/components/backgrounds/MonsterBackgroundDisplay'
import { User } from 'lucide-react'
import type { ISerializedPublicMonster } from '@/lib/serializers/monster.serializer'

interface GalleryMonsterCardProps {
  monster: ISerializedPublicMonster
}

/**
 * Gallery monster card component
 * Displays a public monster in a gallery art style with creator info
 */
export default function GalleryMonsterCard ({ monster }: GalleryMonsterCardProps): ReactNode {
  return (
    <div className='group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'>
      {/* Monster Avatar with Background */}
      <div className='relative'>
        <MonsterBackgroundDisplay
          monsterId={monster._id}
          monsterName={monster.name}
          backgroundId={monster.backgroundId}
          showChangeButton={false}
        >
          <MonsterAvatar
            traits={monster.traits}
            state={monster.state}
            size={240}
          />
        </MonsterBackgroundDisplay>

        {/* Level Badge - Top Right Corner */}
        <div className='absolute top-4 right-4 z-10'>
          <span className='rounded-full bg-blood-500 px-3 py-1 text-sm font-bold text-white shadow-lg'>
            Niv. {monster.level}
          </span>
        </div>
      </div>

      {/* Info Section - Gallery Plaque Style */}
      <div className='border-t-4 border-tolopea-200 bg-gradient-to-b from-white to-gray-50 p-6'>
        {/* Monster Name - Title */}
        <h3 className='mb-3 text-center text-2xl font-bold text-tolopea-800'>
          {monster.name}
        </h3>

        {/* Creator Info - Artist Signature Style */}
        <div className='flex items-center justify-center gap-2 text-gray-600'>
          <User className='h-4 w-4' />
          <p className='text-sm font-medium'>
            par <span className='font-semibold text-tolopea-600'>{monster.ownerName}</span>
          </p>
        </div>

        {/* Decorative Line */}
        <div className='mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-tolopea-300 to-aqua-forest-300' />
      </div>

      {/* Hover Overlay Effect */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-tolopea-900/0 to-tolopea-900/0 transition-all duration-300 group-hover:from-tolopea-900/5 group-hover:to-transparent' />
    </div>
  )
}
