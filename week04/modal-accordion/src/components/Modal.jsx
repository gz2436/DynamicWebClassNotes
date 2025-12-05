// src/components/Modal.jsx
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

const getPortalRoot = () => document.getElementById('modal-root')

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose?.()
    if (open) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded shadow-xl p-6 w-[min(90vw,600px)]">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    getPortalRoot()
  )
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
}