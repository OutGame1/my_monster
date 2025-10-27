'use client'

import { ReactNode } from 'react'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import { useStaticMonsters } from '@/hooks/useStaticMonsters'

export default function MonstersSection (): ReactNode {
  const { monsters, loading } = useStaticMonsters()

  const renderMonsters = (): ReactNode => {
    if (loading) {
      return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
          {[1, 2, 3].map((placeholder) => (
            <div
              key={placeholder}
              className='rounded-2xl p-8 bg-white/50 flex flex-col items-center shadow-lg animate-pulse'
            >
              <div className='w-48 h-48 mb-8 rounded-full bg-gray-200 flex items-center justify-center'>
                <div className='text-6xl'>🥚</div>
              </div>
              <div className='h-8 bg-gray-200 rounded w-32 mb-4' />
              <div className='h-6 bg-gray-200 rounded w-24 mb-4' />
              <div className='h-4 bg-gray-200 rounded w-full' />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
        {monsters.map((monster, index) => (
          <div
            key={index}
            className={`rounded-2xl p-8 ${monster.color} hover:scale-105 transition-all duration-300 flex flex-col items-center shadow-lg hover:shadow-2xl border-2 border-white/50`}
          >
            <div className='w-48 h-48 mb-8 rounded-full bg-white/70 flex items-center justify-center shadow-inner'>
              <MonsterAvatar
                visualProfile={monster.visualProfile}
                animation='idle'
                size={180}
                interactive
              />
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-4 text-center'>
              {monster.name}
            </h3>
            <p className='text-gray-800 font-semibold text-center text-xl mb-4'>
              Type: {monster.typeLabel}
            </p>
            <p className='text-gray-700 text-center text-lg'>
              {monster.description}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <section id='monsters' className='w-full min-h-screen py-20 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center'>
      <div className='container mx-auto px-4 w-full'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-tolopea to-blood bg-clip-text text-transparent'>
            Nos adorables monstres
          </h2>
          <p className='text-center text-gray-700 font-medium mb-16 text-xl max-w-3xl mx-auto'>
            Chaque monstre est unique et possède sa propre personnalité. Découvrez quelques-uns de nos compagnons les plus populaires !
          </p>

          {renderMonsters()}
        </div>
      </div>
    </section>
  )
}
