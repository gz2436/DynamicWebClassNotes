const express = require('express');
const router = express.Router();
const { generateResponse } = require('../config/deepseek');

router.post('/resume', async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // Build the optimization prompt
    const messages = [
      {
        role: 'system',
        content: 'You are an expert resume writer and career coach. Your task is to analyze resumes and provide specific, actionable suggestions for improvement. Focus on making the resume more professional, ATS-friendly, and impactful.'
      },
      {
        role: 'user',
        content: `Please analyze this resume and provide specific suggestions for improvement:

Name: ${resumeData.contact?.fullName || 'Not provided'}
Email: ${resumeData.contact?.email || 'Not provided'}
Phone: ${resumeData.contact?.phone || 'Not provided'}
Location: ${resumeData.contact?.location || 'Not provided'}

Professional Summary:
${resumeData.summary || 'Not provided'}

Work Experience:
${resumeData.experience?.length > 0
  ? resumeData.experience.map((exp, i) => `
${i + 1}. ${exp.title} at ${exp.company} (${exp.duration})
   ${exp.description}
`).join('\n')
  : 'No experience listed'}

Education:
${resumeData.education?.degree ? `${resumeData.education.degree} in ${resumeData.education.major || 'N/A'} from ${resumeData.education.school} (${resumeData.education.graduationYear})` : 'Not provided'}

Skills:
${resumeData.skills?.length > 0 ? resumeData.skills.join(', ') : 'Not provided'}

Please provide:
1. Overall assessment (2-3 sentences)
2. Specific suggestions for improving the professional summary
3. Suggestions for better describing work experience (use action verbs, quantify achievements)
4. Skills that might be missing based on their experience
5. Any formatting or structural improvements

Format your response in clear sections with headers.`
      }
    ];

    const optimizationSuggestions = await generateResponse(messages);

    res.json({
      success: true,
      suggestions: optimizationSuggestions
    });

  } catch (error) {
    console.error('Error optimizing resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize resume',
      error: error.message
    });
  }
});

module.exports = router;
