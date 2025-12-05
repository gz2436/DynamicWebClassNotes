'use client'

import { useState } from 'react'
import { WizardProvider, useWizard } from '@/lib/context/wizard-context'
import { useLanguage } from '@/lib/i18n/language-context'
import StepIndicator from '@/components/wizard/StepIndicator'
import BasicInfoStep from '@/components/wizard/BasicInfoStep'
import BackgroundStep from '@/components/wizard/BackgroundStep'
import TemplateSelectionStep from '@/components/wizard/TemplateSelectionStep'

// Job Description Step
function Step2() {
  const { wizardData, updateWizardData, goToNextStep, goToPreviousStep } = useWizard()
  const { t } = useLanguage()
  const [jobDescription, setJobDescription] = useState(wizardData.jobDescription || '')

  const handleNext = () => {
    updateWizardData({ jobDescription })
    goToNextStep()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setJobDescription(value)
    updateWizardData({ jobDescription: value })
  }

  return <div className="max-w-lg mx-auto animate-in fade-in duration-500">
    <div className="glass-g2 rounded-xl p-6 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t.jobDescription.title}
        </h2>
        <p className="text-muted-foreground">
          {t.jobDescription.subtitle}
        </p>
      </div>

      <textarea
        value={jobDescription}
        onChange={handleChange}
        placeholder={t.jobDescription.placeholder}
        className="w-full h-48 px-4 py-3 rounded-2xl glass-g1 border-2 border-transparent focus:border-primary/50 focus:outline-none resize-none placeholder:text-muted-foreground/50"
      />

      {/* Navigation Buttons - Icon Only */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={goToPreviousStep}
          className="w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center
                     bg-white/10 backdrop-blur-xl border border-white/20
                     hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg shadow-black/5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center
                     bg-white/90 backdrop-blur-xl border border-white/40 text-gray-900
                     hover:bg-white hover:scale-110 active:scale-95 shadow-lg shadow-black/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
}


function WizardContent() {
  const { currentStep } = useWizard()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />
      case 2:
        return <Step2 />
      case 3:
        return <BackgroundStep />
      case 4:
        return <TemplateSelectionStep />
      default:
        return <BasicInfoStep />
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <StepIndicator />
        <div className="mt-12">{renderStep()}</div>
      </div>
    </div>
  )
}

export default function WizardPage() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
