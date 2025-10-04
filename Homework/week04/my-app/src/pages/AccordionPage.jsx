// src/pages/AccordionPage.jsx
import Panel from '../components/Panel'
import Accordion from '../components/Accordion'

const items = [
  {
    title: 'Overview of Week 4',
    content: (
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
        <li>Reusable <b>Panel</b> for consistent layouts</li>
        <li><b>Dropdown</b> (controlled; closes on outside click)</li>
        <li><b>Modal</b> via React <b>Portal</b> (overlay/ESC close)</li>
        <li><b>PropTypes</b> added to all components</li>
      </ul>
    ),
  },
  {
    title: 'Dropdown — Key Points',
    content: (
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
        <li>State-driven selection with <code>useState</code></li>
        <li>Outside click closes the menu</li>
        <li>Selected option is highlighted</li>
      </ul>
    ),
  },
  {
    title: 'Modal — Key Points',
    content: (
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
        <li>Renders into <code>#modal-root</code> via <code>createPortal</code></li>
        <li>Overlay click closes the dialog</li>
        <li>ESC key closes the dialog</li>
      </ul>
    ),
  },
  {
    title: 'Panel — Purpose',
    content: (
      <p className="text-sm text-gray-700">
        A shared container (border, padding, rounded corners) to keep sections consistent and reduce repeated markup.
      </p>
    ),
  },
  {
    title: 'PropTypes — Why it matters',
    content: (
      <p className="text-sm text-gray-700">
        Runtime prop validation in development surfaces incorrect props early and improves DX.
      </p>
    ),
  },
]

export default function AccordionPage() {
  return (
    <div className="space-y-4">
      <Panel>
        <h2 className="text-xl font-semibold">Week 4 Class Notes</h2>
        <p className="text-sm text-gray-600">Click a section to expand.</p>
      </Panel>
      <Panel>
        {/* keep minimal, default closed; allow multiple open */}
        <Accordion items={items} multiple />
      </Panel>
    </div>
  )
}