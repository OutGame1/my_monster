'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SectionTitle from '@/components/ui/SectionTitle'
import CoinPackage from './CoinPackage'
import { Zap, Shield, Check } from 'lucide-react'
import { pricingPackages } from '@/config/pricing.config'
import { createCheckoutSession } from '@/actions/stripe.actions'
import { toast } from 'react-toastify'

/**
 * Buy coins content component
 * Displays coin packages with prices and purchase options
 */
export default function BuyCoinsContent (): ReactNode {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Détection du retour après paiement Stripe
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')

    if (paymentStatus === 'success') {
      toast.success('🎉 Paiement réussi ! Vos pièces ont été ajoutées à votre compte.')
      // Nettoyer l'URL
      router.replace('/buy-coins')
    } else if (paymentStatus === 'cancelled') {
      toast.info('Paiement annulé. Vous pouvez réessayer quand vous voulez.')
      // Nettoyer l'URL
      router.replace('/buy-coins')
    }
  }, [searchParams, router])

  const handlePurchase = async (productId: string): Promise<void> => {
    try {
      const checkoutUrl = await createCheckoutSession(productId)

      if (checkoutUrl === null) {
        toast.error('Erreur lors de la création de la session de paiement')
        return
      }

      // Rediriger vers Stripe Checkout
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Erreur lors du paiement')
    }
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
          {Object.entries(pricingPackages).map(([productId, pkg]) => (
            <CoinPackage
              key={productId}
              pkg={pkg}
              onPurchase={() => { void handlePurchase(productId) }}
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
