// ========================================
// CONTENU DÉTAILS MONSTRE - PRÉSENTATION
// ========================================
// Contenu de la page détails d'un monstre

'use client'

import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@components/ui/Button'
import { SerializedMonster } from '@/types/monster.types'
import { useMonsterVisual } from '@/presentation/hooks/useMonsterVisual'
import MonsterAvatar from '@/presentation/components/monster/MonsterAvatar'
import { AnimationType } from '@/core/models/monster-visual.model'
import { toast } from 'react-toastify'

interface MonsterDetailContentProps {
  monster: SerializedMonster
}

export default function MonsterDetailContent ({ monster }: MonsterDetailContentProps): ReactNode {
  const router = useRouter()
  const visualProfile = useMonsterVisual(monster)
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>('idle')

  const handleAnimate = (animation: AnimationType): void => {
    setCurrentAnimation(animation)
    setTimeout(() => setCurrentAnimation('idle'), 2000)
  }

  const handleFeed = async (): Promise<void> => {
    handleAnimate('hungry')
    toast.success(`${monster.name} a été nourri ! 🍖`)
    // TODO: Appel API pour nourrir le monstre
  }

  const handlePet = async (): Promise<void> => {
    handleAnimate('happy')
    toast.success(`${monster.name} est content ! 😊`)
    // TODO: Appel API pour caresser le monstre
  }

  const handleCelebrate = async (): Promise<void> => {
    handleAnimate('celebrate')
    toast.success(`${monster.name} célèbre ! 🎉`)
  }

  const handleBattle = async (): Promise<void> => {
    handleAnimate('attack')
    toast.info(`${monster.name} est prêt au combat ! ⚔️`)
    // TODO: Rediriger vers page de combat
  }

  const experiencePercent = (monster.experience / monster.experienceToNextLevel) * 100

  return (
    <div className='min-h-screen bg-gradient-to-b from-tolopea-50 to-white'>
      <div className='max-w-7xl mx-auto p-8'>
        {/* Header avec retour */}
        <div className='mb-8'>
          <Button
            variant='secondary'
            onClick={() => router.push('/dashboard')}
            className='mb-4'
          >
            ← Retour au dashboard
          </Button>

          <div className='space-y-4'>
            {/* Nom et niveau */}
            <div className='text-center'>
              <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                {monster.name}
              </h1>
              <div className='flex items-center justify-center gap-2 text-lg text-gray-700'>
                <span className='px-3 py-1 bg-purple-100 text-purple-900 rounded-full font-semibold'>
                  Niveau {monster.level}
                </span>
                <span className='px-3 py-1 bg-blue-100 text-blue-900 rounded-full font-semibold'>
                  {monster.type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Colonne gauche : Avatar et interactions */}
          <div className='space-y-6'>
            {/* Avatar grand format */}
            <div className='bg-white/90 backdrop-blur-sm rounded-xl p-12 flex items-center justify-center border-2 border-tolopea-100 shadow-xl'>
              {(visualProfile != null)
                ? (
                  <MonsterAvatar
                    visualProfile={visualProfile}
                    animation={currentAnimation}
                    size={400}
                    interactive={false}
                  />
                  )
                : (
                  <div className='w-[400px] h-[400px] animate-pulse bg-gray-200 rounded-lg' />
                  )}
            </div>

            {/* Boutons d'interaction */}
            <div className='grid grid-cols-2 gap-4'>
              <button
                onClick={handlePet}
                className='p-6 bg-aqua-forest/10 hover:bg-aqua-forest/20
                         text-aqua-forest-700 rounded-xl transition-all font-semibold
                         flex flex-col items-center gap-3 border-2 border-aqua-forest/30
                         hover:border-aqua-forest/50 hover:scale-105 transform'
              >
                <span className='text-4xl'>😊</span>
                <span className='text-lg'>Caresser</span>
              </button>
              <button
                onClick={handleFeed}
                className='p-6 bg-blood/10 hover:bg-blood/20
                         text-red-700 rounded-xl transition-all font-semibold
                         flex flex-col items-center gap-3 border-2 border-blood/30
                         hover:border-blood/50 hover:scale-105 transform'
              >
                <span className='text-4xl'>🍖</span>
                <span className='text-lg'>Nourrir</span>
              </button>
              <button
                onClick={handleCelebrate}
                className='p-6 bg-tolopea/10 hover:bg-tolopea/20
                         text-tolopea-700 rounded-xl transition-all font-semibold
                         flex flex-col items-center gap-3 border-2 border-tolopea/30
                         hover:border-tolopea/50 hover:scale-105 transform'
              >
                <span className='text-4xl'>🎉</span>
                <span className='text-lg'>Célébrer</span>
              </button>
              <button
                onClick={handleBattle}
                className='p-6 bg-orange-500/10 hover:bg-orange-500/20
                         text-orange-700 rounded-xl transition-all font-semibold
                         flex flex-col items-center gap-3 border-2 border-orange-500/30
                         hover:border-orange-500/50 hover:scale-105 transform'
              >
                <span className='text-4xl'>⚔️</span>
                <span className='text-lg'>Combattre</span>
              </button>
            </div>
          </div>

          {/* Colonne droite : Informations détaillées */}
          <div className='space-y-6'>
            {/* Informations générales */}
            <div className='bg-white/90 backdrop-blur-sm rounded-xl border-2 border-tolopea-100 p-6 shadow-lg'>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>Informations</h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                  <span className='text-gray-700 font-semibold'>Type</span>
                  <span className='px-4 py-2 bg-tolopea/20 text-tolopea-800 rounded-full font-bold'>
                    {monster.type}
                  </span>
                </div>
                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                  <span className='text-gray-700 font-semibold'>Rareté</span>
                  <span className='px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-bold'>
                    {monster.rarity}
                  </span>
                </div>
                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                  <span className='text-gray-700 font-semibold'>Niveau</span>
                  <span className='text-3xl font-bold text-gray-900'>{monster.level}</span>
                </div>
                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                  <span className='text-gray-700 font-semibold'>Humeur</span>
                  <span className='font-bold text-gray-900'>{monster.mood}</span>
                </div>
              </div>
            </div>

            {/* Barre d'expérience */}
            <div className='bg-white/90 backdrop-blur-sm rounded-xl border-2 border-tolopea-100 p-6 shadow-lg'>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Expérience</h3>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm text-gray-700'>
                  <span className='font-semibold'>{monster.experience} / {monster.experienceToNextLevel} XP</span>
                  <span className='font-bold'>{Math.round(experiencePercent)}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-6 overflow-hidden border-2 border-gray-300'>
                  <div
                    className='bg-gradient-to-r from-tolopea to-purple-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2'
                    style={{ width: `${experiencePercent}%` }}
                  >
                    {experiencePercent > 10 && (
                      <span className='text-xs font-bold text-white'>
                        {Math.round(experiencePercent)}%
                      </span>
                    )}
                  </div>
                </div>
                <p className='text-sm text-gray-600 text-center'>
                  {monster.experienceToNextLevel - monster.experience} XP jusqu&apos;au niveau suivant
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <div className='bg-white/90 backdrop-blur-sm rounded-xl border-2 border-tolopea-100 p-6 shadow-lg'>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>Statistiques</h3>
              <div className='space-y-5'>
                {/* Santé */}
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='font-bold text-gray-800'>❤️ Santé</span>
                    <span className='text-gray-700 font-semibold'>{monster.stats.health} / {monster.stats.maxHealth}</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-3 border border-gray-300'>
                    <div
                      className='bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all'
                      style={{ width: `${(monster.stats.health / monster.stats.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Énergie */}
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='font-bold text-gray-800'>⚡ Énergie</span>
                    <span className='text-gray-700 font-semibold'>{monster.stats.energy} / {monster.stats.maxEnergy}</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-3 border border-gray-300'>
                    <div
                      className='bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all'
                      style={{ width: `${(monster.stats.energy / monster.stats.maxEnergy) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats de combat */}
                <div className='grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-gray-200'>
                  <div className='text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200'>
                    <div className='text-3xl font-bold text-orange-700'>{monster.stats.attack}</div>
                    <div className='text-sm text-gray-700 font-semibold mt-1'>⚔️ Attaque</div>
                  </div>
                  <div className='text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200'>
                    <div className='text-3xl font-bold text-blue-700'>{monster.stats.defense}</div>
                    <div className='text-sm text-gray-700 font-semibold mt-1'>🛡️ Défense</div>
                  </div>
                  <div className='text-center p-4 bg-green-50 rounded-lg border-2 border-green-200'>
                    <div className='text-3xl font-bold text-green-700'>{monster.stats.speed}</div>
                    <div className='text-sm text-gray-700 font-semibold mt-1'>⚡ Vitesse</div>
                  </div>
                </div>

                {/* Bonheur et Faim */}
                <div className='grid grid-cols-2 gap-4 pt-6 border-t-2 border-gray-200'>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='font-bold text-gray-800'>😊 Bonheur</span>
                      <span className='text-gray-700 font-semibold'>{monster.stats.happiness}%</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-3 border border-gray-300'>
                      <div
                        className='bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all'
                        style={{ width: `${monster.stats.happiness}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='font-bold text-gray-800'>🍖 Faim</span>
                      <span className='text-gray-700 font-semibold'>{monster.stats.hunger}%</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-3 border border-gray-300'>
                      <div
                        className='bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all'
                        style={{ width: `${monster.stats.hunger}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacités */}
            {monster.abilities && monster.abilities.length > 0 && (
              <div className='bg-white/90 backdrop-blur-sm rounded-xl border-2 border-tolopea-100 p-6 shadow-lg'>
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>Capacités</h3>
                <div className='space-y-4'>
                  {monster.abilities.map((ability, index) => (
                    <div
                      key={index}
                      className='p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-tolopea-300 transition-colors'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <span className='font-bold text-gray-900 text-lg'>{ability.name}</span>
                        <span className='text-sm px-3 py-1 bg-tolopea/20 text-tolopea-800 rounded-full font-semibold'>
                          {ability.type}
                        </span>
                      </div>
                      <p className='text-sm text-gray-700 mb-3'>{ability.description}</p>
                      <div className='flex justify-between text-sm text-gray-700'>
                        <span className='font-semibold'>💥 Puissance: <span className='text-orange-700 font-bold'>{ability.power}</span></span>
                        <span className='font-semibold'>⚡ Coût: <span className='text-yellow-700 font-bold'>{ability.energyCost}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className='bg-white/90 backdrop-blur-sm rounded-xl border-2 border-tolopea-100 p-6 shadow-lg'>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Description</h3>
              <p className='text-gray-700 leading-relaxed text-lg'>{monster.description}</p>
            </div>

            {/* Achievements */}
            {monster.achievements && monster.achievements.length > 0 && (
              <div className='bg-white/90 backdrop-blur-sm rounded-xl border-2 border-tolopea-100 p-6 shadow-lg'>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>Succès</h3>
                <div className='flex flex-wrap gap-3'>
                  {monster.achievements.map((achievement, index) => (
                    <span
                      key={index}
                      className='px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900 rounded-full text-sm font-bold border-2 border-yellow-300'
                    >
                      🏆 {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
