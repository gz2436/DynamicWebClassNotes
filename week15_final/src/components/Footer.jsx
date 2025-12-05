import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPopularMovies } from '../services/tmdb';

const Footer = () => {
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
                        DAILY_MOVIE
                    </Link>
                    <p className="leading-relaxed">
                        Experimental cinema archive.<br />
                        Est. 2025. New York, NY.
                    </p>
                </div>

                {/* Col 2: Navigation */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase tracking-widest">Navigation</h3>
                    <ul className="space-y-2 text-white/60">
                        <li><Link to="/manifesto" className="hover:text-white transition-colors">MANIFESTO</Link></li>
                        <li>
                            <button
                                onClick={handleRandom}
                                className="hover:text-white transition-colors uppercase text-left w-full"
                            >
                                RANDOM
                            </button>
                        </li>
                        <li><Link to="/about" className="hover:text-white transition-colors">ABOUT</Link></li>
                    </ul>
                </div>

                {/* Col 3: Discover */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase tracking-widest">Discover</h3>
                    <div className="flex flex-col space-y-2">
                        <Link to="/popular" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors w-fit">Popular</Link>
                        <Link to="/now-playing" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors w-fit">Now Playing</Link>
                        <Link to="/upcoming" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors w-fit">Upcoming</Link>
                        <Link to="/top-rated" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors w-fit">Top Rated</Link>
                    </div>
                </div>

                {/* Column 4: Project */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Project</h4>
                    <p className="text-white/60">
                        A dynamic web experiment.<br />
                        Powered by TMDB API.
                    </p>
                    <p className="text-white/40">© 2025 Daily_Movie.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
