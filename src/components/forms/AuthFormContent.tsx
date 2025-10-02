'use client'

import { ReactNode, useState } from 'react'
import { toast } from 'react-toastify'
import Card from '@/components/ui/Card'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'

const monsters = [
  { color: 'bg-tolopea-100', delay: '0s', top: '15%', left: '20%' },
  { color: 'bg-blood-100', delay: '2s', top: '65%', left: '75%' },
  { color: 'bg-aqua-forest-100', delay: '4s', top: '40%', left: '85%' }
]

export default function AuthFormContent (): ReactNode {
  const [isSignIn, setIsSignIn] = useState(true)

  const toggleForm = (): void => {
    setIsSignIn(!isSignIn)
    toast.info(isSignIn ? 'Passons à l\'inscription !' : 'De retour à la connexion !', {
      icon: () => '🐾'
    })
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-tolopea-50 to-white relative overflow-hidden p-4'>
      {/* Monstres flottants */}
      {monsters.map((monster, index) => (
        <div
          key={index}
          className={`absolute w-24 h-24 ${monster.color} rounded-full opacity-70 animate-float`}
          style={{
            top: monster.top,
            left: monster.left,
            animationDelay: monster.delay,
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Contenu principal */}
      <Card className='w-full max-w-md z-10'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-tolopea-900 mb-2'>
            {isSignIn ? 'Bienvenue !' : 'Rejoignez l\'aventure !'}
          </h1>
          <p className='text-gray-600'>
            {isSignIn
              ? 'Retrouvez votre petit monstre'
              : 'Adoptez votre premier monstre'}
          </p>
        </div>

        {isSignIn ? <SignInForm /> : <SignUpForm />}

        <div className='mt-6 text-center'>
          <button
            onClick={toggleForm}
            className='text-tolopea-600 hover:text-tolopea-800 transition-colors text-sm'
          >
            {isSignIn
              ? 'Pas encore de compte ? Créez-en un !'
              : 'Déjà un compte ? Connectez-vous !'}
          </button>
        </div>
      </Card>
    </div>
  )
}
