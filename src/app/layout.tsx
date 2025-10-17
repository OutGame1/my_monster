import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  applicationName: 'MyMonster',
  appleWebApp: {
    capable: true,
    title: 'MyMonster',
    statusBarStyle: 'default'
  }
}

export default function RootLayout ({
  children
}: Readonly<{
  children: ReactNode
}>): ReactNode {
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
