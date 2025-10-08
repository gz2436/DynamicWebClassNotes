import { useState } from 'react'
import MemoryGame from './pages/MemoryGame.jsx'
import UnsplashGallery from './pages/UnsplashGallery.jsx'
const TABS=[{key:'memory',label:'Memory Game'},{key:'unsplash',label:'Unsplash Gallery'}]
export default function App(){
  const [tab,setTab]=useState('memory')
  return(<div className="container-narrow p-6">
    <h1 className="text-3xl font-bold mb-2">Week06 Starter</h1>
    <p className="text-slate-600 mb-6">useState/useEffect + axios</p>
    <nav className="flex gap-2 mb-6">{TABS.map(t=>(
      <button key={t.key} onClick={()=>setTab(t.key)} className={`btn ${tab===t.key?'bg-black text-white':'bg-white'}`}>{t.label}</button>
    ))}</nav>
    <div className="rounded-xl border bg-white shadow-sm p-4">
      {tab==='memory'&&<MemoryGame/>}
      {tab==='unsplash'&&<UnsplashGallery/>}
    </div>
  </div>)}
