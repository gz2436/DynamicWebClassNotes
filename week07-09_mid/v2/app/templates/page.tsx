'use client'

import { ResumeTemplates } from '@/components/resume-templates/ResumeTemplates'
import { getDefaultSettings } from '@/components/resume-templates/data-adapter'

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

// Sample resume data - Standard one-page format
const sampleResume = {
  profile: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'New York, NY',
    url: 'linkedin.com/in/sarahjohnson',
    summary: 'Results-driven Product Manager with 5+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of increasing user engagement and revenue growth.',
  },
  workExperiences: [
    {
      company: 'TechCorp Inc.',
      jobTitle: 'Senior Product Manager',
      date: '2022 - Present',
      descriptions: [
        'Led product strategy for flagship SaaS platform serving 50K+ users, increasing MRR by 40%',
        'Managed cross-functional team of 12 engineers and designers through full product lifecycle',
        'Launched 3 major features that improved user retention by 25%',
      ],
    },
    {
      company: 'StartupXYZ',
      jobTitle: 'Product Manager',
      date: '2020 - 2022',
      descriptions: [
        'Defined product roadmap and prioritized features based on user research and analytics',
        'Collaborated with engineering to ship bi-weekly releases with 99.9% uptime',
        'Increased conversion rate by 18% through A/B testing and optimization',
      ],
    },
  ],
  educations: [
    {
      school: 'Stanford University',
      degree: 'MBA in Technology Management',
      date: '2018 - 2020',
      gpa: '3.8',
      descriptions: [],
    },
    {
      school: 'UC Berkeley',
      degree: 'BS in Computer Science',
      date: '2014 - 2018',
      gpa: '3.7',
      descriptions: [],
    },
  ],
  projects: [],
  skills: {
    featuredSkills: [
      { skill: 'Product Strategy', rating: 5 },
      { skill: 'Agile/Scrum', rating: 5 },
      { skill: 'Data Analysis', rating: 4 },
      { skill: 'User Research', rating: 4 },
    ],
    descriptions: [
      'Technical: SQL, Python, Tableau, Google Analytics, Mixpanel',
      'Product: JIRA, Figma, Miro, Product Roadmapping, A/B Testing',
      'Leadership: Team Management, Stakeholder Communication, OKRs',
    ],
  },
  custom: {
    descriptions: [],
  },
}

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Resume Templates</h1>
        <p className="text-xl text-muted-foreground">
          8 Professional Templates - Click to Preview
        </p>
      </div>

      {/* Templates Grid - 4 PER ROW, 2 ROWS */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="cursor-pointer group transition-all duration-300"
          >
            {/* Template Screenshot - ONE PAGE, NO SCROLL */}
            <div className="aspect-[8.5/11] overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all bg-white border border-gray-200">
              <ResumeTemplates
                resume={sampleResume}
                settings={getDefaultSettings(template.color)}
                templateId={template.id}
                scale={0.38}
              />
            </div>

            {/* Template Name Below Screenshot */}
            <h3 className="text-sm font-semibold mt-3 text-center">{template.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
