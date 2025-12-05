'use client'

import { Languages } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Language = 'en' | 'zh'

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>('en')

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en')
  }

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'glass-g1 glass-transition relative h-10 w-10 rounded-full',
        'flex items-center justify-center',
        'hover:scale-105 active:scale-95'
      )}
      aria-label="Toggle language"
      title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
    >
      <Languages className="h-5 w-5" />
      <span className="absolute -bottom-1 -right-1 text-[10px] font-bold glass-g2 px-1 rounded-full">
        {language.toUpperCase()}
      </span>
    </button>
  )
}
