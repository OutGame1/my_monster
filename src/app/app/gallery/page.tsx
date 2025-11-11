import type { ReactNode } from 'react'
import GalleryContent from '@/components/gallery/GalleryContent'
import AppLayout from '@/components/navigation/AppLayout'

/**
 * Gallery page
 * Displays all public monsters from all users in an art gallery style
 * Uses infinite scroll and filters for better performance and UX
 */
export default function GalleryPage (): ReactNode {
  return (
    <AppLayout protectedRoute>
      <GalleryContent />
    </AppLayout>
  )
}
