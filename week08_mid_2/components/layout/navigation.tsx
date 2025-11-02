'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AuthButton } from '@/components/auth/auth-button'
import { Menu, X, FileText } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/builder', label: 'Builder' },
  { href: '/templates', label: 'Templates' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <nav className="glass-g2 glass-transition fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full px-6 py-3 hidden md:block">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg glass-transition hover:scale-105"
          >
            <FileText className="h-5 w-5" />
            <span>ResumeAI</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium glass-transition',
                  'hover:bg-white/10 dark:hover:bg-white/5',
                  pathname === item.href &&
                    'bg-white/20 dark:bg-white/10 shadow-sm'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <AuthButton />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="glass-g2 fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span>ResumeAI</span>
          </Link>

          <div className="flex items-center gap-2">
            <AuthButton />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="glass-g1 glass-transition h-10 w-10 rounded-full flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="glass-g3 border-t border-white/10 px-4 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium glass-transition',
                    'hover:bg-white/10 dark:hover:bg-white/5',
                    pathname === item.href &&
                      'bg-white/20 dark:bg-white/10 shadow-sm'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
