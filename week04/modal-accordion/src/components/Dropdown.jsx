// src/components/Dropdown.jsx
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export default function Dropdown({ options = [], value, onChange, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = options.find((o) => o.value === value) || null

  useEffect(() => {
    const onDocumentClick = (e) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [])

  const choose = (opt) => {
    if (opt?.disabled) return
    onChange?.(opt.value)
    setOpen(false)
  }

  const onKeyDownItem = (e, opt) => {
    if (opt?.disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(opt)
    }
  }

  const onKeyDownButton = (e) => {
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative inline-block w-64">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full border rounded px-3 py-2 text-left flex justify-between items-center"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDownButton}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full border rounded bg-white shadow"
        >
          {options.map((opt) => {
            const isActive = value === opt.value
            const isDisabled = !!opt.disabled
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isActive}
                tabIndex={isDisabled ? -1 : 0}
                onClick={() => choose(opt)}
                onKeyDown={(e) => onKeyDownItem(e, opt)}
                className={[
                  'px-3 py-2',
                  isDisabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100',
                  isActive ? 'bg-gray-50 font-medium' : '',
                ].join(' ')}
              >
                {opt.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
}