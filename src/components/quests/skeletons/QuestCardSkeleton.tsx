import type { ReactNode } from 'react'
import Skeleton from '@/components/ui/Skeleton'
import Card from '@/components/ui/Card'

/**
 * Quest card skeleton component
 * Displays a loading placeholder for quest cards
 */
export default function QuestCardSkeleton (): ReactNode {
  return (
    <Card className='relative'>
      {/* Icon & Title */}
      <div className='mb-4 flex items-start justify-between'>
        <div className='flex items-center gap-3 flex-1'>
          <Skeleton circle width={48} height={48} />
          <div className='flex-1'>
            <Skeleton width='70%' height={24} className='mb-2' />
            <Skeleton width='90%' height={16} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='mb-4'>
        <div className='mb-2 flex items-center justify-between'>
          <Skeleton width={60} height={16} />
          <Skeleton width={40} height={16} />
        </div>
        <Skeleton height={12} borderRadius={9999} />
      </div>

      {/* Reward & Action */}
      <div className='flex items-center justify-between gap-4'>
        <Skeleton width={80} height={24} />
        <Skeleton width={100} height={40} borderRadius={8} />
      </div>
    </Card>
  )
}
