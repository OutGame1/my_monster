import type { ReactNode } from 'react'
import Link from 'next/link'
import AuthPageLayout from '@/components/forms/AuthPageLayout'
import SignInForm from '@/components/forms/SignInForm'

/**
 * Page d'authentification pour la connexion des joueurs existants.
 *
 * @returns {ReactNode} Interface de connexion encapsulée dans le layout d'authentification.
 */
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
