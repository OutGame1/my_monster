import type { ReactNode } from 'react'
import { getMonsterById } from '@/actions/monsters.actions'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import { notFound } from 'next/navigation'
import AppLayout from '@/components/navigation/AppLayout'

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
      <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Back Button */}
        <a
          href='/dashboard'
          className='mb-6 inline-flex items-center gap-2 text-tolopea-600 transition-colors hover:text-tolopea-800'
        >
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Retour au dashboard
        </a>

        {/* Monster Card */}
        <div className='rounded-2xl border border-tolopea-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm'>
          {/* Monster Avatar */}
          <div className='mb-6 flex justify-center'>
            <div className='rounded-full bg-gradient-to-br from-tolopea-50 to-aqua-forest-50 p-8'>
              <MonsterAvatar
                traits={monster.traits}
                animation={monster.state}
                size={300}
              />
            </div>
          </div>

          {/* Monster Info */}
          <div className='text-center'>
            <h1 className='mb-4 text-4xl font-bold text-tolopea-800'>{monster.name}</h1>

            <div className='mb-6 flex items-center justify-center gap-4'>
              <span className='rounded-full bg-blood-100 px-4 py-2 text-lg font-semibold text-blood-700'>
                Niveau {monster.level}
              </span>
              <span className='rounded-full bg-aqua-forest-100 px-4 py-2 text-lg font-semibold text-aqua-forest-700'>
                {monster.state}
              </span>
            </div>

            {/* Monster Traits */}
            <div className='mx-auto max-w-2xl rounded-xl bg-tolopea-50 p-6'>
              <h2 className='mb-4 text-2xl font-bold text-tolopea-800'>Caractéristiques</h2>
              <div className='grid grid-cols-2 gap-4 text-left'>
                <div>
                  <span className='font-semibold text-tolopea-700'>Corps:</span>
                  <span className='ml-2 text-gray-700'>{monster.traits.bodyShape}</span>
                </div>
                <div>
                  <span className='font-semibold text-tolopea-700'>Bras:</span>
                  <span className='ml-2 text-gray-700'>{monster.traits.armType}</span>
                </div>
                <div>
                  <span className='font-semibold text-tolopea-700'>Jambes:</span>
                  <span className='ml-2 text-gray-700'>{monster.traits.legType}</span>
                </div>
                <div>
                  <span className='font-semibold text-tolopea-700'>Yeux:</span>
                  <span className='ml-2 text-gray-700'>{monster.traits.eyeType}</span>
                </div>
                <div>
                  <span className='font-semibold text-tolopea-700'>Bouche:</span>
                  <span className='ml-2 text-gray-700'>{monster.traits.mouthType}</span>
                </div>
                <div>
                  <span className='font-semibold text-tolopea-700'>Taille:</span>
                  <span className='ml-2 text-gray-700'>{monster.traits.size}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='mt-8 flex gap-4'>
              <button className='flex-1 rounded-lg bg-tolopea-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-tolopea-600 active:scale-95'>
                Nourrir
              </button>
              <button className='flex-1 rounded-lg bg-aqua-forest-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-aqua-forest-600 active:scale-95'>
                Jouer
              </button>
              <button className='flex-1 rounded-lg bg-blood-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-blood-600 active:scale-95'>
                Entraîner
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
