import { NavLink, Routes, Route } from 'react-router-dom'
import MemoryGame from './pages/MemoryGame.jsx'
import ImageSearch from './pages/ImageSearch.jsx'

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container nav-row">
          <h1 className="brand">Week06 React Mini Apps</h1>
          <nav className="nav">
            <NavLink to="/" end className="nav-link">Home</NavLink>
            <NavLink to="/memory" className="nav-link">Memory Game</NavLink>
            <NavLink to="/search" className="nav-link">Image Search</NavLink>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/search" element={<ImageSearch />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

function Home(){
  return (
    <section className="section">
      <div className="home-hero">
        <h2 className="home-title">Welcome</h2>
        <div className="home-cta">
          <NavLink className="btn" to="/memory">Memory Game</NavLink>
          <NavLink className="btn" to="/search">Image Search</NavLink>
        </div>
      </div>
    </section>
  )
}
function NotFound(){ return <section className="section"><p>Page not found.</p></section> }