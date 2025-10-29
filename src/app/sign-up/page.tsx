import type { ReactNode } from 'react'
import Link from 'next/link'
import AuthPageLayout from '@/components/forms/AuthPageLayout'
import SignUpForm from '@/components/forms/SignUpForm'

/**
 * Page d'inscription permettant de créer un nouveau compte My Monster.
 *
 * @returns {ReactNode} Interface de création de compte avec redirection vers la connexion.
 */
export default function SignUpPage (): ReactNode {
  return (
    <AuthPageLayout
      title="Rejoignez l'aventure !"
      subtitle='Adoptez votre premier monstre'
      footer={(
        <Link href='/sign-in' className='hover:text-tolopea-800 transition-colors'>
          Déjà un compte ? Connectez-vous !
        </Link>
      )}
    >
      <SignUpForm />
    </AuthPageLayout>
  )
}
