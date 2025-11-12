'use client'

import { createContext, useContext, type PropsWithChildren, type ReactNode } from 'react'
import type { Session } from '@/lib/auth-client'

const SessionContext = createContext<Session | null>(null)

interface SessionProviderProps extends PropsWithChildren {
  session: Session
}

export default function SessionProvider ({ children, session }: SessionProviderProps): ReactNode {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession (): Session {
  const context = useContext(SessionContext)
  if (context === null) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}
