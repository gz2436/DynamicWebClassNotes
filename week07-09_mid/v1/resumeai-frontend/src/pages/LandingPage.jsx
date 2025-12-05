import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          ResumeAI
        </div>
        <button className="cta-button" onClick={() => navigate('/builder')}>
          Login
        </button>
      </header>

      <section className="hero-section">
        <div className="hero-logo-large"></div>
        <h1 className="hero-title">
          Build Your Perfect Resume
          <span className="gradient-text">Powered by AI</span>
        </h1>
        <p className="hero-subtitle">
          Create professional, ATS-friendly resumes in minutes with our AI-powered resume builder
        </p>
        <button className="cta-button-large" onClick={() => navigate('/builder')}>
          CREATE NOW
        </button>
      </section>

      <section className="features-section">
        <h2>Why Choose ResumeAI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI-Powered Content</h3>
            <p>Let AI craft professional content tailored to your experience</p>
          </div>
          <div className="feature-card">
            <h3>Fast & Easy</h3>
            <p>Create your resume in minutes through conversational AI</p>
          </div>
          <div className="feature-card">
            <h3>ATS-Friendly</h3>
            <p>Professional templates optimized for applicant tracking systems</p>
          </div>
          <div className="feature-card">
            <h3>Download PDF</h3>
            <p>Export your resume as a high-quality PDF file</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
