'use client'

import { useState, ReactNode, FormEvent } from 'react'
import { toast } from 'react-toastify'
import InputField from '@components/ui/InputField'
import Button from '@components/ui/Button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

export default function SignInForm (): ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    setIsLoading(true)

    void authClient.signIn.email({
      ...credentials,
      callbackURL: '/sign-in'
    }, {
      onRequest: () => {
        toast.loading('Connexion en cours... 🐾', {
          toastId: 'signin'
        })
      },
      onSuccess: () => {
        toast.update('signin', {
          render: 'Connexion réussie ! 🎉',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      onError: (ctx) => {
        toast.update('signin', {
          render: `Erreur: ${ctx.error.message} 😿`,
          type: 'error',
          isLoading: false,
          autoClose: 5000
        })
        setIsLoading(false)
      }
    })
  }

  return (
    <form
      className='flex flex-col gap-6'
      onSubmit={handleSubmit}
    >
      <InputField
        type='email'
        name='email'
        label='Email'
        value={credentials.email}
        onChangeText={email => setCredentials({ ...credentials, email })}
        required
        placeholder='votre@email.com'
      />

      <InputField
        type='password'
        name='password'
        label='Mot de passe'
        value={credentials.password}
        onChangeText={password => setCredentials({ ...credentials, password })}
        required
        placeholder='••••••••'
      />

      <Button
        type='submit'
        variant='primary'
        className={isLoading ? 'opacity-75 cursor-not-allowed' : ''}
      >
        Se connecter
      </Button>
    </form>
  )
}
