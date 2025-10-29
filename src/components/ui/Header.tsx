'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { authClient, type Session } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import type { ISerializedWallet } from '@/lib/serializers/wallet.serializer'
import CreditBadge from './CreditBadge'

interface HeaderProps {
  session: Session | null
  wallet: ISerializedWallet | null
}

export default function Header ({ session, wallet }: HeaderProps): ReactNode {
  const router = useRouter()

  const handleSignOut = (): void => {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
          router.refresh()
        }
      }
    })
  }

  return (
    <header className='sticky top-0 z-50 border-b border-tolopea-100 bg-tolopea-50 backdrop-blur-sm'>
      <div className='mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6'>
        <Link
          href='/'
          className='flex items-center gap-3 text-tolopea-700 transition-colors hover:text-tolopea-900'
        >
          <img
            src='/logo.png'
            alt='Logo MyMonster'
            className='h-10 w-10 rounded-full bg-blood-50 object-cover'
          />
          <span className='text-2xl font-semibold text-tolopea-800'>MyMonster</span>
        </Link>

        <div className='flex items-center gap-4'>
          {session !== null
            ? (
              <>
                <CreditBadge initialBalance={wallet?.balance ?? 0} />
                <Link
                  href='/dashboard'
                  className='text-sm font-semibold text-tolopea-600 transition-colors hover:text-tolopea-800'
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className='rounded-lg bg-blood-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-blood-600 active:scale-95'
                >
                  Déconnexion
                </button>
              </>
              )
            : (
              <>
                <Link
                  href='/sign-in'
                  className='text-sm font-semibold text-tolopea-600 transition-colors hover:text-tolopea-800'
                >
                  Connexion
                </Link>
                <Link
                  href='/sign-up'
                  className='rounded-lg bg-blood-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-blood-600 active:scale-95'
                >
                  Créer mon monstre
                </Link>
              </>
              )}
        </div>
      </div>
    </header>
  )
}
