'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'

export function FloatingControls() {
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn(
          'glass-g1 glass-transition',
          'h-12 w-12 rounded-full',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95',
          'shadow-lg'
        )}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </button>

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className={cn(
          'glass-g1 glass-transition',
          'h-12 w-12 rounded-full',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95',
          'shadow-lg',
          'text-sm'
        )}
        aria-label="Toggle language"
        title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
      >
        {language === 'en' ? 'EN' : 'ZH'}
      </button>
    </div>
  )
}
