import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Look1nce - Virtual Try-On',
  description: 'AI-powered virtual clothing try-on app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
