// src/pages/ModalPage.jsx
import { useState } from 'react'
import Panel from '../components/Panel'
import Modal from '../components/Modal'

export default function ModalPage() {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState([{ title: 'Week 4 goals', body: 'Polish component library and PropTypes' }])
  const [form, setForm] = useState({ title: '', body: '' })

  const save = () => {
    const title = form.title.trim()
    if (!title) return
    setNotes([{ title, body: form.body.trim() }, ...notes])
    setForm({ title: '', body: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <Panel className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Modal</h2>
          <p className="text-sm text-gray-600">Portal-based dialog with ESC and overlay close.</p>
        </div>
        <button className="border rounded px-3 py-2 hover:bg-gray-50" onClick={() => setOpen(true)}>
          New note
        </button>
      </Panel>

      <Panel>
        <div className="grid gap-3">
          {notes.map((n, i) => (
            <div key={i} className="p-3 border rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Note</div>
              <div className="font-medium">{n.title || '(untitled)'}</div>
              {n.body && <div className="text-sm text-gray-600 mt-1">{n.body}</div>}
            </div>
          ))}
          {notes.length === 0 && <div className="text-sm text-gray-500">No notes yet.</div>}
        </div>
      </Panel>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-semibold mb-3">New note</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Body (optional)</label>
            <textarea
              className="w-full border rounded px-3 py-2 h-28"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button className="px-3 py-2 rounded border" onClick={() => setOpen(false)}>Cancel</button>
            <button
              className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
              disabled={!form.title.trim()}
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}