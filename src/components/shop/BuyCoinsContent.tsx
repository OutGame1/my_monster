'use client'

import type { ReactNode } from 'react'
import SectionTitle from '@/components/ui/SectionTitle'
import CoinPackage from './CoinPackage'
import { Sparkles, Zap, Crown, Flame, Shield, Check } from 'lucide-react'

interface CoinPackageData {
  id: string
  label: string
  coins: number
  price: number
  icon: ReactNode
  popular?: boolean
  color: 'tolopea' | 'blood' | 'aqua-forest' | 'golden-fizz'
}

const packages: CoinPackageData[] = [
  {
    id: 'starter',
    label: 'Petit Sac',
    coins: 150,
    price: 1,
    icon: <Sparkles className='h-8 w-8' />,
    color: 'tolopea'
  },
  {
    id: 'popular',
    label: 'Sac Magique',
    coins: 350,
    price: 2,
    icon: <Zap className='h-8 w-8' />,
    popular: true,
    color: 'blood'
  },
  {
    id: 'premium',
    label: 'Coffre Royal',
    coins: 1000,
    price: 5,
    icon: <Crown className='h-8 w-8' />,
    color: 'aqua-forest'
  },
  {
    id: 'ultimate',
    label: 'Trésor Légendaire',
    coins: 2500,
    price: 10,
    icon: <Flame className='h-8 w-8' />,
    color: 'golden-fizz'
  }
]

/**
 * Buy coins content component
 * Displays coin packages with prices and purchase options
 */
export default function BuyCoinsContent (): ReactNode {
  const handlePurchase = (packageId: string): void => {
    // TODO: Implement Stripe payment integration
    console.log('Purchase package:', packageId)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Section Title */}
        <SectionTitle
          title='Acheter des pièces'
          subtitle='Obtenez plus de pièces pour personnaliser vos monstres'
        />

        {/* Coin Packages Grid */}
        <div className='mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {packages.map((pkg) => (
            <CoinPackage
              key={pkg.id}
              id={pkg.id}
              label={pkg.label}
              coins={pkg.coins}
              price={pkg.price}
              icon={pkg.icon}
              popular={pkg.popular}
              color={pkg.color}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <div className='flex items-center gap-2 text-sm text-tolopea-700'>
            <Shield className='h-5 w-5 text-aqua-forest-600' />
            <span className='font-semibold'>Paiement sécurisé par Stripe</span>
          </div>
          <div className='hidden sm:block text-tolopea-400'>•</div>
          <div className='flex items-center gap-2 text-sm text-tolopea-700'>
            <Check className='h-5 w-5 text-aqua-forest-600' />
            <span className='font-semibold'>Aucun abonnement</span>
          </div>
          <div className='hidden sm:block text-tolopea-400'>•</div>
          <div className='flex items-center gap-2 text-sm text-tolopea-700'>
            <Zap className='h-5 w-5 text-golden-fizz-600' />
            <span className='font-semibold'>Pièces ajoutées instantanément</span>
          </div>
        </div>
      </div>
    </div>
  )
}
