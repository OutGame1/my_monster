import type { ReactNode } from 'react'
import Skeleton from '@/components/ui/Skeleton'

/**
 * Monster card skeleton component
 * Displays a loading placeholder for monster cards
 */
export default function MonsterCardSkeleton (): ReactNode {
  return (
    <div className='group relative overflow-hidden rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
      {/* Monster Avatar Skeleton - Center Display */}
      <div className='mb-4 flex justify-center'>
        <div className='rounded-full bg-gradient-to-br from-tolopea-50 to-aqua-forest-50 p-4'>
          <Skeleton circle width={180} height={180} />
        </div>
      </div>

      {/* Monster Information Skeleton */}
      <div className='text-center'>
        {/* Name */}
        <div className='mb-2 flex justify-center'>
          <Skeleton width={150} height={32} />
        </div>

        {/* Badges */}
        <div className='mb-4 flex items-center justify-center gap-2'>
          <Skeleton width={80} height={28} borderRadius={9999} />
          <Skeleton width={100} height={28} borderRadius={9999} />
        </div>
      </div>
    </div>
  )
}
