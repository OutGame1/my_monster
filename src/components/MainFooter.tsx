import React from 'react'

export default function MainFooter (): React.ReactNode {
  return (
    <footer className='bg-tolopea-900 text-tolopea-50 py-8 px-4 mt-auto'>
      <div className='max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='flex items-center gap-2'>
          <img src='/file.svg' alt='Logo' className='w-8 h-8' />
          <span className='font-bold text-lg'>My Monster</span>
        </div>
        <nav className='flex gap-6 text-sm'>
          <a href='#hero' className='hover:underline'>Accueil</a>
          <a href='#benefits' className='hover:underline'>Bénéfices</a>
          <a href='#monsters' className='hover:underline'>Monstres</a>
          <a href='#actions' className='hover:underline'>Actions</a>
          <a href='#newsletter' className='hover:underline'>Newsletter</a>
        </nav>
        <div className='flex flex-col sm:items-end text-xs text-tolopea-100'>
          <span>© 2025 My Monster. Tous droits réservés.</span>
          <div className='flex gap-2 mt-1'>
            <a href='#' className='hover:underline'>Mentions légales</a>
            <a href='#' className='hover:underline'>CGU</a>
            <a href='#' className='hover:underline'>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
