import type { ReactNode } from 'react'
import Link from 'next/link'
import Button from '@components/ui/Button'

export default function HeroSection (): ReactNode {
  return (
    <section className='bg-tolopea-900 text-white'>
      <div className='max-w-5xl mx-auto px-4 py-20 sm:py-24'>
        <h1 className='mt-4 text-3xl sm:text-4xl font-bold'>
          Adoptez un compagnon virtuel unique
        </h1>
        <p className='mt-4 text-base sm:text-lg text-white/80 max-w-2xl'>
          Créez un monstre, veillez sur son humeur et accompagnez-le pas à pas. Une expérience Tamagotchi moderne qui récompense la régularité et la créativité.
        </p>
        <div className='mt-8 flex flex-col sm:flex-row gap-4 sm:items-center'>
          <Link href='/sign-up'>
            <Button>Commencer gratuitement</Button>
          </Link>
          <Link href='/sign-in' className='sm:w-auto text-white/80 hover:text-white underline decoration-white/40'>
            J'ai déjà un compte
          </Link>
        </div>
      </div>
    </section>
  )
}
