import type { ReactNode } from 'react'
import GalleryMonsterCard from './GalleryMonsterCard'
import type { ISerializedPublicMonster } from '@/lib/serializers/monster.serializer'

interface GalleryGridProps {
  monsters: ISerializedPublicMonster[]
}

/**
 * Gallery grid component
 * Displays public monsters in an art gallery style grid
 */
export default function GalleryGrid ({ monsters }: GalleryGridProps): ReactNode {
  if (monsters.length === 0) {
    return (
      <div className='flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-tolopea-200 bg-tolopea-50/30 p-12'>
        <div className='text-center'>
          <p className='text-2xl font-bold text-tolopea-600'>🎨 Galerie vide</p>
          <p className='mt-2 text-gray-600'>
            Aucun monstre public pour le moment. Soyez le premier à partager votre création !
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {monsters.map(monster => (
        <GalleryMonsterCard key={monster._id} monster={monster} />
      ))}
    </div>
  )
}
