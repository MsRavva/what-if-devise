import type { Metadata } from 'next'
import { EB_Garamond, Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { ToastProvider } from '@/components/toast-provider'
import PageTransition from '@/components/page-transition'
import '@/styles/globals.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'What If Device - Генератор альтернативных сценариев',
  description: 'Создавайте уникальные альтернативные сценарии для ваших историй с помощью ИИ',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${ebGaramond.variable} ${inter.variable} font-serif antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <PageTransition>
                {children}
              </PageTransition>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
