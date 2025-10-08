// src/pages/DropdownPage.jsx
import { useState } from 'react'
import Panel from '../components/Panel'
import Dropdown from '../components/Dropdown'

export default function DropdownPage() {
  const [fruit, setFruit] = useState(null)
  const [theme, setTheme] = useState('light')

  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'coconut', label: 'Coconut' },
  ]

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'System' },
    { value: 'dark', label: 'Dark (disabled)', disabled: true },
  ]

  return (
    <div className="space-y-4">
      <Panel>
        <h2 className="text-xl font-semibold">Dropdown</h2>
        <p className="text-sm text-gray-600">Click outside to close the menu.</p>
      </Panel>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel>
          <div className="font-medium mb-2">Pick a fruit</div>
          <Dropdown options={fruitOptions} value={fruit} onChange={setFruit} placeholder="Select a fruit" />
          <div className="mt-3 text-sm text-gray-600">
            Selected: <b>{fruit ?? 'none'}</b>
          </div>
        </Panel>

        <Panel>
          <div className="font-medium mb-2">Choose theme</div>
          <Dropdown options={themeOptions} value={theme} onChange={setTheme} placeholder="Theme" />
          <div className="mt-3 text-sm text-gray-600">
            Current theme: <b>{theme}</b>
          </div>
        </Panel>
      </div>
    </div>
  )
}