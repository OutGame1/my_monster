import type { ReactNode } from 'react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import AppLayout from '@/components/navigation/AppLayout'
import { getMonsters } from '@/actions/monsters.actions'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage (): Promise<ReactNode> {
  // Récupération de la session utilisateur via Better Auth
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  // Récupération de tous les monstres appartenant à l'utilisateur connecté
  const monsters = await getMonsters()

  return (
    <AppLayout>
      <DashboardContent session={session} monsters={monsters} />
    </AppLayout>
  )
}
