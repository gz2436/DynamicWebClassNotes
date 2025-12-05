import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation, useNavigationType, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import InlineBackRow from '../components/InlineBackRow';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import useScrollRestoration from '../hooks/useScrollRestoration';
import { getPopularMovies, getNowPlayingMovies, getUpcomingMovies, getTopRatedMovies, getImageUrl } from '../services/tmdb';
import ImageWithFallback from '../components/ImageWithFallback';

const PaginationInput = ({ page, onJump }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputVal, setInputVal] = useState(page);

    useEffect(() => {
        setInputVal(page);
    }, [page]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const newPage = parseInt(inputVal, 10);
            if (!isNaN(newPage) && newPage > 0) {
                onJump(newPage);
                setIsEditing(false);
            }
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setInputVal(page);
        }
    };

    if (isEditing) {
        return (
            <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onBlur={() => { setIsEditing(false); setInputVal(page); }}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-transparent border-b border-white text-center w-16 text-xs font-mono text-white focus:outline-none"
            />
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            className="text-xs font-mono text-white/40 cursor-pointer hover:text-white transition-colors border-b border-transparent hover:border-white/20"
            title="Click to jump to page"
        >
            PAGE {page}
        </span>
    );
};

const CategoryPage = ({ type, title }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // URL-Driven State (The Single Source of Truth)
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = searchParams.get('sort') || 'popularity';
    const filterGenre = searchParams.get('genre') || 'all';

    // Helper to update params while preserving others
    const updateParams = (updates) => {
        setSearchParams({
            page: updates.page || page,
            sort: updates.sort || sortBy,
            genre: updates.genre || filterGenre
        });
    };

    // Initialize Movies: Check cache for the SPECIFIC page we are on
    const [movies, setMovies] = useState(() => {
        const cacheKey = `category_movies_${type}_p${page}`;
        let cached = null;
        try { cached = sessionStorage.getItem(cacheKey); } catch (e) { }
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    const [loading, setLoading] = useState(() => {
        const cacheKey = `category_movies_${type}_p${page}`;
        let cached = null;
        try { cached = sessionStorage.getItem(cacheKey); } catch (e) { }
        return !cached;
    });

    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);

    // Scroll Restoration
    // Uses location.key internally to handle unique scroll positions for every history entry.
    useScrollRestoration('category');

    useEffect(() => {
        const fetchMovies = async () => {
            // Check cache first BEFORE setting loading to prevent layout thrashing
            const cacheKey = `category_movies_${type}_p${page}`;
            let cached = null;
            try { cached = sessionStorage.getItem(cacheKey); } catch (e) { }

            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    // Check if cached data has the new structure or old array
                    const results = Array.isArray(parsed) ? parsed : parsed.results;
                    const cachedTotalPages = parsed.total_pages || 500; // Fallback for old cache

                    if (Array.isArray(results) && results.length > 0) {
                        setMovies(results);
                        setTotalPages(cachedTotalPages);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    // ignore corrupt cache
                }
            }

            setLoading(true);
            try {
                // Safety Timeout: If API hangs, stop loading after 8 seconds
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000));

                let dataPromise;
                switch (type) {
                    case 'popular': dataPromise = getPopularMovies(page); break;
                    case 'now_playing': dataPromise = getNowPlayingMovies(page); break;
                    case 'upcoming': dataPromise = getUpcomingMovies(page); break;
                    case 'top_rated': dataPromise = getTopRatedMovies(page); break;
                    default:
                        console.warn("Unknown category type:", type);
                        dataPromise = Promise.resolve({ results: [], total_pages: 0 });
                }

                let response = await Promise.race([dataPromise, timeoutPromise]);

                // Handle both array (legacy/fallback) and object (new) responses
                let data = Array.isArray(response) ? response : (response.results || []);
                let pages = response.total_pages || 0;
                let total = response.total_results || 0;

                if (!Array.isArray(data)) {
                    console.warn("API returned non-array data:", data);
                    data = [];
                }

                setMovies(data);
                setTotalPages(pages);
                setTotalResults(total);

                if (data.length > 0) {
                    // Cache the full response or just results? 
                    // Let's cache the object to keep metadata
                    try {
                        sessionStorage.setItem(cacheKey, JSON.stringify({ results: data, total_pages: pages }));
                    } catch (e) {
                        // ignore
                    }
                }
            } catch (error) {
                console.error("Failed to fetch category:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [type, page]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="min-h-screen bg-[#080808] text-white font-mono p-6 md:p-12 pb-20"
        >
            <div className="pt-32 md:pt-40 max-w-6xl mx-auto px-4 md:px-24 relative">
                <div className="flex flex-col items-center text-center mb-12 gap-6">
                    {/* Back Button (Centered) */}
                    <div className="relative z-10 -translate-y-8 md:-translate-y-12">
                        <BackButton />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                        {title}
                    </h1>    <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar justify-center" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {/* Sort Dropdown */}
                        <div className="flex flex-col gap-1 min-w-fit">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                                className="bg-black border border-white/20 text-xs uppercase py-1 px-2 focus:outline-none focus:border-white transition-colors cursor-pointer"
                            >
                                <option value="popularity">Popularity</option>
                                <option value="date">Release Date</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>

                        {/* Genre Filter (Simple) */}
                        <div className="flex flex-col gap-1 min-w-fit">
                            <label className="text-[10px] uppercase tracking-widest text-white/40">Genre</label>
                            <select
                                value={filterGenre}
                                onChange={(e) => updateParams({ genre: e.target.value, page: 1 })}
                                className="bg-black border border-white/20 text-xs uppercase py-1 px-2 focus:outline-none focus:border-white transition-colors cursor-pointer"
                            >
                                <option value="all">All Genres</option>
                                <option value="28">Action</option>
                                <option value="12">Adventure</option>
                                <option value="16">Animation</option>
                                <option value="35">Comedy</option>
                                <option value="80">Crime</option>
                                <option value="18">Drama</option>
                                <option value="14">Fantasy</option>
                                <option value="27">Horror</option>
                                <option value="878">Sci-Fi</option>
                                <option value="53">Thriller</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pagination Controls (Top) */}
                <div className="flex justify-between items-center mb-8 border-t border-b border-white/10 py-4">
                    <button
                        onClick={() => updateParams({ page: Math.max(1, page - 1) })}
                        disabled={page === 1 || loading}
                        className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-4 -ml-4"
                    >
                        <ChevronLeft className="h-4 w-4" /> Prev
                    </button>

                    <PaginationInput page={page} onJump={(p) => updateParams({ page: p })} />

                    <button
                        onClick={() => updateParams({ page: page + 1 })}
                        disabled={loading || page >= totalPages || (movies.length === 0 && !loading)}
                        className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-4 -mr-4"
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-xs animate-pulse text-white/50 tracking-widest py-24">{/* Silent Loading */}</div>
                ) : movies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4 opacity-50">
                        <div className="text-4xl">∅</div>
                        <div className="text-xs uppercase tracking-widest">NO_DATA_FOUND</div>
                        <button onClick={() => window.location.reload()} className="border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors text-[10px] uppercase">
                            RETRY_CONNECTION
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                        {Array.isArray(movies) && movies
                            .filter(m => filterGenre === 'all' || (m.genre_ids || []).includes(parseInt(filterGenre)))
                            .sort((a, b) => {
                                if (sortBy === 'popularity') return b.popularity - a.popularity;
                                if (sortBy === 'date') return new Date(b.release_date) - new Date(a.release_date);
                                if (sortBy === 'rating') return b.vote_average - a.vote_average;
                                return 0;
                            })
                            .map(movie => (
                                <Link key={movie.id} to={`/movie/${movie.id}`} state={{ category: type }} className="group block space-y-2">
                                    <div className="aspect-[2/3] overflow-hidden bg-neutral-900 border border-white/10 relative">
                                        <ImageWithFallback
                                            src={getImageUrl(movie.poster_path, 'w500')}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {/* Removed View Data text per user request */}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase truncate pr-4">{movie.title}</h3>
                                        <div className="flex justify-between text-[10px] text-white/40 mt-1">
                                            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                                            <span>★ {movie.vote_average?.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                )}

                {/* Pagination Controls (Bottom) */}
                {!loading && movies.length > 0 && (
                    <div className="flex justify-between items-center mt-12 border-t border-white/10 pt-8 pb-24">
                        <button
                            onClick={() => updateParams({ page: Math.max(1, page - 1) })}
                            disabled={page === 1}
                            className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-4 -ml-4"
                        >
                            <ChevronLeft className="h-4 w-4" /> Prev
                        </button>

                        <PaginationInput page={page} onJump={(p) => updateParams({ page: p })} />

                        <button
                            onClick={() => updateParams({ page: page + 1 })}
                            disabled={page >= totalPages}
                            className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-4 -mr-4"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CategoryPage;
