# Custom Claude Code Core Setup — Context for Codex

## Goal

We are building a custom Claude Code (cc) core system, designed as a reusable AI framework for generating and managing high-quality, design-oriented web projects.

The system is modular: each pack adds its own domain logic, for example:
- Apple-style UI (ui-apple)
- Brand art assets (brand-art)
- Resume builder templates (resume)
- Project scaffolding (midterm)

The goal is to have a developer-grade framework that can be reused as a base for future projects.

---

## Core Concept Overview

### Mother Core
The `.claude` directory acts as the shared “brain” for all projects.  
Inside it, `packs/` holds modular skill packs.  
Each project can load packs by listing them under `.claude/local/settings.json → profiles`.

### Packs
Each pack is a self-contained feature module.

Example structure:
resources/   → tokens, design data, assets
skills/      → skill definitions
commands/    → slash commands
rules.json   → local triggers

---

## Hooks

Two required hooks:
- skill-activation-prompt.sh  
- post-tool-use-tracker.sh

They load `packs/*/rules.json` into the active session based on triggers.

---

## Settings Example

`.claude/local/settings.json`
```json
{
  "profiles": ["ui-apple", "brand-art", "resume", "midterm"],
  "enabled_hooks": ["skill-activation-prompt", "post-tool-use-tracker"],
  "default_language": "en"
}

Folder Structure
.claude/
├─ packs/
│  ├─ ui-apple/
│  ├─ brand-art/
│  ├─ resume/
│  └─ midterm/
│
├─ skills/
│  └─ skill-rules.json
│
├─ hooks/
│  ├─ skill-activation-prompt.sh
│  └─ post-tool-use-tracker.sh
│
└─ local/
   └─ settings.json

Skill Routers

Inside .claude/skills/skill-rules.json, each pack must have a global router entry:
"pack-ui-apple-router": {
  "type": "system",
  "enforcement": "suggest",
  "priority": "high",
  "description": "Enable Apple-style UI pack when opted-in",
  "promptTriggers": { "intentPatterns": ["^\\s*[/|:]ui-apple\\b"] },
  "fileTriggers": {
    "pathPatterns": [".claude/local/settings.json"],
    "contentPatterns": ["\"profiles\"\\s*:\\s*\$begin:math:display$.*\\"ui-apple\\".*\\$end:math:display$"]
  },
  "activateSkill": "dev-docs"
},
"pack-brand-art-router": {
  "type": "system",
  "enforcement": "suggest",
  "priority": "high",
  "description": "Enable brand art pack when opted-in",
  "promptTriggers": { "intentPatterns": ["^\\s*[/|:]art-(kickoff|inject|audit)\\b"] },
  "fileTriggers": {
    "pathPatterns": [".claude/local/settings.json"],
    "contentPatterns": ["\"profiles\"\\s*:\\s*\$begin:math:display$.*\\"brand-art\\".*\\$end:math:display$"]
  },
  "activateSkill": "dev-docs"
},
"pack-resume-router": {
  "type": "system",
  "enforcement": "suggest",
  "priority": "high",
  "description": "Enable resume pack when opted-in",
  "promptTriggers": { "intentPatterns": ["^\\s*[/|:]resume-(kickoff|templates|templates-sync)\\b"] },
  "fileTriggers": {
    "pathPatterns": [".claude/local/settings.json"],
    "contentPatterns": ["\"profiles\"\\s*:\\s*\$begin:math:display$.*\\"resume\\".*\\$end:math:display$"]
  },
  "activateSkill": "dev-docs"
},
"pack-midterm-router": {
  "type": "system",
  "enforcement": "suggest",
  "priority": "high",
  "description": "Enable midterm project pack when opted-in",
  "promptTriggers": { "intentPatterns": ["^\\s*[/|:]midterm-kickoff\\b"] },
  "fileTriggers": {
    "pathPatterns": [".claude/local/settings.json"],
    "contentPatterns": ["\"profiles\"\\s*:\\s*\$begin:math:display$.*\\"midterm\\".*\\$end:math:display$"]
  },
  "activateSkill": "dev-docs"
}

Pack Summaries

ui-apple (Apple Liquid Glass)
	•	Apple-style blur and glass design system
	•	Commands:
	•	/ui-apple → apply Apple-style setup
	•	Skills:
	•	ui-apple-apply → inject CSS variables and Tailwind utilities

brand-art
	•	Illustration and gradient pack
	•	Commands:
	•	/art-kickoff → set color theme and hero art
	•	/art-inject → inject assets
	•	Skills:
	•	art-audit → check consistency and contrast

resume
	•	Resume builder templates and export logic
	•	Commands:
	•	/resume-kickoff → initialize builder
	•	/resume-templates → preview templates
	•	/resume-templates-sync → update registry
	•	Skills:
	•	resume-ui-pack, resume-ats-audit, resume-export

midterm
	•	Generates initial project skeleton
	•	Commands:
	•	/midterm-kickoff → build Next.js + Tailwind + shadcn + Framer setup
	•	Skills:
	•	midterm-pages → generate pages Home, Builder, Templates, Export

⸻

Command Flow Example

Once setup is complete:
claude
/ui-apple
/midterm-kickoff
/art-kickoff
/resume-templates

Each step:
	1.	Asks for confirmation before writing files
	2.	Loads relevant rules
	3.	Generates structure
	4.	Stops for human review

Design Goals
	•	Prioritize quality and visual consistency
	•	Use shadcn/ui, Tailwind, Framer Motion
	•	Support glass/blur effects and Apple-style gradients
	•	Respect accessibility and prefers-reduced-motion
	•	Keep hooks interactive (no forced automation)
	•	Default language: English
	•	Keep packs portable for reuse across projects

⸻

Tasks for Codex
	1.	Verify .claude/packs/ and all router entries.
	2.	Create or fix missing packs (ui-apple, brand-art, resume, midterm).
	3.	Ensure all rules.json files are valid JSON.
	4.	Check .claude/local/settings.json for correct profiles.
	5.	Validate command recognition: /ui-apple and /midterm-kickoff.
	6.	When all packs are functional, continue improving UI quality and templates.

⸻

Notes for Codex
	•	All edits must request confirmation.
	•	Keep English output.
	•	Maintain Claude Code v2 compatibility.
	•	Ensure the core can be copied to other projects without breaking.