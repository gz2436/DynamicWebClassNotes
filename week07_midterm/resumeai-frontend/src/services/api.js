import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await api.post('/chat/message', {
      message,
      conversationHistory,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

// Optimize resume
export const optimizeResume = async (resumeData) => {
  try {
    const response = await api.post('/optimize/resume', {
      resumeData,
    });
    return response.data;
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw error;
  }
};

export default api;
