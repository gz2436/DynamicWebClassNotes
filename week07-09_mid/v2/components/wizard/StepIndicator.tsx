'use client'

import { useWizard } from '@/lib/context/wizard-context'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const steps = [
  { number: 1, title: 'Basic Info' },
  { number: 2, title: 'Job Description' },
  { number: 3, title: 'Background' },
  { number: 4, title: 'Generate' },
]

export default function StepIndicator() {
  const { currentStep } = useWizard()

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                  step.number < currentStep &&
                    'bg-green-500 text-white shadow-lg shadow-green-500/50',
                  step.number === currentStep &&
                    'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground scale-110 shadow-xl shadow-primary/50',
                  step.number > currentStep &&
                    'glass-g1 text-muted-foreground'
                )}
              >
                {step.number < currentStep ? (
                  <Check className="h-6 w-6" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium transition-all duration-300',
                  step.number === currentStep && 'text-primary font-bold',
                  step.number !== currentStep && 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="w-16 h-1 mx-2 rounded-full overflow-hidden bg-secondary">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    step.number < currentStep && 'bg-gradient-to-r from-green-500 to-green-400 w-full',
                    step.number >= currentStep && 'w-0'
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-2">
        <div className="flex justify-between items-center px-4">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {steps[currentStep - 1].title}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
