import { useState } from 'react'
import RecipePage from './pages/RecipePage.jsx'
import HelloState from './pages/HelloState.jsx'
import HtmlToJsxNotes from './pages/HtmlToJsxNotes.jsx'

const TABS = [
  { key: 'recipe', label: 'Recipe Site (JSX + Components)' },
  { key: 'state', label: 'Hello State' },
  { key: 'notes', label: 'HTML → JSX Notes' },
]

export default function App() {
  const [tab, setTab] = useState('recipe')

  return (
    <div className="container-narrow p-6">
      <h1 className="text-3xl font-bold mb-4">Week01-02 React Starter</h1>
      <nav className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 rounded border text-sm ${tab === t.key ? 'bg-black text-white' : 'bg-white'}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'recipe' && <RecipePage />}
      {tab === 'state' && <HelloState />}
      {tab === 'notes' && <HtmlToJsxNotes />}
    </div>
  )
}
