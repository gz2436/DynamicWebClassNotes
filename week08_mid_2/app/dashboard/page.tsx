'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { getUserResumes } from '@/lib/supabase/queries'
import { useRouter } from 'next/navigation'
import { Plus, FileText, Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

type Resume = {
  id: string
  title: string
  template_id: string
  updated_at: string
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  const loadResumes = useCallback(async (userId: string) => {
    try {
      const data = await getUserResumes(userId)
      setResumes(data)
    } catch (error) {
      console.error('Error loading resumes:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const checkUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      loadResumes(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth/login')
    }
  }, [router, supabase, loadResumes])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Your Resumes</h1>
        <p className="text-muted-foreground">
          Manage and edit your professional resumes
        </p>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Link
          href="/builder"
          className={cn(
            'glass-card glass-transition hover:scale-105',
            'min-h-[300px] flex flex-col items-center justify-center',
            'border-2 border-dashed border-white/20'
          )}
        >
          <div className="glass-g1 h-16 w-16 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Create New Resume</h3>
          <p className="text-sm text-muted-foreground text-center">
            Start building a new professional resume
          </p>
        </Link>

        {/* Resume Cards */}
        {resumes.map((resume) => (
          <Link
            key={resume.id}
            href={`/builder?id=${resume.id}`}
            className="glass-card glass-transition hover:scale-105 cursor-pointer"
          >
            {/* Preview */}
            <div className="glass-g1 aspect-[8.5/11] rounded-lg mb-4 flex items-center justify-center">
              <FileText className="h-16 w-16 text-muted-foreground/30" />
            </div>

            {/* Info */}
            <h3 className="text-xl font-semibold mb-2">{resume.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {resumes.length === 0 && (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first resume to get started
          </p>
          <Link
            href="/builder"
            className={cn(
              'glass-g2 glass-transition inline-flex items-center gap-2',
              'px-6 py-3 rounded-full font-semibold',
              'hover:scale-105 active:scale-95'
            )}
          >
            <Plus className="h-5 w-5" />
            Create Resume
          </Link>
        </div>
      )}
    </div>
  )
}
