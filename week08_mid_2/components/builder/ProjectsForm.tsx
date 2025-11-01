'use client'

import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export default function ProjectsForm() {
  const { resumeData, addProject, updateProject, deleteProject } = useResumeBuilder()
  const { projects = [] } = resumeData

  const addTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project && tech.trim() && !project.technologies.includes(tech.trim())) {
      updateProject(projectId, {
        technologies: [...project.technologies, tech.trim()],
      })
    }
  }

  const removeTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      updateProject(projectId, {
        technologies: project.technologies.filter((t) => t !== tech),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-g1 p-4 rounded-xl">
        <p className="text-sm text-muted-foreground">
          Projects are optional but can showcase your practical skills and initiative. Include personal projects, open-source contributions, or significant work projects.
        </p>
      </div>

      {projects.length === 0 && (
        <div className="glass-g1 p-8 rounded-xl text-center">
          <p className="text-muted-foreground mb-4">No projects added yet</p>
          <button
            onClick={addProject}
            className="glass-g2 glass-transition px-6 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </button>
        </div>
      )}

      {projects.map((project, index) => (
        <div key={project.id} className="glass-card border-2 border-white/10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Project #{index + 1}</h3>
            <button
              onClick={() => deleteProject(project.id)}
              className="glass-g1 glass-transition h-10 w-10 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                placeholder="E-commerce Platform"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                placeholder="A full-stack e-commerce platform with real-time inventory management and payment integration. Built with React, Node.js, and PostgreSQL."
                rows={4}
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium mb-2">Technologies</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add technology (e.g., React, Python)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTechnology(project.id, e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="glass-g1 flex-1 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="glass-g1 px-3 py-1.5 rounded-full flex items-center gap-2 group glass-transition hover:bg-white/10 text-sm"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => removeTechnology(project.id, tech)}
                        className="opacity-0 group-hover:opacity-100 glass-transition hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to add a technology
              </p>
            </div>

            {/* Project Link */}
            <div>
              <label className="block text-sm font-medium mb-2">Project Link</label>
              <input
                type="url"
                value={project.link}
                onChange={(e) => updateProject(project.id, { link: e.target.value })}
                placeholder="https://github.com/username/project or https://project-demo.com"
                className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      ))}

      {projects.length > 0 && (
        <button
          onClick={addProject}
          className="glass-g2 glass-transition w-full px-6 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Another Project
        </button>
      )}
    </div>
  )
}
