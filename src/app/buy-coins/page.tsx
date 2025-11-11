import type { ReactNode } from 'react'
import AppLayout from '@/components/navigation/AppLayout'
import BuyCoinsContent from '@/components/shop/BuyCoinsContent'

/**
 * Page d'achat de pièces permettant aux joueurs d'acquérir plus de monnaie.
 */
export default function BuyCoinsPage (): ReactNode {
  return (
    <AppLayout protectedRoute>
      <BuyCoinsContent />
    </AppLayout>
  )
}
