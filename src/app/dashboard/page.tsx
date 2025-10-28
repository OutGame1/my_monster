import { getMonsters } from '@/actions/monsters.actions'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/navigation/AppLayout'

export default async function DashboardPage (): Promise<React.ReactNode> {
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
