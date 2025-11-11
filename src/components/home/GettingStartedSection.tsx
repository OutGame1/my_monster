import type { ReactNode } from 'react'
import Card from '@components/ui/Card'
import Link from 'next/link'
import { Plus, Heart, Zap, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Plus,
    title: 'Créez votre monstre',
    description: 'Choisissez un nom adorable et laissez la magie opérer. Notre générateur lui donnera une apparence unique avec des traits distinctifs !',
    color: 'from-tolopea-400 to-tolopea-600',
    bgGradient: 'from-tolopea-500/10 to-seance-500/10'
  },
  {
    icon: Heart,
    title: 'Prenez-en soin',
    description: 'Nourrissez-le, jouez avec lui et répondez à ses besoins émotionnels. Chaque action renforce votre lien et fait évoluer votre compagnon.',
    color: 'from-blood-400 to-blood-600',
    bgGradient: 'from-blood-500/10 to-seance-500/10'
  },
  {
    icon: Zap,
    title: 'Faites-le évoluer',
    description: 'Gagnez de l\'XP et des pièces à chaque interaction ! Montez de niveau, accomplissez des quêtes et débloquez de nouvelles fonctionnalités.',
    color: 'from-aqua-forest-400 to-aqua-forest-600',
    bgGradient: 'from-aqua-forest-500/10 to-golden-fizz-500/10'
  }
]

export default function GettingStartedSection (): ReactNode {
  return (
    <section className='relative bg-gradient-to-br from-tolopea-50 via-white to-aqua-forest-50 py-20 sm:py-28'>
      {/* Decorative circles */}
      <div className='absolute top-20 left-10 w-32 h-32 rounded-full bg-seance-200/20 blur-2xl' />
      <div className='absolute bottom-20 right-10 w-40 h-40 rounded-full bg-golden-fizz-200/20 blur-2xl' />

      <div className='relative max-w-6xl mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-tolopea-900 mb-4'>
            Comment ça marche ?
          </h2>

          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Démarrez votre aventure en quelques minutes et découvrez
            le compagnon virtuel de vos rêves !
          </p>
        </div>

        {/* Steps Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {steps.map(({ icon: Icon, title, description, color, bgGradient }, index) => (
            <div key={index} className='relative'>
              {/* Connector Arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className='hidden md:block absolute top-24 -right-4 z-10'>
                  <ArrowRight className='h-8 w-8 text-tolopea-300' />
                </div>
              )}

              <Card className={`h-full bg-gradient-to-br ${bgGradient} border-2 border-tolopea-100 hover:border-tolopea-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group`}>
                {/* Step Badge */}
                <div className='flex items-center gap-4 mb-4'>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className='h-6 w-6' />
                  </div>
                </div>

                <h3 className='text-xl font-bold text-tolopea-900 mb-3'>
                  {title}
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  {description}
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className='text-center'>
          <Link
            href='/sign-up'
            className='inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-tolopea-500 via-seance-500 to-blood-500 text-white font-bold text-xl shadow-2xl hover:shadow-tolopea-500/50 transition-all duration-300 hover:scale-105 group'
          >
            <span>Créer mon monstre maintenant</span>
            <ArrowRight className='h-6 w-6 group-hover:translate-x-2 transition-transform duration-300' />
          </Link>
          <p className='mt-4 text-sm text-gray-600'>
            100% gratuit • Aucune carte bancaire requise • Démarrez en 2 minutes
          </p>
        </div>
      </div>
    </section>
  )
}
