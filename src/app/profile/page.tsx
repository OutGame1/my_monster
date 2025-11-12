import type { ReactNode } from 'react'
import ProfileContent from '@/components/profile/ProfileContent'
import ProtectedAppLayout from '@/components/navigation/ProtectedAppLayout'

/**
 * Page de profil utilisateur affichant les informations du compte.
 */
export default function ProfilePage (): ReactNode {
  return (
    <ProtectedAppLayout>
      <ProfileContent />
    </ProtectedAppLayout>
  )
}
