'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Session } from '@/lib/auth-client'
import { usePathname } from 'next/navigation'
import CreditBadge from './CreditBadge'

interface HeaderProps {
  session: Session | null
}

export default function Header ({ session }: HeaderProps): ReactNode {
  const pathname = usePathname()

  // Helper to check if current path matches
  const isActive = (path: string): boolean => pathname === path

  return (
    <header className='sticky top-0 z-50 border-b border-tolopea-100 bg-tolopea-50 backdrop-blur-sm'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
        {/* Left - Logo */}
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

        {/* Center - Navigation (only when logged in) */}
        {session !== null && (
          <nav className='hidden md:flex items-center gap-4'>
            <Link
              href='/app'
              className={`rounded-lg px-6 py-3 text-base font-bold transition-all duration-300 ${
                isActive('/app')
                  ? 'bg-gradient-to-r from-tolopea-500 to-tolopea-600 text-white shadow-lg'
                  : 'text-tolopea-700 hover:bg-tolopea-100'
              }`}
            >
              Mes monstres
            </Link>
            <Link
              href='/gallery'
              className={`rounded-lg px-6 py-3 text-base font-bold transition-all duration-300 ${
                isActive('/gallery')
                  ? 'bg-gradient-to-r from-blood-500 to-blood-600 text-white shadow-lg'
                  : 'text-tolopea-700 hover:bg-blood-100'
              }`}
            >
              Galerie
            </Link>
            <Link
              href='/quests'
              className={`rounded-lg px-6 py-3 text-base font-bold transition-all duration-300 ${
                isActive('/quests')
                  ? 'bg-gradient-to-r from-aqua-forest-500 to-aqua-forest-600 text-white shadow-lg'
                  : 'text-tolopea-700 hover:bg-aqua-forest-100'
              }`}
            >
              Quêtes
            </Link>
          </nav>
        )}

        {/* Right - User Actions */}
        <div className='flex items-center gap-4'>
          {session !== null
            ? (
              <>
                <CreditBadge />
                <div className='group relative'>
                  <Link
                    href='/profile'
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-tolopea-500 to-blood-500 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110'
                  >
                    {session.user.name.charAt(0).toUpperCase()}
                  </Link>
                  {/* Tooltip on hover */}
                  <div className='absolute right-0 top-12 hidden group-hover:block'>
                    <div className='rounded-lg bg-gray-800 px-3 py-2 text-xs text-white shadow-xl whitespace-nowrap'>
                      Mon profil
                    </div>
                  </div>
                </div>
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
