import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeTemplate from '../components/ResumeTemplate';
import { optimizeResume } from '../services/api';
import '../styles/ResumePreview.css';

const ResumePreview = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [showOptimization, setShowOptimization] = useState(false);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Load resume data from localStorage
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    } else {
      // No data found, redirect to builder
      navigate('/builder');
    }
  }, [navigate]);

  if (!resumeData) {
    return (
      <div className="preview-loading">
        <p>Loading your resume...</p>
      </div>
    );
  }

  const handleEdit = () => {
    navigate('/builder');
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? This will delete your current resume data.')) {
      localStorage.removeItem('resumeData');
      navigate('/builder');
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setShowOptimization(true);
    try {
      const result = await optimizeResume(resumeData);
      setOptimizationSuggestions(result.suggestions);
    } catch (error) {
      setOptimizationSuggestions('Failed to get optimization suggestions. Please try again later.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="resume-preview-page">
      <header className="preview-header no-print">
        <div className="preview-logo" onClick={() => navigate('/')}>
          <div className="logo-icon-small"></div>
          <span>ResumeAI</span>
        </div>
        <div className="preview-actions">
          <button className="preview-button" onClick={handleOptimize} disabled={isOptimizing}>
            {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
          </button>
          <button className="preview-button" onClick={handleEdit}>
            Edit
          </button>
          <button className="preview-button" onClick={handleExportPDF}>
            Export PDF
          </button>
          <button className="preview-button secondary" onClick={handleStartOver}>
            Start Over
          </button>
        </div>
      </header>

      <div className="preview-container">
        <div className="preview-layout">
          <div className="resume-section-wrapper">
            <ResumeTemplate resumeData={resumeData} />
          </div>

          {showOptimization && (
            <div className="optimization-panel no-print">
              <div className="optimization-header">
                <h2>AI Suggestions</h2>
                <button
                  className="close-button"
                  onClick={() => setShowOptimization(false)}
                >
                  ×
                </button>
              </div>
              <div className="optimization-content">
                {isOptimizing ? (
                  <div className="loading-suggestions">
                    <div className="spinner"></div>
                    <p>Analyzing your resume...</p>
                  </div>
                ) : (
                  <div className="suggestions-text">
                    {optimizationSuggestions}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
