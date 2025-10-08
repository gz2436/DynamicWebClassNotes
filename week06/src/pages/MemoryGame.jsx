import { useEffect, useMemo, useState } from 'react'
const EMOJIS=['🍎','🍌','🍓','🍒','🍑','🍉']
const shuffle=(a)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export default function MemoryGame(){
  const deck=useMemo(()=>shuffle([...EMOJIS,...EMOJIS]).map((v,i)=>({id:i,value:v})),[])
  const [flipped,setFlipped]=useState([])
  const [matched,setMatched]=useState(new Set())
  const [moves,setMoves]=useState(0)
  const [lock,setLock]=useState(false)
  useEffect(()=>{
    if(flipped.length===2){
      setLock(true);setMoves(m=>m+1)
      const [a,b]=flipped;const ca=deck[a],cb=deck[b];const ok=ca.value===cb.value
      const t=setTimeout(()=>{ if(ok){setMatched(p=>new Set([...p,a,b]))} setFlipped([]);setLock(false)},700)
      return ()=>clearTimeout(t)
    }
  },[flipped,deck])
  const handleFlip=(i)=>{ if(lock||flipped.includes(i)||matched.has(i))return; setFlipped(f=>f.length<2?[...f,i]:f) }
  const reset=()=>{setFlipped([]);setMatched(new Set());setMoves(0)}
  const win=matched.size===deck.length
  return (<div>
    <div className="flex items-center gap-3 mb-4">
      <button className="btn bg-white" onClick={reset}>Reset</button>
      <span className="text-sm text-slate-600">Moves: {moves}</span>
      {win&&<span className="text-sm text-green-700">🎉 You win!</span>}
    </div>
    <div className="grid grid-cols-4 gap-3">
      {deck.map((c,i)=>{const open=flipped.includes(i)||matched.has(i);return(
        <button key={c.id} onClick={()=>handleFlip(i)}
          className={`h-24 text-3xl flex items-center justify-center rounded-lg border transition ${open?'bg-indigo-50':'bg-slate-200 hover:bg-slate-300'}`}>
          {open?c.value:'❓'}
        </button>
      )})}
    </div>
  </div>)}
