import type { Metadata } from 'next'
import Providers from './providers'
import './globals.css'
import { Space_Grotesk } from 'next/font/google'
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
// tambahkan variable ke <html> className

export const metadata: Metadata = {
  title: 'RentGo — Sewa Kendaraan Online',
  description: 'Platform sewa kendaraan terpercaya',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🚗</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}