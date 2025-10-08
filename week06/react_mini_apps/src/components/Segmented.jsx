export default function Segmented({ value, onChange, options }) {
  const idx = Math.max(0, options.findIndex(o => o.value === value))
  return (
    <div className="segment" data-idx={idx}>
      <div className="thumb" aria-hidden />
      {options.map(opt => (
        <button
          key={opt.value}
          className={value === opt.value ? 'active' : ''}
          onClick={()=>onChange(opt.value)}
          role="tab" aria-selected={value===opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}