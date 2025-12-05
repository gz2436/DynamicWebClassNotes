'use client'

import { useWizard } from '@/lib/context/wizard-context'
import { useLanguage } from '@/lib/i18n/language-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  const { t } = useLanguage()

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
            {t.basicInfo.title}
          </h2>
          <p className="text-muted-foreground">
            {t.basicInfo.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Required Fields Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              {t.basicInfo.requiredInfo}
              <span className="text-destructive">*</span>
            </h3>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {t.basicInfo.fullName} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('fullName')}
                type="text"
                placeholder={t.basicInfo.placeholders.fullName}
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
                {t.basicInfo.email} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder={t.basicInfo.placeholders.email}
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
                {t.basicInfo.phone} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder={t.basicInfo.placeholders.phone}
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
                {t.basicInfo.location} <span className="text-destructive">*</span>
              </label>
              <input
                {...register('location')}
                type="text"
                placeholder={t.basicInfo.placeholders.location}
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
              {t.basicInfo.optionalLinks}
            </h3>

            {/* LinkedIn */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {t.basicInfo.linkedinProfile}
              </label>
              <input
                {...register('linkedin')}
                type="url"
                placeholder={t.basicInfo.placeholders.linkedin}
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
                {t.basicInfo.githubProfile}
              </label>
              <input
                {...register('github')}
                type="url"
                placeholder={t.basicInfo.placeholders.github}
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
                {t.basicInfo.portfolioWebsite}
              </label>
              <input
                {...register('portfolio')}
                type="url"
                placeholder={t.basicInfo.placeholders.portfolio}
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

          {/* Navigation Button - Apple Glassmorphism Style */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!isValid}
              className={cn(
                'w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center',
                'shadow-lg',
                isValid
                  ? 'bg-white/90 backdrop-blur-xl border border-white/40 text-gray-900 hover:bg-white hover:scale-110 active:scale-95 shadow-black/10'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-500 cursor-not-allowed opacity-50'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
