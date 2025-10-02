import { ReactNode } from 'react'
import Header from '@components/ui/Header'
import Footer from '@components/ui/Footer'
import HeroSection from '@/components/sections/HeroSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import MonstersSection from '@/components/sections/MonstersSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import NewsletterSection from '@/components/sections/NewsletterSection'

export default function Home (): ReactNode {
  return (
    <div className='h-screen flex flex-col w-full'>
      <Header />
      <main className='flex-grow flex flex-col w-full'>
        <HeroSection />
        <BenefitsSection />
        <MonstersSection />
        <FeaturesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
