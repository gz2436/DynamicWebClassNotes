import React from 'react';
import '../styles/ResumeTemplate.css';

const ResumeTemplate = ({ resumeData }) => {
  const { contact, summary, experience, education, skills } = resumeData;

  return (
    <div className="resume-template">
      {/* Header Section */}
      <header className="resume-header">
        <h1 className="resume-name">{contact.fullName || 'Your Name'}</h1>
        <div className="resume-contact-info">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="resume-section">
          <h2 className="resume-section-title">Professional Summary</h2>
          <p className="resume-summary">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Work Experience</h2>
          {experience.map((job, index) => (
            <div key={index} className="resume-experience-item">
              <div className="experience-header">
                <div>
                  <h3 className="experience-title">{job.title}</h3>
                  <p className="experience-company">{job.company}</p>
                </div>
                <span className="experience-duration">{job.duration}</span>
              </div>
              <p className="experience-description">{job.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.degree && (
        <section className="resume-section">
          <h2 className="resume-section-title">Education</h2>
          <div className="resume-education-item">
            <div className="education-header">
              <div>
                <h3 className="education-degree">{education.degree}</h3>
                <p className="education-school">{education.school}</p>
              </div>
              <span className="education-year">{education.graduationYear}</span>
            </div>
            {education.major && (
              <p className="education-major">Major: {education.major}</p>
            )}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Skills</h2>
          <div className="resume-skills">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumeTemplate;
