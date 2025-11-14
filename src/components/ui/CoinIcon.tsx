import type { ReactNode } from 'react'

interface CoinIconProps {
  size?: number
  className?: string
}

/**
 * Coin icon component
 * Displays a custom SVG coin icon with golden colors and effects
 *
 * @param props - Optional className for styling
 * @returns SVG coin icon
 */
export default function CoinIcon ({ size, className }: CoinIconProps): ReactNode {
  return (
    <img
      src='/coin.svg'
      alt='Coin icon'
      width={size}
      height={size}
      className={className}
    />
  )
}
