import type { ReactNode } from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function ComingSoon (): ReactNode {
  return (
    <div className='min-h-screen flex gap-2 items-center justify-center bg-tolopea-50'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-tolopea-900 mb-4'>Bientôt disponible</h1>
        <p className='text-gray-600'>Cette page est en cours de construction.</p>
        <Button>
          <Link href='/'>
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  )
}
