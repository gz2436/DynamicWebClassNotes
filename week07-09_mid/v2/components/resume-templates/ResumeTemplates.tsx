'use client'

import { Resume, Settings } from './types'

interface Props {
  resume: Resume
  settings: Settings
  templateId: string
  scale?: number
}

export function ResumeTemplates({ resume, settings, templateId, scale = 0.5 }: Props) {
  const { profile, workExperiences, educations } = resume
  const { themeColor } = settings

  // Get background color based on template
  const getBackgroundColor = () => {
    if (templateId === 'technical') return '#0a0a0a'
    if (templateId === 'creative') return '#f5f5f5'
    return 'white'
  }

  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: `${100 / scale}%`,
    backgroundColor: getBackgroundColor(), // ← Fix: prevents background color leakage
  }

  // Classic: Traditional single column
  if (templateId === 'classic') {
    return (
      <div style={containerStyle}>
        <div style={{ fontFamily: 'Georgia, serif', padding: '50px', backgroundColor: 'white', fontSize: '11px', lineHeight: '1.6' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: `3px solid ${themeColor}`, paddingBottom: '20px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1a1a1a' }}>{profile.name}</h1>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {profile.email} • {profile.phone} • {profile.location}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: themeColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Experience</h2>
            {workExperiences.map((work, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px' }}>{work.jobTitle}</strong>
                  <span style={{ fontSize: '10px', color: '#666' }}>{work.date}</span>
                </div>
                <div style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '8px', color: '#444' }}>{work.company}</div>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  {work.descriptions.map((desc, j) => (
                    <li key={j} style={{ marginBottom: '4px', fontSize: '11px' }}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: themeColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Education</h2>
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '13px' }}>{edu.school}</strong>
                  <span style={{ fontSize: '10px', color: '#666' }}>{edu.date}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#444' }}>{edu.degree}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Modern: Two-column layout
  if (templateId === 'modern') {
    return (
      <div style={containerStyle}>
        <div style={{ fontFamily: 'sans-serif', display: 'flex', backgroundColor: 'white', fontSize: '10px', lineHeight: '1.5', minHeight: '100%' }}>
          <div style={{ width: '35%', backgroundColor: themeColor, color: 'white', padding: '40px 30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{profile.name}</h1>
            <div style={{ fontSize: '10px', marginBottom: '30px', opacity: 0.9 }}>
              <div style={{ marginBottom: '4px' }}>{profile.email}</div>
              <div style={{ marginBottom: '4px' }}>{profile.phone}</div>
              <div>{profile.location}</div>
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '6px' }}>EDUCATION</h3>
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{edu.school}</div>
                <div style={{ fontSize: '10px', opacity: 0.9 }}>{edu.degree}</div>
                <div style={{ fontSize: '9px', opacity: 0.8 }}>{edu.date}</div>
              </div>
            ))}
          </div>

          <div style={{ width: '65%', padding: '40px 35px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: themeColor, marginBottom: '16px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '8px' }}>EXPERIENCE</h2>
            {workExperiences.map((work, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12px', color: '#1a1a1a' }}>{work.jobTitle}</strong>
                  <span style={{ fontSize: '9px', color: '#666' }}>{work.date}</span>
                </div>
                <div style={{ fontSize: '11px', color: themeColor, marginBottom: '8px', fontWeight: '600' }}>{work.company}</div>
                <ul style={{ margin: '0', paddingLeft: '18px' }}>
                  {work.descriptions.map((desc, j) => (
                    <li key={j} style={{ marginBottom: '4px', fontSize: '10px', color: '#444' }}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Technical: Compact, grid-based
  if (templateId === 'technical') {
    return (
      <div style={containerStyle}>
        <div style={{ fontFamily: 'Monaco, monospace', padding: '40px', backgroundColor: '#0a0a0a', color: '#00ff00', fontSize: '10px', lineHeight: '1.4' }}>
          <div style={{ border: `2px solid ${themeColor}`, padding: '20px', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', margin: '0', color: themeColor }}>$ {profile.name.toUpperCase()}</h1>
            <div style={{ fontSize: '9px', marginTop: '8px', color: '#888' }}>
              {profile.email} | {profile.phone} | {profile.location}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: themeColor, fontSize: '14px', marginBottom: '10px' }}>&gt; EXPERIENCE</div>
            {workExperiences.map((work, i) => (
              <div key={i} style={{ marginBottom: '14px', paddingLeft: '15px', borderLeft: `2px solid ${themeColor}` }}>
                <div style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>{work.jobTitle} @ {work.company}</div>
                <div style={{ fontSize: '9px', color: '#888', marginBottom: '6px' }}>{work.date}</div>
                {work.descriptions.map((desc, j) => (
                  <div key={j} style={{ fontSize: '9px', marginBottom: '3px', color: '#aaa' }}>• {desc}</div>
                ))}
              </div>
            ))}
          </div>

          <div>
            <div style={{ color: themeColor, fontSize: '14px', marginBottom: '10px' }}>&gt; EDUCATION</div>
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: '10px', paddingLeft: '15px' }}>
                <div style={{ color: '#fff', fontSize: '11px' }}>{edu.degree} - {edu.school}</div>
                <div style={{ fontSize: '9px', color: '#888' }}>{edu.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Executive: Elegant, spacious
  if (templateId === 'executive') {
    return (
      <div style={containerStyle}>
        <div style={{ fontFamily: '"Playfair Display", serif', padding: '60px', backgroundColor: 'white', fontSize: '11px', lineHeight: '1.8' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 10px 0', color: '#1a1a1a', letterSpacing: '2px' }}>{profile.name.toUpperCase()}</h1>
            <div style={{ height: '1px', width: '100px', backgroundColor: themeColor, margin: '15px auto' }} />
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '1px' }}>
              {profile.email} • {profile.phone} • {profile.location}
            </div>
          </div>

          <div style={{ marginBottom: '35px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: themeColor, marginBottom: '20px', textAlign: 'center', letterSpacing: '3px' }}>PROFESSIONAL EXPERIENCE</h2>
            {workExperiences.map((work, i) => (
              <div key={i} style={{ marginBottom: '25px', borderLeft: `3px solid ${themeColor}`, paddingLeft: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>{work.jobTitle}</div>
                <div style={{ fontSize: '12px', fontStyle: 'italic', color: themeColor, marginBottom: '8px' }}>{work.company} • {work.date}</div>
                <ul style={{ margin: '0', paddingLeft: '20px', listStyle: 'none' }}>
                  {work.descriptions.map((desc, j) => (
                    <li key={j} style={{ marginBottom: '6px', fontSize: '10px', color: '#444', position: 'relative', paddingLeft: '15px' }}>
                      <span style={{ position: 'absolute', left: '0', color: themeColor }}>▸</span>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: themeColor, marginBottom: '20px', textAlign: 'center', letterSpacing: '3px' }}>EDUCATION</h2>
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a1a1a' }}>{edu.degree}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>{edu.school} • {edu.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Creative: Bold, asymmetric
  if (templateId === 'creative') {
    return (
      <div style={containerStyle}>
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', fontSize: '10px', lineHeight: '1.5' }}>
          <div style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #000 100%)`, color: 'white', padding: '30px 40px', clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 5px 0', transform: 'skew(-5deg)' }}>{profile.name}</h1>
            <div style={{ fontSize: '10px', opacity: 0.9 }}>
              {profile.email} • {profile.phone}
            </div>
          </div>

          <div style={{ padding: '30px 40px' }}>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: themeColor, marginBottom: '15px', position: 'relative', paddingLeft: '20px' }}>
                <span style={{ position: 'absolute', left: '0', top: '-2px', fontSize: '24px' }}>●</span>
                EXPERIENCE
              </h2>
              {workExperiences.map((work, i) => (
                <div key={i} style={{ marginBottom: '18px', backgroundColor: 'white', padding: '15px', borderLeft: `5px solid ${themeColor}`, boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12px', color: themeColor }}>{work.jobTitle}</strong>
                    <span style={{ fontSize: '9px', backgroundColor: themeColor, color: 'white', padding: '2px 8px', borderRadius: '3px' }}>{work.date}</span>
                  </div>
                  <div style={{ fontSize: '11px', marginBottom: '8px', fontWeight: '600' }}>{work.company}</div>
                  {work.descriptions.map((desc, j) => (
                    <div key={j} style={{ fontSize: '10px', marginBottom: '4px', color: '#444' }}>→ {desc}</div>
                  ))}
                </div>
              ))}
            </div>

            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: themeColor, marginBottom: '15px', position: 'relative', paddingLeft: '20px' }}>
                <span style={{ position: 'absolute', left: '0', top: '-2px', fontSize: '24px' }}>●</span>
                EDUCATION
              </h2>
              {educations.map((edu, i) => (
                <div key={i} style={{ marginBottom: '12px', backgroundColor: 'white', padding: '12px 15px', borderLeft: `5px solid ${themeColor}` }}>
                  <strong style={{ fontSize: '11px', color: '#1a1a1a' }}>{edu.school}</strong>
                  <div style={{ fontSize: '10px', color: '#666' }}>{edu.degree} • {edu.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Minimal: Ultra clean
  if (templateId === 'minimal') {
    return (
      <div style={containerStyle}>
        <div style={{ fontFamily: 'Helvetica, sans-serif', padding: '50px', backgroundColor: 'white', fontSize: '10px', lineHeight: '1.7', color: '#2a2a2a' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '300', margin: '0 0 5px 0', letterSpacing: '1px' }}>{profile.name}</h1>
          <div style={{ fontSize: '9px', color: '#888', marginBottom: '40px' }}>
            {profile.email} · {profile.phone} · {profile.location}
          </div>

          <div style={{ marginBottom: '35px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '15px', color: '#1a1a1a' }}>Experience</div>
            {workExperiences.map((work, i) => (
              <div key={i} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '500' }}>{work.jobTitle}, {work.company}</span>
                  <span style={{ fontSize: '9px', color: '#888' }}>{work.date}</span>
                </div>
                {work.descriptions.map((desc, j) => (
                  <div key={j} style={{ fontSize: '9px', marginBottom: '3px', color: '#555', marginLeft: '0' }}>
                    {desc}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '15px', color: '#1a1a1a' }}>Education</div>
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: '500' }}>{edu.degree}, {edu.school}</span>
                  <span style={{ fontSize: '9px', color: '#888' }}>{edu.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Academic: Traditional academic CV style
  if (templateId === 'academic') {
    return (
      <div style={containerStyle}>
        <div style={{ fontFamily: 'Times New Roman, serif', padding: '45px 50px', backgroundColor: 'white', fontSize: '11px', lineHeight: '1.6' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#1a1a1a' }}>{profile.name}</h1>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '8px' }}>
              {profile.email} | {profile.phone} | {profile.location}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '12px', fontVariant: 'small-caps' }}>Education</h2>
            {educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{edu.degree}</div>
                <div style={{ fontSize: '11px', fontStyle: 'italic' }}>{edu.school}, {edu.date}</div>
                {edu.gpa && <div style={{ fontSize: '10px', color: '#666' }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '12px', fontVariant: 'small-caps' }}>Professional Experience</h2>
            {workExperiences.map((work, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '12px' }}>{work.jobTitle}</strong>
                  <span style={{ fontSize: '10px', fontStyle: 'italic' }}>{work.date}</span>
                </div>
                <div style={{ fontSize: '11px', fontStyle: 'italic', marginBottom: '6px' }}>{work.company}</div>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  {work.descriptions.map((desc, j) => (
                    <li key={j} style={{ fontSize: '10px', marginBottom: '3px' }}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Professional: Modern business style
  if (templateId === 'professional') {
    return (
      <div style={containerStyle}>
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'white', fontSize: '10px', lineHeight: '1.6' }}>
          <div style={{ backgroundColor: themeColor, color: 'white', padding: '25px 40px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{profile.name}</h1>
            <div style={{ fontSize: '10px', opacity: 0.95 }}>
              {profile.email} | {profile.phone} | {profile.location}
            </div>
          </div>

          <div style={{ padding: '30px 40px' }}>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: themeColor, marginBottom: '12px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '6px' }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              {workExperiences.map((work, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '12px', color: '#1a1a1a' }}>{work.jobTitle}</strong>
                      <span style={{ marginLeft: '8px', fontSize: '11px', color: '#666' }}>• {work.company}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>{work.date}</span>
                  </div>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
                    {work.descriptions.map((desc, j) => (
                      <li key={j} style={{ marginBottom: '3px', fontSize: '10px', color: '#444' }}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: themeColor, marginBottom: '12px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '6px' }}>
                EDUCATION
              </h2>
              {educations.map((edu, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '11px', color: '#1a1a1a' }}>{edu.degree}</strong>
                      <span style={{ marginLeft: '8px', fontSize: '10px', color: '#666' }}>• {edu.school}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>{edu.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default fallback
  return <div style={containerStyle}>Template not found</div>
}
