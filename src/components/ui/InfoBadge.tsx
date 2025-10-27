import type { ReactNode } from 'react'

interface InfoBadgeProps {
  label: string
  value: string | number
  className?: string
}

export default function InfoBadge ({ label, value, className = '' }: InfoBadgeProps): ReactNode {
  return (
    <div className={`text-sm ${className}`}>
      <span className='font-semibold text-gray-700'>{label}:</span>
      <span className='ml-2 text-gray-600'>{value}</span>
    </div>
  )
}
