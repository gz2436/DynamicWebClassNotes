# Week5 · Component Library (Active Nav + Custom Page)

## 📘 Overview
Week5 builds on Week4’s component library.  

This week adds **active navigation (NavLink)** and a **new custom page (Gallery)** to show how to expand the app structure.

---

## ✨ Features
1. **Active Navbar**
  1. Replaced `<a>` with `<NavLink>` for smooth SPA navigation  
  2. Highlights the current route with active styling  
2. **New Page — Gallery**
  1. `/gallery` shows a simple grid built with the shared `Panel`  
  2. Demonstrates layout reuse and data mapping  
3. **Routing**
  1. Added `/gallery` to `App.jsx`  
  2. Kept Accordion, Dropdown, and Modal from Week4  
4. **Deployment**
     Added `vercel.json` to fix SPA routing on Vercel

---

## 🗂️ Structure
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

## ▶️ Run
```bash
cd week05/my-app
```

```bash
npm install
```

```bash
npm run dev
```

## 🔗 Demo
```
https://dynamic-web-week05.vercel.app/
```


## ✅ Summary
1. Added NavLink navbar for active route highlight
2. Created Gallery page using shared components
3. Improved navigation, structure, and deployment