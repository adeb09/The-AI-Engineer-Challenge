import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Matrix Terminal - ChatGPT Interface',
  description: 'Chat with ChatGPT using a Matrix-style terminal interface',
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
