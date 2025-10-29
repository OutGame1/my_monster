'use client'

import { type ReactNode, useState, useEffect } from 'react'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import MonsterDisplay from './MonsterDisplay'
import MonsterXPBar from './MonsterXPBar'
import MonsterStateInfo from './MonsterStateInfo'
import MonsterActions from './MonsterActions'
import { useWallet } from '@/contexts/WalletContext'

interface MonsterPageClientProps {
  initialMonster: ISerializedMonster
}

/**
 * Client-side wrapper for monster page
 * Handles coin animations and state updates
 * Polls API every 10 seconds to show live monster state
 */
export default function MonsterPageClient ({ initialMonster }: MonsterPageClientProps): ReactNode {
  const { addBalance } = useWallet()

  const [monster, setMonster] = useState<ISerializedMonster>(initialMonster)
  const [coinAnimation, setCoinAnimation] = useState<number | null>(null)

  // Function to fetch and update monster data
  const fetchAndUpdateMonster = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/monster?id=${monster._id}`)

      if (!response.ok) {
        console.error(`Failed to fetch monster: ${response.status} ${response.statusText}`)
        return
      }

      const updatedMonster = await response.json()
      setMonster(updatedMonster)
    } catch (error) {
      console.error('Error fetching monster updates:', error)
      // Continue polling despite errors - temporary network issues shouldn't stop updates
    }
  }

  // Poll API for monster updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchAndUpdateMonster()
    }, 10000) // 10 seconds

    return () => { clearInterval(interval) }
  }, [monster._id])

  const handleCoinsEarned = (coins: number): void => {
    setCoinAnimation(coins)
    addBalance(coins)
  }

  const handleActionComplete = (): void => {
    // Immediately fetch updated monster data after action
    void fetchAndUpdateMonster()
  }

  useEffect(() => {
    if (coinAnimation !== null) {
      const timer = setTimeout(() => {
        setCoinAnimation(null)
      }, 2000)
      return () => { clearTimeout(timer) }
    }
  }, [coinAnimation])

  return (
    <>
      {/* Floating coin notification */}
      {coinAnimation !== null && (
        <div className='fixed top-24 right-8 z-50 animate-bounce'>
          <div className='rounded-full bg-gradient-to-br from-golden-fizz-400 to-golden-fizz-600 px-6 py-3 shadow-2xl ring-4 ring-golden-fizz-300/50'>
            <span className='text-2xl font-black text-golden-fizz-900'>
              +{coinAnimation} 💰
            </span>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Left Column - Monster Display */}
        <MonsterDisplay monster={monster} />

        {/* Right Column - Info & Actions */}
        <div className='space-y-6'>
          {/* State Info */}
          <MonsterStateInfo name={monster.name} state={monster.state} />

          {/* XP Bar */}
          <MonsterXPBar currentXP={monster.xp} maxXP={monster.maxXp} />

          {/* Action Buttons */}
          <MonsterActions
            monsterId={monster._id}
            monsterName={monster.name}
            onCoinsEarned={handleCoinsEarned}
            onActionComplete={handleActionComplete}
          />
        </div>
      </div>
    </>
  )
}
