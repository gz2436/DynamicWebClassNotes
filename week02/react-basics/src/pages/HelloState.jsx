import { useState } from 'react'

export default function HelloState() {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Hello State</h2>
      <p className="text-slate-600">Two tiny interactions using <code>useState</code>.</p>

      <div className="flex items-center gap-3">
        <button className="px-3 py-2 border rounded" onClick={() => setCount(c => c + 1)}>
          Clicked {count} times
        </button>
        <button
          className={`px-3 py-2 border rounded ${liked ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setLiked(v => !v)}
        >
          {liked ? '♥ Liked' : '♡ Like'}
        </button>
      </div>
    </div>
  )
}
