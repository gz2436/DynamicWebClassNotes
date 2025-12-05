import { NextRequest, NextResponse } from 'next/server'
import { generateWorkDescription, generateSkillsSuggestions, generateProfessionalSummary } from '@/lib/ai/deepseek-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...params } = body

    // Handle full resume generation (new flow from Background step)
    if (!type && params.personalInfo && params.education) {
      const { personalInfo, education, workExperience, projects, jobDescription, aiModel } = params

      // Generate comprehensive resume content using DeepSeek
      const prompt = `Generate a professional resume based on the following information:

Personal Information:
- Name: ${personalInfo.fullName}
- Email: ${personalInfo.email}
- Phone: ${personalInfo.phone}
- Location: ${personalInfo.location || 'N/A'}

Education:
- Degree: ${education.degree} in ${education.major}
- University: ${education.university}
- Graduation Year: ${education.graduationYear}
${education.gpa ? `- GPA: ${education.gpa}` : ''}

${workExperience ? `Work Experience:\n${workExperience}\n` : ''}
${projects ? `Projects:\n${projects}\n` : ''}
${jobDescription ? `Target Job Description:\n${jobDescription}\n` : ''}

Please generate:
1. A professional summary (2-3 sentences)
2. Enhanced work experience bullets (if provided)
3. Enhanced project descriptions (if provided)
4. Suggested skills based on the information

Format the response as JSON with keys: summary, workExperience, projects, skills`

      // Use DeepSeek for all AI models (as requested)
      const summary = await generateProfessionalSummary(
        jobDescription || 'General Position',
        0,  // Years of experience (0 for entry-level)
        [education.major, education.degree]
      )

      return NextResponse.json({
        content: {
          summary,
          aiModel: aiModel, // Track which button was clicked
          generatedAt: new Date().toISOString(),
        },
      })
    }

    // Handle individual generation types (existing flow)
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
