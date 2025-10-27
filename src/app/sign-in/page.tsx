import type { ReactNode } from 'react'
import Link from 'next/link'
import AuthPageLayout from '@/components/forms/AuthPageLayout'
import SignInForm from '@/components/forms/SignInForm'

export default function SignInPage (): ReactNode {
  return (
    <AuthPageLayout
      title='Bienvenue !'
      subtitle='Retrouvez votre petit monstre'
      footer={(
        <Link href='/sign-up' className='hover:text-tolopea-800 transition-colors'>
          Pas encore de compte ? Créez-en un !
        </Link>
      )}
    >
      <SignInForm />
    </AuthPageLayout>
  )
}
