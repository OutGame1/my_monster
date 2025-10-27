import type { ReactNode } from 'react'
import Link from 'next/link'
import AuthPageLayout from '@/components/forms/AuthPageLayout'
import SignUpForm from '@/components/forms/SignUpForm'

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
