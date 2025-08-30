import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AOL Instant Messenger - ChatGPT Edition',
  description: 'Chat with ChatGPT using the classic AOL Instant Messenger interface',
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
