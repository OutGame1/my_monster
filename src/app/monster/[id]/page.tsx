import type { ReactNode } from 'react'
import { getMonsterById } from '@/actions/monsters.actions'
import { notFound } from 'next/navigation'
import AppLayout from '@/components/navigation/AppLayout'
import Link from 'next/link'
import MonsterPageClient from '@/components/monster/MonsterPageClient'

interface MonsterPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Monster detail page
 * Server component that displays a single monster's details
 */
export default async function MonsterPage ({ params }: MonsterPageProps): Promise<ReactNode> {
  const { id } = await params
  const monster = await getMonsterById(id)

  if (monster === null) {
    notFound()
  }

  return (
    <AppLayout>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Back Button */}
        <Link
          href='/dashboard'
          className='mb-6 inline-flex items-center gap-2 text-tolopea-600 transition-colors hover:text-tolopea-800'
        >
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Retour au dashboard
        </Link>

        <MonsterPageClient monster={monster} />
      </div>
    </AppLayout>
  )
}
