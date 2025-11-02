'use client'

import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCallback } from 'react'
import { useAIGenerate } from '@/lib/hooks/use-ai-generate'
import { useToast } from '@/lib/hooks/use-toast'

interface GenerateResult {
  summary: string
}

export default function SummaryForm() {
  const { resumeData, updateSummary } = useResumeBuilder()
  const { summary } = resumeData
  const { generate, isLoading } = useAIGenerate<GenerateResult>()
  const { showToast } = useToast()

  const handleGenerateSummary = useCallback(async () => {
    if (resumeData.experience.length === 0) {
      showToast('Please add work experience first to generate a professional summary', 'warning')
      return
    }

    const result = await generate({
      type: 'summary',
      context: {
        type: 'summary',
        experience: resumeData.experience,
        skills: resumeData.skills,
        education: resumeData.education,
      },
    })

    if (result?.summary) {
      updateSummary(result.summary)
      showToast('Professional summary generated successfully!', 'success')
    } else {
      showToast('Failed to generate summary. Please check your API key.', 'error')
    }
  }, [resumeData, generate, updateSummary, showToast])

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="glass-g1 p-4 rounded-xl">
        <h3 className="font-semibold mb-2">What is a Professional Summary?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          A professional summary is a brief statement at the top of your resume that highlights your key qualifications, experience, and career goals. It should be 2-4 sentences long.
        </p>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className={cn(
            'glass-g2 glass-transition px-4 py-2 rounded-xl font-medium',
            'hover:scale-105 active:scale-95 flex items-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </>
          )}
        </button>
      </div>

      {/* Summary Textarea */}
      <div>
        <label className="block text-sm font-medium mb-2">Professional Summary</label>
        <textarea
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact projects. Expertise in React, Node.js, and cloud technologies. Passionate about creating elegant solutions to complex problems."
          rows={6}
          className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {summary.length} / 500 characters recommended
        </p>
      </div>

      {/* Tips */}
      <div className="glass-g1 p-4 rounded-xl">
        <h3 className="text-sm font-semibold mb-2">Tips for a Great Summary:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Start with your current role or professional identity</li>
          <li>• Highlight 2-3 key accomplishments or areas of expertise</li>
          <li>• Include relevant years of experience</li>
          <li>• Mention key technical skills or domains</li>
          <li>• Keep it concise - aim for 2-4 sentences</li>
          <li>• Tailor it to the type of role you&apos;re seeking</li>
        </ul>
      </div>

      {/* Optional Note */}
      <div className="glass-g1 p-4 rounded-xl">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> The professional summary is optional. You can skip this step if you prefer, but it&apos;s highly recommended as it gives employers a quick overview of your qualifications.
        </p>
      </div>
    </div>
  )
}
