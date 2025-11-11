import type { PropsWithChildren, ReactNode } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { getWallet } from '@/actions/wallet.actions'
import { WalletProvider } from '@/contexts/WalletContext'

interface AppLayoutProps extends PropsWithChildren {
  protectedRoute?: boolean
}

export default async function AppLayout ({ children, protectedRoute = false }: AppLayoutProps): Promise<ReactNode> {
  const session = await getSession()

  if (protectedRoute && session === null) {
    redirect('/sign-in')
  }

  const wallet = session === null
    ? null
    : await getWallet(session.user.id)

  return (
    <WalletProvider initialWallet={wallet}>
      <div className='min-h-screen flex flex-col text-gray-900'>
        <Header session={session} />
        <main className='flex-1 flex flex-col bg-gradient-to-br from-tolopea-200 via-aqua-forest-200 to-blood-200'>
          {children}
        </main>
        <Footer />
      </div>
    </WalletProvider>
  )
}
