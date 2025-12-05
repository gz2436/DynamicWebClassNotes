import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Panel from './components/Panel'

// keep your existing pages if you have them
import ButtonsPage from './pages/ButtonsPage'
import AccordionPage from './pages/AccordionPage'
import DropdownPage from './pages/DropdownPage'
import ModalPage from './pages/ModalPage'

function HomePage() {
  return (
    <Panel>
      <h1 className="text-2xl font-bold mb-1">Week 4 — Component Library (Continued)</h1>
      <p className="text-sm text-gray-600">
        This week adds <b>Dropdown</b>, <b>Modal (Portal)</b>, and a shared <b>Panel</b>. All components include PropTypes.
      </p>
    </Panel>
  )
}

export default function App() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/buttons', label: 'Buttons' },
    { href: '/accordion', label: 'Accordion' },
    { href: '/dropdown', label: 'Dropdown' },
    { href: '/modal', label: 'Modal' },
  ]

  return (
    <div className="min-h-screen">
      <Navbar items={navItems} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buttons" element={<ButtonsPage />} />
          <Route path="/accordion" element={<AccordionPage />} />
          <Route path="/dropdown" element={<DropdownPage />} />
          <Route path="/modal" element={<ModalPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}