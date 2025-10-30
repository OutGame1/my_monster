import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AppLayout from '@/components/navigation/AppLayout'
import BuyCoinsContent from '@/components/shop/BuyCoinsContent'

/**
 * Page d'achat de pièces permettant aux joueurs d'acquérir plus de monnaie.
 *
 * @returns {Promise<ReactNode>} Contenu JSX rendu côté serveur pour la boutique.
 */
export default async function BuyCoinsPage (): Promise<ReactNode> {
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  return (
    <AppLayout>
      <BuyCoinsContent />
    </AppLayout>
  )
}
