import './globals.css'
import { Providers } from './providers'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const metadata = {
  title: 'Kiwi Trails — Premium New Zealand Tours & Private Journeys',
  description: 'Discover Aotearoa with hand-crafted private tours across Hobbiton, Tongariro, Taupo, Auckland, Tauranga & Wellington. Book directly with local experts.',
  openGraph: {
    title: 'Kiwi Trails — Premium New Zealand Tours',
    description: 'Hand-crafted private journeys across New Zealand.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
