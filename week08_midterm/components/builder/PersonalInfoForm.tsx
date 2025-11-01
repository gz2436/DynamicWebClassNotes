'use client'

import { useResumeBuilder } from '@/lib/context/resume-builder-context'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResumeBuilder()
  const { personalInfo } = resumeData

  return (
    <div className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          value={personalInfo.fullName}
          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          placeholder="John Doe"
          className="glass-g1 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="john@example.com"
            className="glass-g1 w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          Phone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="glass-g1 w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="location"
            type="text"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            placeholder="San Francisco, CA"
            className="glass-g1 w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* LinkedIn */}
      <div>
        <label htmlFor="linkedin" className="block text-sm font-medium mb-2">
          LinkedIn Profile
        </label>
        <div className="relative">
          <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="linkedin"
            type="url"
            value={personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
            className="glass-g1 w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Portfolio */}
      <div>
        <label htmlFor="portfolio" className="block text-sm font-medium mb-2">
          Portfolio / Website
        </label>
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="portfolio"
            type="url"
            value={personalInfo.portfolio}
            onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
            placeholder="johndoe.com"
            className="glass-g1 w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="glass-g1 p-4 rounded-xl">
        <p className="text-sm text-muted-foreground">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </div>
  )
}
