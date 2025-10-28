'use client'

import type { ReactNode } from 'react'
import type { Session } from '@/lib/auth-client'
import type { IMonster, MonsterState } from '@/db/models/monster.model'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import Link from 'next/link'

interface DashboardContentProps {
  session: Session
  monsters: IMonster[]
}

export default function DashboardContent ({ session, monsters }: DashboardContentProps): ReactNode {
  const getStateEmoji = (state: MonsterState): string => {
    const emojiMap: Record<MonsterState, string> = {
      happy: '😊',
      sad: '😢',
      gamester: '🎮',
      angry: '😠',
      hungry: '🍔',
      sleepy: '😴'
    }
    return emojiMap[state] ?? emojiMap.happy
  }

  const getStateColor = (state: MonsterState): string => {
    const colorMap: Record<MonsterState, string> = {
      happy: 'bg-aqua-forest-100 text-aqua-forest-700 border-aqua-forest-300',
      sad: 'bg-tolopea-100 text-tolopea-700 border-tolopea-300',
      gamester: 'bg-tolopea-100 text-tolopea-700 border-tolopea-300',
      angry: 'bg-blood-100 text-blood-700 border-blood-300',
      hungry: 'bg-amber-100 text-amber-700 border-amber-300',
      sleepy: 'bg-purple-100 text-purple-700 border-purple-300'
    }
    return colorMap[state] ?? 'bg-gray-100 text-gray-700 border-gray-300'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='mb-8'>
          <h1 className='mb-2 text-4xl font-bold text-tolopea-800'>
            Bienvenue, {session.user.name ?? 'Dresseur de monstres'} ! 👋
          </h1>
          <p className='text-lg text-tolopea-600'>
            Voici votre collection de monstres adorables
          </p>
        </div>

        {/* Stats Overview */}
        <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <div className='rounded-2xl border border-aqua-forest-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105'>
            <div className='text-3xl font-bold text-aqua-forest-600'>{monsters.length}</div>
            <div className='text-sm text-aqua-forest-700'>Monstres collectés</div>
          </div>
          <div className='rounded-2xl border border-tolopea-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105'>
            <div className='text-3xl font-bold text-tolopea-600'>
              {monsters.reduce((sum, m) => sum + m.level, 0)}
            </div>
            <div className='text-sm text-tolopea-700'>Niveaux cumulés</div>
          </div>
          <div className='rounded-2xl border border-blood-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105'>
            <div className='text-3xl font-bold text-blood-600'>
              {monsters.filter(m => m.state === 'happy').length}
            </div>
            <div className='text-sm text-blood-700'>Monstres heureux</div>
          </div>
        </div>

        {/* Monsters Grid */}
        {monsters.length > 0
          ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {monsters.map((monster) => {
                const stateEmoji = getStateEmoji(monster.state)
                const stateColor = getStateColor(monster.state)

                return (
                  <div
                    key={monster._id}
                    className='group relative overflow-hidden rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl'
                  >
                    {/* State Badge */}
                    <div className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold ${stateColor}`}>
                      {stateEmoji} {monster.state}
                    </div>

                    {/* Monster Avatar */}
                    <div className='mb-4 flex justify-center'>
                      <div className='rounded-full bg-gradient-to-br from-tolopea-50 to-aqua-forest-50 p-4'>
                        <MonsterAvatar
                          traits={monster.traits}
                          animation={monster.state}
                          size={180}
                        />
                      </div>
                    </div>

                    {/* Monster Info */}
                    <div className='text-center'>
                      <h3 className='mb-2 text-2xl font-bold text-tolopea-800'>{monster.name}</h3>
                      <div className='mb-4 flex items-center justify-center gap-2'>
                        <span className='rounded-full bg-blood-100 px-3 py-1 text-sm font-semibold text-blood-700'>
                          Niveau {monster.level}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex gap-2'>
                        <button className='flex-1 rounded-lg bg-tolopea-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-tolopea-600 active:scale-95'>
                          Nourrir
                        </button>
                        <button className='flex-1 rounded-lg bg-aqua-forest-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-aqua-forest-600 active:scale-95'>
                          Jouer
                        </button>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className='absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-tolopea-300' />
                  </div>
                )
              })}
            </div>
            )
          : (
            <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-tolopea-300 bg-white/50 p-12 text-center backdrop-blur-sm'>
              <div className='mb-4 text-6xl'>🥚</div>
              <h2 className='mb-2 text-2xl font-bold text-tolopea-800'>Aucun monstre pour le moment</h2>
              <p className='mb-6 text-tolopea-600'>Créez votre premier monstre pour commencer l'aventure !</p>
              <Link
                href='/create-monster'
                className='rounded-lg bg-blood-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blood-600 active:scale-95'
              >
                Créer mon premier monstre
              </Link>
            </div>
            )}
      </div>
    </div>
  )
}
