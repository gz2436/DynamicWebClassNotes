'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'

// Top US universities database (100+) - NYU and Columbia first
const UNIVERSITIES = [
  'New York University', 'Columbia University',
  'Massachusetts Institute of Technology', 'Harvard University', 'Stanford University',
  'Princeton University', 'Yale University', 'University of Pennsylvania',
  'California Institute of Technology', 'University of Chicago',
  'Johns Hopkins University', 'Northwestern University', 'Duke University',
  'Dartmouth College', 'Brown University', 'Cornell University',
  'University of California, Berkeley', 'University of California, Los Angeles',
  'University of California, San Diego', 'University of California, Santa Barbara',
  'University of California, Irvine', 'University of California, Davis',
  'University of Michigan', 'University of Virginia', 'University of North Carolina at Chapel Hill',
  'Georgetown University', 'Carnegie Mellon University',
  'University of Southern California', 'University of Texas at Austin',
  'University of Washington', 'Georgia Institute of Technology',
  'University of Illinois Urbana-Champaign', 'University of Wisconsin-Madison',
  'University of Florida', 'University of Maryland', 'Ohio State University',
  'Pennsylvania State University', 'Purdue University', 'University of Minnesota',
  'Boston University', 'University of Rochester', 'Tufts University',
  'Wake Forest University', 'Vanderbilt University', 'Rice University',
  'University of Notre Dame', 'Emory University', 'Washington University in St. Louis',
  'University of California, Santa Cruz', 'Rutgers University', 'Texas A&M University',
  'University of Pittsburgh', 'University of Colorado Boulder', 'University of Arizona',
  'Arizona State University', 'University of Utah', 'University of Oregon',
  'University of Iowa', 'Michigan State University', 'Indiana University',
  'University of Connecticut', 'University of Massachusetts Amherst',
  'Stony Brook University', 'University at Buffalo', 'Virginia Tech',
  'North Carolina State University', 'University of Delaware', 'Northeastern University',
  'Boston College', 'Brandeis University', 'Case Western Reserve University',
  'Rensselaer Polytechnic Institute', 'University of Miami', 'Tulane University',
  'Syracuse University', 'Lehigh University', 'Worcester Polytechnic Institute',
  'University of California, Riverside', 'University of South Florida',
  'Florida State University', 'University of Central Florida', 'George Washington University',
  'Fordham University', 'Drexel University', 'Stevens Institute of Technology',
  'Illinois Institute of Technology', 'Colorado School of Mines', 'Santa Clara University',
  'University of San Diego', 'Pepperdine University', 'University of Denver',
  'Baylor University', 'Southern Methodist University', 'Texas Christian University',
]

const MAJORS = [
  // NYU Integrated Design & Media - First
  'Integrated Design and Media',

  // Computer Science & Technology
  'Computer Science', 'Software Engineering', 'Information Technology',
  'Data Science', 'Artificial Intelligence', 'Machine Learning',
  'Cybersecurity', 'Information Systems', 'Computer Engineering',
  'Web Development', 'Mobile App Development', 'Game Development',
  'Human-Computer Interaction', 'Cloud Computing', 'Robotics',

  // Interactive & Digital Media (NYU ITP, etc.)
  'Interactive Media Arts',
  'Interactive Telecommunications', 'Digital Media Design',
  'User Experience Design', 'User Interface Design', 'Product Design',
  'Interaction Design', 'Design and Technology', 'Media Arts',
  'Game Design', 'Animation', 'Motion Graphics', 'Visual Effects',
  'Digital Art', 'New Media', 'Media Studies', 'Media Production',

  // Engineering
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Biomedical Engineering', 'Aerospace Engineering',
  'Industrial Engineering', 'Environmental Engineering', 'Materials Science',
  'Petroleum Engineering', 'Nuclear Engineering', 'Systems Engineering',
  'Software Engineering', 'Network Engineering',

  // Business & Economics
  'Business Administration', 'Economics', 'Finance', 'Accounting',
  'Marketing', 'Management', 'Entrepreneurship', 'International Business',
  'Supply Chain Management', 'Human Resources', 'Business Analytics',
  'Financial Engineering', 'Real Estate', 'Risk Management',

  // Sciences
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Statistics',
  'Biotechnology', 'Biochemistry', 'Neuroscience', 'Genetics',
  'Environmental Science', 'Marine Biology', 'Astronomy', 'Geology',
  'Applied Mathematics', 'Computational Biology', 'Bioinformatics',

  // Health & Medicine
  'Nursing', 'Pre-Medicine', 'Public Health', 'Health Administration',
  'Pharmacy', 'Physical Therapy', 'Occupational Therapy', 'Nutrition',
  'Health Informatics', 'Medical Technology', 'Biomedical Sciences',

  // Social Sciences
  'Psychology', 'Sociology', 'Political Science', 'International Relations',
  'Anthropology', 'Criminology', 'Social Work', 'Urban Planning',
  'Cognitive Science', 'Behavioral Science', 'Public Policy',

  // Arts & Humanities
  'Communications', 'Journalism', 'English Literature', 'History',
  'Philosophy', 'Linguistics', 'Foreign Languages', 'Art History',
  'Music', 'Theater', 'Film Studies', 'Creative Writing',
  'Performing Arts', 'Fine Arts', 'Studio Art', 'Photography',
  'Graphic Design', 'Industrial Design', 'Fashion Design',

  // Interdisciplinary & Other Fields
  'Architecture', 'Education', 'Law', 'Environmental Studies',
  'Agriculture', 'Hospitality Management', 'Sports Management',
  'Library Science', 'Museum Studies', 'Arts Administration',
  'Sustainability', 'Urban Studies', 'Global Studies',
  'Digital Humanities', 'Information Science', 'Data Analytics',
]

interface EducationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  required?: boolean
  error?: string
  type: 'university' | 'major'
}

export default function EducationInput({
  value,
  onChange,
  placeholder,
  label,
  required,
  error,
  type,
}: EducationInputProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredItems, setFilteredItems] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const database = type === 'university' ? UNIVERSITIES : MAJORS

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(inputValue)

    if (inputValue.trim()) {
      const filtered = database.filter(item =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      )
      setFilteredItems(filtered)
      setShowDropdown(true)
    } else {
      setFilteredItems([])
      setShowDropdown(false)
    }
  }

  const handleSelectItem = (item: string) => {
    onChange(item)
    setShowDropdown(false)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    onChange('')
    setFilteredItems([])
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    if (value.trim()) {
      const filtered = database.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredItems(filtered)
      setShowDropdown(true)
    } else {
      setFilteredItems(database.slice(0, 8))
      setShowDropdown(true)
    }
  }

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-3 pr-20 rounded-2xl glass-g1',
            'border-2 border-transparent transition-all duration-300',
            'focus:border-primary/50 focus:outline-none focus:scale-[1.02]',
            'placeholder:text-muted-foreground/50',
            error && 'border-destructive animate-shake'
          )}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && filteredItems.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 glass-g2 rounded-xl border border-white/20 shadow-2xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {filteredItems.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectItem(item)}
              className="w-full px-4 py-3 text-left transition-all duration-200 ease-in-out
                         hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5
                         hover:pl-6 hover:scale-[1.01]
                         first:rounded-t-xl last:rounded-b-xl
                         border-l-2 border-transparent hover:border-primary/50"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive ml-2 animate-in slide-in-from-left duration-300">
          {error}
        </p>
      )}
    </div>
  )
}
