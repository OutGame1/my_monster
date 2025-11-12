import type { ReactNode } from 'react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import ProtectedAppLayout from '@/components/navigation/ProtectedAppLayout'

/**
 * Page dashboard authentifiée affichant la gestion des monstres de l'utilisateur.
 * Les données sont chargées côté client pour permettre une meilleure expérience utilisateur avec skeleton loading.
 */
export default function DashboardPage (): ReactNode {
  return (
    <ProtectedAppLayout>
      <DashboardContent />
    </ProtectedAppLayout>
  )
}
