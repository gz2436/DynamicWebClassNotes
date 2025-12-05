'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="glass-g1 h-10 w-10 rounded-full animate-pulse" />
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="glass-g1 glass-transition h-10 w-10 rounded-full flex items-center justify-center hover:scale-110"
        >
          <UserIcon className="h-5 w-5" />
        </Link>
        <button
          onClick={handleSignOut}
          className="glass-g1 glass-transition h-10 w-10 rounded-full flex items-center justify-center hover:scale-110"
          aria-label="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/auth/login"
      className={cn(
        'glass-g1 glass-transition h-10 w-10 rounded-full flex items-center justify-center',
        'hover:scale-110'
      )}
      aria-label="Sign In"
    >
      <UserIcon className="h-5 w-5" />
    </Link>
  )
}
