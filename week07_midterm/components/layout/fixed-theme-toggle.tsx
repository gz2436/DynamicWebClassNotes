'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function FixedThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="fixed top-6 right-6 z-50 glass-g1 h-12 w-12 rounded-full" />
    )
  }

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'fixed top-6 right-6 z-50',
        'glass-g1 glass-transition',
        'h-12 w-12 rounded-full',
        'flex items-center justify-center',
        'hover:scale-110 active:scale-95',
        'shadow-lg'
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
