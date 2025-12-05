import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ProgressBar from '../components/ProgressBar';
import { sendChatMessage } from '../services/api';
import QuestionFlowManager from '../utils/questionFlowManager';
import { initialResumeData, resumeSections, getTotalQuestions } from '../utils/resumeQuestions';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [flowManager] = useState(() => new QuestionFlowManager());
  const [currentExperience, setCurrentExperience] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    const currentQuestion = flowManager.getCurrentQuestion();
    const initialMessage = {
      text: `Hi! I'm your AI resume assistant. I'll help you create a professional resume by asking you a series of questions. Let's get started!\n\n${currentQuestion.question}`,
      isUser: false,
    };
    setMessages([initialMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save resume data whenever it changes
  useEffect(() => {
    if (resumeData && (resumeData.contact.fullName || resumeData.summary || resumeData.experience.length > 0)) {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
  }, [resumeData]);

  const processAnswer = (answer, question) => {
    const currentSection = flowManager.getCurrentSection();

    switch (currentSection) {
      case resumeSections.CONTACT:
        setResumeData(prev => ({
          ...prev,
          contact: {
            ...prev.contact,
            [question.field]: answer
          }
        }));
        break;

      case resumeSections.SUMMARY:
        setResumeData(prev => ({
          ...prev,
          summary: answer
        }));
        break;

      case resumeSections.EXPERIENCE:
        if (question.id === 'hasExperience') {
          if (answer.toLowerCase().includes('yes')) {
            flowManager.startExperienceCollection();
          } else {
            flowManager.stopExperienceCollection();
          }
        } else if (question.id === 'anotherJob') {
          if (answer.toLowerCase().includes('yes')) {
            // Save current experience and prepare for next one
            setResumeData(prev => ({
              ...prev,
              experience: [...prev.experience, currentExperience]
            }));
            setCurrentExperience({});
          } else {
            // Save final experience and move to next section
            setResumeData(prev => ({
              ...prev,
              experience: [...prev.experience, currentExperience]
            }));
            setCurrentExperience({});
            flowManager.stopExperienceCollection();
          }
        } else if (question.repeatable) {
          setCurrentExperience(prev => ({
            ...prev,
            [question.field]: answer
          }));
        }
        break;

      case resumeSections.EDUCATION:
        setResumeData(prev => ({
          ...prev,
          education: {
            ...prev.education,
            [question.field]: answer
          }
        }));
        break;

      case resumeSections.SKILLS:
        const skillsArray = answer.split(',').map(skill => skill.trim());
        setResumeData(prev => ({
          ...prev,
          skills: skillsArray
        }));
        break;

      default:
        break;
    }
  };

  const handleSendMessage = async (userMessage) => {
    // Add user message
    const newUserMessage = { text: userMessage, isUser: true };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const currentQuestion = flowManager.getCurrentQuestion();

      // Process and store the answer
      processAnswer(userMessage, currentQuestion);

      // Move to next question
      const nextQuestion = flowManager.getNextQuestion();

      if (flowManager.isComplete()) {
        // Show completion message
        const completionMessage = {
          text: "Perfect! I've collected all your information. Your resume is ready! Click the 'View Resume' button below to see your professional resume.",
          isUser: false,
        };
        setMessages((prev) => [...prev, completionMessage]);
        setIsComplete(true);
      } else {
        // Ask next question with AI enhancement
        const conversationHistory = messages.slice(-4).map((msg) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text,
        }));

        // Add context about the question flow
        const systemContext = {
          role: 'system',
          content: `You are helping collect resume information. The next question to ask is: "${nextQuestion.question}". You can rephrase it naturally or add encouraging comments, but make sure to ask this question.`
        };

        const response = await sendChatMessage(userMessage, [systemContext, ...conversationHistory]);

        // Add AI response with next question
        const aiMessage = { text: response.message, isUser: false };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);

      // Fallback: ask next question directly without AI enhancement
      const nextQuestion = flowManager.getCurrentQuestion();
      if (nextQuestion) {
        const fallbackMessage = {
          text: nextQuestion.question,
          isUser: false,
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getSectionName = (section) => {
    const sectionNames = {
      [resumeSections.CONTACT]: 'Contact Info',
      [resumeSections.SUMMARY]: 'Professional Summary',
      [resumeSections.EXPERIENCE]: 'Work Experience',
      [resumeSections.EDUCATION]: 'Education',
      [resumeSections.SKILLS]: 'Skills',
      [resumeSections.COMPLETE]: 'Complete'
    };
    return sectionNames[section] || '';
  };

  const totalQuestions = getTotalQuestions();
  const currentQuestionNum = flowManager.getCurrentQuestionNumber();

  return (
    <div className="resume-builder">
      <header className="builder-header">
        <div className="builder-logo" onClick={() => navigate('/')}>
          <div className="logo-icon-small"></div>
          <span>ResumeAI</span>
        </div>

        {!isComplete && (
          <ProgressBar
            currentSection={getSectionName(flowManager.getCurrentSection())}
            totalSections={5}
            currentQuestion={currentQuestionNum}
            totalQuestions={totalQuestions}
          />
        )}

        <button className="exit-button" onClick={() => navigate('/')}>
          Exit
        </button>
      </header>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
          ))}
          {isLoading && (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isComplete && <ChatInput onSend={handleSendMessage} disabled={isLoading} />}

        {isComplete && (
          <div className="completion-actions">
            <button className="view-resume-button" onClick={() => navigate('/preview')}>
              View Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
