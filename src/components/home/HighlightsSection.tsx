import type { ReactNode } from 'react'
import Card from '@components/ui/Card'

const highlights = [
  {
    title: 'Une identité soignée',
    description: 'Chaque monstre possède un nom, des traits visuels et une personnalité enregistrés dans notre base de données.'
  },
  {
    title: 'Progression claire',
    description: 'Faites monter le niveau de votre compagnon. Ses états comme happy ou hungry reflètent vos soins quotidiens.'
  },
  {
    title: 'Lien avec le dresseur',
    description: 'Reliez la créature à votre profil et partagez votre aventure avec vos amis en quelques clics.'
  }
]

export default function HighlightsSection (): ReactNode {
  return (
    <section className='bg-white'>
      <div className='max-w-5xl mx-auto px-4 py-16 sm:py-20'>
        <h2 className='text-2xl sm:text-3xl font-semibold text-tolopea-900'>Pourquoi adopter un monstre ?</h2>
        <p className='mt-3 text-base text-gray-600 max-w-2xl'>
          Notre modèle de données assure un suivi simple : nom, niveau, traits et état émotionnel. Vous gardez une vision claire de votre progression.
        </p>
        <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {highlights.map(({ title, description }) => (
            <Card key={title} className='h-full'>
              <h3 className='text-lg font-semibold text-tolopea-800'>{title}</h3>
              <p className='mt-3 text-sm text-gray-600'>{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
