import type { ReactNode } from 'react'
import Card from '@components/ui/Card'

const steps = [
  {
    title: '1. Créez votre monstre',
    description: 'Choisissez un nom et laissez notre générateur lui attribuer des traits distinctifs.'
  },
  {
    title: '2. Surveillez son état',
    description: 'Consultez son humeur et ses besoins. Nourrissez-le et occupez-vous de lui chaque jour.'
  },
  {
    title: '3. Faites-le évoluer',
    description: 'Accomplissez des actions pour gagner de l’expérience, débloquer des niveaux et de nouvelles interactions.'
  }
]

export default function GettingStartedSection (): ReactNode {
  return (
    <section className='bg-tolopea-50'>
      <div className='max-w-5xl mx-auto px-4 py-16 sm:py-20'>
        <h2 className='text-2xl sm:text-3xl font-semibold text-tolopea-900'>Comment ça marche ?</h2>
        <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {steps.map(({ title, description }) => (
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
