import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AppLayout from '@/components/navigation/AppLayout'
import ProfileContent from '@/components/profile/ProfileContent'
import { getWallet } from '@/actions/wallet.actions'

/**
 * Page de profil utilisateur affichant les informations du compte.
 *
 * @returns {Promise<ReactNode>} Contenu JSX rendu côté serveur pour le profil.
 */
export default async function ProfilePage (): Promise<ReactNode> {
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  const wallet = await getWallet(session.user.id)

  return (
    <AppLayout>
      <ProfileContent session={session} wallet={wallet} />
    </AppLayout>
  )
}
