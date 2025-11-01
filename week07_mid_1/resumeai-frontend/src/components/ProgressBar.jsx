import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ currentSection, totalSections, currentQuestion, totalQuestions }) => {
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="progress-section">{currentSection}</span>
        <span className="progress-count">
          {currentQuestion} / {totalQuestions}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
