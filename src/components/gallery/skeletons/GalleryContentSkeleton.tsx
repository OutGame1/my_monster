import type { ReactNode } from 'react'
import Skeleton from '@/components/ui/Skeleton'
import SectionTitle from '@/components/ui/SectionTitle'
import GalleryMonsterCardSkeleton from './GalleryMonsterCardSkeleton'

/**
 * Gallery content skeleton component
 * Displays loading placeholders for the entire gallery page
 */
export default function GalleryContentSkeleton (): ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <SectionTitle
          title='Galerie Communautaire'
          subtitle='Découvrez les créations publiques de notre communauté de dresseurs'
        />

        {/* Stats Skeleton */}
        <div className='mb-8 flex items-center justify-center gap-8'>
          <div className='flex items-center gap-2'>
            <Skeleton circle width={12} height={12} />
            <Skeleton width={120} height={20} />
          </div>
        </div>

        {/* Filters Bar Skeleton */}
        <div className='mb-8 rounded-xl bg-white p-6 shadow-lg'>
          <div className='flex flex-wrap items-center gap-4'>
            <Skeleton width={150} height={40} borderRadius={8} />
            <Skeleton width={150} height={40} borderRadius={8} />
            <Skeleton width={200} height={40} borderRadius={8} />
            <div className='ml-auto'>
              <Skeleton width={100} height={40} borderRadius={8} />
            </div>
          </div>
        </div>

        {/* Gallery Grid Skeleton */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 12 }).map((_, i) => (
            <GalleryMonsterCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
