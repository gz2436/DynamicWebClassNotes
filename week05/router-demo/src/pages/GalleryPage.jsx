// src/pages/GalleryPage.jsx
import Panel from '../components/Panel'

const data = [
  { title: 'Accordion', desc: 'Notes and collapsible sections.' },
  { title: 'Dropdown', desc: 'Controlled select with outside-click close.' },
  { title: 'Modal', desc: 'Portal-based dialog with overlay/ESC.' },
  { title: 'Panel', desc: 'Shared container for consistent layout.' },
]

export default function GalleryPage() {
  return (
    <div className="space-y-4">
      <Panel>
        <h2 className="text-xl font-semibold">Gallery</h2>
        <p className="text-sm text-gray-600">A small grid of cards built with the shared Panel.</p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((item, i) => (
          <Panel key={i} className="transition hover:shadow-md">
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
          </Panel>
        ))}
      </div>
    </div>
  )
}