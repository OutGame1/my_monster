'use client'

import { useState, useCallback, useEffect, type ReactNode } from 'react'
import InfiniteGalleryGrid from './InfiniteGalleryGrid'
import GalleryFiltersBar from './GalleryFiltersBar'
import { getPublicMonstersPaginated } from '@/actions/monsters.actions'
import { DEFAULT_SORT, GALLERY_PAGE_SIZE } from '@/config/gallery.config'
import {
  GetPublicMonstersPaginatedResult,
  type GalleryFilters,
  type GalleryFiltersParams
} from '@/types/gallery'
import Skeleton from '@/components/ui/Skeleton'
import GalleryMonsterCardSkeleton from './skeletons/GalleryMonsterCardSkeleton'
import SectionTitle from '@/components/ui/SectionTitle'

/**
 * Composant client pour la galerie avec filtres et infinite scroll
 * Gère le chargement initial, l'état des filtres et recharge les données quand ils changent
 * Affiche les squelettes pendant le chargement initial
 */
export default function GalleryContent (): ReactNode {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [filters, setFilters] = useState<GalleryFilters>({
    sortBy: DEFAULT_SORT
  })

  const [result, setResult] = useState<GetPublicMonstersPaginatedResult>({
    monsters: [],
    nextCursor: null,
    hasMore: false,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  // Chargement initial des données
  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      try {
        const result = await getPublicMonstersPaginated()
        setResult(result)
      } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    void fetchInitialData()
  }, [])

  // Fonction pour recharger les données avec les nouveaux filtres
  const handleFiltersChange = useCallback(async (newFilters: GalleryFilters) => {
    setFilters(newFilters)

    if (newFilters.minLevel !== undefined &&
        newFilters.maxLevel !== undefined &&
        newFilters.minLevel > newFilters.maxLevel) {
      // Ne pas appliquer les filtres si la plage de niveaux est invalide
      setResult(prev => ({ ...prev, monsters: [] }))
      return
    }

    setIsLoading(true)

    // Convertir les filtres UI en filtres API
    const apiFilters: GalleryFiltersParams = {
      minLevel: newFilters.minLevel,
      maxLevel: newFilters.maxLevel,
      state: newFilters.state === 'all' ? undefined : newFilters.state,
      sortBy: newFilters.sortBy,
      hasBackground: newFilters.hasBackground
    }

    try {
      // Recharger depuis le début avec les nouveaux filtres
      const newResult = await getPublicMonstersPaginated(undefined, GALLERY_PAGE_SIZE, apiFilters)
      setResult(newResult)
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Convertir les filtres pour la fonction fetchMore avec dépendances granulaires
  const fetchMore = useCallback(async (currentCursor: string) => {
    const apiFilters: GalleryFiltersParams = {
      minLevel: filters.minLevel,
      maxLevel: filters.maxLevel,
      state: filters.state === 'all' ? undefined : filters.state,
      sortBy: filters.sortBy,
      hasBackground: filters.hasBackground
    }

    const result = await getPublicMonstersPaginated(currentCursor, GALLERY_PAGE_SIZE, apiFilters)
    return {
      data: result.monsters,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore
    }
  }, [filters.minLevel, filters.maxLevel, filters.state, filters.sortBy, filters.hasBackground])

  const pluralMonsters = result.total > 1 ? 's' : ''

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <SectionTitle
          title='Galerie Communautaire'
          subtitle='Découvrez les créations publiques de notre communauté de dresseurs'
        />

        {/* Stats */}
        {isInitialLoading
          ? (
            <div className='mb-8 flex items-center justify-center gap-8'>
              <div className='flex items-center gap-2'>
                <Skeleton circle width={12} height={12} />
                <Skeleton width={120} height={20} />
              </div>
            </div>
            )
          : (
            <div className='mb-8 flex items-center justify-center gap-8 text-sm text-gray-500'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-aqua-forest-400' />
                <span>{result.total} monstre{pluralMonsters} public{pluralMonsters}</span>
              </div>
            </div>
            )}

        {/* Barre de filtres */}
        {isInitialLoading
          ? (
            <div className='mb-8 rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
              <div className='flex flex-wrap items-center gap-4'>
                <Skeleton width={150} height={40} borderRadius={8} />
                <Skeleton width={150} height={40} borderRadius={8} />
                <Skeleton width={200} height={40} borderRadius={8} />
                <div className='ml-auto'>
                  <Skeleton width={100} height={40} borderRadius={8} />
                </div>
              </div>
            </div>
            )
          : (
            <GalleryFiltersBar
              filters={filters}
              onFiltersChange={(newFilters) => { void handleFiltersChange(newFilters) }}
            />
            )}

        {/* Grille avec infinite scroll ou squelettes */}
        {isInitialLoading
          ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 12 }).map((_, i) => (
                <GalleryMonsterCardSkeleton key={i} />
              ))}
            </div>
            )
          : isLoading
            ? (
              <div className='mb-8 flex items-center justify-center gap-3 rounded-xl bg-tolopea-50 py-8 text-tolopea-600'>
                <div className='h-6 w-6 animate-spin rounded-full border-4 border-tolopea-200 border-t-tolopea-600' />
                <span className='font-medium'>Application des filtres...</span>
              </div>
              )
            : (
              <InfiniteGalleryGrid
                key={`${filters.sortBy ?? 'newest'}-${filters.state ?? 'all'}-${filters.minLevel ?? 0}-${filters.maxLevel ?? 0}-${String(filters.hasBackground ?? false)}`}
                initialResult={result}
                fetchMore={fetchMore}
              />
              )}
      </div>
    </div>
  )
}
