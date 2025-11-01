import { Template } from '../types/resume'

export const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional layout perfect for corporate environments',
    category: 'Professional',
    atsScore: 98,
    preview: '/templates/classic.png',
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean and contemporary design for tech professionals',
    category: 'Modern',
    atsScore: 95,
    preview: '/templates/modern.png',
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    description: 'Stand out with this design-forward template',
    category: 'Creative',
    atsScore: 88,
    preview: '/templates/creative.png',
  },
  {
    id: 'technical',
    name: 'Technical Engineer',
    description: 'Optimized for software engineers and developers',
    category: 'Technical',
    atsScore: 97,
    preview: '/templates/technical.png',
  },
  {
    id: 'executive',
    name: 'Executive Elite',
    description: 'Premium design for senior leadership positions',
    category: 'Professional',
    atsScore: 96,
    preview: '/templates/executive.png',
  },
  {
    id: 'minimal',
    name: 'Ultra Minimal',
    description: 'Let your achievements speak with this clean layout',
    category: 'Minimal',
    atsScore: 99,
    preview: '/templates/minimal.png',
  },
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}
