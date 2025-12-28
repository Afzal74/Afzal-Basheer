import './globals.css'
import { AudioProvider } from '@/components/AudioProvider'
import GeminiChat from '@/components/GeminiChat'

export const metadata = {
  title: 'Afzal Basheer',
  description: 'Creative engineer specializing in high-fidelity interaction and gaming-inspired motion systems.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AudioProvider>
          {children}
          <GeminiChat />
        </AudioProvider>
      </body>
    </html>
  )
}
