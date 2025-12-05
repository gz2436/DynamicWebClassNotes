'use client'

import { Resume, Settings } from './types'

interface Props {
  resume: Resume
  settings: Settings
  scale?: number
}

export function ResumeHTMLPreview({ resume, settings, scale = 0.5 }: Props) {
  const { profile, workExperiences, educations } = resume
  const { themeColor, fontFamily, fontSize } = settings

  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: `${100 / scale}%`,
  }

  const baseStyle = {
    fontFamily: fontFamily || 'sans-serif',
    fontSize: `${fontSize}px`,
    lineHeight: '1.5',
    color: '#1f2937',
    backgroundColor: 'white',
    padding: '40px',
  }

  return (
    <div style={containerStyle}>
      <div style={baseStyle} className="shadow-lg">
        {/* Header Section */}
        <div style={{ marginBottom: '24px', borderBottom: `3px solid ${themeColor}`, paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: themeColor }}>
            {profile.name}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: '#6b7280' }}>
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>{profile.phone}</span>}
            {profile.location && <span>{profile.location}</span>}
            {profile.url && <span style={{ color: themeColor }}>{profile.url}</span>}
          </div>
        </div>

        {/* Work Experience Section */}
        {settings.formToShow.workExperiences && workExperiences.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: themeColor, marginBottom: '12px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '4px' }}>
              {settings.formToHeading.workExperiences}
            </h2>
            {workExperiences.map((work, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div>
                    <strong style={{ fontSize: '13px' }}>{work.jobTitle}</strong>
                    <span style={{ marginLeft: '8px', fontSize: '12px', color: '#6b7280' }}>{work.company}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>{work.date}</span>
                </div>
                <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                  {work.descriptions.map((desc, i) => (
                    <li key={i} style={{ fontSize: '11px', marginBottom: '2px', color: '#4b5563' }}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {settings.formToShow.educations && educations.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: themeColor, marginBottom: '12px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '4px' }}>
              {settings.formToHeading.educations}
            </h2>
            {educations.map((edu, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div>
                    <strong style={{ fontSize: '13px' }}>{edu.school}</strong>
                    <span style={{ marginLeft: '8px', fontSize: '12px', color: '#6b7280' }}>{edu.degree}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>{edu.date}</span>
                </div>
                {edu.gpa && <div style={{ fontSize: '11px', color: '#6b7280' }}>GPA: {edu.gpa}</div>}
                {edu.descriptions.length > 0 && (
                  <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                    {edu.descriptions.map((desc, i) => (
                      <li key={i} style={{ fontSize: '11px', marginBottom: '2px', color: '#4b5563' }}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
