import type { WizardData } from '@/lib/context/wizard-context'
import type { Resume, Settings } from './types'

/**
 * Converts WizardData from the builder to the Resume format expected by ResumePDF
 */
export function convertWizardDataToResume(wizardData: Partial<WizardData>): Resume {
  // Determine the primary URL (prioritize LinkedIn, then GitHub, then portfolio)
  const url = wizardData.linkedin || wizardData.github || wizardData.portfolio || ''

  // Parse work summary into structured work experiences
  const workExperiences = parseWorkSummary(wizardData.workSummary || '')

  // Parse education summary into structured education entries
  const educations = parseEducationSummary(wizardData.educationSummary || '')

  return {
    profile: {
      name: wizardData.fullName || 'Your Name',
      email: wizardData.email || '',
      phone: wizardData.phone || '',
      location: wizardData.location || '',
      url,
      summary: '',
    },
    workExperiences,
    educations,
    projects: [],
    skills: {
      featuredSkills: [],
      descriptions: [],
    },
    custom: {
      descriptions: [],
    },
  }
}

/**
 * Parses work summary text into structured work experience entries
 * For now, creates a single entry with the summary as descriptions
 * TODO: Can be enhanced with AI to parse into multiple entries
 */
function parseWorkSummary(summary: string) {
  if (!summary.trim()) {
    return []
  }

  // Split by paragraphs or bullet points
  const lines = summary
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  // If we have multiple lines, treat them as bullet points
  // Otherwise, use the whole summary as a single description
  const descriptions = lines.length > 1
    ? lines
    : [summary]

  return [
    {
      company: 'Company Name',
      jobTitle: 'Job Title',
      date: 'Present',
      descriptions,
    },
  ]
}

/**
 * Parses education summary text into structured education entries
 * For now, creates a single entry with the summary as descriptions
 * TODO: Can be enhanced with AI to parse into multiple entries
 */
function parseEducationSummary(summary: string) {
  if (!summary.trim()) {
    return []
  }

  // Split by paragraphs or bullet points
  const lines = summary
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const descriptions = lines.length > 1
    ? lines
    : [summary]

  return [
    {
      school: 'University Name',
      degree: 'Degree',
      date: 'Graduation Year',
      gpa: '',
      descriptions,
    },
  ]
}

/**
 * Creates default settings for resume rendering
 */
export function getDefaultSettings(themeColor = '#0ea5e9'): Settings {
  return {
    fontFamily: 'Helvetica',
    fontSize: 11,
    documentSize: 'LETTER',
    themeColor,
    showBulletPoints: {
      educations: true,
      skills: true,
      custom: true,
    },
    formToHeading: {
      workExperiences: 'Work Experience',
      educations: 'Education',
      projects: 'Projects',
      skills: 'Skills',
      custom: 'Additional Information',
    },
    formToShow: {
      workExperiences: true,
      educations: true,
      projects: false,
      skills: false,
      custom: false,
    },
    formsOrder: ['workExperiences', 'educations', 'projects', 'skills', 'custom'],
  }
}
