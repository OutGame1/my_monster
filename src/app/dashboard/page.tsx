import { getMonsters } from '@/actions/monsters.actions'
import Header from '@/components/ui/Header'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur via Better Auth
  const session = await getSession(() => redirect('/sign-in'))

  // Récupération de tous les monstres appartenant à l'utilisateur connecté
  const monsters = await getMonsters()

  return (
    <div className='min-h-screen flex flex-col bg-white text-gray-900'>
      <Header session={session} />
      <DashboardContent session={session} monsters={monsters} />
    </div>
  )
}
