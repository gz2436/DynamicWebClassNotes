import { NextRequest, NextResponse } from 'next/server'
import { generateWorkDescription, generateSkillsSuggestions, generateProfessionalSummary } from '@/lib/ai/deepseek-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...params } = body

    switch (type) {
      case 'work-description': {
        const { position, company, responsibilities } = params
        const bullets = await generateWorkDescription(position, company, responsibilities)
        return NextResponse.json({ bullets })
      }

      case 'skills': {
        const { position, experience } = params
        const skills = await generateSkillsSuggestions(position, experience)
        return NextResponse.json({ skills })
      }

      case 'summary': {
        const { position, yearsOfExperience, keySkills } = params
        const summary = await generateProfessionalSummary(position, yearsOfExperience, keySkills)
        return NextResponse.json({ summary })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid generation type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
