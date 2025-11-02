'use client'

import { useState } from 'react'
import { useWizard } from '@/lib/context/wizard-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  education: z.string().min(1, 'Please provide your education details'),
  workExperience: z.string().optional(),
  projects: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function BackgroundStep() {
  const { wizardData, updateWizardData, goToNextStep } = useWizard()
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      education: wizardData.educationSummary || '',
      workExperience: wizardData.workSummary || '',
      projects: wizardData.projectsSummary || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    updateWizardData({
      educationSummary: data.education,
      workSummary: data.workExperience,
      projectsSummary: data.projects,
    })

    // Show AI animation
    setIsGenerating(true)

    // Simulate AI generation for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsGenerating(false)
    goToNextStep()
  }

  return (
    <div className="max-w-lg mx-auto animate-in fade-in duration-500">
      <div className="glass-g2 rounded-xl p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Background
          </h2>
          <p className="text-muted-foreground">
            Tell us about your education, experience, and projects
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Education - Required */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Education <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register('education')}
              rows={4}
              placeholder="e.g., MS in Computer Science, NYU (2022-2024)&#10;GPA: 3.8&#10;Relevant coursework: Machine Learning, Data Structures"
              className={cn(
                'w-full px-4 py-3 rounded-2xl glass-g1',
                'border-2 border-transparent transition-all duration-300',
                'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                'placeholder:text-muted-foreground/50 resize-none',
                errors.education && 'border-destructive animate-shake'
              )}
            />
            {errors.education && (
              <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                {errors.education.message}
              </p>
            )}
          </div>

          {/* Work Experience - Optional */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Work Experience
            </label>
            <textarea
              {...register('workExperience')}
              rows={4}
              placeholder="e.g., Software Engineer at Google (2021-2022)&#10;- Built scalable microservices&#10;- Led team of 3 developers"
              className={cn(
                'w-full px-4 py-3 rounded-2xl glass-g1',
                'border-2 border-transparent transition-all duration-300',
                'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                'placeholder:text-muted-foreground/50 resize-none'
              )}
            />
          </div>

          {/* Projects - Optional */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Projects
            </label>
            <textarea
              {...register('projects')}
              rows={4}
              placeholder="e.g., E-commerce Platform&#10;- Built with React, Node.js, MongoDB&#10;- 10,000+ active users"
              className={cn(
                'w-full px-4 py-3 rounded-2xl glass-g1',
                'border-2 border-transparent transition-all duration-300',
                'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                'placeholder:text-muted-foreground/50 resize-none'
              )}
            />
          </div>

          {/* Generate Button - Centered at Bottom */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!isValid || isGenerating}
              className={cn(
                'px-10 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2',
                isValid && !isGenerating
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:scale-105 hover:shadow-2xl shadow-lg shadow-primary/50'
                  : 'glass-g1 text-muted-foreground cursor-not-allowed opacity-50'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
