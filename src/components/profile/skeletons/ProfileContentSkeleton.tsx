import type { ReactNode } from 'react'
import Skeleton from '@/components/ui/Skeleton'
import Card from '@/components/ui/Card'
import SectionTitle from '@/components/ui/SectionTitle'

/**
 * Profile content skeleton component
 * Displays loading placeholders for the entire profile page
 */
export default function ProfileContentSkeleton (): ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
      <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Section Title */}
        <SectionTitle
          title='Mon Profil'
          subtitle='Gérez vos informations et statistiques'
        />

        {/* Account Information Section Skeleton */}
        <Card className='mb-6'>
          <div className='mb-6'>
            <div className='flex items-center gap-2'>
              <Skeleton circle width={24} height={24} />
              <Skeleton width={240} height={32} />
            </div>
          </div>

          <div className='space-y-6'>
            {/* User Name Skeleton */}
            <div className='flex items-start gap-4'>
              <Skeleton circle width={48} height={48} />
              <div className='flex-1'>
                <Skeleton width={120} height={14} className='mb-2' />
                <Skeleton width={180} height={24} />
              </div>
            </div>

            {/* Email Skeleton */}
            <div className='flex items-start gap-4 border-t border-tolopea-100 pt-6'>
              <Skeleton circle width={48} height={48} />
              <div className='flex-1'>
                <Skeleton width={80} height={14} className='mb-2' />
                <Skeleton width={220} height={24} />
              </div>
            </div>

            {/* Member Since Skeleton */}
            <div className='flex items-start gap-4 border-t border-tolopea-100 pt-6'>
              <Skeleton circle width={48} height={48} />
              <div className='flex-1'>
                <Skeleton width={140} height={14} className='mb-2' />
                <Skeleton width={200} height={24} />
              </div>
            </div>
          </div>
        </Card>

        {/* Wallet Statistics Section Skeleton */}
        <Card className='mb-6'>
          <div className='mb-6'>
            <div className='flex items-center gap-2'>
              <Skeleton circle width={24} height={24} />
              <Skeleton width={280} height={32} />
            </div>
          </div>

          <div className='space-y-6'>
            {/* Current Balance Skeleton */}
            <div className='flex items-start gap-4'>
              <Skeleton circle width={48} height={48} />
              <div className='flex-1'>
                <Skeleton width={100} height={14} className='mb-2' />
                <Skeleton width={120} height={24} />
              </div>
            </div>

            {/* Total Earned Skeleton */}
            <div className='flex items-start gap-4 border-t border-tolopea-100 pt-6'>
              <Skeleton circle width={48} height={48} />
              <div className='flex-1'>
                <Skeleton width={180} height={14} className='mb-2' />
                <Skeleton width={140} height={24} className='mb-1' />
                <Skeleton width={220} height={12} />
              </div>
            </div>
          </div>
        </Card>

        {/* Logout Section Skeleton */}
        <Card>
          <div className='mb-4'>
            <div className='flex items-center gap-2'>
              <Skeleton circle width={24} height={24} />
              <Skeleton width={180} height={32} />
            </div>
          </div>

          <div className='space-y-4'>
            <Skeleton width={280} height={20} />
            <Skeleton width={180} height={48} borderRadius={8} />
          </div>
        </Card>
      </div>
    </div>
  )
}
