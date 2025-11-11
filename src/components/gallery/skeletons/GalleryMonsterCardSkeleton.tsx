import type { ReactNode } from 'react'
import Skeleton from '@/components/ui/Skeleton'

/**
 * Gallery monster card skeleton component
 * Displays a loading placeholder for gallery monster cards
 */
export default function GalleryMonsterCardSkeleton (): ReactNode {
  return (
    <div className='relative overflow-hidden rounded-xl bg-white shadow-md'>
      {/* Monster Avatar Frame - Skeleton */}
      <div className='relative aspect-square bg-gradient-to-br from-tolopea-50 via-white to-aqua-forest-50 p-8'>
        <div className='flex h-full items-center justify-center'>
          <Skeleton circle width={200} height={200} />
        </div>

        {/* Level Badge Skeleton - Top Right Corner */}
        <div className='absolute top-4 right-4'>
          <Skeleton width={70} height={28} borderRadius={9999} />
        </div>
      </div>

      {/* Info Section Skeleton */}
      <div className='border-t-4 border-tolopea-200 bg-gradient-to-b from-white to-gray-50 p-6'>
        {/* Monster Name Skeleton */}
        <div className='mb-3 flex justify-center'>
          <Skeleton width={150} height={32} />
        </div>

        {/* Creator Info Skeleton */}
        <div className='flex items-center justify-center gap-2'>
          <Skeleton circle width={16} height={16} />
          <Skeleton width={120} height={20} />
        </div>

        {/* Decorative Line */}
        <div className='mx-auto mt-4'>
          <Skeleton width={64} height={4} borderRadius={9999} />
        </div>
      </div>
    </div>
  )
}
