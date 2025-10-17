// ========================================
// PAGE DÉTAILS MONSTRE - APP ROUTER
// ========================================
// Page dédiée affichant un monstre en détail

import { redirect } from 'next/navigation'
import { auth } from '@lib/auth'
import { headers } from 'next/headers'
import MonsterDetailContent from '@/components/content/MonsterDetailContent'
import { getMonsterById } from '@/actions/monsters.actions'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MonsterDetailPage ({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if ((session?.user) == null) {
    redirect('/sign-in')
  }

  // Await params avant d'accéder à ses propriétés
  const { id } = await params

  // Utilisation de l'action serveur
  const monster = await getMonsterById(id)

  if (monster == null) {
    redirect('/dashboard')
  }

  return <MonsterDetailContent monster={monster} />
}
