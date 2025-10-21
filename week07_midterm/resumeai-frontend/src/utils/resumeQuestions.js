// Resume data collection questions
export const resumeSections = {
  CONTACT: 'contact',
  SUMMARY: 'summary',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  SKILLS: 'skills',
  COMPLETE: 'complete'
};

export const questionFlow = [
  {
    section: resumeSections.CONTACT,
    questions: [
      {
        id: 'fullName',
        question: "Let's start with your basic information. What's your full name?",
        field: 'fullName'
      },
      {
        id: 'email',
        question: "What's your email address?",
        field: 'email'
      },
      {
        id: 'phone',
        question: "What's your phone number?",
        field: 'phone'
      },
      {
        id: 'location',
        question: "Where are you located? (City, State/Country)",
        field: 'location'
      }
    ]
  },
  {
    section: resumeSections.SUMMARY,
    questions: [
      {
        id: 'summary',
        question: "Great! Now, briefly describe your professional background and career goals. This will be your professional summary.",
        field: 'summary',
        multiline: true
      }
    ]
  },
  {
    section: resumeSections.EXPERIENCE,
    questions: [
      {
        id: 'hasExperience',
        question: "Do you have any work experience? (yes/no)",
        field: 'hasExperience',
        type: 'boolean'
      },
      // Dynamic - will ask for each job
      {
        id: 'jobTitle',
        question: "What was your job title?",
        field: 'title',
        repeatable: true
      },
      {
        id: 'company',
        question: "Which company did you work for?",
        field: 'company',
        repeatable: true
      },
      {
        id: 'jobDuration',
        question: "When did you work there? (e.g., Jan 2020 - Present)",
        field: 'duration',
        repeatable: true
      },
      {
        id: 'jobDescription',
        question: "Describe your key responsibilities and achievements in this role.",
        field: 'description',
        multiline: true,
        repeatable: true
      },
      {
        id: 'anotherJob',
        question: "Do you have another work experience to add? (yes/no)",
        field: 'addAnother',
        type: 'boolean',
        repeatable: true
      }
    ]
  },
  {
    section: resumeSections.EDUCATION,
    questions: [
      {
        id: 'degree',
        question: "What's your highest degree or education level?",
        field: 'degree'
      },
      {
        id: 'school',
        question: "Which school/university did you attend?",
        field: 'school'
      },
      {
        id: 'graduationYear',
        question: "When did you graduate? (or expected graduation year)",
        field: 'graduationYear'
      },
      {
        id: 'major',
        question: "What was your major/field of study?",
        field: 'major'
      }
    ]
  },
  {
    section: resumeSections.SKILLS,
    questions: [
      {
        id: 'skills',
        question: "List your key skills (e.g., programming languages, tools, soft skills). Separate them with commas.",
        field: 'skills',
        type: 'list'
      }
    ]
  }
];

// Initial resume data structure
export const initialResumeData = {
  contact: {
    fullName: '',
    email: '',
    phone: '',
    location: ''
  },
  summary: '',
  experience: [],
  education: {
    degree: '',
    school: '',
    graduationYear: '',
    major: ''
  },
  skills: []
};

// Calculate total number of questions (excluding repeatable experience questions after first)
export const getTotalQuestions = () => {
  let total = 0;
  questionFlow.forEach(section => {
    total += section.questions.length;
  });
  return total;
};
