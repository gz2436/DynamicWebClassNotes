# Week3_Component Library
- Buttons
- Accordion

## Overview
Week3 introduces building a simple component library using **React + Vite + Tailwind CSS**.  

This week focuses on creating reusable UI elements and understanding basic component props and styling.

---

## Features
1. **Button Component**
   - Variants: primary, secondary, success, warning, danger, outline  
   - Sizes: sm, md, lg  
   - States: disabled, loading  
   - Pill (rounded-full) option  
   - Optional icons (react-icons)

2. **Accordion Component**
   - Expand/collapse panels with smooth animation  
   - Chevron icon rotates on toggle  
   - Typography via `@tailwindcss/typography` (prose)  
   - English content, supports paragraphs/lists/code

3. **Routing**
   - `/buttons` – showcase all Button variants & states  
   - `/accordion` – accordion demo with prose content

---

## Project Structure
```text
week03/my-app/
├── components/     # Button, Accordion
├── pages/          # ButtonsPage, AccordionPage
├── App.jsx         # Routes setup
├── main.jsx
├── index.html
├── vite.config.js
└── vercel.json
```

## Run
```bash
 cd week03/my-app
```

```bash
 npm install
```

```bash
 npm run dev
```

## Demo

```
/
```

## Summary
   1.	Built reusable Button and Accordion components
   2.	Practiced React props, state, and Tailwind styling
   3.	Introduced routing between component demo pages
   4.	Deployed successfully to Vercel