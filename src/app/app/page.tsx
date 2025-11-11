import type { ReactNode } from 'react'
import DashboardContentWrapper from '@/components/dashboard/DashboardContentWrapper'
import AppLayout from '@/components/navigation/AppLayout'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * Page dashboard authentifiée affichant la gestion des monstres de l'utilisateur.
 * Les données sont chargées côté client pour permettre une meilleure expérience utilisateur avec skeleton loading.
 *
 * @returns {Promise<ReactNode>} Contenu JSX rendu côté serveur pour le tableau de bord.
 */
export default async function DashboardPage (): Promise<ReactNode> {
  const session = await getSession()
  if (session === null) {
    redirect('/sign-in')
  }

  return (
    <AppLayout>
      <DashboardContentWrapper />
    </AppLayout>
  )
}
