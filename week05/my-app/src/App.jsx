// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Panel from './components/Panel'

import AccordionPage from './pages/AccordionPage'
import DropdownPage from './pages/DropdownPage'
import ModalPage from './pages/ModalPage'
import GalleryPage from './pages/GalleryPage'   // ← 新增

function HomePage() {
  return (
    <Panel>
      <h1 className="text-2xl font-bold mb-1">Week 5 — Component Library (Navigation + Your Page)</h1>
      <p className="text-sm text-gray-600">
        This week adds <b>active navigation (NavLink)</b> and one <b>custom page</b> built on our shared Panel.
      </p>
    </Panel>
  )
}

export default function App() {
  const navItems = [
    { href: '/', label: 'Home', end: true },
    { href: '/accordion', label: 'Accordion' },
    { href: '/dropdown', label: 'Dropdown' },
    { href: '/modal', label: 'Modal' },
    { href: '/gallery', label: 'Gallery' }, // ← 新增
  ]

  return (
    <div className="min-h-screen">
      <Navbar items={navItems} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accordion" element={<AccordionPage />} />
          <Route path="/dropdown" element={<DropdownPage />} />
          <Route path="/modal" element={<ModalPage />} />
          <Route path="/gallery" element={<GalleryPage />} /> {/* ← 新增 */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}