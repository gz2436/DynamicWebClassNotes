'use client'

import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function LivePreview() {
  const { resumeData } = useResumeBuilder()
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 glass-g2 glass-transition px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 active:scale-95"
      >
        Preview Resume
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card max-w-5xl w-full max-h-[90vh] overflow-auto relative">
        <div className="sticky top-0 glass-g2 flex items-center justify-between p-4 mb-4 rounded-xl">
          <h2 className="text-xl font-bold">Resume Preview</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="glass-g1 glass-transition h-10 w-10 rounded-full flex items-center justify-center hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center">
          <div className="transform scale-50 origin-top">
            <ClassicTemplate data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  )
}
