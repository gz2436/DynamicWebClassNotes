import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'

// X (formerly Twitter) icon
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export function Footer() {
  return (
    <footer className="glass-g1 mt-20 border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-lg mb-2">ResumeAI</h3>
            <p className="text-sm text-muted-foreground">
              Create professional resumes with AI-powered assistance.
              Stand out from the crowd with ATS-optimized templates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/builder" className="text-muted-foreground hover:text-foreground glass-transition">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-muted-foreground hover:text-foreground glass-transition">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/export" className="text-muted-foreground hover:text-foreground glass-transition">
                  Export
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-g1 glass-transition h-9 w-9 rounded-full flex items-center justify-center hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-g1 glass-transition h-9 w-9 rounded-full flex items-center justify-center hover:scale-110"
                aria-label="X (formerly Twitter)"
              >
                <XIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-g1 glass-transition h-9 w-9 rounded-full flex items-center justify-center hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
