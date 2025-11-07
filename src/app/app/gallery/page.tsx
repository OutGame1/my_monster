import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import SectionTitle from '@/components/ui/SectionTitle'
import { getPublicMonsters } from '@/actions/monsters.actions'
import AppLayout from '@/components/navigation/AppLayout'

/**
 * Gallery page
 * Displays all public monsters from all users in an art gallery style
 */
export default async function GalleryPage (): Promise<ReactNode> {
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  const publicMonsters = await getPublicMonsters()

  const pluralMonsters = publicMonsters.length > 1 ? 's' : ''

  return (
    <AppLayout>
      <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          {/* Header Section */}
          <SectionTitle
            title='Galerie Communautaire'
            subtitle='Découvrez les créations publiques de notre communauté de dresseurs'
          />

          <div className='mb-8 flex items-center justify-center gap-8 text-sm text-gray-500'>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-aqua-forest-400' />
              <span>{publicMonsters.length} monstre{pluralMonsters} public{pluralMonsters}</span>
            </div>
          </div>

          {/* Gallery Grid */}
          <GalleryGrid monsters={publicMonsters} />
        </div>
      </div>
    </AppLayout>
  )
}
