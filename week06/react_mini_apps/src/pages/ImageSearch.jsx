import { useEffect, useState } from 'react'
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY
const PER_PAGE = 24

export default function ImageSearch(){
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  useEffect(()=>{ void featured() },[])
  const featured = async () => {
    if (!ACCESS_KEY) return
    setLoading(true); setError('')
    try{
      const url = new URL('https://api.unsplash.com/search/photos')
      url.searchParams.set('query', 'editorial')
      url.searchParams.set('page', '1')
      url.searchParams.set('per_page', String(PER_PAGE))
      const res = await fetch(url, { headers:{ Authorization:`Client-ID ${ACCESS_KEY}` } })
      const data = await res.json()
      setList(data.results || []); setTotal(data.total || 0); setPage(1)
    }catch(e){ setError(String(e)) } finally{ setLoading(false) }
  }

  const search = async (term, pageNo=1) => {
    if (!ACCESS_KEY){ setError('Missing Unsplash Access Key'); return }
    const keyword = term.trim(); if (!keyword){ setError('Type a keyword'); return }
    setLoading(true); setError('')
    try{
      const url = new URL('https://api.unsplash.com/search/photos')
      url.searchParams.set('query', keyword)
      url.searchParams.set('page', String(pageNo))
      url.searchParams.set('per_page', String(PER_PAGE))
      const res = await fetch(url, { headers:{ Authorization:`Client-ID ${ACCESS_KEY}` } })
      if(!res.ok){ setError('Request failed: ' + res.status); setLoading(false); return }
      const data = await res.json()
      setList(data.results || []); setTotal(data.total || 0); setPage(pageNo)
    }catch(e){ setError(String(e)) } finally{ setLoading(false) }
  }

  const pages = Math.ceil(total / PER_PAGE) || 1
  const prev = () => page>1 && search(q||'editorial', page-1)
  const next = () => page<pages && search(q||'editorial', page+1)

  const openPreview = (p) => setPreview(p)
  const closePreview = () => setPreview(null)
  const goUnsplash = (p) => {
    if(!p) return
    const url = p.links?.html ? `${p.links.html}?utm_source=your_app_name&utm_medium=referral` : p.urls?.full
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="section">
      <div className="searchbar">
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search high-quality photos…" />
        <button className="search-btn" onClick={()=>search(q,1)} disabled={loading}>{loading?'Searching…':'Search'}</button>
      </div>
      {error && <p className="error" style={{textAlign:'center'}}>⚠ {error}</p>}

      <div className="gallery">
        {list.map(p=>(
          <figure key={p.id} className="photo" onClick={()=>openPreview(p)} title="Open">
            <img src={p.urls.small} alt={p.alt_description || 'Unsplash Photo'} loading="lazy" />
          </figure>
        ))}
      </div>

      {list.length>0 && (
        <div className="searchbar" style={{marginTop:'var(--space-4)'}}>
          <button onClick={prev} disabled={loading||page<=1}>Prev</button>
          <span className="badge">Page {page} / {pages} · {total} results</span>
          <button onClick={next} disabled={loading||page>=pages}>Next</button>
        </div>
      )}

      {preview && (
        <div className="modal" onClick={closePreview}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <img
              src={preview.urls.regular}
              alt={preview.alt_description || 'Photo'}
              onClick={()=>goUnsplash(preview)}
              title="Open on Unsplash"
            />
          </div>
        </div>
      )}
    </section>
  )
}