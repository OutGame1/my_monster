'use client'

import { createContext, type PropsWithChildren, useContext, useState, type ReactNode } from 'react'
import type { ISerializedWallet } from '@/lib/serializers/wallet.serializer'

interface WalletContextType {
  balance: number
  totalEarned: number
  addBalance: (amount: number) => void
  removeBalance: (amount: number) => void
}

const WalletContext = createContext<WalletContextType | null>(null)

interface WalletProviderProps extends PropsWithChildren {
  wallet: ISerializedWallet | null
}

/**
 * Global wallet state provider
 * Manages coin balance across the entire application
 */
export function WalletProvider ({ children, wallet }: WalletProviderProps): ReactNode {
  const [balance, setBalance] = useState<number>(wallet?.balance ?? 0)
  const totalEarned = wallet?.totalEarned ?? 0

  const addBalance = (amount: number): void => {
    setBalance(prev => prev + amount)
  }

  const removeBalance = (amount: number): void => {
    setBalance(prev => prev - amount)
  }

  return (
    <WalletContext.Provider value={{ balance, totalEarned, addBalance, removeBalance }}>
      {children}
    </WalletContext.Provider>
  )
}

/**
 * Hook to access wallet state
 * @throws {Error} If used outside WalletProvider
 */
export function useWallet (): WalletContextType {
  const context = useContext(WalletContext)
  if (context === null) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}
