import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AppLayout from '@/components/navigation/AppLayout'
import ProfileContent from '@/components/profile/ProfileContent'

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

  return (
    <AppLayout>
      <ProfileContent session={session} />
    </AppLayout>
  )
}
