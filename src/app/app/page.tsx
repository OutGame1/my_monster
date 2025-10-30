import type { ReactNode } from 'react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import AppLayout from '@/components/navigation/AppLayout'
import { getMonsters } from '@/actions/monsters.actions'
import { calculateMonsterCreationCost } from '@/config/monsters.config'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { MonsterProvider } from '@/contexts/MonsterContext'

/**
 * Page dashboard authentifiée affichant la gestion des monstres de l'utilisateur.
 *
 * @returns {Promise<ReactNode>} Contenu JSX rendu côté serveur pour le tableau de bord.
 */
export default async function DashboardPage (): Promise<ReactNode> {
  // Récupération de la session utilisateur via Better Auth
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  // Récupération de tous les monstres appartenant à l'utilisateur connecté
  const monsters = await getMonsters()

  const creationCost = calculateMonsterCreationCost(monsters.length)

  return (
    <AppLayout>
      <MonsterProvider initialMonsters={monsters}>
        <DashboardContent initialCreationCost={creationCost} />
      </MonsterProvider>
    </AppLayout>
  )
}
