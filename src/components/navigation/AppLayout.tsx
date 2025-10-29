import type { PropsWithChildren, ReactNode } from 'react'
import { getSession } from '@/lib/auth'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { getWallet } from '@/actions/wallet.actions'
import { WalletProvider } from '@/contexts/WalletContext'

export default async function AppLayout ({ children }: PropsWithChildren): Promise<ReactNode> {
  const session = await getSession()

  const wallet = session === null
    ? null
    : await getWallet(session.user.id)

  return (
    <WalletProvider initialWallet={wallet}>
      <div className='min-h-screen flex flex-col bg-white text-gray-900'>
        <Header session={session} />
        <main className='flex-1 flex flex-col'>
          {children}
        </main>
        <Footer />
      </div>
    </WalletProvider>
  )
}
