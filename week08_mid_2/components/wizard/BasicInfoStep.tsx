'use client'

import { useWizard } from '@/lib/context/wizard-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().min(2, 'Location is required'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function BasicInfoStep() {
  const { wizardData, updateWizardData, goToNextStep } = useWizard()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      fullName: wizardData.fullName || '',
      email: wizardData.email || '',
      phone: wizardData.phone || '',
      location: wizardData.location || '',
      linkedin: wizardData.linkedin || '',
      github: wizardData.github || '',
      portfolio: wizardData.portfolio || '',
    },
  })

  const onSubmit = (data: FormData) => {
    updateWizardData(data)
    goToNextStep()
  }

  return (
    <div className="max-w-lg mx-auto animate-in fade-in duration-500">
      <div className="glass-g2 rounded-xl p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Basic Information
          </h2>
          <p className="text-muted-foreground">
            Let&apos;s start with your contact details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Required Fields Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              Required Information
              <span className="text-destructive">*</span>
            </h3>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register('fullName')}
                type="text"
                placeholder="John Doe"
                className={cn(
                  'w-full px-4 py-3 rounded-2xl glass-g1',
                  'border-2 border-transparent transition-all duration-300',
                  'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                  'placeholder:text-muted-foreground/50',
                  errors.fullName && 'border-destructive animate-shake'
                )}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className={cn(
                  'w-full px-4 py-3 rounded-2xl glass-g1',
                  'border-2 border-transparent transition-all duration-300',
                  'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                  'placeholder:text-muted-foreground/50',
                  errors.email && 'border-destructive animate-shake'
                )}
              />
              {errors.email && (
                <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Phone <span className="text-destructive">*</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 123-4567"
                className={cn(
                  'w-full px-4 py-3 rounded-2xl glass-g1',
                  'border-2 border-transparent transition-all duration-300',
                  'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                  'placeholder:text-muted-foreground/50',
                  errors.phone && 'border-destructive animate-shake'
                )}
              />
              {errors.phone && (
                <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Location <span className="text-destructive">*</span>
              </label>
              <input
                {...register('location')}
                type="text"
                placeholder="New York, NY"
                className={cn(
                  'w-full px-4 py-3 rounded-2xl glass-g1',
                  'border-2 border-transparent transition-all duration-300',
                  'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                  'placeholder:text-muted-foreground/50',
                  errors.location && 'border-destructive animate-shake'
                )}
              />
              {errors.location && (
                <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="space-y-4 pt-6 border-t border-border/50">
            <h3 className="text-base font-semibold">
              Optional Links
            </h3>

            {/* LinkedIn */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                LinkedIn Profile
              </label>
              <input
                {...register('linkedin')}
                type="url"
                placeholder="https://linkedin.com/in/johndoe"
                className={cn(
                  'w-full px-4 py-3 rounded-2xl glass-g1',
                  'border-2 border-transparent transition-all duration-300',
                  'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                  'placeholder:text-muted-foreground/50',
                  errors.linkedin && 'border-destructive animate-shake'
                )}
              />
              {errors.linkedin && (
                <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                  {errors.linkedin.message}
                </p>
              )}
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                GitHub Profile
              </label>
              <input
                {...register('github')}
                type="url"
                placeholder="https://github.com/johndoe"
                className={cn(
                  'w-full px-4 py-3 rounded-2xl glass-g1',
                  'border-2 border-transparent transition-all duration-300',
                  'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                  'placeholder:text-muted-foreground/50',
                  errors.github && 'border-destructive animate-shake'
                )}
              />
              {errors.github && (
                <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                  {errors.github.message}
                </p>
              )}
            </div>

            {/* Portfolio */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Portfolio Website
              </label>
              <input
                {...register('portfolio')}
                type="url"
                placeholder="https://johndoe.com"
                className={cn(
                  'w-full px-4 py-3 rounded-2xl glass-g1',
                  'border-2 border-transparent transition-all duration-300',
                  'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                  'placeholder:text-muted-foreground/50',
                  errors.portfolio && 'border-destructive animate-shake'
                )}
              />
              {errors.portfolio && (
                <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                  {errors.portfolio.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button - Super Rounded! */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!isValid}
              className={cn(
                'px-10 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2',
                isValid
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:scale-105 hover:shadow-2xl shadow-lg shadow-purple-500/50'
                  : 'glass-g1 text-muted-foreground cursor-not-allowed opacity-50'
              )}
            >
              Next <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
