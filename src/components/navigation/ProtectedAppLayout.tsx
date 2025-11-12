import type { ReactNode, PropsWithChildren } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getWallet } from '@/actions/wallet.actions'
import AppLayout from './AppLayout'
import SessionProvider from '@/contexts/SessionContext'

export default async function ProtectedAppLayout ({ children }: PropsWithChildren): Promise<ReactNode> {
  const session = await getSession()

  if (session === null) {
    redirect('/login')
  }

  const wallet = await getWallet(session.user.id)

  return (
    <SessionProvider session={session}>
      <AppLayout session={session} wallet={wallet}>
        {children}
      </AppLayout>
    </SessionProvider>
  )
}
