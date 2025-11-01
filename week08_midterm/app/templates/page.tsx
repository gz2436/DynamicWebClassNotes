import { FileText, Star, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const templates = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional layout perfect for corporate environments',
    category: 'Professional',
    atsScore: 98,
    popular: true,
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean and contemporary design for tech professionals',
    category: 'Modern',
    atsScore: 95,
    popular: true,
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    description: 'Stand out with this design-forward template',
    category: 'Creative',
    atsScore: 88,
    popular: false,
  },
  {
    id: 'technical',
    name: 'Technical Engineer',
    description: 'Optimized for software engineers and developers',
    category: 'Technical',
    atsScore: 97,
    popular: true,
  },
  {
    id: 'executive',
    name: 'Executive Elite',
    description: 'Premium design for senior leadership positions',
    category: 'Professional',
    atsScore: 96,
    popular: false,
  },
  {
    id: 'minimal',
    name: 'Ultra Minimal',
    description: 'Let your achievements speak with this clean layout',
    category: 'Minimal',
    atsScore: 99,
    popular: false,
  },
]

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Resume Templates</h1>
        <p className="text-xl text-muted-foreground">
          Choose from our collection of professional, ATS-optimized templates
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="glass-g1 inline-flex gap-2 p-1 rounded-full">
          <button className="px-6 py-2 rounded-full bg-white/20 dark:bg-white/10 font-medium text-sm">
            All Templates
          </button>
          <button className="px-6 py-2 rounded-full hover:bg-white/10 font-medium text-sm glass-transition">
            Professional
          </button>
          <button className="px-6 py-2 rounded-full hover:bg-white/10 font-medium text-sm glass-transition">
            Modern
          </button>
          <button className="px-6 py-2 rounded-full hover:bg-white/10 font-medium text-sm glass-transition">
            Creative
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className="glass-card glass-transition hover:scale-105 cursor-pointer group"
          >
            {/* Template Preview Placeholder */}
            <div className="glass-g1 aspect-[8.5/11] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <FileText className="h-16 w-16 text-muted-foreground/30" />
              {template.popular && (
                <div className="absolute top-3 right-3 glass-g2 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  Popular
                </div>
              )}
            </div>

            {/* Template Info */}
            <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {template.description}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm">
              <span className="glass-g1 px-3 py-1 rounded-full">
                {template.category}
              </span>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">{template.atsScore}% ATS</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              className={cn(
                'w-full mt-4 glass-g2 glass-transition',
                'px-4 py-3 rounded-xl font-medium',
                'opacity-0 group-hover:opacity-100',
                'hover:scale-105 active:scale-95'
              )}
            >
              Use Template
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-4">What does ATS Score mean?</h3>
          <p className="text-muted-foreground">
            ATS (Applicant Tracking System) Score indicates how well your resume will be parsed
            and ranked by automated recruitment systems. A higher score means better compatibility
            with most ATS software used by employers. All our templates are designed to maximize
            your ATS score while maintaining beautiful design.
          </p>
        </div>
      </div>
    </div>
  )
}
