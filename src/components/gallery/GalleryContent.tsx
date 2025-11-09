'use client'

import { useState, useCallback, type ReactNode } from 'react'
import InfiniteGalleryGrid from './InfiniteGalleryGrid'
import GalleryFiltersBar from './GalleryFiltersBar'
import { getPublicMonstersPaginated } from '@/actions/monsters.actions'
import { DEFAULT_SORT, GALLERY_PAGE_SIZE } from '@/config/gallery.config'
import type {
  GalleryContentProps,
  GalleryFilters,
  GalleryFiltersParams
} from '@/types/gallery'

/**
 * Composant client pour la galerie avec filtres et infinite scroll
 * Gère l'état des filtres et recharge les données quand ils changent
 */
export default function GalleryContent ({
  initialMonsters,
  initialCursor,
  initialHasMore,
  initialTotal
}: GalleryContentProps): ReactNode {
  const [filters, setFilters] = useState<GalleryFilters>({
    sortBy: DEFAULT_SORT
  })

  const [monsters, setMonsters] = useState(initialMonsters)
  const [cursor, setCursor] = useState(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [total, setTotal] = useState(initialTotal)
  const [isLoading, setIsLoading] = useState(false)

  // Fonction pour recharger les données avec les nouveaux filtres
  const handleFiltersChange = useCallback((newFilters: GalleryFilters) => {
    setFilters(newFilters)
    setIsLoading(true)

    // Convertir les filtres UI en filtres API
    const apiFilters: GalleryFiltersParams = {
      minLevel: newFilters.minLevel,
      maxLevel: newFilters.maxLevel,
      state: newFilters.state === 'all' ? undefined : newFilters.state,
      sortBy: newFilters.sortBy
    }

    // Recharger depuis le début avec les nouveaux filtres
    void getPublicMonstersPaginated(undefined, GALLERY_PAGE_SIZE, apiFilters)
      .then(result => {
        setMonsters(result.monsters)
        setCursor(result.nextCursor)
        setHasMore(result.hasMore)
        setTotal(result.total)
      })
      .catch(error => {
        console.error('Error applying filters:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Convertir les filtres pour la fonction fetchMore
  const fetchMore = useCallback(async (currentCursor: string) => {
    const apiFilters: GalleryFiltersParams = {
      minLevel: filters.minLevel,
      maxLevel: filters.maxLevel,
      state: filters.state === 'all' ? undefined : filters.state,
      sortBy: filters.sortBy
    }

    const result = await getPublicMonstersPaginated(currentCursor, GALLERY_PAGE_SIZE, apiFilters)
    return {
      data: result.monsters,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore
    }
  }, [filters])

  return (
    <>
      {/* Barre de filtres */}
      <GalleryFiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={total}
      />

      {/* Overlay de chargement lors du changement de filtres */}
      {isLoading && (
        <div className='mb-8 flex items-center justify-center gap-3 rounded-xl bg-tolopea-50 py-8 text-tolopea-600'>
          <div className='h-6 w-6 animate-spin rounded-full border-4 border-tolopea-200 border-t-tolopea-600' />
          <span className='font-medium'>Application des filtres...</span>
        </div>
      )}

      {/* Grille avec infinite scroll */}
      {!isLoading && (
        <InfiniteGalleryGrid
          key={`${filters.sortBy ?? 'newest'}-${filters.state ?? 'all'}-${filters.minLevel ?? 0}-${filters.maxLevel ?? 0}`}
          initialMonsters={monsters}
          initialCursor={cursor}
          initialHasMore={hasMore}
          totalCount={total}
          fetchMore={fetchMore}
        />
      )}
    </>
  )
}
