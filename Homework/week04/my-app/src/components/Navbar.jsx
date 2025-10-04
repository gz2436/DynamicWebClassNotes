// src/components/Navbar.jsx
import PropTypes from 'prop-types'

export default function Navbar({ items = [] }) {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="text-sm text-gray-500">Week 4 · Component Library</div>
        <div className="flex items-center gap-4">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="text-sm text-gray-700 hover:text-black px-2 py-1 rounded hover:bg-gray-100"
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
}