'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import { useRandomMonster } from '@/hooks/useRandomMonster'

export default function HeroSection (): ReactNode {
  const heroMonsterProfile = useRandomMonster()

  const renderHeroMonster = (): ReactNode => {
    if (heroMonsterProfile !== null) {
      return (
        <MonsterAvatar
          visualProfile={heroMonsterProfile}
          animation='happy'
          size={350}
          interactive={false}
        />
      )
    }

    return (
      <div className='w-[350px] h-[350px] flex items-center justify-center'>
        <div className='animate-pulse text-6xl'>🥚</div>
      </div>
    )
  }

  return (
    <section className='w-full min-h-screen pt-24 pb-16 bg-gradient-to-b from-tolopea-50 to-white flex items-center'>
      <div className='container mx-auto px-4 w-full'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='md:w-1/2 w-full flex flex-col items-center md:items-start text-center md:text-left'>
            <h1 className='text-4xl md:text-6xl font-bold text-tolopea-900 mb-6'>
              Adoptez votre petit monstre virtuel
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
              Découvrez une expérience unique de compagnon virtuel. Élevez, jouez et créez des liens avec votre adorable monstre personnalisé.
            </p>
            <div className='flex gap-4'>
              <Link
                href='/temp'
                className='bg-blood-500 text-white px-8 py-3 rounded-lg hover:bg-blood-600 transition-colors text-lg font-semibold'
              >
                Commencer l&apos;aventure
              </Link>
              <a
                href='#monsters'
                className='border-2 border-tolopea-200 text-tolopea-600 px-8 py-3 rounded-lg hover:bg-tolopea-50 transition-colors text-lg font-semibold'
              >
                Voir les monstres
              </a>
            </div>
          </div>
          <div className='md:w-1/2 w-full relative h-[400px] flex items-center justify-center'>
            {/* Cercle de fond animé */}
            <div className='absolute w-80 h-80 bg-gradient-to-br from-aqua-forest-100 to-tolopea-100 rounded-full animate-pulse opacity-50' />
            <div className='absolute w-72 h-72 bg-gradient-to-br from-blood-100 to-purple-100 rounded-full animate-ping opacity-30' style={{ animationDuration: '3s' }} />

            {/* Monstre héros - affiché uniquement quand généré côté client */}
            <div className='relative z-10'>{renderHeroMonster()}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
