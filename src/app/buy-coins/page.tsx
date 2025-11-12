import type { ReactNode } from 'react'
import ProtectedAppLayout from '@/components/navigation/ProtectedAppLayout'
import BuyCoinsContent from '@/components/shop/BuyCoinsContent'

/**
 * Page d'achat de pièces permettant aux joueurs d'acquérir plus de monnaie.
 */
export default function BuyCoinsPage (): ReactNode {
  return (
    <ProtectedAppLayout>
      <BuyCoinsContent />
    </ProtectedAppLayout>
  )
}
