import type { ReactNode } from 'react'
import Link from 'next/link'
import Card from '@components/ui/Card'

const floatingMonsters = [
  { className: 'bg-tolopea-100', top: '15%', left: '20%', delay: '0s' },
  { className: 'bg-blood-100', top: '65%', left: '75%', delay: '2s' },
  { className: 'bg-aqua-forest-100', top: '40%', left: '85%', delay: '4s' }
]

interface AuthPageLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export default function AuthPageLayout ({
  title,
  subtitle,
  children,
  footer
}: AuthPageLayoutProps): ReactNode {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-tolopea-50 to-white relative overflow-hidden p-4'>
      {floatingMonsters.map(({ className, top, left, delay }) => (
        <div
          key={`${className}-${top}-${left}`}
          className={`absolute w-24 h-24 ${className} rounded-full opacity-70 animate-float`}
          style={{
            top,
            left,
            animationDelay: delay,
            filter: 'blur(1px)'
          }}
        />
      ))}

      <Card className='w-full max-w-md z-10'>
        <div className='mb-6'>
          <Link
            href='/'
            className='text-sm text-tolopea-600 hover:text-tolopea-800 transition-colors'
          >
            {'<- Retour à l\'accueil'}
          </Link>
        </div>

        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-tolopea-900 mb-2'>{title}</h1>
          <p className='text-gray-600'>{subtitle}</p>
        </div>

        {children}

        {footer !== undefined && (
          <div className='mt-6 text-center text-sm text-tolopea-600'>
            {footer}
          </div>
        )}
      </Card>
    </div>
  )
}
