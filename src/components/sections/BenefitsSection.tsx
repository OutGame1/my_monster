import { ReactNode } from 'react'

export default function BenefitsSection (): ReactNode {
  const benefits = [
    {
      title: 'Compagnon Unique',
      description: 'Chaque monstre développe sa propre personnalité basée sur vos interactions',
      icon: '🎨'
    },
    {
      title: 'Évolution Continue',
      description: 'Regardez votre monstre grandir et évoluer au fil du temps',
      icon: '🌱'
    },
    {
      title: 'Interaction Sociale',
      description: "Rencontrez d'autres dresseurs et leurs monstres",
      icon: '🤝'
    },
    {
      title: 'Apprentissage Ludique',
      description: 'Développez le sens des responsabilités tout en vous amusant',
      icon: '📚'
    }
  ]

  return (
    <section id='benefits' className='w-full min-h-screen py-20 bg-white flex items-center'>
      <div className='container mx-auto px-4 w-full'>
        <h2 className='text-4xl md:text-5xl font-bold text-center text-tolopea-900 mb-16'>
          Pourquoi adopter un monstre ?
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto'>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className='p-8 rounded-xl bg-tolopea-50 hover:bg-tolopea-100 transition-colors flex flex-col items-center text-center'
            >
              <div className='text-5xl mb-6'>{benefit.icon}</div>
              <h3 className='text-2xl font-semibold text-tolopea-900 mb-4'>
                {benefit.title}
              </h3>
              <p className='text-gray-600 text-lg'>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
