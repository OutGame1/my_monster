import type { ReactNode } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import CoinIcon from '@/components/ui/CoinIcon'
import cn from 'classnames'

interface CoinPackageProps {
  id: string
  label: string
  coins: number
  price: number
  icon: ReactNode
  popular?: boolean
  color: 'tolopea' | 'blood' | 'aqua-forest' | 'golden-fizz'
  onPurchase: (id: string) => void
}

/**
 * Coin package card component
 * Displays a purchasable coin package with icon, amount, price and buy button
 *
 * @param {CoinPackageProps} props - Package configuration and purchase handler
 * @returns {ReactNode} Card displaying coin package details
 */
export default function CoinPackage ({
  id,
  label,
  coins,
  price,
  icon,
  popular = false,
  color,
  onPurchase
}: CoinPackageProps): ReactNode {
  // Map colors to complete Tailwind classes (required for purging)
  const iconColorClasses = {
    tolopea: 'bg-gradient-to-br from-tolopea-400 to-tolopea-600',
    blood: 'bg-gradient-to-br from-blood-400 to-blood-600',
    'aqua-forest': 'bg-gradient-to-br from-aqua-forest-400 to-aqua-forest-600',
    'golden-fizz': 'bg-gradient-to-br from-golden-fizz-400 to-golden-fizz-600'
  }

  const priceColorClasses = {
    tolopea: 'text-tolopea-700',
    blood: 'text-blood-700',
    'aqua-forest': 'text-aqua-forest-700',
    'golden-fizz': 'text-golden-fizz-700'
  }
  return (
    <div className='relative'>
      {/* Popular Badge */}
      {popular && (
        <div className='absolute -top-3 left-1/2 z-10 -translate-x-1/2 transform'>
          <div className='rounded-full bg-gradient-to-r from-blood-500 to-blood-600 px-4 py-1 text-xs font-bold text-white shadow-lg ring-2 ring-blood-300'>
            ⭐ POPULAIRE
          </div>
        </div>
      )}

      {/* Card with optional popular styling */}
      <Card
        className={cn(
          'relative h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl',
          { 'ring-4 ring-blood-400 ring-offset-2': popular }
        )}
      >
        <div className='flex flex-col items-center space-y-6 text-center'>
          {/* Icon */}
          <div
            className={cn(
              'flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg',
              iconColorClasses[color]
            )}
          >
            {icon}
          </div>

          {/* Label */}
          <div>
            <h3 className='text-xl font-bold text-tolopea-900'>
              {label}
            </h3>
          </div>

          {/* Coins Amount - Prominent */}
          <div className='flex items-center gap-2'>
            <CoinIcon />
            <span className='text-4xl font-black text-tolopea-900'>
              {coins.toLocaleString()}
            </span>
          </div>

          {/* Price - Smaller */}
          <div className={cn('text-4xl font-semibold', priceColorClasses[color])}>
            {price.toFixed(2)}€
          </div>

          {/* Purchase Button */}
          <Button
            onClick={() => { onPurchase(id) }}
            variant='primary'
            color={color}
          >
            Acheter
          </Button>
        </div>
      </Card>
    </div>
  )
}
