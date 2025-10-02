import { ReactNode } from 'react'
import Link from 'next/link'

export default function HeroSection (): ReactNode {
  return (
    <section className='w-full min-h-screen pt-24 pb-16 bg-gradient-to-b from-tolopea-50 to-white flex items-center'>
      <div className='container mx-auto px-4 w-full'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='md:w-1/2 w-full flex flex-col items-center md:items-start text-center md:text-left'>
            <h1 className='text-4xl md:text-6xl font-bold text-tolopea-900 mb-6'>
              Adoptez votre petit monstre virtuel
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
              Découvrez une expérience unique de compagnon virtuel. Élevez, jouez et créez des liens avec votre adorable monstre personnalisé.
            </p>
            <div className='flex gap-4'>
              <Link
                href='/temp'
                className='bg-blood-500 text-white px-8 py-3 rounded-lg hover:bg-blood-600 transition-colors text-lg font-semibold'
              >
                Commencer l&apos;aventure
              </Link>
              <a
                href='#monsters'
                className='border-2 border-tolopea-200 text-tolopea-600 px-8 py-3 rounded-lg hover:bg-tolopea-50 transition-colors text-lg font-semibold'
              >
                Voir les monstres
              </a>
            </div>
          </div>
          <div className='md:w-1/2 w-full relative h-[400px]'>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-aqua-forest-100 rounded-full animate-float' />
          </div>
        </div>
      </div>
    </section>
  )
}
