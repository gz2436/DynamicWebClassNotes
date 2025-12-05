export interface ResumeProfile {
  name: string
  email: string
  phone: string
  url: string
  summary: string
  location: string
}

export interface ResumeWorkExperience {
  company: string
  jobTitle: string
  date: string
  descriptions: string[]
}

export interface ResumeEducation {
  school: string
  degree: string
  date: string
  gpa: string
  descriptions: string[]
}

export interface ResumeProject {
  project: string
  date: string
  descriptions: string[]
}

export interface FeaturedSkill {
  skill: string
  rating: number
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[]
  descriptions: string[]
}

export interface ResumeCustom {
  descriptions: string[]
}

export interface Resume {
  profile: ResumeProfile
  workExperiences: ResumeWorkExperience[]
  educations: ResumeEducation[]
  projects: ResumeProject[]
  skills: ResumeSkills
  custom: ResumeCustom
}

export interface Settings {
  fontFamily: string
  fontSize: number
  documentSize: 'A4' | 'LETTER'
  themeColor: string
  showBulletPoints: {
    educations: boolean
    skills: boolean
    custom: boolean
  }
  formToHeading: {
    workExperiences: string
    educations: string
    projects: string
    skills: string
    custom: string
  }
  formToShow: {
    workExperiences: boolean
    educations: boolean
    projects: boolean
    skills: boolean
    custom: boolean
  }
  formsOrder: Array<'workExperiences' | 'educations' | 'projects' | 'skills' | 'custom'>
}

export const DEFAULT_FONT_COLOR = '#171717'
