import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import AppLayout from '@/components/navigation/AppLayout'
import GettingStartedSection from '@/components/home/GettingStartedSection'
import HeroSection from '@/components/home/HeroSection'
import HighlightsSection from '@/components/home/HighlightsSection'

/**
 * Configuration du viewport mobile/desktop pour une mise à l'échelle responsive optimale.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
}

/**
 * Métadonnées SEO détaillées de la page d'accueil My Monster.
 */
export const metadata: Metadata = {
  title: 'My Monster - Adoptez et élevez votre compagnon virtuel',
  description: 'Créez, nourrissez et faites évoluer votre propre monstre unique ! Découvrez une expérience de jeu immersive où chaque créature est générée de manière procédurale avec des traits visuels uniques.',
  keywords: [
    'monstre virtuel',
    'compagnon virtuel',
    'jeu en ligne',
    'créature virtuelle',
    'tamagotchi',
    'élever un monstre',
    'jeu de monstres',
    'génération procédurale',
    'adoption virtuelle',
    'monstre unique',
    'jeu gratuit',
    'évolution monstre'
  ],
  authors: [{ name: 'My Monster Team' }],
  creator: 'My Monster',
  publisher: 'My Monster',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: 'https://mymonster.app',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'My Monster - Adoptez et élevez votre compagnon virtuel',
    description: 'Créez, nourrissez et faites évoluer votre propre monstre unique ! Découvrez une expérience de jeu immersive où chaque créature est générée de manière procédurale avec des traits visuels uniques.',
    siteName: 'My Monster',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'My Monster - Adoptez votre compagnon virtuel'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Monster - Adoptez et élevez votre compagnon virtuel',
    description: 'Créez, nourrissez et faites évoluer votre propre monstre unique ! Découvrez une expérience de jeu immersive où chaque créature est générée de manière procédurale.',
    images: ['/logo.png'],
    creator: '@mymonster',
    site: '@mymonster'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon1.png', type: 'image/png', sizes: '32x32' }
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  verification: {
    // google: 'votre-code-google',
    // yandex: 'votre-code-yandex',
    // bing: 'votre-code-bing'
  },
  category: 'games',
  classification: 'Games & Entertainment',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default'
  }
}

/**
 * Page d'accueil publique affichant les sections marketing principales.
 *
 * @returns {ReactNode} Structure de mise en page avec sections héro, points forts et démarrage.
 */
export default function Home (): ReactNode {
  return (
    <AppLayout>
      <HeroSection />
      <HighlightsSection />
      <GettingStartedSection />
    </AppLayout>
  )
}
