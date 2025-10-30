'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import Link from 'next/link'
import CoinIcon from './CoinIcon'

/**
 * Credit badge component
 * Displays user's coin balance with animated counter
 * Uses global wallet context for state management
 * Clickable to navigate to coin purchase page
 */
export default function CreditBadge (): ReactNode {
  const { balance } = useWallet()
  const [displayCredit, setDisplayCredit] = useState(balance)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animate when balance changes
  useEffect(() => {
    if (balance === displayCredit) {
      return
    }

    setIsAnimating(true)

    // Animate the counter going up or down
    const startValue = displayCredit
    const endValue = balance
    const duration = 1000 // 1 second
    const steps = 30
    const increment = (endValue - startValue) / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayCredit(endValue)
        clearInterval(interval)
        setTimeout(() => { setIsAnimating(false) }, 500)
      } else {
        setDisplayCredit(Math.floor(startValue + (increment * currentStep)))
      }
    }, duration / steps)

    return () => { clearInterval(interval) }
  }, [balance, displayCredit])

  return (
    <Link
      href='/buy-coins'
      className={`group flex items-center gap-2 rounded-full bg-gradient-to-br from-golden-fizz-300 via-golden-fizz-400 to-golden-fizz-500 px-4 py-2 shadow-lg shadow-golden-fizz-500/30 ring-2 ring-golden-fizz-600/40 transition-all duration-300 hover:scale-110 hover:shadow-xl ${
        isAnimating ? 'scale-110 ring-4' : 'scale-100'
      }`}
    >
      <CoinIcon size={20} className={`transition-transform group-hover:rotate-12 ${isAnimating ? 'animate-spin' : ''}`} />
      <span className='text-lg font-bold text-golden-fizz-900 transition-all group-hover:scale-105'>
        {displayCredit}
      </span>
    </Link>
  )
}
