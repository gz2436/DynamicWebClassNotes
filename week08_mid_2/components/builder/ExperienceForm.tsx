'use client'

import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useCallback } from 'react'
import { useAIGenerate } from '@/lib/hooks/use-ai-generate'
import { useToast } from '@/lib/hooks/use-toast'

interface GenerateResult {
  bullets: string[]
}

export default function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, deleteExperience } = useResumeBuilder()
  const { experience } = resumeData
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)
  const { generate, isLoading } = useAIGenerate<GenerateResult>()
  const { showToast } = useToast()

  const handleGenerateDescription = useCallback(async (expId: string) => {
    const exp = experience.find((e) => e.id === expId)
    if (!exp || !exp.position || !exp.company) {
      showToast('Please fill in the position and company first', 'warning')
      return
    }

    setGeneratingFor(expId)

    const result = await generate({
      type: 'experience',
      context: {
        type: 'work-description',
        position: exp.position,
        company: exp.company,
        responsibilities: exp.description.join('; '),
      },
    })

    setGeneratingFor(null)

    if (result?.bullets) {
      updateExperience(expId, { description: result.bullets })
      showToast('Description generated successfully!', 'success')
    } else {
      showToast('Failed to generate description. Please check your API key.', 'error')
    }
  }, [experience, generate, updateExperience, showToast])

  const handleDescriptionChange = useCallback((expId: string, value: string) => {
    const bullets = value.split('\n').filter((line) => line.trim())
    updateExperience(expId, { description: bullets })
  }, [updateExperience])

  return (
    <div className="space-y-6">
      {experience.length === 0 && (
        <div className="glass-g1 p-8 rounded-xl text-center">
          <p className="text-muted-foreground mb-4">No work experience added yet</p>
          <button
            onClick={addExperience}
            className="glass-g2 glass-transition px-6 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Experience
          </button>
        </div>
      )}

      {experience.map((exp, index) => (
        <div key={exp.id} className="glass-card border-2 border-white/10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Experience #{index + 1}</h3>
            <button
              onClick={() => deleteExperience(exp.id)}
              className="glass-g1 glass-transition h-10 w-10 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Position */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                placeholder="Software Engineer"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                placeholder="Tech Corp"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                placeholder="San Francisco, CA"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  disabled={exp.current}
                  className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            {/* Current Position */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) =>
                  updateExperience(exp.id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : exp.endDate,
                  })
                }
                className="h-4 w-4"
              />
              <span className="text-sm">I currently work here</span>
            </label>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Responsibilities & Achievements</label>
                <button
                  onClick={() => handleGenerateDescription(exp.id)}
                  disabled={generatingFor === exp.id}
                  className={cn(
                    'glass-g1 glass-transition px-3 py-1.5 rounded-full text-sm font-medium',
                    'hover:scale-105 active:scale-95 flex items-center gap-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {generatingFor === exp.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      AI Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={exp.description.join('\n')}
                onChange={(e) => handleDescriptionChange(exp.id, e.target.value)}
                placeholder="• Led development of key features&#10;• Improved system performance by 40%&#10;• Mentored junior developers"
                rows={6}
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Each line will become a bullet point. AI will generate based on your position and company.
              </p>
            </div>
          </div>
        </div>
      ))}

      {experience.length > 0 && (
        <button
          onClick={addExperience}
          className="glass-g2 glass-transition w-full px-6 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Another Experience
        </button>
      )}
    </div>
  )
}
