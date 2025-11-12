import type { ReactNode } from 'react'
import Skeleton from '@/components/ui/Skeleton'

export default function BackgroundSelectorSkeleton (): ReactNode {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} height={180} className='rounded-lg' />
      ))}
    </div>
  )
}
