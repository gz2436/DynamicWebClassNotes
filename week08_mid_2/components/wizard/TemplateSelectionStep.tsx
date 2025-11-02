'use client'

import { useState, useMemo, useRef } from 'react'
import { useWizard } from '@/lib/context/wizard-context'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react'
import { ResumeTemplates } from '@/components/resume-templates/ResumeTemplates'
import { convertWizardDataToResume, getDefaultSettings } from '@/components/resume-templates/data-adapter'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const templates = [
  { id: 'classic', name: 'Classic', color: '#2563eb' },
  { id: 'modern', name: 'Modern', color: '#8b5cf6' },
  { id: 'technical', name: 'Technical', color: '#10b981' },
  { id: 'executive', name: 'Executive', color: '#f59e0b' },
  { id: 'creative', name: 'Creative', color: '#ec4899' },
  { id: 'minimal', name: 'Minimal', color: '#6b7280' },
  { id: 'academic', name: 'Academic', color: '#1e40af' },
  { id: 'professional', name: 'Professional', color: '#0891b2' },
]

export default function TemplateSelectionStep() {
  const { wizardData, goToPreviousStep } = useWizard()
  const { t } = useLanguage()
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)

  const handlePrevTemplate = () => {
    setSelectedTemplate((prev) => (prev > 0 ? prev - 1 : templates.length - 1))
  }

  const handleNextTemplate = () => {
    setSelectedTemplate((prev) => (prev < templates.length - 1 ? prev + 1 : 0))
  }

  // Convert wizard data to resume format
  const resumeData = useMemo(
    () => convertWizardDataToResume(wizardData),
    [wizardData]
  )

  const settings = useMemo(
    () => getDefaultSettings(templates[selectedTemplate].color),
    [selectedTemplate]
  )

  const handleExportPDF = async () => {
    if (!resumeRef.current) return

    setIsExporting(true)
    try {
      // Create a temporary container for export
      const exportContainer = document.createElement('div')
      exportContainer.style.position = 'absolute'
      exportContainer.style.left = '-9999px'
      exportContainer.style.top = '0'
      exportContainer.style.width = '816px' // A4 width at 96 DPI
      exportContainer.style.background = 'white'
      document.body.appendChild(exportContainer)

      // Render the resume at full scale for export
      const root = await import('react-dom/client')
      const reactRoot = root.createRoot(exportContainer)

      await new Promise<void>((resolve) => {
        reactRoot.render(
          <div style={{ width: '816px', background: 'white', padding: '40px' }}>
            <ResumeTemplates
              resume={resumeData}
              settings={{...settings, fontSize: settings.fontSize * 1.2}}
              templateId={templates[selectedTemplate].id}
              scale={1}
            />
          </div>
        )
        setTimeout(resolve, 500) // Wait for render
      })

      // Convert to canvas
      const canvas = await html2canvas(exportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      // Download
      const fileName = `${wizardData.fullName || 'Resume'}_${templates[selectedTemplate].name}.pdf`
      pdf.save(fileName)

      // Cleanup
      reactRoot.unmount()
      document.body.removeChild(exportContainer)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="w-full mx-auto animate-in fade-in duration-500">
      {/* LaTeX-Style Dual Pane Layout - Desktop */}
      <div className="hidden lg:grid lg:grid-cols-[1.2fr,1fr] gap-4 mb-6 max-w-[95vw] mx-auto px-2">
        {/* Left: Editable Content - More Compact */}
        <div className="glass-g2 rounded-lg p-4 shadow-xl h-[calc(100vh-180px)] overflow-y-auto">
          <div className="space-y-4">
            {/* Basic Info Section - Compact */}
            <div className="glass-g1 rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wide">{t.templateSelection.sections.contact}</h4>
              <div className="space-y-1 text-xs">
                <p className="flex justify-between"><span className="text-muted-foreground">{t.templateSelection.labels.name}</span> <span className="font-medium">{wizardData.fullName}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">{t.templateSelection.labels.email}</span> <span className="font-medium">{wizardData.email}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">{t.templateSelection.labels.phone}</span> <span className="font-medium">{wizardData.phone}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">{t.templateSelection.labels.location}</span> <span className="font-medium">{wizardData.location}</span></p>
              </div>
            </div>

            {/* Education Section - Compact */}
            <div className="glass-g1 rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wide">{t.templateSelection.sections.education}</h4>
              {wizardData.university ? (
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold">{wizardData.degree}</p>
                  <p className="text-muted-foreground">{wizardData.major}</p>
                  <p className="text-muted-foreground">{wizardData.university}</p>
                  <p className="text-muted-foreground">{wizardData.graduationYear}{wizardData.gpa && ` • GPA: ${wizardData.gpa}`}</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">{t.templateSelection.labels.notProvided}</p>
              )}
            </div>

            {/* Work Experience Section - Compact */}
            {wizardData.workSummary && (
              <div className="glass-g1 rounded-lg p-3">
                <h4 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wide">{t.templateSelection.sections.experience}</h4>
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{wizardData.workSummary}</p>
              </div>
            )}

            {/* Projects Section - Compact */}
            {wizardData.projectsSummary && (
              <div className="glass-g1 rounded-lg p-3">
                <h4 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wide">{t.templateSelection.sections.projects}</h4>
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{wizardData.projectsSummary}</p>
              </div>
            )}

            {/* Job Description Section - Compact */}
            {wizardData.jobDescription && (
              <div className="glass-g1 rounded-lg p-3">
                <h4 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wide">{t.templateSelection.sections.targetRole}</h4>
                <p className="text-xs whitespace-pre-wrap line-clamp-4 leading-relaxed">{wizardData.jobDescription}</p>
              </div>
            )}

            {/* Links - Compact */}
            {(wizardData.linkedin || wizardData.github || wizardData.portfolio) && (
              <div className="glass-g1 rounded-lg p-3">
                <h4 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wide">{t.templateSelection.sections.links}</h4>
                <div className="space-y-1 text-xs">
                  {wizardData.linkedin && <p className="truncate text-muted-foreground">{t.templateSelection.labels.linkedin}: {wizardData.linkedin}</p>}
                  {wizardData.github && <p className="truncate text-muted-foreground">{t.templateSelection.labels.github}: {wizardData.github}</p>}
                  {wizardData.portfolio && <p className="truncate text-muted-foreground">{t.templateSelection.labels.portfolio}: {wizardData.portfolio}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Real-time Preview - Wider */}
        <div className="glass-g2 rounded-lg p-3 shadow-xl h-[calc(100vh-180px)] overflow-y-auto flex flex-col">
          {/* A4 Preview Container - Fills available space */}
          <div
            ref={resumeRef}
            className="w-full rounded-lg shadow-2xl overflow-hidden bg-white"
            style={{
              aspectRatio: '1 / 1.414', // A4 ratio
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ backgroundColor: '#ffffff', width: '100%', height: '100%' }}>
              <ResumeTemplates
                resume={resumeData}
                settings={{...settings, fontSize: settings.fontSize * 1.5}}
                templateId={templates[selectedTemplate].id}
                scale={0.85}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Single Column Preview */}
      <div className="lg:hidden mb-8 max-w-2xl mx-auto">
        <div
          ref={resumeRef}
          className="w-full rounded-xl shadow-lg overflow-hidden bg-white"
          style={{
            aspectRatio: '1 / 1.414',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ backgroundColor: '#ffffff', width: '100%', height: '100%' }}>
            <ResumeTemplates
              resume={resumeData}
              settings={{...settings, fontSize: settings.fontSize * 1.5}}
              templateId={templates[selectedTemplate].id}
              scale={0.85}
            />
          </div>
        </div>

        {/* Mobile: Left/Right Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevTemplate}
            className="glass-g1 glass-transition h-12 w-12 rounded-full flex items-center justify-center hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="text-sm text-muted-foreground">
            {selectedTemplate + 1} / {templates.length}
          </span>
          <button
            onClick={handleNextTemplate}
            className="glass-g1 glass-transition h-12 w-12 rounded-full flex items-center justify-center hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Template Selection Gallery - Horizontal, No Frame */}
      <div className="mb-8 max-w-7xl mx-auto px-4">
        <div className="flex gap-6 justify-center flex-wrap">
          {templates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(index)}
              className="group relative transition-all duration-300"
            >
              {/* Template Thumbnail - Larger Size */}
              <div className={cn(
                'w-36 h-48 overflow-hidden rounded-xl bg-white transition-all duration-300',
                'hover:scale-110 hover:z-10 hover:shadow-2xl',
                selectedTemplate === index
                  ? 'shadow-2xl scale-110 ring-4 ring-primary/50'
                  : 'shadow-md border-2 border-gray-200 opacity-70 hover:opacity-100'
              )}>
                <ResumeTemplates
                  resume={resumeData}
                  settings={getDefaultSettings(template.color)}
                  templateId={template.id}
                  scale={0.12}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="glass-g2 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">{t.templateSelection.export.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={cn(
                'glass-g1 glass-transition px-6 py-4 rounded-full',
                'flex items-center justify-center gap-3',
                'hover:scale-105 active:scale-95 font-semibold',
                isExporting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t.templateSelection.export.generatingPDF}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  {t.templateSelection.export.downloadPDF}
                </>
              )}
            </button>
            <button
              onClick={() => alert('DOCX export coming soon!')}
              className={cn(
                'glass-g1 glass-transition px-6 py-4 rounded-full',
                'flex items-center justify-center gap-3',
                'hover:scale-105 active:scale-95 font-semibold',
                'opacity-60 cursor-not-allowed'
              )}
              disabled
            >
              <Download className="h-5 w-5" />
              {t.templateSelection.export.exportDOCX}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation - Back Button Only */}
      <div className="flex justify-start max-w-7xl mx-auto">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={isExporting}
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
    </div>
  )
}
