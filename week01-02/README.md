# Week1-2_Basics Setup
- React + Vite Environment
- Tailwind CSS Setup
- JSX & Component Basics
- CSS Modules and useState Practice

## Overview
Weeks 1–2 focus on setting up a working development environment using **React + Vite + Tailwind CSS**.  

These weeks focus on moving from a static HTML project to a dynamic React setup, learning the basics of **component structure**, **state management**, and **modular styling**.

---

## Features
1. **Project Setup**
    - Initialized project with `npm create vite@latest`
    - Configured **React + Vite** for fast local development  
    - Organized folder structure for scalability

2. **Tailwind CSS**
    - Installed and configured `tailwind.config.js`
    - Verified responsive layout and utility classes  
    - Combined with **CSS Modules** for scoped styling 

3. **Basic Components**
    - Built `Card`, `RecipePage`, and `HelloState` components  
    - Practiced JSX syntax and component composition  
    - Added `useState` examples (button counter and like toggle)  

4. **File Organization**
    - Introduced `components/` and `pages/` folders  
    - Used `App.jsx` for simple tab-based navigation  
    - Added `HtmlToJsxNotes` page for syntax conversion notes  

### Project Structure
```text
week01-02-react/
├── components/      # Reusable UI components (Card)
├── pages/           # Page-level components (RecipePage, HelloState, Notes)
├── App.jsx          # Root component with navigation
├── main.jsx         # React entry point
├── index.html
├── index.css        # Tailwind base styles
├── vite.config.js
└── tailwind.config.js
```

### Run
```bash
cd week01-02-react
```

```bash
 npm install
```

```bash
 npm run dev
```

### Summary
   1. Set up a React + Vite + Tailwind CSS development environment
   2. Converted static HTML/CSS (recipe-site) into React components
   3. Practiced JSX, props, and useState basics
   4. Established file organization for future weeks (Week3 component library)