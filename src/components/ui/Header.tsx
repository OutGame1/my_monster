'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

export default function Header (): ReactNode {
  return (
    <header className='fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
        <div className='flex items-center justify-between h-20'>
          <div className='flex items-center justify-center gap-2'>
            <img src='logo.png' alt='Logo' width={72}/>
            <Link href='/public' className='text-3xl font-bold text-tolopea-600'>
              MyMonster
            </Link>
          </div>

          <nav className='hidden md:flex items-center space-x-12'>
            <a href='#benefits' className='text-lg text-gray-600 hover:text-tolopea-600 transition-colors'>Avantages</a>
            <a href='#monsters' className='text-lg text-gray-600 hover:text-tolopea-600 transition-colors'>Nos Monstres</a>
            <a href='#features' className='text-lg text-gray-600 hover:text-tolopea-600 transition-colors'>Fonctionnalités</a>
            <a href='#newsletter' className='text-lg text-gray-600 hover:text-tolopea-600 transition-colors'>Newsletter</a>
          </nav>

          <div className='flex items-center space-x-6'>
            <Link
              href='/sign-in'
              className='text-lg text-gray-600 hover:text-tolopea-600 transition-colors'
            >
              Connexion
            </Link>
            <Link
              href='/temp'
              className='bg-blood-500 text-white px-6 py-3 rounded-lg hover:bg-blood-600 transition-colors text-lg font-semibold'
            >
              Créer mon monstre
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
