'use client'

import { ReactNode, useState } from 'react'
import Button from '@components/ui/Button'
import MonsterCard from '@components/ui/MonsterCard'
import AdoptMonsterModal from '@components/modals/AdoptMonsterModal'
import { authClient } from '@lib/auth-client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import type { SerializedMonster } from '@/types/monster.types'

interface DashboardContentProps {
  user: {
    name: string
  }
  monsters?: SerializedMonster[]
}

export default function DashboardContent ({ user, monsters = [] }: DashboardContentProps): ReactNode {
  const router = useRouter()
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false)

  const handleSignOut = (): void => {
    toast.loading('Déconnexion...', { toastId: 'signout' })
    void authClient.signOut()
    toast.update('signout', {
      render: 'À bientôt ! 👋',
      type: 'success',
      isLoading: false,
      autoClose: 2000
    })
    router.push('/sign-in')
  }

  const handleOpenAdoptModal = (): void => {
    setIsAdoptModalOpen(true)
  }

  const handleCloseAdoptModal = (): void => {
    setIsAdoptModalOpen(false)
  }

  // Calculer les statistiques
  const averageLevel = monsters.length > 0
    ? Math.round(monsters.reduce((sum, m) => sum + m.level, 0) / monsters.length)
    : 0

  const averageHappiness = monsters.length > 0
    ? Math.round(monsters.reduce((sum, m) => sum + m.stats.happiness, 0) / monsters.length)
    : 0

  return (
    <div className='min-h-screen bg-gradient-to-b from-tolopea-50 to-white'>
      <div className='max-w-7xl mx-auto p-8'>
        {/* Header avec titre et bouton de déconnexion */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12'>
          <div>
            <h1 className='text-4xl font-bold text-tolopea-900 mb-2'>
              Bienvenue, {user.name} !
            </h1>
            <p className='text-gray-600 text-lg'>
              Voici le tableau de bord de vos petits monstres
            </p>
          </div>

          <Button
            onClick={handleSignOut}
            variant='secondary'
            className='px-8 py-3 hover:bg-tolopea-100 transition-colors'
          >
            Se déconnecter
          </Button>
        </div>

        {/* Grille de statistiques */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          {/* Carte des statistiques */}
          <div className='bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-tolopea-100 hover:border-tolopea-200 transition-colors'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-12 h-12 rounded-full bg-blood-100 flex items-center justify-center'>
                <span className='text-2xl'>📊</span>
              </div>
              <h2 className='text-2xl font-semibold text-tolopea-900'>
                Statistiques
              </h2>
            </div>
            <div className='space-y-4'>
              <p className='text-gray-600 text-lg flex justify-between'>
                Monstres adoptés <span className='font-semibold'>{monsters.length}</span>
              </p>
              <p className='text-gray-600 text-lg flex justify-between'>
                Niveau moyen <span className='font-semibold'>{averageLevel || '-'}</span>
              </p>
              <p className='text-gray-600 text-lg flex justify-between'>
                Bonheur moyen <span className='font-semibold'>{averageHappiness > 0 ? `${averageHappiness}%` : '-'}</span>
              </p>
            </div>
          </div>

          {/* Bouton d'adoption */}
          <div className='bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-tolopea-100 hover:border-tolopea-200 transition-colors'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-12 h-12 rounded-full bg-tolopea-100 flex items-center justify-center'>
                <span className='text-2xl'>🥚</span>
              </div>
              <h2 className='text-2xl font-semibold text-tolopea-900'>
                Adoption
              </h2>
            </div>
            <p className='text-gray-600 text-lg mb-6'>
              {monsters.length === 0
                ? 'Commencez votre aventure en adoptant votre premier monstre !'
                : 'Adoptez un nouveau compagnon !'}
            </p>
            <Button variant='primary' className='w-full' onClick={handleOpenAdoptModal}>
              Adopter un monstre
            </Button>
          </div>

          {/* Carte des activités récentes */}
          <div className='bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-tolopea-100 hover:border-tolopea-200 transition-colors'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-12 h-12 rounded-full bg-aqua-forest-100 flex items-center justify-center'>
                <span className='text-2xl'>📝</span>
              </div>
              <h2 className='text-2xl font-semibold text-tolopea-900'>
                Activités
              </h2>
            </div>
            <p className='text-gray-600 text-lg'>
              {monsters.length === 0
                ? 'Vos actions avec vos monstres apparaîtront ici !'
                : `Vous avez ${monsters.length} monstre${monsters.length > 1 ? 's' : ''} à votre charge`}
            </p>
          </div>
        </div>

        {/* Section des monstres */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-tolopea-900 mb-6'>
            Vos Monstres ({monsters.length})
          </h2>

          {monsters.length === 0 ? (
            <div className='bg-white/90 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-tolopea-100 text-center'>
              <span className='text-6xl mb-4 block'>🦕</span>
              <h3 className='text-2xl font-semibold text-tolopea-900 mb-2'>
                Aucun monstre pour le moment
              </h3>
              <p className='text-gray-600 text-lg mb-6'>
                Commencez par en adopter un pour démarrer votre aventure !
              </p>
              <Button variant='primary' onClick={handleOpenAdoptModal}>
                Adopter mon premier monstre
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {monsters.map((monster) => (
                <MonsterCard key={monster._id} monster={monster} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal d'adoption */}
      <AdoptMonsterModal
        isOpen={isAdoptModalOpen}
        onClose={handleCloseAdoptModal}
      />
    </div>
  )
}
