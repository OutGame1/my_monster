'use client'

import { useState, useEffect, type ReactNode } from 'react'
import ProfileContent from './ProfileContent'
import ProfileContentSkeleton from './skeletons/ProfileContentSkeleton'
import type { Session } from '@/lib/auth-client'
import type { ISerializedWallet } from '@/lib/serializers/wallet.serializer'
import { getWallet } from '@/actions/wallet.actions'

interface ProfileContentWrapperProps {
  session: Session
}

/**
 * Client-side wrapper for ProfileContent that handles data fetching
 * Shows skeleton while loading wallet data
 */
export default function ProfileContentWrapper ({ session }: ProfileContentWrapperProps): ReactNode {
  const [wallet, setWallet] = useState<ISerializedWallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async (): Promise<void> => {
      try {
        const walletData = await getWallet(session.user.id)
        setWallet(walletData)
      } catch (error) {
        console.error('Error fetching wallet:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchWallet()
  }, [session.user.id])

  if (isLoading || wallet === null) {
    return <ProfileContentSkeleton />
  }

  return <ProfileContent session={session} wallet={wallet} />
}
