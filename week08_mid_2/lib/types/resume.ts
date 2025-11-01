export interface ResumeData {
  id?: string
  templateId?: string
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects?: Project[]
}

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  portfolio?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  link?: string
}

export type TemplateId = 'classic' | 'modern' | 'creative' | 'technical' | 'executive' | 'minimal'

export interface Template {
  id: TemplateId
  name: string
  description: string
  category: string
  atsScore: number
  preview: string
}
