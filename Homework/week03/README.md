# Week 03 – Component Library (Buttons + Accordion)

## 🚀 Overview
For this week I built a small component library with **React** and **Tailwind CSS**.  
The main goals were:
- Build a reusable `<Button />` component with multiple styles and states.
- Create an `<Accordion />` that can expand and collapse smoothly.
- Use **React Router** to organize pages (`/buttons` and `/accordion`).

---

## 📂 Project Structure

```text
Week03/
└─ my-app/
   ├─ src/
   │  ├─ components/        # Button + Accordion components
   │  ├─ pages/             # ButtonsPage + AccordionPage
   │  └─ main.jsx           # Router + Layout
   ├─ index.html
   ├─ tailwind.config.js
   ├─ package.json
   └─ README.md
```

---

## 🛠️ How to Run
1. Clone this repo and navigate into the Week03 project:
   ```bash
   cd Week03/my-app

2.	Install dependencies:   
   ```bash
    npm install

3.	Start the dev server:
   ```bash
    npm run dev

4.	Open the local server link in your browser (usually http://localhost:5173).

## 🎨 Features

1. Button Component
	· Variants: primary, secondary, success, warning, danger, outline
	· Sizes: sm, md, lg
	· States: disabled, loading
	· pill option for fully rounded buttons
	· Supports icons via react-icons

2. Accordion Component
	· Expand/collapse panels with smooth animation
	· Chevron icon rotates on toggle
	· Typography enhanced with @tailwindcss/typography (prose styles)
	· Supports rich content: paragraphs, lists, code blocks

3. Routing
	· /buttons: Demonstrates all Button variants and states
	· /accordion: Demonstrates Accordion with English content + typography

## 📸 Screenshots

### Home page
![Home Page](./images/home.png)

### Buttons page
![Buttons Page](./images/buttons.png)

### Accordion Page
![Accordion Page](./images/accordion.png)

❤️