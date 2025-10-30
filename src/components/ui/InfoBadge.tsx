import type { ReactNode } from 'react'
import cn from 'classnames'

interface InfoBadgeProps {
  label: string
  value: string | number
  className?: string
}

export default function InfoBadge ({ label, value, className = '' }: InfoBadgeProps): ReactNode {
  return (
    <div className={cn('text-sm', className)}>
      <span className='font-semibold text-gray-700'>{label}:</span>
      <span className='ml-2 text-gray-600'>{value}</span>
    </div>
  )
}
