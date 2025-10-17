import { ReactNode } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/content/DashboardContent'

export default async function DashboardPage (): Promise<ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null) {
    redirect('/sign-in')
  }

  return (
    <DashboardContent user={session.user} />
  )
}
