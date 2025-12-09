import React, { Suspense, lazy, useState, useEffect } from 'react';
// Force Refresh 2
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import PageLoader from './components/PageLoader.tsx';
import ScrollManager from './components/ScrollManager.tsx';
import { AnimatePresence } from 'framer-motion';

// Eager load critical pages
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';
import Layout from './components/Layout.tsx';


import { Presentation } from './presentation';
// Lazy load secondary pages
const MovieDetail = lazy(() => import('./pages/MovieDetail.tsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.tsx'));
const Manifesto = lazy(() => import('./pages/Manifesto.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const PersonDetail = lazy(() => import('./pages/PersonDetail.tsx'));
const CompanyDetail = lazy(() => import('./pages/CompanyDetail.tsx'));
const Feedback = lazy(() => import('./pages/Feedback.tsx'));

// Loading Fallback


const Toast = () => {
    const [msg, setMsg] = useState(null);
    useEffect(() => {
        const handler = (e) => {
            setMsg(e.detail.message);
            setTimeout(() => setMsg(null), 3000);
        };
        window.addEventListener('API_ERROR', handler);
        return () => window.removeEventListener('API_ERROR', handler);
    }, []);

    if (!msg) return null;
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-4 py-2 text-xs font-mono uppercase tracking-widest z-[100] border border-red-500/30 backdrop-blur-md">
            {msg}
        </div>
    );
};

function AnimatedRoutes() {
    const location = useLocation();
    const navType = useNavigationType();

    return (
        <AnimatePresence
            mode="wait"
        >
            <Suspense fallback={<PageLoader />}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/presentation" element={<Presentation />} />
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />

                        <Route path="/movie/:id" element={<MovieDetail />} />
                        <Route path="/manifesto" element={<Manifesto />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/popular" element={<CategoryPage type="popular" title="Popular Movies" />} />
                        <Route path="/now-playing" element={<CategoryPage type="now_playing" title="Now Playing" />} />
                        <Route path="/upcoming" element={<CategoryPage type="upcoming" title="Upcoming" />} />
                        <Route path="/top-rated" element={<CategoryPage type="top_rated" title="Top Rated" />} />
                        <Route path="/person/:id" element={<PersonDetail />} />
                        <Route path="/company/:id" element={<CompanyDetail />} />
                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
}

function App() {
    React.useEffect(() => {
        if ('scrollRestoration' in window.history) {
            const prev = window.history.scrollRestoration;
            window.history.scrollRestoration = 'manual';
            return () => {
                window.history.scrollRestoration = prev;
            };
        }
    }, []);

    return (
        <Router>
            <ScrollManager />
            <div className="bg-[#080808] min-h-screen text-white selection:bg-white selection:text-black">
                <AnimatedRoutes />
            </div>
            <Toast />
        </Router>
    );
}

export default App;
