# Week5_Component Library 
- Active Nav
- Custom Page

## Overview
Week5 builds on Week4’s component library.  

This week adds **active navigation (NavLink)** and a **new custom page (Gallery)** to show how to expand the app structure.

---

## Features
1. **Active Navbar**
   - Replaced `<a>` with `<NavLink>` for smooth SPA navigation  
   - Highlights the current route with active styling  
2. **New Page — Gallery**
   - `/gallery` shows a simple grid built with the shared `Panel`  
   - Demonstrates layout reuse and data mapping  
3. **Routing**
   - Added `/gallery` to `App.jsx`  
   - Kept Accordion, Dropdown, and Modal from Week4  
4. **Deployment**
   - Added `vercel.json` to fix SPA routing on Vercel

---

## Structure
```text
week05/my-app/
├── components/     # Navbar (NavLink), Panel
├── pages/          # Accordion, Dropdown, Modal, Gallery
├── App.jsx
├── main.jsx
├── index.html
├── vite.config.js
└── vercel.json
```

---

## Run
```bash
cd week05/my-app
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
1. Added NavLink navbar for active route highlight
2. Created Gallery page using shared components
3. Improved navigation, structure, and deployment