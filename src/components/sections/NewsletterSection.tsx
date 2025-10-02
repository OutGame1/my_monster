'use client'

import { ReactNode, FormEvent, useState } from 'react'

export default function NewsletterSection (): ReactNode {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    // TODO: Implémenter l'inscription à la newsletter
    setStatus('success')
    setEmail('')
  }

  return (
    <section id='newsletter' className='w-full min-h-[80vh] py-20 bg-tolopea-400 text-white flex items-center'>
      <div className='container mx-auto px-4 w-full'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            Obtenez 10% de réduction
          </h2>
          <p className='text-tolopea-100 mb-12 text-xl'>
            Inscrivez-vous à notre newsletter et recevez un code promo de 10% sur votre premier achat in-app !
          </p>
          <form onSubmit={handleSubmit} className='max-w-2xl mx-auto'>
            <div className='flex flex-col sm:flex-row gap-4 items-stretch'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Votre adresse email'
                className='flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blood-500 text-lg'
                required
              />
              <button
                type='submit'
                className='bg-blood-500 text-white px-8 py-4 rounded-lg hover:bg-blood-600 transition-colors whitespace-nowrap text-lg font-semibold'
              >
                Je m&apos;inscris
              </button>
            </div>
          </form>
          {status === 'success' && (
            <p className='text-aqua-forest-300 mt-8 text-lg'>
              Merci de votre inscription ! Vous recevrez bientôt votre code promo.
            </p>
          )}
          {status === 'error' && (
            <p className='text-blood-300 mt-8 text-lg'>
              Une erreur est survenue. Veuillez réessayer.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
