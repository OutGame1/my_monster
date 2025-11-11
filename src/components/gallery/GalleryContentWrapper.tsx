'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { getPublicMonstersPaginated } from '@/actions/monsters.actions'
import type { ISerializedPublicMonster } from '@/lib/serializers/monster.serializer'
import GalleryContent from './GalleryContent'
import GalleryContentSkeleton from './skeletons/GalleryContentSkeleton'
import SectionTitle from '@/components/ui/SectionTitle'

/**
 * Gallery content wrapper that fetches data client-side
 * Shows skeleton while loading
 */
export default function GalleryContentWrapper (): ReactNode {
  const [monsters, setMonsters] = useState<ISerializedPublicMonster[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGalleryData = async (): Promise<void> => {
      try {
        const result = await getPublicMonstersPaginated()
        setMonsters(result.monsters)
        setNextCursor(result.nextCursor)
        setHasMore(result.hasMore)
        setTotal(result.total)
      } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchGalleryData()
  }, [])

  if (isLoading) {
    return <GalleryContentSkeleton />
  }

  const pluralMonsters = total > 1 ? 's' : ''

  return (
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
  )
}
