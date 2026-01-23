import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

// Configuração da fonte de texto (Inter)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Configuração da fonte de títulos (Playfair Display)
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'Kontrol',
  description: 'Gestão financeira minimalista.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}