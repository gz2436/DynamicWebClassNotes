import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPopularMovies } from '../services/tmdbClient';

const Footer: React.FC = () => {
    const navigate = useNavigate();

    const handleRandom = async () => {
        try {
            // Fetch a random page (1-5) to get variety
            const randomPage = Math.floor(Math.random() * 5) + 1;
            const response = await getPopularMovies(randomPage);
            const movies = response.results || [];
            if (movies && movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                navigate(`/movie/${randomMovie.id}`, { state: { category: 'random' } });
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error("Failed to fetch random movie:", error);
        }
    };

    return (
        <footer className="bg-[#080808] text-white/40 py-24 border-t border-white/10 font-mono text-xs">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Col 1: Brand */}
                <div className="space-y-4">
                    <Link
                        to="/"
                        state={{ resetScroll: true }}
                        className="text-white font-bold uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity block text-base"
                    >
                        DAILY_FILM
                    </Link>
                    <p className="leading-relaxed">
                        Experimental cinema archive.<br />
                        Est. 2025. New York, NY.<br />
                        <span className="inline-block mt-2 px-1.5 py-0.5 border border-white/20 rounded text-[9px] uppercase tracking-wider text-white/30">
                            v3.0.0
                        </span>
                    </p>
                </div>

                {/* Col 2: Navigation */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase tracking-widest">Navigation</h3>
                    <ul className="space-y-2 text-white/60">
                        <li><Link to="/manifesto" className="block hover:text-white transition-colors">MANIFESTO</Link></li>
                        <li><Link to="/about" className="block hover:text-white transition-colors">ABOUT</Link></li>
                        <li><Link to="/feedback" className="block hover:text-white transition-colors">FEEDBACK</Link></li>
                        <li>
                            <button
                                onClick={handleRandom}
                                className="hover:text-white transition-colors uppercase text-left w-full h-full block"
                            >
                                RANDOM
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Col 3: Discover */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase tracking-widest">Discover</h3>
                    <div className="flex flex-col space-y-2 text-white/60">
                        <Link to="/popular" state={{ resetPage: true }} className="hover:text-white transition-colors w-fit uppercase">Popular</Link>
                        <Link to="/now-playing" state={{ resetPage: true }} className="hover:text-white transition-colors w-fit uppercase">Now Playing</Link>
                        <Link to="/upcoming" state={{ resetPage: true }} className="hover:text-white transition-colors w-fit uppercase">Upcoming</Link>
                        <Link to="/top-rated" state={{ resetPage: true }} className="hover:text-white transition-colors w-fit uppercase">Top Rated</Link>
                    </div>
                </div>

                {/* Column 4: Project */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Project</h4>
                    <p className="text-white/60">
                        A dynamic web experiment.<br />
                        Powered by TMDB API.
                    </p>
                    <p className="text-white/40">© 2025 Daily_Film.</p>
                </div>

            </div>
        </footer >
    );
};

export default Footer;
