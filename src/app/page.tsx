
import MainHeader from '@/components/MainHeader'
import HeroSection from '@/components/HeroSection'
import BenefitsSection from '@/components/BenefitsSection'
import MonstersSection from '@/components/MonstersSection'
import ActionsSection from '@/components/ActionsSection'
import NewsletterSection from '@/components/NewsletterSection'
import MainFooter from '@/components/MainFooter'

export default function Home (): React.ReactNode {
  return (
    <div className='font-sans bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen flex flex-col'>
      <MainHeader />
      <HeroSection />
      <BenefitsSection />
      <MonstersSection />
      <ActionsSection />
      <NewsletterSection />
      <MainFooter />
    </div>
  )
}
