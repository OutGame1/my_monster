import type { PropsWithChildren, ReactNode } from 'react'
import { getSession } from '@/lib/auth'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export default async function AppLayout ({ children }: PropsWithChildren): Promise<ReactNode> {
  const session = await getSession()

  return (
    <div className='min-h-screen flex flex-col bg-white text-gray-900'>
      <Header session={session} />
      <main className='flex-1 flex flex-col'>
        {children}
      </main>
      <Footer />
    </div>
  )
}
