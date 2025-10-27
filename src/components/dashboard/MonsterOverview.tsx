'use client'

import { ReactNode, useMemo, useState, useTransition } from 'react'
import Button from '@components/ui/Button'
import MonsterCard from '@/components/ui/MonsterCard'
import type { SerializedMonster } from '@/types/monster.types'

type MonsterActionType = 'feed' | 'pet'

interface MonsterOverviewProps {
  monsters: SerializedMonster[]
  onOpenAdoptModal: () => void
}

const ACTION_SUCCESS_MESSAGES: Record<MonsterActionType, string> = {
  feed: 'a été nourri ! 🍖',
  pet: 'est aux anges ! 😊'
}

export default function MonsterOverview ({
  monsters,
  onOpenAdoptModal
}: MonsterOverviewProps): ReactNode {

  if (monsters.length === 0) {
    return (
      <section className='space-y-6'>
        <header>
          <h2 className='text-3xl font-bold text-tolopea-900'>Vos Monstres</h2>
          <p className='text-gray-600 mt-2 text-lg'>Adoptez votre premier compagnon pour démarrer l'aventure.</p>
        </header>

        <div className='bg-white/90 backdrop-blur-sm rounded-2xl border border-tolopea-100 shadow-lg p-16 text-center space-y-6'>
          <span className='text-6xl block'>🦕</span>
          <h3 className='text-2xl font-semibold text-tolopea-900'>Aucun monstre pour le moment</h3>
          <p className='text-gray-600 text-lg'>Commencez par en adopter un pour démarrer votre aventure !</p>
          <Button variant='primary' onClick={onOpenAdoptModal}>Adopter mon premier monstre</Button>
        </div>
      </section>
    )
  }

  return (
    <section className='space-y-8'>
      <header className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold text-tolopea-900'>Vos Monstres</h2>
          <p className='text-gray-600 mt-2 text-lg'>Gardez un œil sur leur bien-être et interagissez directement depuis le tableau de bord.</p>
        </div>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {monsters.map((monster) => (
          <MonsterCard
            key={monster._id}
            monster={monster}
          />
        ))}
      </div>
    </section>
  )
}
