'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

export default function Header (): ReactNode {
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
          <Link
            href='/sign-in'
            className='text-sm font-semibold text-tolopea-600 transition-colors hover:text-tolopea-800'
          >
            Connexion
          </Link>
          <Link
            href='/sign-up'
            className='rounded-lg bg-blood-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blood-600'
          >
            Créer mon monstre
          </Link>
        </div>
      </div>
    </header>
  )
}
