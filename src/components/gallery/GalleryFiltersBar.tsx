'use client'

import type { ReactNode } from 'react'
import cn from 'classnames'
import Button from '../ui/Button'
import type { GalleryFilters, GalleryFiltersBarProps } from '@/types/gallery'
import type { MonsterState } from '@/db/models/monster.model'
import {
  MONSTER_STATE_OPTIONS,
  SORT_OPTIONS,
  DEFAULT_SORT,
  MIN_MONSTER_LEVEL,
  MAX_MONSTER_LEVEL
} from '@/config/gallery.config'
import { count } from '@/lib/utils'

/**
 * Barre de filtres pour la galerie
 * Permet de filtrer par niveau, état et trier les monstres
 */
export default function GalleryFiltersBar ({
  filters,
  onFiltersChange,
  totalCount
}: GalleryFiltersBarProps): ReactNode {
  const handleStateChange = (state: MonsterState | 'all'): void => {
    onFiltersChange({
      ...filters,
      state: state === 'all' ? undefined : state
    })
  }

  const handleSortChange = (sortBy: string): void => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as GalleryFilters['sortBy']
    })
  }

  const handleLevelChange = (type: 'min' | 'max', value: string): void => {
    const numValue = value === '' ? undefined : parseInt(value, 10)

    if (type === 'min') {
      onFiltersChange({
        ...filters,
        minLevel: numValue
      })
    } else {
      onFiltersChange({
        ...filters,
        maxLevel: numValue
      })
    }
  }

  const activeFilters = [
    filters.minLevel !== undefined,
    filters.maxLevel !== undefined,
    filters.state !== undefined && filters.state !== 'all'
  ]

  // compte le nombre de filtre actif (true)
  const activeFiltersCount = count(activeFilters, active => active)

  const handleResetFilters = (): void => {
    onFiltersChange({
      sortBy: DEFAULT_SORT
    })
  }

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
        <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
          <h4 className='mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700'>
            <span>📊</span>
            Niveau
          </h4>
          <div className='flex items-center gap-3'>
            <div className='flex-1'>
              <label className='mb-1 block text-xs text-gray-600'>Min</label>
              <input
                type='number'
                min={MIN_MONSTER_LEVEL}
                max={MAX_MONSTER_LEVEL}
                value={filters.minLevel ?? ''}
                onChange={(e) => handleLevelChange('min', e.target.value)}
                placeholder={MIN_MONSTER_LEVEL.toString()}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-tolopea-500 focus:outline-none focus:ring-2 focus:ring-tolopea-200'
              />
            </div>
            <span className='mt-6 text-gray-400'>-</span>
            <div className='flex-1'>
              <label className='mb-1 block text-xs text-gray-600'>Max</label>
              <input
                type='number'
                min={MIN_MONSTER_LEVEL}
                max={MAX_MONSTER_LEVEL}
                value={filters.maxLevel ?? ''}
                onChange={(e) => handleLevelChange('max', e.target.value)}
                placeholder={MAX_MONSTER_LEVEL.toString()}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-tolopea-500 focus:outline-none focus:ring-2 focus:ring-tolopea-200'
              />
            </div>
          </div>
        </div>

        {/* Filtre par état */}
        <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
          <h4 className='mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700'>
            <span>😊</span>
            État
          </h4>
          <div className='flex flex-wrap gap-2'>
            {MONSTER_STATE_OPTIONS.map(({ value, label, emoji }) => {
              const isActive = (filters.state ?? 'all') === value
              return (
                <button
                  key={value}
                  onClick={() => handleStateChange(value)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-tolopea-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <span className='mr-1'>{emoji}</span>
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tri */}
        <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
          <h4 className='mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700'>
            <span>🔄</span>
            Trier par
          </h4>
          <select
            value={filters.sortBy ?? DEFAULT_SORT}
            onChange={(e) => handleSortChange(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-tolopea-500 focus:outline-none focus:ring-2 focus:ring-tolopea-200'
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
