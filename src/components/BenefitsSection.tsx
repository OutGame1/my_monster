import React from 'react'

const benefits = [
  {
    svg: (
      <svg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='28' cy='28' r='26' fill='#ffdedf' stroke='#ff2d34' strokeWidth='4' />
        <path d='M18 32 Q28 44 38 32' stroke='#ff2d34' strokeWidth='2' fill='none' strokeLinecap='round' />
        <circle cx='22' cy='26' r='3' fill='#fff' />
        <circle cx='34' cy='26' r='3' fill='#fff' />
        <circle cx='22' cy='27' r='1' fill='#ff2d34' />
        <circle cx='34' cy='27' r='1' fill='#ff2d34' />
      </svg>
    ),
    title: 'Crée un lien unique',
    desc: 'Développe une vraie relation avec ton monstre, il réagit à tes soins !'
  },
  {
    svg: (
      <svg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='8' y='8' width='40' height='40' rx='10' fill='#adabff' stroke='#5f47ff' strokeWidth='4' />
        <circle cx='28' cy='28' r='8' fill='#fff' />
        <rect x='20' y='36' width='16' height='4' rx='2' fill='#5f47ff' />
      </svg>
    ),
    title: 'Personnalisation poussée',
    desc: 'Habille, décore et fais évoluer ton compagnon selon tes envies.'
  },
  {
    svg: (
      <svg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <ellipse cx='28' cy='36' rx='16' ry='8' fill='#bedcc0' />
        <circle cx='28' cy='24' r='12' fill='#428751' />
        <path d='M22 28 Q28 34 34 28' stroke='#fff' strokeWidth='2' fill='none' />
      </svg>
    ),
    title: 'Évolution & défis',
    desc: 'Relève des défis quotidiens et vois ton monstre grandir et s’épanouir.'
  }
]

export default function BenefitsSection (): React.ReactNode {
  return (
    <section id='benefits' className='py-16 px-4 bg-blood-50 text-blood-900 flex flex-col items-center'>
      <h2 className='text-3xl font-bold mb-6'>Pourquoi jouer à My Monster ?</h2>
      <ul className='grid sm:grid-cols-3 gap-8 max-w-5xl'>
        {benefits.map((b) => (
          <li key={b.title} className='bg-white/80 rounded-xl shadow p-6 flex flex-col items-center'>
            <span className='mb-2'>{b.svg}</span>
            <span className='font-semibold'>{b.title}</span>
            <p className='text-sm mt-2 text-center'>{b.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
