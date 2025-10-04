import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import ButtonsPage from './pages/ButtonsPage.jsx'
import AccordionPage from './pages/AccordionPage.jsx'
import './index.css'

/** Tab-style navigation links */
function TabLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'inline-block px-4 py-2 rounded-full border transition-colors',
          'text-slate-700 border-slate-300 hover:bg-slate-50',
          isActive && 'bg-slate-900 text-white border-slate-900',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

/** Layout with top navigation + page outlet */
function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">
              Component Library <span className="font-bold">Demo</span>
            </h1>
            <p className="text-slate-500">Week 3 · Tailwind + React Router</p>
          </div>

          {/* Show tabs on home, show Back button on subpages */}
          {isHome ? (
            <nav className="flex gap-3">
              <TabLink to="/buttons">Buttons</TabLink>
              <TabLink to="/accordion">Accordion</TabLink>
            </nav>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              ← Back
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

/** Home page */
function Home() {
  return (
    <div className="space-y-4">
      <p className="text-slate-600">
        This is a tiny component library demo. Use the tabs above to explore.
      </p>
      <div className="text-slate-500">Pick a page: Buttons or Accordion.</div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },                // '/'
      { path: 'buttons', element: <ButtonsPage /> },     // '/buttons'
      { path: 'accordion', element: <AccordionPage /> }, // '/accordion'
    ],
  },
])

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)