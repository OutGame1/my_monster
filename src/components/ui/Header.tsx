'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { authClient, type Session } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  session: Session | null
}

export default function Header ({ session }: HeaderProps): ReactNode {
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
                <div className='flex items-center gap-2 rounded-full bg-gradient-to-br from-golden-fizz-300 via-golden-fizz-400 to-golden-fizz-500 px-4 py-2 shadow-lg shadow-golden-fizz-500/30 ring-2 ring-golden-fizz-600/40'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='h-5 w-5 text-golden-fizz-800'
                  >
                    <path d='M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z' />
                    <path fillRule='evenodd' d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z' clipRule='evenodd' />
                  </svg>
                  <span className='text-lg font-bold text-golden-fizz-900'>
                    {session.user.credit}
                  </span>
                </div>
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
