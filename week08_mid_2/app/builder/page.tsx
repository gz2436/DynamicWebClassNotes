'use client'

import { WizardProvider, useWizard } from '@/lib/context/wizard-context'
import StepIndicator from '@/components/wizard/StepIndicator'
import BasicInfoStep from '@/components/wizard/BasicInfoStep'
import BackgroundStep from '@/components/wizard/BackgroundStep'
import TemplateSelectionStep from '@/components/wizard/TemplateSelectionStep'

// Placeholder components for other steps
function Step2() {
  const { goToNextStep } = useWizard()

  return <div className="max-w-lg mx-auto animate-in fade-in duration-500">
    <div className="glass-g2 rounded-xl p-6 shadow-2xl">
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Job Description
      </h2>
      <p className="text-muted-foreground">
        Paste the job description you&apos;re applying for (optional)
      </p>
    </div>
    <textarea
      placeholder="Paste job description here..."
      className="w-full h-48 px-4 py-3 rounded-2xl glass-g1 border-2 border-transparent focus:border-primary/50 focus:outline-none resize-none"
    />
    <div className="flex justify-end pt-4">
      <button
        onClick={goToNextStep}
        className="px-10 py-4 rounded-full font-semibold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:scale-105 hover:shadow-2xl shadow-lg shadow-primary/50 transition-all"
      >
        Next
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
