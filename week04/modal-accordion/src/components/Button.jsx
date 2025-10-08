import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge'

export default function Button({
  children,
  variant = 'primary', // primary | secondary | success | warning | danger | outline
  size = 'md',         // sm | md | lg
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const palette = {
    primary:  'bg-blue-600 border-blue-600 text-white hover:bg-blue-700',
    secondary:'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200',
    success:  'bg-green-600 border-green-600 text-white hover:bg-green-700',
    warning:  'bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600',
    danger:   'bg-red-600 border-red-600 text-white hover:bg-red-700',
    outline:  'bg-transparent border-slate-300 text-slate-700 hover:bg-slate-50'
  }

  const sizes = {
    sm: 'text-sm px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',   // 默认
    lg: 'text-base px-4 py-2'
  }

  const base =
    'inline-flex items-center gap-2 border rounded-lg transition-colors ' +
    'disabled:opacity-60 disabled:cursor-not-allowed'

  const classes = twMerge(base, palette[variant] ?? palette.primary, sizes[size], className)

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary','secondary','success','warning','danger','outline']),
  size: PropTypes.oneOf(['sm','md','lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  pill: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
  children: PropTypes.node,
};