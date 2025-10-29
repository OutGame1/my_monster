'use client'

import { useState, type ReactNode } from 'react'
import type { Session } from '@/lib/auth-client'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SectionTitle from '@/components/ui/SectionTitle'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, LogOut, Loader2 } from 'lucide-react'

interface ProfileContentProps {
  session: Session
}

/**
 * Component displaying user profile information and account management options.
 *
 * @param {ProfileContentProps} props - Session data for the current user
 * @returns {ReactNode} Profile content with user information and logout
 */
export default function ProfileContent ({ session }: ProfileContentProps): ReactNode {
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
    <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
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
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-tolopea-500 to-blood-500 text-xl font-bold text-white shadow-lg'>
                {session.user.name.charAt(0).toUpperCase()}
              </div>
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
