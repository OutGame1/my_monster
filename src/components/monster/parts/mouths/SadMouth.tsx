import type { ReactNode } from 'react'

interface SadMouthProps {
  outlineColor: string
  strokeWidth: number
}

export default function SadMouth ({ outlineColor, strokeWidth }: SadMouthProps): ReactNode {
  return (
    <path
      d='M 85 66 Q 100 60 115 66'
      fill='none'
      stroke={outlineColor}
      strokeWidth={strokeWidth}
      strokeLinecap='round'
    />
  )
}
