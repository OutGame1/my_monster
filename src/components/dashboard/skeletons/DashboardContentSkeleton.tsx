import type { ReactNode } from 'react'
import Skeleton from '@/components/ui/Skeleton'
import SectionTitle from '@/components/ui/SectionTitle'
import MonsterCardSkeleton from './MonsterCardSkeleton'

/**
 * Dashboard content skeleton component
 * Displays loading placeholders for the entire dashboard page
 */
export default function DashboardContentSkeleton (): ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Section Title */}
        <SectionTitle
          title='Mes monstres'
          subtitle='Découvrez votre collection de créatures extraordinaires'
        />

        {/* Create Monster Button Skeleton */}
        <div className='mb-8 flex'>
          <Skeleton width={320} height={80} borderRadius={16} />
        </div>

        {/* Monsters Grid Skeleton */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <MonsterCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
