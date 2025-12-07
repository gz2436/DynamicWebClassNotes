import React from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import Footer from './Footer.tsx';
import FloatingBackButton from './FloatingBackButton.tsx';
import ScrollManager from './ScrollManager.tsx';
import ScrollToTop from './ScrollToTop.tsx';

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
    const location = useLocation();
    const [showLogo, setShowLogo] = React.useState(false);

    // Pages that have their own sophisticated navigation/header and don't need the default header/back button
    const isHome = location.pathname === '/';
    // const showFloatingBack = !isHome && !location.pathname.startsWith('/share'); 
    // Actually, Layout uses <Outlet> in the original file I viewed (Step 2714), BUT the `replace` logic I tried to inject (Step 2716) was based on a different version (children prop) which seemed to come from my "thought" instead of the actual file view.
    // The actual file view (Step 2714) uses `<Outlet />` and has a sticky header with logic for `showLogo`.
    // I should RESPECT THE ORIGINAL logic (Step 2714) and just add types.

    React.useEffect(() => {
        const handleScroll = () => {
            // Only apply scroll logic on Home page ('/')
            if (location.pathname === '/') {
                const show = window.scrollY > window.innerHeight - 100; // Show slightly before full scroll
                setShowLogo(show);
            } else {
                setShowLogo(true);
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[#080808] text-white font-mono flex flex-col">
            <ScrollManager />
            <ScrollToTop />

            {/* Accessibility: Skip to Content */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-black px-4 py-2 font-bold uppercase tracking-widest text-xs">
                Skip to Content
            </a>

            {/* Global Header */}
            <header
                className={`fixed top-0 left-0 w-full p-6 pt-[calc(1.5rem+var(--sat))] z-40 flex justify-center items-center pointer-events-none transition-opacity duration-200 ${showLogo ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className={`pointer-events-auto mt-2 md:mt-6 ${showLogo ? '' : 'pointer-events-none'}`}>
                    <Link to="/" state={{ resetScroll: true }} onClick={() => window.scrollTo(0, 0)} className="group block">
                        <span className="block border border-white px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors backdrop-blur-md bg-black/20 font-mono font-bold">
                            DAILY_FILM
                        </span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main id="main-content" className="flex-grow">
                <Outlet />
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
