import { ResumeData } from '@/lib/types/resume'

interface ClassicTemplateProps {
  data: ResumeData
  scale?: number
}

export default function ClassicTemplate({ data, scale = 1 }: ClassicTemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects } = data

  return (
    <div
      className="bg-white text-black p-12 shadow-lg"
      style={{
        width: '210mm',
        minHeight: '297mm',
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.portfolio) && (
          <div className="flex gap-4 text-sm mt-2">
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} className="text-blue-600 underline">
                LinkedIn
              </a>
            )}
            {personalInfo.portfolio && (
              <a href={personalInfo.portfolio} className="text-blue-600 underline">
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 uppercase border-b border-gray-400 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            Work Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              {exp.description.length > 0 && (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {exp.description.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold">{edu.degree} in {edu.field}</h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                {edu.institution} {edu.location && `• ${edu.location}`}
              </div>
              {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 uppercase border-b border-gray-400 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {skills.map((skill, idx) => (
              <span key={idx} className="after:content-['•'] after:ml-2 last:after:content-['']">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="text-base font-bold">{project.name}</h3>
              <p className="text-sm mb-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Technologies:</span>{' '}
                  {project.technologies.join(', ')}
                </div>
              )}
              {project.link && (
                <a href={project.link} className="text-sm text-blue-600 underline">
                  {project.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
