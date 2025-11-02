'use client'

import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Plus, X, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useCallback } from 'react'
import { useAIGenerate } from '@/lib/hooks/use-ai-generate'
import { useToast } from '@/lib/hooks/use-toast'

interface GenerateResult {
  skills: string[]
}

export default function SkillsForm() {
  const { resumeData, updateSkills } = useResumeBuilder()
  const { skills } = resumeData
  const [newSkill, setNewSkill] = useState('')
  const { generate, isLoading } = useAIGenerate<GenerateResult>()
  const { showToast } = useToast()

  const addSkill = useCallback(() => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      updateSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }, [newSkill, skills, updateSkills])

  const removeSkill = useCallback((skill: string) => {
    updateSkills(skills.filter((s) => s !== skill))
  }, [skills, updateSkills])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }, [addSkill])

  const handleGenerateSuggestions = useCallback(async () => {
    if (resumeData.experience.length === 0) {
      showToast('Please add work experience first to get skill suggestions', 'warning')
      return
    }

    const result = await generate({
      type: 'skills',
      context: {
        type: 'skills',
        position: resumeData.experience[0]?.position || '',
        currentSkills: skills,
      },
    })

    if (result?.skills) {
      const newSkills = [...skills, ...result.skills.filter((s: string) => !skills.includes(s))]
      updateSkills(newSkills)
      showToast(`Added ${result.skills.length} new skill suggestions!`, 'success')
    } else {
      showToast('Failed to generate skill suggestions. Please check your API key.', 'error')
    }
  }, [resumeData.experience, skills, generate, updateSkills, showToast])

  return (
    <div className="space-y-6">
      {/* AI Suggestions */}
      <div className="glass-g1 p-4 rounded-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold mb-1">Need help with skills?</h3>
            <p className="text-sm text-muted-foreground">
              AI can suggest relevant skills based on your work experience
            </p>
          </div>
          <button
            onClick={handleGenerateSuggestions}
            disabled={isLoading}
            className={cn(
              'glass-g2 glass-transition px-4 py-2 rounded-xl font-medium',
              'hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap',
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
                Get Suggestions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Skill Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Add Skills</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., JavaScript, Project Management, Adobe Photoshop"
            className="glass-g1 flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={addSkill}
            className="glass-g2 glass-transition px-6 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter or click Add to include a skill
        </p>
      </div>

      {/* Skills List */}
      {skills.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Your Skills ({skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="glass-g1 px-4 py-2 rounded-full flex items-center gap-2 group glass-transition hover:bg-white/10"
              >
                <span className="text-sm">{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="opacity-0 group-hover:opacity-100 glass-transition hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length === 0 && (
        <div className="glass-g1 p-8 rounded-xl text-center">
          <p className="text-muted-foreground">
            No skills added yet. Add your technical and soft skills above.
          </p>
        </div>
      )}

      {/* Skill Categories Suggestion */}
      <div className="glass-g1 p-4 rounded-xl">
        <h3 className="text-sm font-semibold mb-2">Skill Categories to Consider:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div>• Technical Skills</div>
          <div>• Programming Languages</div>
          <div>• Frameworks & Tools</div>
          <div>• Soft Skills</div>
          <div>• Languages</div>
          <div>• Certifications</div>
        </div>
      </div>
    </div>
  )
}
