import { useEffect, useState } from 'react'
import axios from 'axios'
const api=axios.create({ baseURL:'https://api.unsplash.com' })
export default function UnsplashGallery(){
  const [query,setQuery]=useState('cats')
  const [photos,setPhotos]=useState([])
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const key=import.meta.env.VITE_UNSPLASH_KEY
  const search=async(q)=>{
    if(!key){ setError('Missing VITE_UNSPLASH_KEY in .env'); return }
    setLoading(true); setError('')
    try{
      const res=await api.get('/search/photos',{ params:{ query:q, per_page:20 }, headers:{ Authorization:`Client-ID ${key}` }})
      setPhotos(res.data.results||[])
    }catch(e){ setError(e?.response?.data?.errors?.[0]||e.message||'Request failed') }
    finally{ setLoading(false) }
  }
  useEffect(()=>{ search(query) },[])
  const onSubmit=(e)=>{ e.preventDefault(); search(query) }
  return (<div>
    <form onSubmit={onSubmit} className="flex gap-2 mb-4">
      <input className="border rounded px-3 py-2 w-full" placeholder="Search Unsplash" value={query} onChange={e=>setQuery(e.target.value)}/>
      <button className="btn bg-black text-white" type="submit">Search</button>
    </form>
    {loading&&<div className="text-slate-600">Loading...</div>}
    {error&&<div className="text-red-700">Error: {error}</div>}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map(p=>(
        <a key={p.id} href={p.links.html} target="_blank" rel="noreferrer" className="block">
          <img src={p.urls.small} alt={p.alt_description||'unsplash'} className="w-full h-44 object-cover rounded" loading="lazy"/>
          <div className="text-xs text-slate-600 mt-1">@{p.user.username}</div>
        </a>
      ))}
    </div>
    {!loading&&!error&&photos.length===0&&<div className="text-slate-600">No results.</div>}
  </div>)}
