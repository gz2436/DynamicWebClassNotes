// src/components/Navbar.jsx
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

export default function Navbar({ items = [] }) {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="text-sm text-gray-500">Week 5 · Component Library</div>
        <div className="flex items-center gap-2">
          {items.map(it => (
            <NavLink
              key={it.href}
              to={it.href}
              className={({ isActive }) =>
                [
                  'text-sm px-3 py-1.5 rounded',
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black',
                ].join(' ')
              }
              end={it.end} // 对于 "/" 这种精确匹配可传 end: true
            >
              {it.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({ href: PropTypes.string.isRequired, label: PropTypes.string.isRequired, end: PropTypes.bool })
  ),
}