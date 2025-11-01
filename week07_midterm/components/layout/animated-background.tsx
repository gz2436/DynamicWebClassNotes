'use client'

import { usePathname } from 'next/navigation'

export function AnimatedBackground() {
  const pathname = usePathname()

  // Homepage and sign in page: center orb (handled in respective pages)
  if (pathname === '/' || pathname === '/auth/login' || pathname === '/auth/signup') {
    return null
  }

  // Builder page: Diagonal layout
  if (pathname.startsWith('/builder')) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top-left large */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 rounded-full blur-3xl opacity-25 animate-float-fast" />

        {/* Middle-right */}
        <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] bg-gradient-to-br from-pink-500 via-rose-400 to-red-500 rounded-full blur-3xl opacity-25 animate-float-medium" />

        {/* Bottom-left */}
        <div className="absolute -bottom-32 left-1/4 w-[520px] h-[520px] bg-gradient-to-br from-cyan-500 via-teal-400 to-emerald-500 rounded-full blur-3xl opacity-25 animate-float-reverse" />
      </div>
    )
  }

  // Templates page: Corner emphasis
  if (pathname.startsWith('/templates')) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top-right large */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-600 via-violet-500 to-purple-500 rounded-full blur-3xl opacity-25 animate-float-slow" />

        {/* Bottom-left large */}
        <div className="absolute -bottom-40 -left-40 w-[580px] h-[580px] bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-500 rounded-full blur-3xl opacity-25 animate-float-slow-reverse" />

        {/* Center accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-500 via-pink-400 to-rose-500 rounded-full blur-3xl opacity-20 animate-float-medium" />
      </div>
    )
  }

  // Export page: Horizontal layout
  if (pathname.startsWith('/export')) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Left side */}
        <div className="absolute top-1/4 -left-48 w-[560px] h-[560px] bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 rounded-full blur-3xl opacity-25 animate-float-medium" />

        {/* Right side */}
        <div className="absolute top-2/3 -right-48 w-[540px] h-[540px] bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-500 rounded-full blur-3xl opacity-25 animate-float-reverse" />

        {/* Top center */}
        <div className="absolute -top-32 left-1/3 w-[480px] h-[480px] bg-gradient-to-br from-violet-500 via-purple-400 to-fuchsia-500 rounded-full blur-3xl opacity-20 animate-float-fast" />
      </div>
    )
  }

  // Default: Subtle corner orbs for other pages
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top-left */}
      <div className="absolute -top-24 -left-24 w-[450px] h-[450px] bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full blur-3xl opacity-20 animate-float-medium" />

      {/* Top-right */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-full blur-3xl opacity-20 animate-float-fast" />

      {/* Bottom-left */}
      <div className="absolute -bottom-40 -left-40 w-[480px] h-[480px] bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-float-reverse" />

      {/* Bottom-right */}
      <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-float-slow-reverse" />
    </div>
  )
}
