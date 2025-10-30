import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AppLayout from '@/components/navigation/AppLayout'
import QuestsContent from '@/components/quests/QuestsContent'
import { getQuestsWithProgress } from '@/actions/quests.actions'

/**
 * Page des quêtes et succès permettant de gagner des pièces.
 *
 * @returns {Promise<ReactNode>} Contenu JSX rendu côté serveur pour les quêtes.
 */
export default async function QuestsPage (): Promise<ReactNode> {
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  const { daily, achievement } = await getQuestsWithProgress()

  return (
    <AppLayout>
      <QuestsContent dailyQuests={daily} achievements={achievement} />
    </AppLayout>
  )
}
