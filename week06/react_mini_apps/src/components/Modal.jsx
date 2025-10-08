export default function Modal({ open, onClose, children, actions }) {
  if (!open) return null
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        {children}
        <div className="modal-actions">
          <div className="badge">Preview</div>
          <div style={{display:'flex', gap:8}}>
            {actions}
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}