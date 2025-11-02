'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Languages } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

type Language = 'en' | 'zh'

export function FloatingControls() {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
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
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className={cn(
          'glass-g1 glass-transition relative',
          'h-12 w-12 rounded-full',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95',
          'shadow-lg'
        )}
        aria-label="Toggle language"
        title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
      >
        <Languages className="h-5 w-5" />
        <span className="absolute -bottom-1 -right-1 text-[10px] font-bold glass-g2 px-1.5 py-0.5 rounded-full">
          {language.toUpperCase()}
        </span>
      </button>
    </div>
  )
}
