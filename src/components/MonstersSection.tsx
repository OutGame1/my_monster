import React from 'react'

const monsters = [
  {
    name: 'Mochi',
    img: '/file.svg',
    color: 'bg-aqua-forest-100',
    desc: 'Toujours joyeux et gourmand.'
  },
  {
    name: 'Globule',
    img: '/globe.svg',
    color: 'bg-blood-100',
    desc: 'Un cœur tendre, adore les câlins.'
  },
  {
    name: 'Vercool',
    img: '/vercel.svg',
    color: 'bg-tolopea-100',
    desc: 'Rapide et malin, toujours prêt à jouer.'
  }
]

export default function MonstersSection (): React.ReactNode {
  return (
    <section id='monsters' className='py-16 px-4 bg-tolopea-50 text-tolopea-900 flex flex-col items-center'>
      <h2 className='text-3xl font-bold mb-8'>Quelques monstres à adopter</h2>
      <div className='flex flex-wrap gap-8 justify-center'>
        {monsters.map((m) => (
          <div key={m.name} className={`rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 ${m.color}`}>
            <img src={m.img} alt={m.name} className='w-20 h-20 mb-3' />
            <span className='font-bold text-lg mb-1'>{m.name}</span>
            <span className='text-sm text-gray-700'>{m.desc}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
