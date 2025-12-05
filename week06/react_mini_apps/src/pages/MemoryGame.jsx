import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Segmented from '../components/Segmented'

const POOL = ['🐶','🐱','🐭','🦊','🐼','🐵','🦉','🐸','🐻','🐰','🐧','🦄','🐨','🐯']

const makeDeck = (pairs) => {
  const pool = POOL.slice(0, pairs)
  const base = [...pool, ...pool].map((s, i) => ({ id:`${s}-${i}`, symbol:s, matched:false }))
  for (let i = base.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [base[i], base[j]] = [base[j], base[i]] }
  return base
}

export default function MemoryGame(){
  const [pairs, setPairs] = useState(2)  // Easy: 2 pairs -> 4 cards
  const [deck, setDeck] = useState(()=>makeDeck(2))
  const [a, setA] = useState(null)
  const [b, setB] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [turns, setTurns] = useState(0)
  const [matched, setMatched] = useState(0)

  const onFlip = (card) => {
    if (card.matched || disabled) return
    if (!a) setA(card)
    else if (!b && card.id !== a.id) setB(card)
  }

  useEffect(()=>{
    if (!a || !b) return
    setDisabled(true)
    const isMatch = a.symbol === b.symbol
    const t = setTimeout(()=>{
      if (isMatch) {
        setDeck(prev => prev.map(c => c.symbol === a.symbol ? {...c, matched:true} : c))
        setMatched(m => m + 1)
      }
      setA(null); setB(null); setTurns(t=>t+1); setDisabled(false)
    }, isMatch ? 240 : 700)
    return ()=>clearTimeout(t)
  }, [a,b])

  const totalPairs = useMemo(()=>pairs, [pairs])
  const gridClass = pairs===2 ? 'e' : pairs===4 ? 'm' : 'h'

  const reset = (p = pairs) => { setDeck(makeDeck(p)); setA(null); setB(null); setTurns(0); setMatched(0) }

  return (
    <section className="section">
      <h2 className="title">Memory Game</h2>

      <div className="toolbar">
        <Segmented
          value={pairs}
          onChange={(v)=>{ setPairs(v); reset(v) }}
          options={[ {value:2, label:'Easy'}, {value:4, label:'Medium'}, {value:6, label:'Hard'} ]}
        />
      </div>

      <div className="board">
        <div className={`grid ${gridClass}`}>
          {deck.map(card => (
            <Card
              key={card.id}
              card={card}
              flipped={(a&&a.id===card.id)||(b&&b.id===card.id)||card.matched}
              disabled={disabled}
              onFlip={onFlip}
            />
          ))}
        </div>
      </div>

      <div className="toolbar">
        <span className="badge">Turns: {turns}</span>
        <span className="badge">Matches: {matched}/{totalPairs}</span>
        <button className="btn" onClick={()=>reset()}>Restart</button>
      </div>
    </section>
  )
}