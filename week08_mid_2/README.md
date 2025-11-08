# ResumeAI - AI-Powered Resume Builder

A modern, AI-powered resume builder application built with Next.js 14, featuring intelligent resume generation, multiple templates, and seamless export functionality.

## Features

- **AI-Powered Resume Generation**: Leverage DeepSeek AI to intelligently generate and optimize resume content
- **User Authentication**: Secure authentication system powered by Supabase
- **Multiple Templates**: Choose from various professionally designed resume templates
- **Real-time Preview**: See changes to your resume in real-time as you edit
- **Export Functionality**: Export your resume in multiple formats (PDF, DOCX)
- **Responsive Design**: Fully responsive interface that works on all devices
- **Dark Mode Support**: Built-in dark mode for comfortable viewing

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [shadcn/ui](https://ui.shadcn.com/) patterns
- **Database & Auth**: [Supabase](https://supabase.com/)
- **AI Integration**: [DeepSeek AI](https://www.deepseek.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn package manager
- A Supabase account
- A DeepSeek AI API key

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd week08_mid_2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# DeepSeek AI Configuration
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.local.example` for reference.

### 4. Supabase Setup

Follow the instructions in [SETUP_SUPABASE.md](./SETUP_SUPABASE.md) to set up your Supabase database and authentication.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
week08_mid_2/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── builder/           # Resume builder interface
│   ├── dashboard/         # User dashboard
│   ├── export/            # Export functionality
│   ├── templates/         # Resume templates
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── builder/          # Resume builder components
│   ├── layout/           # Layout components
│   ├── resume/           # Resume display components
│   ├── templates/        # Template components
│   ├── theme/            # Theme components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client configuration
│   └── utils/            # Helper functions
└── .claude/              # Claude Code AI configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project" and import your repository
4. Add all environment variables from `.env.local`
5. Click "Deploy"

Your application will be automatically deployed and you'll receive a production URL.

### Environment Variables for Production

Make sure to add all environment variables in your Vercel project settings:
- Update `NEXT_PUBLIC_APP_URL` to your production URL
- Keep all API keys and secrets secure

## Features in Detail

### Resume Builder
- Drag-and-drop interface for easy resume creation
- AI-powered content suggestions
- Real-time preview
- Section management (Experience, Education, Skills, etc.)

### Templates
- Multiple professionally designed templates
- Customizable color schemes
- ATS-friendly formats

### Export Options
- PDF export with high-quality rendering
- DOCX export for further editing
- Print-optimized layouts

### AI Features
- Intelligent content generation
- Grammar and style improvements
- Industry-specific suggestions
- Keyword optimization for ATS

## Development Notes

This project uses:
- Next.js 14 App Router for optimal performance
- Server Components for improved loading times
- Server Actions for seamless data mutations
- Supabase Auth Helpers for authentication
- TypeScript for type safety
- Tailwind CSS for rapid UI development

## License

This project is part of a course assignment and is for educational purposes.

## Acknowledgments

- Built as part of NYU Dynamic Web Development course
- Powered by DeepSeek AI for intelligent resume generation
- UI inspired by modern design systems and Apple's design language


