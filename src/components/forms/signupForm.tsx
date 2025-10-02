'use client'

import { useState } from 'react'
import InputField from '../input'
import Button from '../button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignUpForm (): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({ email: 'test@test.fr', password: '12345678' })

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    // Handle sign-up logic here, e.g., call your sign-up API
    console.log('Signing up with:', credentials)

    const { data, error } = await authClient.signUp.email({
      email: credentials.email, // user email address
      password: credentials.password, // user password -> min 8 characters by default
      name: '', // user display name
      callbackURL: '/sign-in' // A URL to redirect to after the user verifies their email (optional)
    }, {
      onRequest: (ctx) => {
        // show loading
        console.log('Requesting sign up...', ctx)
      },
      onSuccess: (ctx) => {
        // redirect to the dashboard or sign in page
        console.log('user sign in...', ctx)
      },
      onError: (ctx) => {
        // display the error message
        console.log('sign up error...', ctx)
        alert(ctx.error.message)
      }
    })
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <InputField
          label='Email:'
          type='email'
          name='email'
          value={credentials.email}
          onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        />
        <InputField
          label='Password:'
          type='password'
          name='password'
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        />
        <Button type='submit'>Sign Up</Button>
      </form>
    </div>
  )
}

export default SignUpForm
