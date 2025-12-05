import { useState } from 'react'
import { GoChevronDown } from 'react-icons/go'

// 带动画 + 图标旋转
export default function Accordion({ items, defaultOpen = -1 }) {
  const [open, setOpen] = useState(defaultOpen)

  const toggle = (idx) => setOpen((p) => (p === idx ? -1 : idx))

  return (
    <div className="divide-y border rounded-2xl bg-white shadow-sm">
      {items.map((it, idx) => {
        const expanded = idx === open
        return (
          <div key={it.id} className="p-4">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="font-medium text-slate-800">{it.label}</span>
              <GoChevronDown
                className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>

            {/* 动画容器：max-height 做过渡，aria-hidden 便于无障碍 */}
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300
                         ${expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              aria-hidden={!expanded}
            >
              <div className="pt-2 text-slate-600">{it.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}