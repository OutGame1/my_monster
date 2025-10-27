import { getMonsterById } from '@/actions/monsters.actions'
import MonsterDetailContent from '@/components/content/MonsterDetailContent'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

interface MonsterPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MonsterPage ({ params }: MonsterPageProps): Promise<ReactNode> {
  const { id } = await params
  const monster = await getMonsterById(id)

  if (monster === null) {
    redirect('/dashboard')
  }

  return <MonsterDetailContent monster={monster} />
}
