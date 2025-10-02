import { ReactNode } from 'react'

export default function FeaturesSection (): ReactNode {
  const features = [
    {
      title: 'Nourrir',
      description: 'Donnez différents types de nourriture à votre monstre pour développer ses capacités',
      icon: '🍎'
    },
    {
      title: 'Jouer',
      description: 'Participez à des mini-jeux amusants avec votre monstre',
      icon: '🎮'
    },
    {
      title: 'Entraîner',
      description: 'Apprenez de nouvelles compétences à votre monstre',
      icon: '💪'
    },
    {
      title: 'Soigner',
      description: 'Prenez soin de votre monstre quand il ne se sent pas bien',
      icon: '💊'
    },
    {
      title: 'Décorer',
      description: "Personnalisez l'habitat de votre monstre",
      icon: '🎨'
    },
    {
      title: 'Socialiser',
      description: "Rencontrez d'autres monstres et faites des amis",
      icon: '👥'
    }
  ]

  return (
    <section id='features' className='w-full min-h-screen py-20 bg-white flex items-center'>
      <div className='container mx-auto px-4 w-full'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center text-tolopea-900 mb-6'>
            Que pouvez-vous faire ?
          </h2>
          <p className='text-center text-gray-600 mb-16 text-xl max-w-3xl mx-auto'>
            Découvrez toutes les activités possibles avec votre compagnon virtuel
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='p-8 rounded-xl border-2 border-tolopea-100 hover:border-tolopea-300 transition-colors flex flex-col h-full'
              >
                <div className='flex items-center gap-4 mb-6'>
                  <span className='text-5xl'>{feature.icon}</span>
                  <h3 className='text-2xl font-semibold text-tolopea-900'>
                    {feature.title}
                  </h3>
                </div>
                <p className='text-gray-600 text-lg'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
