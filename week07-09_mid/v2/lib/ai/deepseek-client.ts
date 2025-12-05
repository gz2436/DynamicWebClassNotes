import OpenAI from 'openai'

// Lazy initialization to avoid build errors when env vars are not set
let deepseekClient: OpenAI | null = null

function getDeepSeekClient() {
  if (!deepseekClient) {
    deepseekClient = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || 'placeholder-key-for-build',
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    })
  }
  return deepseekClient
}

export async function generateWorkDescription(
  position: string,
  company: string,
  responsibilities: string
): Promise<string[]> {
  try {
    const deepseek = getDeepSeekClient()
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Generate compelling, ATS-optimized bullet points for work experience. Use action verbs and quantify achievements when possible. Return 3-5 bullet points.',
        },
        {
          role: 'user',
          content: `Position: ${position}\nCompany: ${company}\nResponsibilities: ${responsibilities}\n\nGenerate professional bullet points for this role.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content || ''
    // Parse bullet points from response
    const bullets = content
      .split('\n')
      .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map((line) => line.replace(/^[-•]\s*/, '').trim())
      .filter((line) => line.length > 0)

    return bullets.length > 0 ? bullets : [content]
  } catch (error) {
    console.error('Error generating work description:', error)
    throw new Error('Failed to generate work description')
  }
}

export async function generateSkillsSuggestions(
  position: string,
  experience: string[]
): Promise<string[]> {
  try {
    const deepseek = getDeepSeekClient()
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a career advisor. Suggest relevant skills based on the job position and experience. Return a comma-separated list of 10-15 skills.',
        },
        {
          role: 'user',
          content: `Position: ${position}\nExperience: ${experience.join(', ')}\n\nSuggest relevant skills for this professional.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const content = response.choices[0]?.message?.content || ''
    const skills = content
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)

    return skills
  } catch (error) {
    console.error('Error generating skills:', error)
    throw new Error('Failed to generate skills')
  }
}

export async function generateProfessionalSummary(
  position: string,
  yearsOfExperience: number,
  keySkills: string[]
): Promise<string> {
  try {
    const deepseek = getDeepSeekClient()
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Write a compelling professional summary in 2-3 sentences. Be concise and impactful.',
        },
        {
          role: 'user',
          content: `Position: ${position}\nYears of Experience: ${yearsOfExperience}\nKey Skills: ${keySkills.join(', ')}\n\nWrite a professional summary.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return response.choices[0]?.message?.content?.trim() || ''
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate summary')
  }
}

export async function optimizeForATS(resumeText: string): Promise<string[]> {
  try {
    const deepseek = getDeepSeekClient()
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an ATS (Applicant Tracking System) expert. Analyze the resume and provide 3-5 specific suggestions to improve ATS compatibility and keyword optimization.',
        },
        {
          role: 'user',
          content: `Resume:\n${resumeText}\n\nProvide ATS optimization suggestions.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    })

    const content = response.choices[0]?.message?.content || ''
    const suggestions = content
      .split('\n')
      .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim()))
      .map((line) => line.replace(/^[-•\d.]\s*/, '').trim())
      .filter((line) => line.length > 0)

    return suggestions
  } catch (error) {
    console.error('Error optimizing for ATS:', error)
    throw new Error('Failed to optimize for ATS')
  }
}
