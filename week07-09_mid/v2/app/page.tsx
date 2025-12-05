'use client'

import Link from 'next/link'
import { ArrowRight, FileCheck, Download, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Orb - Fixed to viewport */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0">
        {/* Large Center Orb */}
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-3xl opacity-25 animate-float-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <section className="py-36 md:py-48">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            {t.home.title}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-14 max-w-2xl mx-auto leading-relaxed">
            {t.home.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builder"
              className={cn(
                'glass-g2 glass-transition group',
                'px-8 py-4 rounded-full font-semibold',
                'hover:scale-105 active:scale-95',
                'flex items-center justify-center gap-2'
              )}
            >
              {t.home.getStarted}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/templates"
              className={cn(
                'glass-g1 glass-transition',
                'px-8 py-4 rounded-full font-semibold',
                'hover:scale-105 active:scale-95',
                'flex items-center justify-center gap-2'
              )}
            >
              {t.home.learnMore}
            </Link>
          </div>
        </div>
      </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {/* Feature 1 */}
              <div className="glass-card glass-transition hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
                <div className="flex flex-col h-full p-2">
                  <div className="glass-g1 h-16 w-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 glass-transition shadow-md">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary glass-transition">{t.home.features.ai.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {t.home.features.ai.description}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="glass-card glass-transition hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
                <div className="flex flex-col h-full p-2">
                  <div className="glass-g1 h-16 w-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 glass-transition shadow-md">
                    <FileCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary glass-transition">{t.home.features.ats.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {t.home.features.ats.description}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="glass-card glass-transition hover:scale-[1.03] hover:shadow-2xl group cursor-pointer">
                <div className="flex flex-col h-full p-2">
                  <div className="glass-g1 h-16 w-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 glass-transition shadow-md">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary glass-transition">{t.home.features.download.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {t.home.features.download.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-24 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              {t.home.howItWorks.title}
            </h2>

            <div className="space-y-24 md:space-y-32">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 space-y-5">
                  <div className="text-7xl font-bold text-primary/15 mb-3">01</div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">Choose a Template</h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Browse our collection of professional templates designed for various industries and career levels.
                  </p>
                </div>
                <div className="order-1 md:order-2 glass-g1 aspect-[4/3] rounded-3xl shadow-lg glass-transition hover:scale-[1.02]"></div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="glass-g1 aspect-[4/3] rounded-3xl shadow-lg glass-transition hover:scale-[1.02]"></div>
                <div className="space-y-5">
                  <div className="text-7xl font-bold text-primary/15 mb-3">02</div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">Fill In Your Details</h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Our guided wizard helps you input your information. AI generates compelling content instantly.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 space-y-5">
                  <div className="text-7xl font-bold text-primary/15 mb-3">03</div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">Download & Apply</h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Export in PDF or DOCX format. Start applying to your dream jobs immediately.
                  </p>
                </div>
                <div className="order-1 md:order-2 glass-g1 aspect-[4/3] rounded-3xl shadow-lg glass-transition hover:scale-[1.02]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
          <div className="glass-card max-w-4xl mx-auto text-center shadow-xl hover:shadow-2xl glass-transition">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Ready to land your
              <br />
              dream job?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who&apos;ve upgraded their careers with ResumeAI.
            </p>
            <Link
              href="/builder"
              className={cn(
                'glass-g2 glass-transition inline-flex items-center gap-3 group',
                'px-10 py-5 rounded-full text-lg font-semibold shadow-lg',
                'hover:scale-105 hover:shadow-xl active:scale-95'
              )}
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 glass-transition" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
