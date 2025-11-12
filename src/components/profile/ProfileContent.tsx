'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, LogOut, Loader2, Coins, TrendingUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SectionTitle from '@/components/ui/SectionTitle'
import ProfileImageUploader from './ProfileImageUploader'
import { authClient } from '@/lib/auth-client'
import { useSession } from '@/contexts/SessionContext'
import { useWallet } from '@/contexts/WalletContext'

/**
 * Composant d'affichage du profil utilisateur complet avec gestion du compte
 *
 * Sections affichées:
 * 1. **Informations du compte**:
 *    - Photo de profil avec possibilité de modification (ProfileImageUploader)
 *    - Nom d'utilisateur
 *    - Email
 *    - Date d'inscription (formatée en français)
 *
 * 2. **Statistiques du portefeuille**:
 *    - Solde actuel en pièces (depuis WalletContext)
 *    - Total cumulé de pièces gagnées (totalEarned)
 *
 * 3. **Gestion du compte**:
 *    - Bouton de déconnexion avec état de chargement
 *    - Redirection vers la page d'accueil après déconnexion
 *
 * Contextes utilisés:
 * - `SessionContext`: Récupération des données utilisateur (nom, email, date de création)
 * - `WalletContext`: Récupération des données de portefeuille (balance, totalEarned)
 *
 * @returns {ReactNode} Page de profil complète avec 3 sections en Card
 */
export default function ProfileContent (): ReactNode {
  const session = useSession()
  const wallet = useWallet()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = (): void => {
    setIsSigningOut(true)
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
          router.refresh()
        },
        onError: () => {
          setIsSigningOut(false)
        }
      }
    })
  }

  // Format the creation date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Section Title */}
        <SectionTitle
          title='Mon Profil'
          subtitle='Gérez vos informations et statistiques'
        />

        {/* Account Information Section */}
        <Card className='mb-6'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-tolopea-800 flex items-center gap-2'>
              <User className='h-6 w-6' />
              Informations du compte
            </h2>
          </div>

          <div className='space-y-6'>
            {/* User Name */}
            <div className='flex items-start gap-4'>
              <ProfileImageUploader />
              <div className='flex-1'>
                <p className='text-sm font-semibold text-tolopea-600'>Nom d'utilisateur</p>
                <p className='text-lg font-bold text-tolopea-900'>{session.user.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className='flex items-start gap-4 border-t border-tolopea-100 pt-6'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-aqua-forest-100'>
                <Mail className='h-6 w-6 text-aqua-forest-600' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-tolopea-600'>Email</p>
                <p className='text-lg font-bold text-tolopea-900'>{session.user.email}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className='flex items-start gap-4 border-t border-tolopea-100 pt-6'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blood-100'>
                <Calendar className='h-6 w-6 text-blood-600' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-tolopea-600'>Membre depuis</p>
                <p className='text-lg font-bold text-tolopea-900'>{formatDate(session.user.createdAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Wallet Statistics Section */}
        <Card className='mb-6'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-tolopea-800 flex items-center gap-2'>
              <Coins className='h-6 w-6' />
              Statistiques de votre portefeuille
            </h2>
          </div>

          <div className='space-y-6'>
            {/* Current Balance */}
            <div className='flex items-start gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-golden-fizz-400 to-golden-fizz-600 shadow-lg'>
                <Coins className='h-6 w-6 text-tolopea-900' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-tolopea-600'>Solde actuel</p>
                <p className='text-lg font-bold text-tolopea-900'>{wallet.balance} pièces</p>
              </div>
            </div>

            {/* Total Earned */}
            <div className='flex items-start gap-4 border-t border-tolopea-100 pt-6'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-aqua-forest-100'>
                <TrendingUp className='h-6 w-6 text-aqua-forest-600' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-tolopea-600'>Total de pièces gagnées</p>
                <p className='text-lg font-bold text-tolopea-900'>{wallet.totalEarned} pièces</p>
                <p className='text-xs text-tolopea-500 mt-1'>
                  Depuis le début de votre aventure
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Logout Section */}
        <Card>
          <div className='mb-4'>
            <h2 className='text-2xl font-bold text-tolopea-800 flex items-center gap-2'>
              <LogOut className='h-6 w-6' />
              Gestion du compte
            </h2>
          </div>

          <div className='space-y-4'>
            <p className='text-tolopea-700'>
              Vous souhaitez quitter votre session ?
            </p>
            <Button
              onClick={handleSignOut}
              variant='tertiary'
              color='blood'
              disabled={isSigningOut}
            >
              {isSigningOut
                ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    Déconnexion...
                  </>
                  )
                : (
                  <>
                    <LogOut className='mr-2 h-5 w-5' />
                    Se déconnecter
                  </>
                  )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
