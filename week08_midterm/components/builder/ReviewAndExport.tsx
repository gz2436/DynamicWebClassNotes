'use client'

import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Save, Download, FileText, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { createResume, updateResume } from '@/lib/supabase/queries'
import { useRouter } from 'next/navigation'

export default function ReviewAndExport() {
  const { resumeData } = useResumeBuilder()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [title, setTitle] = useState('My Resume')
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleSave = async () => {
    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        const shouldLogin = confirm(
          'You need to login to save your resume. Your progress will be preserved. Login now?'
        )
        if (shouldLogin) {
          // Store resume data in localStorage before redirect
          localStorage.setItem('resumeDraft', JSON.stringify(resumeData))
          router.push('/auth/login?redirect=/builder')
        }
        setSaving(false)
        return
      }

      if (resumeData.id) {
        await updateResume(resumeData.id, {
          title,
          templateId: resumeData.templateId || 'classic',
          content: resumeData,
        })
      } else {
        await createResume({
          userId: user.id,
          title,
          templateId: resumeData.templateId || 'classic',
          content: resumeData,
        })
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = async () => {
    alert('PDF export will be implemented soon! For now, please save your resume to the dashboard.')
  }

  const handleExportDOCX = async () => {
    alert('DOCX export will be implemented soon! For now, please save your resume to the dashboard.')
  }

  const isComplete = () => {
    return (
      resumeData.personalInfo.fullName &&
      resumeData.personalInfo.email &&
      resumeData.personalInfo.phone &&
      resumeData.experience.length > 0
    )
  }

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <div className={cn(
        'glass-card border-2',
        isComplete() ? 'border-green-500/50' : 'border-yellow-500/50'
      )}>
        <div className="flex items-start gap-4">
          {isComplete() ? (
            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          ) : (
            <FileText className="h-6 w-6 text-yellow-500 flex-shrink-0" />
          )}
          <div>
            <h3 className="font-semibold mb-1">
              {isComplete() ? 'Resume Complete!' : 'Resume Incomplete'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isComplete()
                ? 'Your resume has all required information. You can now save or export it.'
                : 'Please complete the required fields: Full Name, Email, Phone, and at least one Work Experience.'}
            </p>
          </div>
        </div>
      </div>

      {/* Resume Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Resume Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Professional Resume"
          className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Give your resume a descriptive title for easy identification
        </p>
      </div>

      {/* Summary */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-4">Resume Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Template:</span>
            <span className="font-medium">{resumeData.templateId || 'Classic'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Contact Info:</span>
            <span className="font-medium">
              {resumeData.personalInfo.fullName ? 'Complete' : 'Incomplete'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Work Experience:</span>
            <span className="font-medium">{resumeData.experience.length} entries</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Education:</span>
            <span className="font-medium">{resumeData.education.length} entries</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Skills:</span>
            <span className="font-medium">{resumeData.skills.length} skills</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Projects:</span>
            <span className="font-medium">{resumeData.projects?.length || 0} projects</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Professional Summary:</span>
            <span className="font-medium">{resumeData.summary ? 'Added' : 'Not added'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Actions</h3>

        {/* Save to Dashboard */}
        <button
          onClick={handleSave}
          disabled={saving || !isComplete()}
          className={cn(
            'glass-g2 glass-transition w-full px-6 py-4 rounded-xl font-semibold',
            'hover:scale-105 active:scale-95 flex items-center justify-center gap-3',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              Saved Successfully!
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save to Dashboard
            </>
          )}
        </button>

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleExportPDF}
            disabled={!isComplete()}
            className={cn(
              'glass-g1 glass-transition px-6 py-4 rounded-xl font-medium',
              'hover:scale-105 active:scale-95 flex items-center justify-center gap-2',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            )}
          >
            <Download className="h-5 w-5" />
            Export PDF
          </button>

          <button
            onClick={handleExportDOCX}
            disabled={!isComplete()}
            className={cn(
              'glass-g1 glass-transition px-6 py-4 rounded-xl font-medium',
              'hover:scale-105 active:scale-95 flex items-center justify-center gap-2',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            )}
          >
            <Download className="h-5 w-5" />
            Export DOCX
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="glass-g1 p-4 rounded-xl">
        <h3 className="text-sm font-semibold mb-2">Next Steps:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Save your resume to access it later from your dashboard</li>
          <li>• Export to PDF for most job applications</li>
          <li>• Export to DOCX if you need to make minor edits in Word</li>
          <li>• Review and update your resume regularly</li>
          <li>• Customize your resume for each job application</li>
        </ul>
      </div>
    </div>
  )
}
