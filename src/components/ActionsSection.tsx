import React from 'react'

const actions = [
  {
    svg: (
      <svg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <ellipse cx='28' cy='28' rx='26' ry='18' fill='#bedcc0' stroke='#428751' strokeWidth='4' />
        <rect x='22' y='18' width='12' height='8' rx='4' fill='#fff' />
      </svg>
    ),
    title: 'Nourrir',
    desc: 'Donne à manger à ton monstre pour le garder en forme.'
  },
  {
    svg: (
      <svg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='10' y='10' width='36' height='36' rx='8' fill='#adabff' stroke='#5f47ff' strokeWidth='4' />
        <circle cx='28' cy='28' r='10' fill='#fff' />
        <rect x='24' y='36' width='8' height='4' rx='2' fill='#5f47ff' />
      </svg>
    ),
    title: 'Jouer',
    desc: 'Joue avec lui pour le rendre heureux.'
  },
  {
    svg: (
      <svg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <ellipse cx='28' cy='36' rx='16' ry='8' fill='#f1f8f2' />
        <rect x='20' y='20' width='16' height='16' rx='8' fill='#6ca977' />
      </svg>
    ),
    title: 'Laver',
    desc: 'Garde ton monstre propre et en bonne santé.'
  },
  {
    svg: (
      <svg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <ellipse cx='28' cy='44' rx='16' ry='6' fill='#adabff' />
        <rect x='20' y='20' width='16' height='16' rx='8' fill='#5f47ff' />
      </svg>
    ),
    title: 'Coucher',
    desc: 'Veille à ce qu’il dorme bien pour grandir.'
  }
]

export default function ActionsSection (): React.ReactNode {
  return (
    <section id='actions' className='py-16 px-4 bg-aqua-forest-50 text-aqua-forest-900 flex flex-col items-center'>
      <h2 className='text-3xl font-bold mb-8'>Prends soin de ton monstre</h2>
      <div className='grid sm:grid-cols-4 gap-8 max-w-5xl'>
        {actions.map((a) => (
          <div key={a.title} className='bg-white/80 rounded-xl shadow p-6 flex flex-col items-center'>
            <span className='mb-2'>{a.svg}</span>
            <span className='font-semibold'>{a.title}</span>
            <p className='text-sm mt-2 text-center'>{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
