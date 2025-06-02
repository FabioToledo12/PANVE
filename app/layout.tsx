import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PANVE - Protocolo de avaliação não verbal',
  description: 'Protocolo de avaliação não verbal',
  generator: 'JFHTech',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/iconePanve.png" type="image/png" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  )
}
