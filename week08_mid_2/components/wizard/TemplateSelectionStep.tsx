'use client'

import { useState, useMemo, useRef } from 'react'
import { useWizard } from '@/lib/context/wizard-context'
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
  const { wizardData } = useWizard()
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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Resume preview area - FULL BACKGROUND COVERAGE */}
      <div className="mb-8">
        {/* Real Resume Preview - A4 ASPECT RATIO, FULL WHITE BACKGROUND */}
        <div
          ref={resumeRef}
          className="w-full max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden bg-white"
          style={{
            aspectRatio: '1 / 1.414', // A4 ratio (210mm x 297mm)
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

        {/* 移动端：左右切换按钮 */}
        <div className="flex md:hidden items-center justify-between mb-4">
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

      {/* Desktop: Horizontal template thumbnail gallery */}
      <div className="hidden md:block mb-8">
        <div className="flex gap-4 justify-center flex-wrap max-w-5xl mx-auto">
          {templates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(index)}
              className="group relative transition-all duration-300"
            >
              {/* Template Thumbnail - Consistent Scale on Hover & Selected */}
              <div className={cn(
                'w-24 h-32 overflow-hidden rounded-lg bg-white transition-all duration-300',
                'hover:scale-105 hover:z-10 hover:shadow-xl hover:opacity-100',
                selectedTemplate === index
                  ? 'shadow-lg scale-105 opacity-100'
                  : 'shadow-sm border border-gray-200 opacity-60'
              )}>
                <ResumeTemplates
                  resume={resumeData}
                  settings={getDefaultSettings(template.color)}
                  templateId={template.id}
                  scale={0.08}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="glass-g2 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Export Resume</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download PDF
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
            Export DOCX (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  )
}
