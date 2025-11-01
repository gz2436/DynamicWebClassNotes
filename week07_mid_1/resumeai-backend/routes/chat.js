const express = require('express');
const router = express.Router();
const { generateResponse } = require('../config/deepseek');

// Chat endpoint for resume generation
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build messages array for DeepSeek API
    const messages = [];

    // Add system message
    messages.push({
      role: 'system',
      content: 'You are a professional resume assistant. Help users create excellent resumes by asking questions and collecting information in a structured way.'
    });

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Generate response using DeepSeek
    const text = await generateResponse(messages);

    res.json({
      success: true,
      message: text
    });

  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

module.exports = router;
