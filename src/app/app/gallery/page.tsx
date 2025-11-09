import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import GalleryContent from '@/components/gallery/GalleryContent'
import SectionTitle from '@/components/ui/SectionTitle'
import { getPublicMonstersPaginated } from '@/actions/monsters.actions'
import AppLayout from '@/components/navigation/AppLayout'

/**
 * Gallery page
 * Displays all public monsters from all users in an art gallery style
 * Uses infinite scroll and filters for better performance and UX
 */
export default async function GalleryPage (): Promise<ReactNode> {
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  // Charger la première page de monstres (12 par défaut)
  const { monsters, nextCursor, hasMore, total } = await getPublicMonstersPaginated()

  const pluralMonsters = total > 1 ? 's' : ''

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
              <span>{total} monstre{pluralMonsters} public{pluralMonsters}</span>
            </div>
          </div>

          {/* Gallery Content with Filters and Infinite Scroll */}
          <GalleryContent
            initialMonsters={monsters}
            initialCursor={nextCursor}
            initialHasMore={hasMore}
            initialTotal={total}
          />
        </div>
      </div>
    </AppLayout>
  )
}
