import type { ReactNode } from 'react'
import GalleryContent from '@/components/gallery/GalleryContent'
import ProtectedAppLayout from '@/components/navigation/ProtectedAppLayout'

/**
 * Gallery page
 * Displays all public monsters from all users in an art gallery style
 * Uses infinite scroll and filters for better performance and UX
 */
export default function GalleryPage (): ReactNode {
  return (
    <ProtectedAppLayout>
      <GalleryContent />
    </ProtectedAppLayout>
  )
}
