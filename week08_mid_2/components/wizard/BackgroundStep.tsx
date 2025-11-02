'use client'

import { useState } from 'react'
import { useWizard } from '@/lib/context/wizard-context'
import { useLanguage } from '@/lib/i18n/language-context'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import EducationInput from './EducationInput'

const schema = z.object({
  university: z.string().min(1, 'Please provide your university'),
  major: z.string().min(1, 'Please provide your major'),
  degree: z.string().min(1, 'Please provide your degree'),
  graduationYear: z.string().min(4, 'Please provide graduation year'),
  gpa: z.string().optional(),
  workExperience: z.string().optional(),
  projects: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function BackgroundStep() {
  const { wizardData, updateWizardData, goToNextStep, goToPreviousStep } = useWizard()
  const { t } = useLanguage()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedAI, setSelectedAI] = useState<'chatgpt' | 'gemini' | 'claude' | 'deepseek' | null>(null)

  const {
    register,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      university: wizardData.university || '',
      major: wizardData.major || '',
      degree: wizardData.degree || '',
      graduationYear: wizardData.graduationYear || '',
      gpa: wizardData.gpa || '',
      workExperience: wizardData.workSummary || '',
      projects: wizardData.projectsSummary || '',
    },
  })

  const handleAIGenerate = async (aiModel: 'chatgpt' | 'gemini' | 'claude' | 'deepseek') => {
    // Get form data
    const formData = control._formValues as FormData

    // Validate required fields
    if (!formData.university || !formData.major || !formData.degree || !formData.graduationYear) {
      return
    }

    // Combine education data into summary
    const educationSummary = `${formData.degree} in ${formData.major}, ${formData.university} (${formData.graduationYear})${formData.gpa ? `\nGPA: ${formData.gpa}` : ''}`

    updateWizardData({
      university: formData.university,
      major: formData.major,
      degree: formData.degree,
      graduationYear: formData.graduationYear,
      gpa: formData.gpa,
      educationSummary,
      workSummary: formData.workExperience,
      projectsSummary: formData.projects,
    })

    // Show AI animation for selected model
    setSelectedAI(aiModel)
    setIsGenerating(true)

    try {
      // Check if AI API is enabled
      const enableAI = process.env.NEXT_PUBLIC_ENABLE_AI_API === 'true'

      if (enableAI) {
        // Call DeepSeek API (regardless of which AI button was clicked)
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalInfo: wizardData,
            education: {
              university: formData.university,
              major: formData.major,
              degree: formData.degree,
              graduationYear: formData.graduationYear,
              gpa: formData.gpa,
            },
            workExperience: formData.workExperience,
            projects: formData.projects,
            jobDescription: wizardData.jobDescription,
            aiModel: aiModel, // Track which button was clicked
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate resume')
        }

        const result = await response.json()

        // Update wizard data with AI-generated content
        updateWizardData({
          aiGeneratedContent: result.content,
        })
      } else {
        // Mock AI generation for testing (API disabled)
        await new Promise(resolve => setTimeout(resolve, 2000))

        updateWizardData({
          aiGeneratedContent: {
            summary: `Mock AI summary - ${aiModel} model selected`,
            aiModel: aiModel,
            generatedAt: new Date().toISOString(),
          },
        })
      }

      setIsGenerating(false)
      setSelectedAI(null)
      goToNextStep()
    } catch (error) {
      console.error('Resume generation failed:', error)
      setIsGenerating(false)
      setSelectedAI(null)
      // TODO: Show error message to user
    }
  }

  return (
    <div className="max-w-lg mx-auto animate-in fade-in duration-500">
      <div className="glass-g2 rounded-xl p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t.background.title}
          </h2>
          <p className="text-muted-foreground">
            {t.background.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {/* Education - Required Fields */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              {t.background.education.title}
              <span className="text-destructive">*</span>
            </h3>

            {/* University - Searchable */}
            <Controller
              name="university"
              control={control}
              render={({ field }) => (
                <EducationInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t.background.education.placeholders.university}
                  label={t.background.education.university}
                  required
                  error={errors.university?.message}
                  type="university"
                />
              )}
            />

            {/* Major - Searchable */}
            <Controller
              name="major"
              control={control}
              render={({ field }) => (
                <EducationInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t.background.education.placeholders.major}
                  label={t.background.education.major}
                  required
                  error={errors.major?.message}
                  type="major"
                />
              )}
            />

            {/* Degree */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {t.background.education.degree} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('degree')}
                  className={cn(
                    'w-full px-4 py-3 pr-10 rounded-2xl glass-g1 appearance-none',
                    'border-2 border-transparent transition-all duration-300',
                    'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                    errors.degree && 'border-destructive animate-shake'
                  )}
                >
                  <option value="">{t.background.education.placeholders.degree}</option>
                  <option value="Bachelor of Science">{t.background.education.degrees.bs}</option>
                  <option value="Bachelor of Arts">{t.background.education.degrees.ba}</option>
                  <option value="Master of Science">{t.background.education.degrees.ms}</option>
                  <option value="Master of Arts">{t.background.education.degrees.ma}</option>
                  <option value="Master of Business Administration">{t.background.education.degrees.mba}</option>
                  <option value="Doctor of Philosophy">{t.background.education.degrees.phd}</option>
                  <option value="Associate Degree">{t.background.education.degrees.associate}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.degree && (
                <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                  {errors.degree.message}
                </p>
              )}
            </div>

            {/* Graduation Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {t.background.education.graduationYear} <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('graduationYear')}
                  type="text"
                  placeholder={t.background.education.placeholders.graduationYear}
                  maxLength={4}
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl glass-g1',
                    'border-2 border-transparent transition-all duration-300',
                    'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                    'placeholder:text-muted-foreground/50',
                    errors.graduationYear && 'border-destructive animate-shake'
                  )}
                />
                {errors.graduationYear && (
                  <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
                    {errors.graduationYear.message}
                  </p>
                )}
              </div>

              {/* GPA */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {t.background.education.gpa}
                </label>
                <input
                  {...register('gpa')}
                  type="text"
                  placeholder={t.background.education.placeholders.gpa}
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl glass-g1',
                    'border-2 border-transparent transition-all duration-300',
                    'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                    'placeholder:text-muted-foreground/50'
                  )}
                />
              </div>
            </div>
          </div>

          {/* Work Experience - Optional */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t.background.workExperience.title}
            </label>
            <textarea
              {...register('workExperience')}
              rows={4}
              placeholder={t.background.workExperience.placeholder}
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
              {t.background.projects.title}
            </label>
            <textarea
              {...register('projects')}
              rows={4}
              placeholder={t.background.projects.placeholder}
              className={cn(
                'w-full px-4 py-3 rounded-2xl glass-g1',
                'border-2 border-transparent transition-all duration-300',
                'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
                'placeholder:text-muted-foreground/50 resize-none'
              )}
            />
          </div>

          {/* Navigation Buttons - Redesigned Layout */}
          <div className="flex justify-between items-center pt-4">
            {/* Left: Back Button Only */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={isGenerating}
                className="w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center
                           bg-white/10 backdrop-blur-xl border border-white/20
                           hover:bg-white/20 hover:scale-110 active:scale-95
                           disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Right: AI Model Selection */}
            <div className="flex items-center gap-2">
              {/* ChatGPT - Official Black Logo */}
              <button
                type="button"
                onClick={() => handleAIGenerate('chatgpt')}
                disabled={!isValid || isGenerating}
                title="ChatGPT"
                className={cn(
                  'w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center',
                  'bg-white/10 backdrop-blur-xl border border-white/20',
                  isValid && !isGenerating
                    ? 'hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg shadow-black/20'
                    : 'opacity-50 cursor-not-allowed'
                )}
              >
                {isGenerating && selectedAI === 'chatgpt' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-black" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"/>
                  </svg>
                )}
              </button>

              {/* Gemini - Official Logo */}
              <button
                type="button"
                onClick={() => handleAIGenerate('gemini')}
                disabled={!isValid || isGenerating}
                title="Gemini"
                className={cn(
                  'w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden',
                  'bg-white/10 backdrop-blur-xl border border-white/20',
                  isValid && !isGenerating
                    ? 'hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg shadow-blue-500/20'
                    : 'opacity-50 cursor-not-allowed'
                )}
              >
                {isGenerating && selectedAI === 'gemini' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                ) : (
                  <img
                    src="/images/ai-models/gemini.jpg"
                    alt="Gemini"
                    className="w-5 h-5 object-contain object-left"
                    style={{ objectPosition: '0% 50%' }}
                  />
                )}
              </button>

              {/* Claude - Official Logo */}
              <button
                type="button"
                onClick={() => handleAIGenerate('claude')}
                disabled={!isValid || isGenerating}
                title="Claude"
                className={cn(
                  'w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden',
                  'bg-white/10 backdrop-blur-xl border border-white/20',
                  isValid && !isGenerating
                    ? 'hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg shadow-orange-500/20'
                    : 'opacity-50 cursor-not-allowed'
                )}
              >
                {isGenerating && selectedAI === 'claude' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                ) : (
                  <img
                    src="/images/ai-models/claude.jpg"
                    alt="Claude"
                    className="w-5 h-5 object-contain object-left"
                    style={{ objectPosition: '0% 50%' }}
                  />
                )}
              </button>

              {/* DeepSeek - Official Logo */}
              <button
                type="button"
                onClick={() => handleAIGenerate('deepseek')}
                disabled={!isValid || isGenerating}
                title="DeepSeek"
                className={cn(
                  'w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden',
                  'bg-white/10 backdrop-blur-xl border border-white/20',
                  isValid && !isGenerating
                    ? 'hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg shadow-blue-600/20'
                    : 'opacity-50 cursor-not-allowed'
                )}
              >
                {isGenerating && selectedAI === 'deepseek' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                ) : (
                  <img
                    src="/images/ai-models/deepseek.jpg"
                    alt="DeepSeek"
                    className="w-5 h-5 object-contain object-left"
                    style={{ objectPosition: '0% 50%' }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
