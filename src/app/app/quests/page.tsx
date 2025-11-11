import type { ReactNode } from 'react'
import AppLayout from '@/components/navigation/AppLayout'
import QuestsContentWrapper from '@/components/quests/QuestsContentWrapper'

/**
 * Page des quêtes et succès permettant de gagner des pièces.
 * Les données sont chargées côté client pour permettre une meilleure expérience utilisateur avec skeleton loading.
 *
 * @returns {Promise<ReactNode>} Contenu JSX rendu côté serveur pour les quêtes.
 */
export default function QuestsPage (): ReactNode {
  return (
    <AppLayout protectedRoute>
      <QuestsContentWrapper />
    </AppLayout>
  )
}
