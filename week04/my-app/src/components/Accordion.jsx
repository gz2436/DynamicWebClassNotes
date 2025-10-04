// src/components/Accordion.jsx
import { useState } from 'react'
import PropTypes from 'prop-types'

export default function Accordion({ items = [], multiple = false, className = '' }) {
  // 用布尔数组记录每一项是否打开
  const [openList, setOpenList] = useState(() => items.map(() => false))

  const toggle = (i) => {
    setOpenList(prev => {
      if (multiple) {
        const next = [...prev]
        next[i] = !next[i]
        return next
      } else {
        // 互斥：只开当前，其他都关
        return prev.map((_, idx) => idx === i ? !prev[i] : false)
      }
    })
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((it, i) => {
        const title = it.title ?? it.label ?? `Item ${i + 1}`
        const open = !!openList[i]
        return (
          <div key={i} className="border rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => toggle(i)}
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 focus:outline-none relative z-10"
            >
              <span className="font-medium text-gray-900">{title}</span>
              <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden>▾</span>
            </button>
            {open && (
              <div className="px-4 py-3 border-t text-gray-700 text-sm bg-white">
                {it.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      label: PropTypes.node,
      content: PropTypes.node,
    })
  ).isRequired,
  multiple: PropTypes.bool,
  className: PropTypes.string,
}