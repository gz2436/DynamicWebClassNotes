# Week4_Component Library
- Dropdown
- Modal & Panel

## Overview
Week4 builds a small component library using **React + Vite + Tailwind CSS**.  

This week focuses on reusable UI components and basic routing setup.

---

## Features
1. **Accordion**
   - Expand / collapse panels with smooth animation  
   - Chevron icon rotation & typography styling  
2. **Dropdown**
   - Click to toggle options; closes on outside click  
   - Clean, minimal behavior control with React state  
3. **Modal**
   - Uses React Portal (`#modal-root`)  
   - Overlay + ESC to close + smooth transition  
4. **Routing**
   - `/accordion`, `/dropdown`, `/modal` routes  
   - Shared layout via `Navbar` + `Panel` components  

---

## Project Structure
```text
week04/my-app/
├── components/     # Navbar, Panel, Accordion, Dropdown, Modal
├── pages/          # AccordionPage, DropdownPage, ModalPage
├── App.jsx         # Routes setup
├── main.jsx
├── index.html
├── vite.config.js
└── vercel.json
```

## Run
```bash
cd week04/my-app
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
1. Built Accordion / Dropdown / Modal components
2. Practiced React state + conditional rendering
3. Organized multi-page routing with react-router-dom
4. Deployed successfully to Vercel