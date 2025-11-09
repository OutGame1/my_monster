'use client'

import { useCallback, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'
import GalleryMonsterCard from './GalleryMonsterCard'
import { getPublicMonstersPaginated } from '@/actions/monsters.actions'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { InfiniteGalleryGridProps } from '@/types/gallery'

/**
 * Composant client pour la grille de galerie avec infinite scroll
 * Utilise react-intersection-observer pour détecter quand charger plus de monstres
 */
export default function InfiniteGalleryGrid ({
  initialMonsters,
  initialCursor,
  initialHasMore,
  totalCount,
  fetchMore: customFetchMore
}: InfiniteGalleryGridProps): ReactNode {
  // Fonction de fetch par défaut (sans filtres)
  const defaultFetchMore = useCallback(async (cursor: string) => {
    const result = await getPublicMonstersPaginated(cursor)
    return {
      data: result.monsters,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore
    }
  }, [])

  // Utiliser la fonction custom si fournie, sinon la fonction par défaut
  const fetchMore = customFetchMore ?? defaultFetchMore

  // Hook personnalisé pour gérer l'infinite scroll
  const { data: monsters, hasMore, isLoading, loadMore } = useInfiniteScroll({
    initialData: initialMonsters,
    initialCursor,
    initialHasMore,
    fetchMore
  })

  // Hook pour détecter quand l'utilisateur atteint le bas de la liste
  const { ref: loadMoreRef } = useInView({
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        void loadMore()
      }
    }
  })

  if (monsters.length === 0) {
    return (
      <div className='flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-tolopea-200 bg-tolopea-50/30 p-12'>
        <div className='text-center'>
          <p className='text-2xl font-bold text-tolopea-600'>🎨 Galerie vide</p>
          <p className='mt-2 text-gray-600'>
            Aucun monstre public pour le moment. Soyez le premier à partager votre création !
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Grille de monstres */}
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {monsters.map(monster => (
          <GalleryMonsterCard key={monster._id} monster={monster} />
        ))}
      </div>

      {/* Indicateur de chargement / Fin de liste */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className='flex justify-center py-8'
        >
          {isLoading
            ? (
              <div className='flex items-center gap-3 text-tolopea-600'>
                <div className='h-6 w-6 animate-spin rounded-full border-4 border-tolopea-200 border-t-tolopea-600' />
                <span className='font-medium'>Chargement de plus de monstres...</span>
              </div>
              )
            : (
              <div className='text-sm text-gray-500'>
                Faites défiler pour charger plus • {monsters.length} / {totalCount} monstres affichés
              </div>
              )}
        </div>
      )}

      {/* Message de fin */}
      {!hasMore && monsters.length > 0 && (
        <div className='flex justify-center py-8 text-sm text-gray-500'>
          ✨ Vous avez vu tous les {totalCount} monstres publics
        </div>
      )}
    </div>
  )
}
