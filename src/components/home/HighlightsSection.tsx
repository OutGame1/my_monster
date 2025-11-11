import type { ReactNode } from 'react'
import Card from '@components/ui/Card'
import { Palette, TrendingUp, Users } from 'lucide-react'

const highlights = [
  {
    icon: Palette,
    color: 'from-tolopea-400 to-seance-400',
    bgColor: 'bg-gradient-to-br from-tolopea-50 to-seance-50',
    title: 'Créatures uniques',
    description: 'Chaque monstre possède des traits visuels générés aléatoirement. Aucune créature ne se ressemble !'
  },
  {
    icon: TrendingUp,
    color: 'from-aqua-forest-400 to-golden-fizz-500',
    bgColor: 'bg-gradient-to-br from-aqua-forest-50 to-golden-fizz-50',
    title: 'Évolution & Récompenses',
    description: 'Gagnez de l\'XP et des pièces à chaque interaction. Montez en niveau et débloquez de nouvelles capacités !'
  },
  {
    icon: Users,
    color: 'from-blood-400 to-seance-400',
    bgColor: 'bg-gradient-to-br from-blood-50 to-seance-50',
    title: 'Communauté active',
    description: 'Partagez vos créations dans la galerie et découvrez les monstres des autres dresseurs !'
  }
]

export default function HighlightsSection (): ReactNode {
  return (
    <section className='relative bg-gradient-to-b from-white via-tolopea-50/30 to-white py-20 sm:py-28'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-tolopea-900 mb-4'>
            Une expérience unique
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Découvrez un jeu de compagnon virtuel moderne avec des mécaniques
            enrichies et une progression claire
          </p>
        </div>

        {/* Highlights Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {highlights.map(({ icon: Icon, color, bgColor, title, description }) => (
            <div
              key={title}
              className='group relative'
            >
              <Card className={`h-full ${bgColor} border-2 border-transparent hover:border-tolopea-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}>
                {/* Icon Circle */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className='h-8 w-8' />
                </div>

                <h3 className='text-xl font-bold text-tolopea-900 mb-3 group-hover:text-tolopea-700 transition-colors'>
                  {title}
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  {description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
