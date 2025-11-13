'use client'

import { useMemo, type ReactNode } from 'react'
import cn from 'classnames'
import { AlertCircle } from 'lucide-react'
import Button from '@components/ui/Button'
import type { GalleryFilters, GallerySortBy, GalleryStateFilter } from '@/types/gallery'
import { MONSTER_STATE_OPTIONS, SORT_OPTIONS, DEFAULT_SORT } from '@/config/gallery.config'
import { count } from '@/lib/utils'

/**
 * Props du composant GalleryFiltersBar
 */
interface GalleryFiltersBarProps {
  filters: GalleryFilters
  onFiltersChange: (filters: GalleryFilters) => void
}

/**
 * Barre de filtres pour la galerie
 * Permet de filtrer par niveau, état et trier les monstres
 */
export default function GalleryFiltersBar ({
  filters,
  onFiltersChange
}: GalleryFiltersBarProps): ReactNode {
  const handleStateChange = (state: GalleryStateFilter): void => {
    onFiltersChange({
      ...filters,
      state: state === 'all' ? undefined : state
    })
  }

  const handleSortChange = (sortBy: string): void => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as GallerySortBy
    })
  }

  const handleLevelChange = (type: 'minLevel' | 'maxLevel', rawValue: string): void => {
    const numValue = parseInt(rawValue, 10)

    const value = isNaN(numValue) ? undefined : Math.max(numValue, 1)

    // Empêche de maintenir la touche bas enfoncée et de render inutilement
    if (value === 1 && value === filters[type]) {
      return
    }

    onFiltersChange({
      ...filters,
      [type]: value
    })
  }

  const handleBackgroundChange = (checked: boolean): void => {
    onFiltersChange({
      ...filters,
      hasBackground: checked || undefined
    })
  }

  const invalidLevelRange = filters.minLevel !== undefined &&
                            filters.maxLevel !== undefined &&
                            filters.minLevel > filters.maxLevel

  // Mémoïsation du comptage des filtres actifs pour éviter les recalculs inutiles
  const activeFiltersCount = useMemo(() => {
    const activeFilters = [
      filters.minLevel !== undefined,
      filters.maxLevel !== undefined,
      filters.state !== undefined && filters.state !== 'all',
      filters.hasBackground === true
    ]
    return count(activeFilters, active => active)
  }, [filters.minLevel, filters.maxLevel, filters.state, filters.hasBackground])

  const handleResetFilters = (): void => onFiltersChange({ sortBy: DEFAULT_SORT })

  return (
    <div className='mb-8 space-y-6'>
      {/* Header avec reset */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3 className='text-2xl font-semibold text-gray-700'>Filtres</h3>
          {activeFiltersCount > 0 && (
            <span className='rounded-full bg-tolopea-100 px-3 py-1 text-sm font-medium text-tolopea-700'>
              {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Button
          onClick={handleResetFilters}
          width='fit'
          disabled={activeFiltersCount === 0}
        >
          Réinitialiser les filtres
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Filtre par niveau */}
        <div className='flex flex-col gap-1 justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
          <h4 className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
            <span>📊</span>
            Niveau
          </h4>

          {/* Alerte de plage invalide */}
          {invalidLevelRange && (
            <p className='flex items-center gap-2 text-xs text-blood-700 font-medium'>
              <AlertCircle className='w-4 h-4 text-blood-600 flex-shrink-0' />
              Le niveau minimum est inférieur au niveau maximum
            </p>
          )}

          <div className='flex items-center gap-3'>
            <div className='flex-1'>
              <label className='mb-1 block text-xs text-gray-600'>Min</label>
              <input
                type='number'
                value={filters.minLevel ?? ''}
                onChange={(e) => handleLevelChange('minLevel', e.target.value)}
                placeholder='1'
                className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-tolopea-500 focus:outline-none focus:ring-2 focus:ring-tolopea-200'
              />
            </div>
            <span className='text-gray-400'>-</span>
            <div className='flex-1'>
              <label className='mb-1 block text-xs text-gray-600'>Max</label>
              <input
                type='number'
                value={filters.maxLevel ?? ''}
                onChange={(e) => handleLevelChange('maxLevel', e.target.value)}
                placeholder='100'
                className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-tolopea-500 focus:outline-none focus:ring-2 focus:ring-tolopea-200'
              />
            </div>
          </div>
        </div>

        {/* Filtre par état */}
        <div className='flex flex-col gap-1 justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
          <h4 className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
            <span>😊</span>
            État
          </h4>
          <div className='flex flex-wrap gap-2'>
            {MONSTER_STATE_OPTIONS.map(({ value, label }, index) => {
              const isActive = (filters.state ?? 'all') === value
              return (
                <button
                  key={index}
                  onClick={() => handleStateChange(value)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-tolopea-500 text-white shadow-md'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tri */}
        <div className='flex flex-col gap-1 justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
          <h4 className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
            <span>🔄</span>
            Trier par
          </h4>

          <select
            value={filters.sortBy ?? DEFAULT_SORT}
            onChange={(e) => handleSortChange(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-tolopea-500 focus:outline-none focus:ring-2 focus:ring-tolopea-200'
          >
            {SORT_OPTIONS.map(({ value, label }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Checkbox arrière-plan */}
          <label className='flex items-center gap-3 cursor-pointer group'>
            <input
              type='checkbox'
              checked={filters.hasBackground ?? false}
              onChange={(e) => handleBackgroundChange(e.target.checked)}
              className='h-5 w-5 rounded border-gray-300 text-tolopea-500 focus:ring-2 focus:ring-tolopea-200 focus:ring-offset-0 cursor-pointer'
            />
            <span className='text-sm font-medium text-gray-700 group-hover:text-tolopea-600 transition-colors'>
              Avec arrière-plan uniquement
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
