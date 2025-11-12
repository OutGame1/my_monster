import type { PropsWithChildren, ReactNode } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { WalletProvider } from '@/contexts/WalletContext'
import { ISerializedWallet } from '@/lib/serializers/wallet.serializer'
import { Session } from '@/lib/auth-client'

interface AppLayoutProps extends PropsWithChildren {
  session?: Session | null
  wallet?: ISerializedWallet | null
}

export default function AppLayout ({
  children,
  wallet = null,
  session = null
}: AppLayoutProps): ReactNode {
  return (
    <WalletProvider wallet={wallet}>
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
