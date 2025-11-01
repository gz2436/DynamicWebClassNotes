import { Download, FileText, File } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ExportPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Export Your Resume</h1>
        <p className="text-xl text-muted-foreground">
          Download your resume in your preferred format
        </p>
      </div>

      {/* Export Options */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PDF Export */}
        <div className="glass-card glass-transition hover:scale-105 cursor-pointer group">
          <div className="glass-g1 h-16 w-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 glass-transition">
            <FileText className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Export as PDF</h2>
          <p className="text-muted-foreground mb-6">
            Download a pixel-perfect PDF that looks great everywhere.
            Best for online applications and email submissions.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Universal compatibility
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Preserves formatting
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Ready to print
            </li>
          </ul>
          <button
            className={cn(
              'w-full glass-g2 glass-transition',
              'px-6 py-3 rounded-xl font-semibold',
              'flex items-center justify-center gap-2',
              'hover:scale-105 active:scale-95'
            )}
          >
            <Download className="h-5 w-5" />
            Download PDF
          </button>
        </div>

        {/* DOCX Export */}
        <div className="glass-card glass-transition hover:scale-105 cursor-pointer group">
          <div className="glass-g1 h-16 w-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 glass-transition">
            <File className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Export as DOCX</h2>
          <p className="text-muted-foreground mb-6">
            Download an editable Word document for further customization.
            Perfect for company-specific applications.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Fully editable
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Microsoft Word compatible
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
              Easy customization
            </li>
          </ul>
          <button
            className={cn(
              'w-full glass-g2 glass-transition',
              'px-6 py-3 rounded-xl font-semibold',
              'flex items-center justify-center gap-2',
              'hover:scale-105 active:scale-95'
            )}
          >
            <Download className="h-5 w-5" />
            Download DOCX
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Preview</h2>
        <div className="glass-card">
          <div className="glass-g1 aspect-[8.5/11] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Your resume preview will appear here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-4">Export Tips</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <div className="glass-g1 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <span>
                <strong className="text-foreground">PDF for most applications:</strong> Use PDF when
                submitting your resume online or via email to ensure formatting stays intact.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="glass-g1 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <span>
                <strong className="text-foreground">DOCX for customization:</strong> Download DOCX if
                you need to make company-specific changes or if the employer specifically requests this format.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="glass-g1 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <span>
                <strong className="text-foreground">File naming:</strong> We recommend naming your file
                as &quot;FirstName_LastName_Resume.pdf&quot; for professional presentation.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
