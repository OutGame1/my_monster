import { ReactNode } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/content/DashboardContent'
import Monster from '@/db/models/monster.model'

export default async function DashboardPage (): Promise<ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null) {
    redirect('/sign-in')
  }

  // Récupérer les monstres de l'utilisateur
  const monsters = await Monster.find({ ownerId: session.user.id })
    .sort({ createdAt: -1 })
    .lean()

  // Convertir les objets MongoDB en objets sérialisables
  const serializedMonsters = monsters.map(monster => ({
    ...monster,
    _id: monster._id.toString(),
    ownerId: monster.ownerId.toString(),
    birthDate: monster.birthDate.toISOString(),
    lastFed: monster.lastFed?.toISOString(),
    lastPlayed: monster.lastPlayed?.toISOString(),
    createdAt: monster.createdAt?.toISOString(),
    updatedAt: monster.updatedAt?.toISOString()
  }))

  return (
    <DashboardContent
      user={session.user}
      monsters={serializedMonsters}
    />
  )
}
