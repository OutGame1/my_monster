import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import GalleryContentWrapper from '@/components/gallery/GalleryContentWrapper'
import AppLayout from '@/components/navigation/AppLayout'

/**
 * Gallery page
 * Displays all public monsters from all users in an art gallery style
 * Uses infinite scroll and filters for better performance and UX
 */
export default async function GalleryPage (): Promise<ReactNode> {
  const session = await getSession()

  if (session === null) {
    redirect('/sign-in')
  }

  return (
    <AppLayout>
      <GalleryContentWrapper />
    </AppLayout>
  )
}
