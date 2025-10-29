import type { PropsWithChildren, ReactNode } from 'react'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import { Jersey_10, Geist_Mono } from 'next/font/google'
import './globals.css'

/**
 * Police Jersey 10 utilisée comme fonte principale pour l'identité visuelle.
 */
const geistSans = Jersey_10({
  variable: '--font-jersey10',
  subsets: ['latin'],
  weight: '400'
})

/**
 * Police monospace Geist Mono pour les éléments nécessitant une fonte technique.
 */
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

/**
 * Métadonnées globales de l'application injectées par Next.js.
 */
export const metadata: Metadata = {
  applicationName: 'MyMonster',
  appleWebApp: {
    capable: true,
    title: 'MyMonster',
    statusBarStyle: 'default'
  }
}

/**
 * Layout racine de l'application Next.js, applique les fontes globales et le conteneur de toasts.
 *
 * @param {PropsWithChildren} props Propriétés contenant les enfants à rendre.
 * @returns {ReactNode} Structure HTML globale avec body configuré.
 */
export default function RootLayout ({
  children
}: PropsWithChildren): ReactNode {
  return (
    <html lang='fr'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        {children}
        <ToastContainer position='top-center' />
      </body>
    </html>
  )
}
