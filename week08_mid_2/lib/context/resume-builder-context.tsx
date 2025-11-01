'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { ResumeData, Experience, Education, Project, PersonalInfo } from '@/lib/types/resume'
import { v4 as uuidv4 } from 'uuid'

interface ResumeBuilderContextType {
  resumeData: ResumeData
  currentStep: number
  setCurrentStep: (step: number) => void
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void
  updateSummary: (summary: string) => void
  addExperience: () => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  deleteExperience: (id: string) => void
  addEducation: () => void
  updateEducation: (id: string, data: Partial<Education>) => void
  deleteEducation: (id: string) => void
  updateSkills: (skills: string[]) => void
  addProject: () => void
  updateProject: (id: string, data: Partial<Project>) => void
  deleteProject: (id: string) => void
  setTemplateId: (templateId: string) => void
  resetResume: () => void
  loadResume: (data: ResumeData) => void
}

const ResumeBuilderContext = createContext<ResumeBuilderContextType | undefined>(undefined)

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
}

export function ResumeBuilderProvider({ children }: { children: React.ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [currentStep, setCurrentStep] = useState(0)

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }))
  }, [])

  const updateSummary = useCallback((summary: string) => {
    setResumeData((prev) => ({ ...prev, summary }))
  }, [])

  const addExperience = useCallback(() => {
    const newExperience: Experience = {
      id: uuidv4(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [],
    }
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }))
  }, [])

  const updateExperience = useCallback((id: string, data: Partial<Experience>) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, ...data } : exp
      ),
    }))
  }, [])

  const deleteExperience = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }, [])

  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: uuidv4(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    }
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }))
  }, [])

  const updateEducation = useCallback((id: string, data: Partial<Education>) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...data } : edu
      ),
    }))
  }, [])

  const deleteEducation = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }, [])

  const updateSkills = useCallback((skills: string[]) => {
    setResumeData((prev) => ({ ...prev, skills }))
  }, [])

  const addProject = useCallback(() => {
    const newProject: Project = {
      id: uuidv4(),
      name: '',
      description: '',
      technologies: [],
      link: '',
    }
    setResumeData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProject],
    }))
  }, [])

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((proj) =>
        proj.id === id ? { ...proj, ...data } : proj
      ),
    }))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((proj) => proj.id !== id),
    }))
  }, [])

  const setTemplateId = useCallback((templateId: string) => {
    setResumeData((prev) => ({ ...prev, templateId }))
  }, [])

  const resetResume = useCallback(() => {
    setResumeData(initialResumeData)
    setCurrentStep(0)
  }, [])

  const loadResume = useCallback((data: ResumeData) => {
    setResumeData(data)
  }, [])

  const value: ResumeBuilderContextType = {
    resumeData,
    currentStep,
    setCurrentStep,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    updateSkills,
    addProject,
    updateProject,
    deleteProject,
    setTemplateId,
    resetResume,
    loadResume,
  }

  return (
    <ResumeBuilderContext.Provider value={value}>
      {children}
    </ResumeBuilderContext.Provider>
  )
}

export function useResumeBuilder() {
  const context = useContext(ResumeBuilderContext)
  if (context === undefined) {
    throw new Error('useResumeBuilder must be used within a ResumeBuilderProvider')
  }
  return context
}
