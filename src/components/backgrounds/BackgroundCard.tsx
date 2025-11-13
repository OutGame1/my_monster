'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import cn from 'classnames'
import { Lock, LockOpen, Check } from 'lucide-react'
import CoinIcon from '@/components/ui/CoinIcon'
import { calculateFinalPrice } from '@/config/backgrounds.config'
import { rarityMap } from '@/config/rarity.config'
import type { Background } from '@/types/backgrounds'

interface BackgroundCardProps {
  background: Background
  selected: boolean
  owned: boolean
  onSelect: () => void
  onPurchase: () => void
  isPurchasing: boolean
}

export default function BackgroundCard ({
  background,
  selected,
  owned,
  onSelect,
  onPurchase,
  isPurchasing
}: BackgroundCardProps): ReactNode {
  const price = calculateFinalPrice(background)
  const rarityConfig = rarityMap[background.rarity]

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden transition-all shadow-sm hover:shadow-md border-2',
        selected ? 'border-blood-500 ring-2 ring-blood-500' : rarityConfig.style.borderColor
      )}
    >
      {/* Image avec overlay interactif */}
      <div
        className='relative aspect-square transition-all cursor-pointer group'
        onClick={() => {
          if (owned) {
            onSelect()
          } else if (!isPurchasing) {
            onPurchase()
          }
        }}
      >
        <Image
          src={background.imageUrl}
          alt={background.name}
          fill
          sizes='(max-width: 768px) 50vw, 33vw'
        />

        {/* Badge "Actif" en haut à gauche si sélectionné */}
        {selected && (
          <div className='absolute top-2 left-2 bg-blood-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg z-10'>
            <Check className='w-3 h-3' />
            Actif
          </div>
        )}

        {/* Overlay si non possédé avec animation du cadenas */}
        {!owned && (
          <div className='absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 group-hover:bg-black/70 transition-all'>
            <div className='relative bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all group-hover:scale-110 flex items-center justify-center'>
              {/* Cadenas fermé par défaut */}
              <Lock className='w-8 h-8 text-white group-hover:opacity-0 transition-opacity duration-300' />
              {/* Cadenas ouvert au survol */}
              <LockOpen className='w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>
            <div className='bg-black/80 px-3 py-1.5 rounded-full flex items-center gap-1.5'>
              <CoinIcon className='w-4 h-4' />
              <span className='text-white font-bold text-sm'>{price}</span>
            </div>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-full'>
              <span className='font-bold text-gray-900 text-sm'>Cliquer pour acheter</span>
            </div>
          </div>
        )}

        {/* Overlay hover si possédé mais non sélectionné */}
        {owned && !selected && (
          <div className='absolute inset-0 bg-blood-500/0 group-hover:bg-blood-500/10 transition-all flex items-center justify-center'>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-full'>
              <span className='font-bold text-blood-500 text-sm'>Cliquer pour équiper</span>
            </div>
          </div>
        )}
      </div>

      {/* Barre d'information avec couleur de rareté */}
      <div className={cn(
        'p-3 flex items-center justify-between gap-2',
        rarityConfig.style.backgroundColor
      )}
      >
        <p className='text-base font-bold truncate text-white flex-1'>
          {background.name}
        </p>

        {/* Badge de rareté */}
        <span className={cn(
          'text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap text-white',
          rarityConfig.style.badgeBackgroundColor
        )}
        >
          {rarityConfig.name}
        </span>
      </div>
    </div>
  )
}
