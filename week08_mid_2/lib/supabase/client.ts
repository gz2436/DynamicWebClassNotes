import { createClient } from '@supabase/supabase-js'
import type { ResumeData } from '@/lib/types/resume'

export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          template_id: string
          content: ResumeData
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          template_id: string
          content: ResumeData
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          template_id?: string
          content?: Partial<ResumeData>
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Client-side Supabase client
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  })
}

// Server-side Supabase client (for API routes)
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

  return createClient<Database>(supabaseUrl, supabaseKey)
}
