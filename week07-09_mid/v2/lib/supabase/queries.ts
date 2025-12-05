import { createBrowserClient } from './client'
import type { Database } from './client'

type Resume = Database['public']['Tables']['resumes']['Row']
type ResumeInsert = Database['public']['Tables']['resumes']['Insert']
type ResumeUpdate = Database['public']['Tables']['resumes']['Update']

export async function getUserResumes(userId: string): Promise<Resume[]> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching resumes:', error)
    throw error
  }

  return data || []
}

export async function getResumeById(id: string): Promise<Resume | null> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching resume:', error)
    return null
  }

  return data
}

export async function createResume(resume: ResumeInsert): Promise<Resume> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from('resumes')
    // @ts-expect-error - Supabase type inference issue with Database generic
    .insert(resume)
    .select()
    .single()

  if (error) {
    console.error('Error creating resume:', error)
    throw error
  }

  return data
}

export async function updateResume(id: string, updates: ResumeUpdate): Promise<Resume> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from('resumes')
    // @ts-expect-error - Supabase type inference issue with Database generic
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating resume:', error)
    throw error
  }

  return data
}

export async function deleteResume(id: string): Promise<void> {
  const supabase = createBrowserClient()

  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting resume:', error)
    throw error
  }
}
