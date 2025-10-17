'use client'

import { ReactNode } from 'react'
import Button from '@components/ui/Button'
import { authClient } from '@lib/auth-client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface DashboardContentProps {
  user: {
    name: string
  }
}

export default function DashboardContent ({ user }: DashboardContentProps): ReactNode {
  const router = useRouter()

  const handleSignOut = async (): Promise<void> => {
    toast.loading('Déconnexion...', { toastId: 'signout' })
    await authClient.signOut()
    toast.update('signout', {
      render: 'À bientôt ! 👋',
      type: 'success',
      isLoading: false,
      autoClose: 2000
    })
    router.push('/sign-in')
  }

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

        {/* Grille de contenu */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Carte des monstres */}
          <div className='bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-tolopea-100 hover:border-tolopea-200 transition-colors'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-12 h-12 rounded-full bg-tolopea-100 flex items-center justify-center'>
                <span className='text-2xl'>🦕</span>
              </div>
              <h2 className='text-2xl font-semibold text-tolopea-900'>
                Vos Monstres
              </h2>
            </div>
            <p className='text-gray-600 text-lg mb-6'>
              Aucun monstre pour le moment. Commencez par en adopter un !
            </p>
            <Button variant='primary' className='w-full'>
              Adopter un monstre
            </Button>
          </div>

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
                Monstres adoptés <span className='font-semibold'>0</span>
              </p>
              <p className='text-gray-600 text-lg flex justify-between'>
                Niveau moyen <span className='font-semibold'>-</span>
              </p>
              <p className='text-gray-600 text-lg flex justify-between'>
                Bonheur moyen <span className='font-semibold'>-</span>
              </p>
            </div>
          </div>

          {/* Carte des activités récentes */}
          <div className='bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-tolopea-100 hover:border-tolopea-200 transition-colors'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-12 h-12 rounded-full bg-aqua-forest-100 flex items-center justify-center'>
                <span className='text-2xl'>📝</span>
              </div>
              <h2 className='text-2xl font-semibold text-tolopea-900'>
                Activités Récentes
              </h2>
            </div>
            <p className='text-gray-600 text-lg'>
              Aucune activité récente. Vos actions avec vos monstres apparaîtront ici !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
