import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { AnimatedBackground } from '@/components/layout/animated-background'
import { PageTransition } from '@/components/layout/page-transition'
import { FloatingControls } from '@/components/layout/floating-controls'
import { ToastProvider } from '@/lib/hooks/use-toast'
import { ToastContainer } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ResumeAI - AI-Powered Resume Builder',
  description: 'Create professional, ATS-optimized resumes with AI assistance. Beautiful Apple-inspired design.',
  keywords: ['resume', 'CV', 'AI', 'resume builder', 'ATS', 'career'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" storageKey="resumeai-theme">
          <LanguageProvider>
            <ToastProvider>
              <AnimatedBackground />
              <FloatingControls />
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 pt-20 md:pt-24">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
                <Footer />
              </div>
              <ToastContainer />
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
