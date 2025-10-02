import { ReactNode } from 'react'

export default function MonstersSection (): ReactNode {
  const monsters = [
    {
      name: 'Bloopy',
      type: 'Aquatique',
      description: 'Un monstre jovial qui adore les éclaboussures',
      color: 'bg-tolopea-100'
    },
    {
      name: 'Leafy',
      type: 'Nature',
      description: 'Un esprit de la forêt espiègle et attachant',
      color: 'bg-aqua-forest-100'
    },
    {
      name: 'Flammy',
      type: 'Feu',
      description: "Une boule d'énergie chaleureuse et dynamique",
      color: 'bg-blood-100'
    }
  ]

  return (
    <section id='monsters' className='w-full min-h-screen py-20 bg-tolopea-50 flex items-center'>
      <div className='container mx-auto px-4 w-full'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center text-tolopea-900 mb-6'>
            Nos adorables monstres
          </h2>
          <p className='text-center text-gray-600 mb-16 text-xl max-w-3xl mx-auto'>
            Chaque monstre est unique et possède sa propre personnalité. Découvrez quelques-uns de nos compagnons les plus populaires !
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            {monsters.map((monster, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${monster.color} hover:scale-105 transition-transform flex flex-col items-center`}
              >
                <div className='w-48 h-48 mb-8 rounded-full bg-white/50 flex items-center justify-center'>
                  <div className='text-6xl'>{monster.name[0]}</div>
                </div>
                <h3 className='text-3xl font-bold text-tolopea-900 mb-4 text-center'>
                  {monster.name}
                </h3>
                <p className='text-tolopea-600 text-center text-xl mb-4'>
                  Type: {monster.type}
                </p>
                <p className='text-gray-600 text-center text-lg'>
                  {monster.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
