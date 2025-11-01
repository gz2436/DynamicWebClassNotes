'use client'

import { useState, useEffect } from 'react'
import { ResumeBuilderProvider, useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Import step components
import TemplateSelector from '@/components/builder/TemplateSelector'
import PersonalInfoForm from '@/components/builder/PersonalInfoForm'
import ExperienceForm from '@/components/builder/ExperienceForm'
import EducationForm from '@/components/builder/EducationForm'
import SkillsForm from '@/components/builder/SkillsForm'
import SummaryForm from '@/components/builder/SummaryForm'
import ProjectsForm from '@/components/builder/ProjectsForm'
import ReviewAndExport from '@/components/builder/ReviewAndExport'
import LivePreview from '@/components/builder/LivePreview'

const steps = [
  { id: 0, name: 'Template', description: 'Choose a template' },
  { id: 1, name: 'Personal Info', description: 'Your contact details' },
  { id: 2, name: 'Experience', description: 'Work history' },
  { id: 3, name: 'Education', description: 'Academic background' },
  { id: 4, name: 'Skills', description: 'Your expertise' },
  { id: 5, name: 'Projects', description: 'Notable projects' },
  { id: 6, name: 'Summary', description: 'Professional summary' },
  { id: 7, name: 'Review', description: 'Export & save' },
]

function BuilderContent() {
  const { currentStep, setCurrentStep, resumeData } = useResumeBuilder()
  const router = useRouter()
  const supabase = createBrowserClient()
  const [authChecking, setAuthChecking] = useState(false)

  // No forced login - users can build resume without account
  useEffect(() => {
    // Optional: Load user data if logged in
    loadUserIfAvailable()
  }, [])

  async function loadUserIfAvailable() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    // User data available but not required
    setAuthChecking(false)
  }

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <TemplateSelector />
      case 1:
        return <PersonalInfoForm />
      case 2:
        return <ExperienceForm />
      case 3:
        return <EducationForm />
      case 4:
        return <SkillsForm />
      case 5:
        return <ProjectsForm />
      case 6:
        return <SummaryForm />
      case 7:
        return <ReviewAndExport />
      default:
        return <TemplateSelector />
    }
  }

  if (authChecking) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen py-8 pb-32">
        <div className="container mx-auto px-4">
          {/* Progress Steps */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setCurrentStep(step.id)}
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center font-semibold glass-transition',
                          currentStep === step.id
                            ? 'glass-g2 text-primary scale-110'
                            : currentStep > step.id
                            ? 'glass-g1 text-green-500'
                            : 'glass-g1 text-muted-foreground'
                        )}
                      >
                        {currentStep > step.id ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span>{step.id + 1}</span>
                        )}
                      </button>
                      <div className="mt-2 text-center hidden md:block">
                        <div className={cn(
                          'text-xs font-medium',
                          currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
                        )}>
                          {step.name}
                        </div>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'h-1 flex-1 mx-2 rounded-full glass-transition',
                          currentStep > step.id ? 'bg-green-500/30' : 'bg-white/10'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-5xl mx-auto">
            <div className="glass-card">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{steps[currentStep].name}</h2>
                <p className="text-muted-foreground">{steps[currentStep].description}</p>
              </div>

              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30 glass-g2 border-t border-white/10 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className={cn(
                'glass-g1 glass-transition px-6 py-3 rounded-xl font-medium',
                'flex items-center gap-2',
                'hover:scale-105 active:scale-95',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              )}
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>

            <button
              onClick={goToNextStep}
              disabled={currentStep === steps.length - 1}
              className={cn(
                'glass-g2 glass-transition px-6 py-3 rounded-xl font-semibold',
                'flex items-center gap-2',
                'hover:scale-105 active:scale-95',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              )}
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <LivePreview />
    </>
  )
}

export default function BuilderPage() {
  return (
    <ResumeBuilderProvider>
      <BuilderContent />
    </ResumeBuilderProvider>
  )
}
