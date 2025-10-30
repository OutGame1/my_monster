import type { ReactNode } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import CoinIcon from '@/components/ui/CoinIcon'

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
        className={`relative h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          popular
            ? 'ring-4 ring-blood-400 ring-offset-2'
            : ''
        }`}
      >
        <div className='flex flex-col items-center space-y-6 text-center'>
          {/* Icon */}
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-${color}-400 to-${color}-600 text-white shadow-lg`}
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
          <div className={`text-4xl font-semibold text-${color}-700`}>
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
