import type { ReactNode } from 'react'
import Skeleton from '@/components/ui/Skeleton'
import Card from '@/components/ui/Card'
import SectionTitle from '@/components/ui/SectionTitle'
import QuestCardSkeleton from './QuestCardSkeleton'

/**
 * Quests content skeleton component
 * Displays loading placeholders for the entire quests page
 */
export default function QuestsContentSkeleton (): ReactNode {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Section Title */}
        <SectionTitle
          title='Quêtes & Succès'
          subtitle='Accomplissez des objectifs pour gagner des pièces'
        />

        {/* Info Card Skeleton */}
        <Card className='mb-8 bg-gradient-to-r from-tolopea-50 to-aqua-forest-50'>
          <div className='flex items-start gap-3'>
            <Skeleton circle width={24} height={24} className='flex-shrink-0 mt-1' />
            <div className='flex-1'>
              <Skeleton width='60%' height={20} className='mb-2' />
              <Skeleton width='80%' height={16} />
            </div>
          </div>
        </Card>

        {/* Tabs Skeleton */}
        <div className='mb-8 flex gap-4'>
          <Skeleton width={220} height={48} borderRadius={8} />
          <Skeleton width={200} height={48} borderRadius={8} />
        </div>

        {/* Quests Grid Skeleton */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <QuestCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
