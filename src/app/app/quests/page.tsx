import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AppLayout from '@/components/navigation/AppLayout'
import QuestsContentWrapper from '@/components/quests/QuestsContentWrapper'

/**
 * Page des quêtes et succès permettant de gagner des pièces.
 * Les données sont chargées côté client pour permettre une meilleure expérience utilisateur avec skeleton loading.
 *
 * @returns {Promise<ReactNode>} Contenu JSX rendu côté serveur pour les quêtes.
 */
export default async function QuestsPage (): Promise<ReactNode> {
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  return (
    <AppLayout>
      <QuestsContentWrapper />
    </AppLayout>
  )
}
