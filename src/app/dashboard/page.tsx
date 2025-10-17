import { ReactNode } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/content/DashboardContent'
import { getMonsters } from '@/actions/monsters.actions'

export default async function DashboardPage (): Promise<ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null) {
    redirect('/sign-in')
  }

  // Récupérer les monstres via l'action serveur
  const monsters = await getMonsters()

  return (
    <DashboardContent
      user={session.user}
      monsters={monsters}
    />
  )
}
