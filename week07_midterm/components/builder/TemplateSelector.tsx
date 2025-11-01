'use client'

import { templates } from '@/lib/data/templates'
import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function TemplateSelector() {
  const { resumeData, setTemplateId } = useResumeBuilder()
  const selectedTemplate = resumeData.templateId || 'classic'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => setTemplateId(template.id)}
          className={cn(
            'glass-card glass-transition text-left relative group hover:scale-105',
            selectedTemplate === template.id && 'ring-2 ring-primary'
          )}
        >
          {/* Selected Badge */}
          {selectedTemplate === template.id && (
            <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
          )}

          {/* Template Preview */}
          <div className="glass-g1 aspect-[8.5/11] rounded-lg mb-4 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
              <span className="text-4xl font-bold">{template.name.charAt(0)}</span>
            </div>
          </div>

          {/* Template Info */}
          <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

          {/* ATS Score */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">ATS Score</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: `${template.atsScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-green-500">{template.atsScore}%</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
