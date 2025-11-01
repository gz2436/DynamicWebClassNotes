'use client'

import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Plus, Trash2 } from 'lucide-react'

export default function EducationForm() {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResumeBuilder()
  const { education } = resumeData

  return (
    <div className="space-y-6">
      {education.length === 0 && (
        <div className="glass-g1 p-8 rounded-xl text-center">
          <p className="text-muted-foreground mb-4">No education added yet</p>
          <button
            onClick={addEducation}
            className="glass-g2 glass-transition px-6 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Education
          </button>
        </div>
      )}

      {education.map((edu, index) => (
        <div key={edu.id} className="glass-card border-2 border-white/10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Education #{index + 1}</h3>
            <button
              onClick={() => deleteEducation(edu.id)}
              className="glass-g1 glass-transition h-10 w-10 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Institution */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                placeholder="Stanford University"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="Bachelor of Science"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                placeholder="Computer Science"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                placeholder="Stanford, CA"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                  className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-sm font-medium mb-2">GPA (Optional)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                placeholder="3.8 / 4.0"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      ))}

      {education.length > 0 && (
        <button
          onClick={addEducation}
          className="glass-g2 glass-transition w-full px-6 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Another Education
        </button>
      )}
    </div>
  )
}
