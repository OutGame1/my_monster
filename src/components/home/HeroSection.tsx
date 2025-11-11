import type { ReactNode } from 'react'
import Link from 'next/link'
import { Sparkles, Heart, Star } from 'lucide-react'

export default function HeroSection (): ReactNode {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-tolopea-500 via-seance-500 to-blood-500'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -left-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse' />
        <div className='absolute -bottom-1/2 -right-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
      </div>

      <div className='relative max-w-6xl mx-auto px-4 py-24 sm:py-32 lg:py-40'>
        <div className='text-center'>
          {/* Badge kawaii */}
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8 animate-bounce'>
            <Sparkles className='h-4 w-4 text-golden-fizz-300' />
            <span className='text-sm font-semibold text-white'>Nouveau jeu Tamagotchi</span>
            <Star className='h-4 w-4 text-golden-fizz-300' />
          </div>

          {/* Title avec emoji */}
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight'>
            Adoptez votre petit
            <br />
            <span className='inline-flex items-center gap-3 bg-gradient-to-r from-golden-fizz-300 via-aqua-forest-300 to-seance-300 bg-clip-text text-transparent'>
              monstre kawaii
              <Heart className='inline h-10 w-10 sm:h-12 sm:w-12 text-blood-300 fill-blood-300 animate-pulse' />
            </span>
          </h1>

          {/* Description */}
          <p className='mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed'>
            Créez, nourrissez et faites évoluer votre compagnon virtuel unique !
            Chaque monstre a sa propre personnalité et attend vos câlins quotidiens !
          </p>

          {/* CTA Buttons */}
          <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link
              href='/sign-up'
              className='group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-golden-fizz-500 hover:bg-golden-fizz-600 text-gray-900 font-bold text-xl shadow-2xl hover:shadow-golden-fizz-500/50 transition-all duration-300 hover:scale-105'
            >
              <Sparkles className='h-5 w-5 group-hover:animate-spin' />
              Commencer l'aventure
            </Link>
            <Link
              href='/sign-in'
              className='inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/10 backdrop-blur-sm font-semibold text-xl transition-all duration-300 hover:scale-105'
            >
              J'ai déjà un compte
            </Link>
          </div>

          {/* Stats badges */}
          <div className='mt-16 flex flex-wrap justify-center gap-6 sm:gap-8'>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl font-bold text-white'>1000+</div>
              <div className='text-sm text-white/70 mt-1'>Monstres créés</div>
            </div>
            <div className='h-12 w-px bg-white/30 hidden sm:block' />
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl font-bold text-white'>500+</div>
              <div className='text-sm text-white/70 mt-1'>Dresseurs actifs</div>
            </div>
            <div className='h-12 w-px bg-white/30 hidden sm:block' />
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl font-bold text-white'>24/7</div>
              <div className='text-sm text-white/70 mt-1'>Disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className='absolute bottom-0 left-0 right-0'>
        <svg
          viewBox='0 0 1440 120'
          className='w-full h-auto'
          preserveAspectRatio='none'
        >
          <path
            d='M0,64 C360,20 720,20 1080,64 C1320,96 1440,96 1440,96 L1440,120 L0,120 Z'
            fill='#f9fafb'
            className='drop-shadow-2xl'
          />
        </svg>
      </div>
    </section>
  )
}
