'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface WizardData {
  // Step 1: Basic Info
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  portfolio?: string
  photoUrl?: string
  // Step 2: Job Description
  jobDescription: string
  detectedLanguage: 'en' | 'zh'
  // Step 3: Background - Detailed Education
  university: string
  major: string
  degree: string
  graduationYear: string
  gpa?: string
  educationSummary: string
  workSummary: string
  projectsSummary: string
  style: 'professional' | 'creative' | 'technical'
  selectedTemplate: 'classic' | 'modern' | 'tech'
  // AI Generated Content
  aiGeneratedContent?: {
    summary?: string
    workExperience?: string
    projects?: string
    skills?: string[]
    aiModel?: 'chatgpt' | 'gemini' | 'claude' | 'deepseek'
    generatedAt?: string
  }
  // Generated Resume ID
  resumeId?: string
}

interface WizardContextType {
  currentStep: number
  wizardData: Partial<WizardData>
  goToNextStep: () => void
  goToPreviousStep: () => void
  updateWizardData: (data: Partial<WizardData>) => void
  resetWizard: () => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

const initialData: Partial<WizardData> = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  jobDescription: '',
  detectedLanguage: 'en',
  university: '',
  major: '',
  degree: '',
  graduationYear: '',
  gpa: '',
  workSummary: '',
  educationSummary: '',
  projectsSummary: '',
  style: 'professional',
  selectedTemplate: 'classic',
}

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<Partial<WizardData>>(initialData)

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      // Scroll to top smoothly when navigating to next step
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // Scroll to top smoothly when navigating to previous step
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }))
  }

  const resetWizard = () => {
    setCurrentStep(1)
    setWizardData(initialData)
  }

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        wizardData,
        goToNextStep,
        goToPreviousStep,
        updateWizardData,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider')
  }
  return context
}
