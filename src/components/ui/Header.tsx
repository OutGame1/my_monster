'use client'

import { useState, useEffect, useRef, type ReactNode, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import cn from 'classnames'
import { authClient, type Session } from '@/lib/auth-client'
import { Menu, X, User, LogOut, Trophy, Grid3x3, Home } from 'lucide-react'
import CoinBadge from './CoinBadge'
import ProfileImage from '@/components/profile/ProfileImage'

interface HeaderProps {
  session: Session | null
}

export default function Header ({ session }: HeaderProps): ReactNode {
  const pathname = usePathname()
  const router = useRouter()

  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  // Helper to check if current path matches
  const isActive = useCallback((path: string): boolean => pathname === path, [pathname])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (event.target instanceof Node && menuRef.current !== null && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false)
    }
  }, [menuRef])

  // Close menu when clicking outside
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen, handleClickOutside])

  // Close menu when pathname changes (navigation)
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

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

  return (
    <header className='sticky top-0 z-50 border-b border-tolopea-100 bg-tolopea-50 backdrop-blur-sm shadow-xl'>
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
              className={cn(
                'rounded-lg px-6 py-3 text-base font-bold transition-all duration-300',
                isActive('/app')
                  ? 'bg-gradient-to-r from-tolopea-500 to-tolopea-600 text-white shadow-lg'
                  : 'text-tolopea-700 hover:bg-tolopea-100'
              )}
            >
              Mes monstres
            </Link>
            <Link
              href='/app/gallery'
              className={cn(
                'rounded-lg px-6 py-3 text-base font-bold transition-all duration-300',
                isActive('/app/gallery')
                  ? 'bg-gradient-to-r from-blood-500 to-blood-600 text-white shadow-lg'
                  : 'text-tolopea-700 hover:bg-blood-100'
              )}
            >
              Galerie
            </Link>
            <Link
              href='/app/quests'
              className={cn(
                'rounded-lg px-6 py-3 text-base font-bold transition-all duration-300',
                isActive('/app/quests')
                  ? 'bg-gradient-to-r from-aqua-forest-500 to-aqua-forest-600 text-white shadow-lg'
                  : 'text-tolopea-700 hover:bg-aqua-forest-100'
              )}
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
                <CoinBadge />
                <div className='relative' ref={menuRef}>
                  {/* Desktop: Profile Image with hover tooltip */}
                  <button
                    onClick={() => { setIsMenuOpen(!isMenuOpen) }}
                    className='flex items-center justify-center rounded-full bg-gradient-to-br from-tolopea-500 to-blood-500 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 overflow-hidden md:group'
                  >
                    <ProfileImage
                      session={session}
                      width={40}
                      height={40}
                    />
                    {/* Menu icon on mobile */}
                    <div className='absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-tolopea-600 p-1 md:hidden'>
                      {isMenuOpen ? <X size={12} /> : <Menu size={12} />}
                    </div>
                  </button>

                  {/* Tooltip on hover (desktop only) */}
                  <div className='absolute right-0 top-12 hidden md:group-hover:block'>
                    <div className='rounded-lg bg-gray-800 px-3 py-2 text-xs text-white shadow-xl whitespace-nowrap'>
                      Menu
                    </div>
                  </div>

                  {/* Dropdown Menu (mobile + desktop) */}
                  {isMenuOpen && (
                    <div className='absolute right-0 top-14 z-50 w-56 rounded-lg border border-tolopea-200 bg-white shadow-2xl'>
                      <div className='p-2'>
                        {/* User Info */}
                        <div className='border-b border-tolopea-100 px-3 py-2 mb-2'>
                          <p className='text-sm font-semibold text-tolopea-800 truncate'>
                            {session.user?.name ?? 'Utilisateur'}
                          </p>
                          <p className='text-xs text-tolopea-600 truncate'>
                            {session.user?.email ?? ''}
                          </p>
                        </div>

                        {/* Navigation Links (mobile only) */}
                        <div className='md:hidden mb-2 border-b border-tolopea-100 pb-2'>
                          <Link
                            href='/app'
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              isActive('/app')
                                ? 'bg-tolopea-100 text-tolopea-800'
                                : 'text-tolopea-700 hover:bg-tolopea-50'
                            )}
                          >
                            <Home size={18} />
                            Mes monstres
                          </Link>
                          <Link
                            href='/app/gallery'
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              isActive('/app/gallery')
                                ? 'bg-blood-100 text-blood-800'
                                : 'text-tolopea-700 hover:bg-blood-50'
                            )}
                          >
                            <Grid3x3 size={18} />
                            Galerie
                          </Link>
                          <Link
                            href='/app/quests'
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              isActive('/app/quests')
                                ? 'bg-aqua-forest-100 text-aqua-forest-800'
                                : 'text-tolopea-700 hover:bg-aqua-forest-50'
                            )}
                          >
                            <Trophy size={18} />
                            Quêtes
                          </Link>
                        </div>

                        {/* Profile Link */}
                        <Link
                          href='/profile'
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isActive('/profile')
                              ? 'bg-tolopea-100 text-tolopea-800'
                              : 'text-tolopea-700 hover:bg-tolopea-50'
                          )}
                        >
                          <User size={18} />
                          Mon profil
                        </Link>

                        {/* Sign Out */}
                        <button
                          onClick={() => { void handleSignOut() }}
                          disabled={isSigningOut}
                          className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blood-600 transition-colors hover:bg-blood-50'
                        >
                          <LogOut size={18} />
                          {isSigningOut ? 'Déconnexion...' : 'Se déconnecter'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
              )
            : (
              <>
                <Link
                  href='/sign-in'
                  className='hidden sm:block text-sm font-semibold text-tolopea-600 transition-colors hover:text-tolopea-800'
                >
                  Connexion
                </Link>
                <Link
                  href='/sign-up'
                  className='rounded-lg bg-blood-500 px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-blood-600 active:scale-95 whitespace-nowrap'
                >
                  <span className='hidden sm:inline'>Créer mon monstre</span>
                  <span className='sm:hidden'>S&apos;inscrire</span>
                </Link>
              </>
              )}
        </div>
      </div>
    </header>
  )
}
