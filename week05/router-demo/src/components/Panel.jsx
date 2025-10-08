// src/components/Panel.jsx
import PropTypes from 'prop-types'

export default function Panel({ className = '', children, ...rest }) {
  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm ${className}`} {...rest}>
      {children}
    </div>
  )
}

Panel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}