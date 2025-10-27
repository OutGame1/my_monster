import type { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { Jersey_10, Geist_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const geistSans = Jersey_10({
  variable: '--font-jersey10',
  subsets: ['latin'],
  weight: '400'
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
