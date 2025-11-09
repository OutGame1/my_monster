import { useState, useCallback } from 'react'

interface UseInfiniteScrollOptions<T> {
  initialData: T[]
  initialCursor: string | null
  initialHasMore: boolean
  fetchMore: (cursor: string) => Promise<{
    data: T[]
    nextCursor: string | null
    hasMore: boolean
  }>
}

interface UseInfiniteScrollReturn<T> {
  data: T[]
  cursor: string | null
  hasMore: boolean
  isLoading: boolean
  loadMore: () => Promise<void>
}

/**
 * Hook personnalisé pour gérer l'infinite scroll avec pagination cursor-based
 * @template T - Type des éléments dans la liste
 * @param options - Configuration du hook
 * @returns État et méthodes pour gérer l'infinite scroll
 *
 * @example
 * ```tsx
 * const { data, hasMore, isLoading, loadMore } = useInfiniteScroll({
 *   initialData: monsters,
 *   initialCursor: cursor,
 *   initialHasMore: hasMore,
 *   fetchMore: async (cursor) => {
 *     const result = await getPublicMonstersPaginated(cursor)
 *     return {
 *       data: result.monsters,
 *       nextCursor: result.nextCursor,
 *       hasMore: result.hasMore
 *     }
 *   }
 * })
 * ```
 */
export function useInfiniteScroll<T> ({
  initialData,
  initialCursor,
  initialHasMore,
  fetchMore
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>(initialData)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(async () => {
    // Gardes : ne rien faire si déjà en chargement, plus de données, ou pas de cursor
    if (isLoading || !hasMore || cursor === null) return

    setIsLoading(true)
    try {
      const result = await fetchMore(cursor)
      setData(prev => [...prev, ...result.data])
      setCursor(result.nextCursor)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading more data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [cursor, hasMore, isLoading, fetchMore])

  return {
    data,
    cursor,
    hasMore,
    isLoading,
    loadMore
  }
}
