import React, { useEffect, useState } from 'react';
import BionicText from '../components/BionicText';
import { getPopularMovies, getCuratedMovies, getMovieDetails, getImageUrl } from '../services/tmdb';
import { recommendationEngine } from '../services/recommendationEngine';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Grid3x3, Quote, Layers, Aperture, Film, Mic2, Shuffle } from 'lucide-react';
import CalendarDropdown from '../components/CalendarDropdown';
import GlitchLogo from '../components/GlitchLogo';
import ImageWithFallback from '../components/ImageWithFallback';

import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutEffect } from 'react';
import useScrollRestoration from '../hooks/useScrollRestoration';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Handle explicit scroll reset (e.g. clicking DAILY_FILM logo)
    useLayoutEffect(() => {
        if (location.state?.resetScroll) {
            window.scrollTo(0, 0);
            sessionStorage.removeItem('home_scroll_pos');
            // Clear the state to prevent it from sticking on reload (optional but good practice)
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    const handleRandomNavigation = async (e) => {
        e.preventDefault();
        try {
            const randomPage = Math.floor(Math.random() * 5) + 1;
            const response = await getCuratedMovies(randomPage); // Use curated for random too
            const movies = response.results || [];

            if (movies && movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                navigate(`/movie/${randomMovie.id}`, { state: { category: 'random' } });
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error("Failed to navigate to random movie:", error);
        }
    };

    // Cache for daily movies: { 'YYYY-MM-DD': movieData }
    const [dailyCache, setDailyCache] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentMovieDetail, setCurrentMovieDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
    const [error, setError] = useState(null);

    // Refs for click-outside detection
    const discoverRef = React.useRef(null);
    const calendarButtonRef = React.useRef(null);
    const calendarDropdownRef = React.useRef(null);

    // Handle Click Outside & Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Discover Menu
            if (isDiscoverOpen && discoverRef.current && !discoverRef.current.contains(event.target)) {
                setIsDiscoverOpen(false);
            }
            // Calendar Menu
            if (isCalendarOpen &&
                calendarDropdownRef.current && !calendarDropdownRef.current.contains(event.target) &&
                calendarButtonRef.current && !calendarButtonRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };

        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setIsDiscoverOpen(false);
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isDiscoverOpen, isCalendarOpen]);

    // Responsive Date Formatting (Moved to top)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Date Logic
    // Date Logic (UTC)
    const getUTCDate = (dateStr) => new Date(dateStr.endsWith('Z') ? dateStr : dateStr + 'Z');
    const startDate = getUTCDate('2025-01-01T00:00:00');
    const targetToday = getUTCDate('2025-12-02T00:00:00');
    const todayStr = new Date().toISOString().split('T')[0];
    const realNow = getUTCDate(todayStr + 'T00:00:00');
    const latestDate = realNow > targetToday ? realNow : targetToday;

    // Generate Available Dates (Memoized - Moved to top)
    const availableDates = React.useMemo(() => {
        const dates = [];
        let d = new Date(latestDate);
        // Limit to last 90 days for performance on mobile
        // RESCINDED: User requested full history from 2025-01-01
        // const limitDate = new Date(latestDate);
        // limitDate.setDate(limitDate.getDate() - 90);
        // const effectiveStartDate = startDate > limitDate ? startDate : limitDate;

        // Always use full range
        const effectiveStartDate = startDate;

        while (d >= effectiveStartDate) {
            dates.push(new Date(d));
            d.setDate(d.getDate() - 1);
        }
        return dates;
    }, [latestDate, startDate]);

    // Calculate display date
    const displayDate = new Date(latestDate);
    displayDate.setDate(latestDate.getDate() - currentIndex);
    const dateKey = displayDate.toISOString().split('T')[0];

    const dateString = isMobile
        ? displayDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
        : displayDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase();

    // Fetch Movie for Current Date
    useEffect(() => {
        const fetchDailyMovie = async () => {
            setLoading(true);
            try {
                let movieCandidate;
                if (dailyCache[dateKey]) {
                    // Memory Cache
                    movieCandidate = dailyCache[dateKey];
                } else {
                    // Ask Recommendation Engine
                    movieCandidate = await recommendationEngine.getDailyMovie(displayDate);
                    // Update Cache
                    setDailyCache(prev => ({ ...prev, [dateKey]: movieCandidate }));
                }

                if (!movieCandidate) {
                    setError("NO_MOVIE_SELECTED");
                    return;
                }

                // 2. Fetch Full Details
                // Check Session Cache for Details
                const detailCacheKey = `movie_detail_${movieCandidate.id}`;
                let cachedDetail = null;
                try { cachedDetail = sessionStorage.getItem(detailCacheKey); } catch (e) { }

                if (cachedDetail) {
                    const details = JSON.parse(cachedDetail);
                    // Merge context ensuring we always have the "Why"
                    if (movieCandidate.recommendationContext) {
                        details.recommendationContext = movieCandidate.recommendationContext;
                    }
                    if (movieCandidate.source) {
                        details.source = movieCandidate.source;
                    }
                    setCurrentMovieDetail(details);
                } else {
                    const details = await getMovieDetails(movieCandidate.id);
                    if (details) {
                        // Merge context before setting state
                        if (movieCandidate.recommendationContext) {
                            details.recommendationContext = movieCandidate.recommendationContext;
                        }
                        if (movieCandidate.source) {
                            details.source = movieCandidate.source;
                        }

                        setCurrentMovieDetail(details);
                        try {
                            sessionStorage.setItem(detailCacheKey, JSON.stringify(details));
                        } catch (e) {
                            console.warn("Session Storage Full, skipping cache for", detailCacheKey);
                        }
                    } else {
                        setError("DETAILS_FETCH_FAILED");
                    }
                }
                setError(null);

            } catch (err) {
                console.error("Daily Movie Fetch Error:", err);
                setError("ENGINE_FAILURE");
            } finally {
                setLoading(false);
            }
        };

        fetchDailyMovie();
    }, [dateKey]); // Re-run when date changes

    // ... (handlers)
    const handlePrev = () => {
        // Allow going back until 2025-01-01
        // Max index = days between latestDate and startDate
        const maxIndex = Math.floor((latestDate - startDate) / (1000 * 60 * 60 * 24));
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleDateSelect = (index) => {
        setCurrentIndex(index);
        setIsCalendarOpen(false);
    };



    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono space-y-4">
                <div className="text-red-500 text-xl font-bold">SYSTEM_ERROR: {error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors text-xs"
                >
                    REBOOT_SYSTEM
                </button>
            </div>
        );
    }

    if (loading || !currentMovieDetail) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono animate-pulse">
                {/* Silent Loading */}
            </div>
        );
    }

    const movie = currentMovieDetail;
    const isToday = currentIndex === 0;

    // Dynamic Coordinates (Fake but deterministic based on ID)
    const lat = movie ? (movie.id % 90).toFixed(4) : '00.0000';
    const lon = movie ? (movie.id % 180).toFixed(4) : '00.0000';
    const dir = movie?.credits?.crew?.find(c => c.job === 'Director')?.name || 'UNKNOWN';

    // Common style for "Micro" text
    const microTextStyle = "text-[10px] opacity-50 uppercase tracking-widest font-mono";

    // Smart Review Selection Logic
    const selectedReview = (() => {
        if (!movie.reviews?.results?.length) return null;

        const clean = (text) => text
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
            .replace(/https?:\/\/\S+/g, '') // Remove URLs
            .replace(/FULL SPOILER-FREE REVIEW @/i, '') // Remove junk
            .replace(/Rating:\s*[A-Z+-]+\s*"?/i, '') // Remove rating
            .replace(/^["\s]+/, ''); // Remove leading quotes

        const candidates = movie.reviews.results.map(r => ({ ...r, cleanContent: clean(r.content) }));

        // 1. Priority: "Goldilocks" length (150 - 800 chars) - Not too short, not too long
        let best = candidates.find(r => r.cleanContent.length >= 150 && r.cleanContent.length <= 800);

        // 2. Fallback: Just long enough (> 150 chars)
        if (!best) {
            best = candidates.find(r => r.cleanContent.length >= 150);
        }

        // 3. If all are too short, return null (will fallback to Tagline)
        return best || null;
    })();

    return (
        <motion.div
            key={location.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="min-h-screen bg-[#080808] text-white font-mono selection:bg-white selection:text-black leading-relaxed"
        >



            {/* Navigation - Left (Prev) */}
            <div
                role="button"
                tabIndex={0}
                onClick={handlePrev}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePrev(); }}
                aria-label="Previous Day"
                className={`fixed inset-y-0 left-0 w-16 min-[2050px]:w-[calc(50vw-960px)] z-30 flex items-center justify-center group cursor-pointer md:hover:bg-white/5 transition-colors outline-none focus-visible:bg-white/10 pointer-events-none md:pointer-events-auto ${currentIndex >= Math.floor((latestDate - startDate) / (1000 * 60 * 60 * 24)) ? 'hidden' : ''}`}
            >
                {/* Desktop: Icon Only */}
                <ChevronLeft className="hidden md:block text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
            </div>

            {/* Navigation - Right (Next) */}
            {!isToday && (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={handleNext}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNext(); }}
                    aria-label="Next Day"
                    className="fixed inset-y-0 right-0 w-16 min-[2050px]:w-[calc(50vw-960px)] z-30 flex items-center justify-center group cursor-pointer md:hover:bg-white/5 transition-colors outline-none focus-visible:bg-white/10 pointer-events-none md:pointer-events-auto"
                >
                    {/* Desktop: Icon Only */}
                    <ChevronRight className="hidden md:block text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                </div>
            )}

            {/* ... (Navbar & Hero) ... */}

            {/* SECTION 1: THE COVER (100vh) */}
            <div className="relative h-screen w-full overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={movie.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-0"
                    >
                        {/* Full Width Background */}
                        {/* Full Width Background */}
                        <ImageWithFallback
                            src={getImageUrl(movie.backdrop_path, 'original')}
                            srcSet={`${getImageUrl(movie.backdrop_path, 'w780')} 780w, ${getImageUrl(movie.backdrop_path, 'original')} 1280w`}
                            sizes="(max-width: 768px) 780px, 100vw"
                            alt={movie.title}
                            className="w-full h-full object-cover opacity-60"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    </motion.div>
                </AnimatePresence>

                {/* Content Container (Constrained) */}
                <div className="relative z-50 h-full w-full flex flex-col justify-between p-6 md:p-12 max-w-[1920px] mx-auto pointer-events-none">

                    {/* Industrial Grid Lines */}
                    <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-transparent md:border-white/5">
                        <div className="w-full h-full border border-white/10 relative">
                            <div className="absolute top-0 left-1/4 w-px h-full bg-white/5"></div>
                            <div className="absolute top-0 right-1/4 w-px h-full bg-white/5"></div>
                            <div className="absolute top-1/3 left-0 w-full h-px bg-white/5"></div>
                            <div className="absolute bottom-1/3 left-0 w-full h-px bg-white/5"></div>
                        </div>
                    </div>

                    {/* Top Bar */}
                    <div className="relative w-full flex items-center justify-between z-[70] h-12 pointer-events-none">

                        {/* LEFT: Discover Menu */}
                        <div className="w-1/3 flex items-center">
                            <div className="relative pointer-events-auto" ref={discoverRef}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDiscoverOpen(!isDiscoverOpen);
                                    }}
                                    className="text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity flex items-center gap-2 ml-4"
                                >
                                    DISCOVER
                                </button>
                                {/* Dropdown Menu */}
                                {isDiscoverOpen && (
                                    <div className="absolute top-full left-0 pt-4 z-50">
                                        <div className="bg-black/90 backdrop-blur-md border border-white/10 p-4 min-w-[160px] max-w-[90vw] flex flex-col gap-3">
                                            <Link to="/popular" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors">Popular</Link>
                                            <Link to="/now-playing" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors">Now Playing</Link>
                                            <Link to="/upcoming" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors">Upcoming</Link>
                                            <Link to="/top-rated" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors">Top Rated</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CENTER: Title */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 -mt-2 md:-mt-4 pointer-events-auto">
                            <GlitchLogo
                                onClick={() => {
                                    setCurrentIndex(0);
                                    window.scrollTo(0, 0);
                                }}
                            />
                        </div>

                        {/* RIGHT: Date & Calendar */}
                        <div className="text-right w-1/3 flex flex-col items-end gap-1 pr-0">
                            <div className="relative flex items-center gap-3 mr-2 pointer-events-auto" ref={calendarButtonRef}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCalendarOpen(!isCalendarOpen);
                                    }}
                                    className="group flex items-center gap-2 text-xs tracking-widest uppercase font-mono font-bold hover:opacity-50 transition-opacity cursor-pointer"
                                    title="View Archive"
                                >
                                    <span>{dateString}</span>
                                    <Grid3x3 className="hidden md:block h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </button>
                                {/* Calendar Dropdown */}
                                <div ref={calendarDropdownRef}>
                                    <CalendarDropdown
                                        isOpen={isCalendarOpen}
                                        onClose={() => setIsCalendarOpen(false)}
                                        onDateSelect={handleDateSelect}
                                        availableDates={availableDates}
                                        currentDate={displayDate}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center: Title (Moved to Bottom Left) */}
                    <div className="relative z-20 flex-1 flex items-end justify-between pb-4 pointer-events-auto">
                        <div className="text-left max-w-[70%]">
                            {movie.tagline && (
                                <p className="text-white/60 text-sm md:text-base font-mono mb-2 tracking-wide max-w-2xl">
                                    {movie.tagline}
                                </p>
                            )}
                            <Link to={`/movie/${movie.id}`} state={{ category: 'popular', fromHome: true }} className="block group w-fit">
                                <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter uppercase mix-blend-overlay opacity-90 drop-shadow-2xl font-mono group-hover:opacity-100 transition-opacity text-balance flex items-end flex-wrap gap-4">
                                    <span>{movie.title}</span>
                                    <span className="text-[9px] md:text-xs opacity-50 font-normal text-white/60 border border-white/10 px-2 py-0.5 rounded-full tracking-widest mb-1">
                                        {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                                    </span>
                                </h1>
                            </Link>
                        </div>

                        {/* Random Button (Text CTA) */}
                        <button
                            onClick={handleRandomNavigation}
                            className="border border-white/20 bg-black/20 backdrop-blur-sm px-4 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center gap-2 mr-4"
                            title="Switch to another candidate"
                        >
                            <Shuffle className="w-3 h-3" />
                            <span className="hidden md:inline">REROLL</span>
                        </button>
                    </div>

                    {/* Bottom: Specs (Real Data) */}
                    <div className="relative z-20 flex justify-between items-end border-t border-white/20 pt-6 pointer-events-auto">
                        <div className="space-y-1">
                            <div className={microTextStyle}>DIR. {dir}</div>
                            <div className={microTextStyle}>DUR. {movie.runtime} MIN</div>
                        </div>

                        <div className="text-right space-y-1">
                            <div className={microTextStyle}>VOL. {movie.vote_average?.toFixed(1)}</div>
                            <div className={microTextStyle}>REF. {movie.id}</div>
                        </div>
                    </div>
                </div>
            </div>


            {/* SECTION 2: BEHIND THE STORY */}
            <div className="relative z-20 bg-black border-t border-white/10">
                <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Left: Label */}
                    <div className="md:col-span-3">
                        <div className="sticky top-12">
                            <h2 className="text-3xl mb-4 leading-none text-white/40 uppercase font-mono font-black tracking-tighter">Why<br />This<br />Film<br />Today?</h2>
                            <span className="border border-white/30 px-2 py-1 rounded-full text-white/50 uppercase tracking-widest text-[10px] font-mono font-bold -ml-2">Curator's Note</span>

                            {/* Recommendation Factors */}
                            {/* Recommendation Factors */}
                            <div className="mt-8 space-y-4">
                                {/* DYNAMIC CONTEXT (NEW) */}
                                {movie.recommendationContext && (
                                    <div className="flex flex-col gap-2 border-l-2 border-white/20 pl-4">
                                        <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${movie.recommendationContext.label === 'GLOBAL_PREMIERE'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-white/20 text-white'
                                                }`}>
                                                {movie.recommendationContext.name}
                                            </span>
                                        </div>
                                        <span className="text-sm text-white/50 font-mono italic">
                                            "{movie.recommendationContext.description}"
                                        </span>
                                    </div>
                                )}

                                {/* FALLBACK / LEGACY LABELS (If no rich context) */}
                                {!movie.recommendationContext && movie.source === 'ZEITGEIST' && (
                                    <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                                        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold">ZEITGEIST</span>
                                        <span>High Viral Velocity</span>
                                    </div>
                                )}
                                {!movie.recommendationContext && movie.source === 'HIDDEN_GEM' && (
                                    <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                                        <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">HIDDEN_GEM</span>
                                        <span>Critical Acclaim / Low Visibility</span>
                                    </div>
                                )}
                                {movie.source === 'MANUAL_EVENT' && (
                                    <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                                        <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-[10px] font-bold">EVENT</span>
                                        <span>Temporal Relevance Override</span>
                                    </div>
                                )}

                                {/* STANDARD METRICS */}
                                <div className="pt-4 border-t border-white/5 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                                        <span className={`w-1.5 h-1.5 rounded-full ${movie.vote_average >= 7 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        <span>Audience Score: {movie.vote_average?.toFixed(1)}/10</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                        <span>Verified Count: {movie.vote_count?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="md:col-span-9 space-y-24">

                        {/* The Hook */}
                        <div className="space-y-6 relative">
                            <div className="text-6xl text-white/20 font-serif leading-none absolute -top-4 -left-2">“</div>
                            <div className="pt-6 px-4">
                                <p className="text-base md:text-lg leading-relaxed text-white/80 font-mono tracking-tight mb-4">
                                    {selectedReview
                                        ? <BionicText text={selectedReview.cleanContent} />
                                        : <BionicText text={movie.tagline || movie.overview} />
                                    }
                                    <span className="text-4xl text-white/20 font-serif leading-none align-middle inline-block translate-y-2 ml-2">”</span>
                                </p>
                                {selectedReview && (
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono border-b border-white/10 pb-1">
                                            — {selectedReview.author}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Analysis Grid 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[10px] font-bold font-mono">
                                    <Layers className="h-4 w-4" /> THEMATIC_INDEX
                                </div>
                                <p className="text-white/60 text-sm font-mono">
                                    Primary Genres: {movie.genres?.map(g => g.name).join(', ') || 'N/A'}.
                                    <br />
                                    Key Themes: {movie.keywords?.keywords?.slice(0, 5).map(k => k.name).join(' / ') || 'N/A'}.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[10px] font-bold font-mono">
                                    <Aperture className="h-4 w-4" /> MARKET_METRICS
                                </div>
                                <p className="text-white/60 text-sm font-mono">
                                    Global Resonance: {movie.vote_count} verified votes with an average rating of {movie.vote_average?.toFixed(1)}/10.
                                    <br />
                                    Trend Index: {movie.popularity?.toFixed(0)} points.
                                </p>
                            </div>
                        </div>

                        {/* Analysis Grid 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[10px] font-bold font-mono">
                                    <Film className="h-4 w-4" /> PRODUCTION_DATA
                                </div>
                                <p className="text-white/60 text-sm font-mono">
                                    Produced by {movie.production_companies?.map(c => c.name).join(', ') || 'Independent Studios'}.
                                    <br />
                                    Released on {new Date(movie.release_date).toLocaleDateString('en-US', { dateStyle: 'long' })}.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[10px] font-bold font-mono">
                                    <Mic2 className="h-4 w-4" /> LINGUISTIC_DATA
                                </div>
                                <p className="text-white/60 text-sm font-mono">
                                    Original Audio: {movie.original_language?.toUpperCase() || 'UNK'}.
                                    <br />
                                    Available Languages: {movie.spoken_languages?.map(l => l.english_name).join(', ') || 'N/A'}.
                                </p>
                            </div>
                        </div>

                        {/* Analysis Grid 3: Production Log & Cross Reference */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                            {/* Production Log */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[10px] font-bold font-mono">
                                    <div className="h-4 w-4 border border-white/50 flex items-center justify-center text-[8px]">P</div>
                                    PRODUCTION_LOG
                                </div>
                                <div className="space-y-2">
                                    {movie.production_companies?.slice(0, 3).map(company => (
                                        <div key={company.id} className="flex justify-between border-b border-white/5 pb-1">
                                            <span className="text-white/60 text-xs font-mono">UNIT</span>
                                            <span className="text-white/80 text-xs font-mono text-right uppercase">{company.name}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-white/60 text-xs font-mono">ORIGIN</span>
                                        <span className="text-white/80 text-xs font-mono text-right uppercase">{movie.production_countries?.[0]?.iso_3166_1 || 'UNK'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-white/60 text-xs font-mono">STATUS</span>
                                        <span className="text-white/80 text-xs font-mono text-right uppercase">{movie.status}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cross Reference */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[10px] font-bold font-mono">
                                    <div className="h-4 w-4 border border-white/50 flex items-center justify-center text-[8px]">X</div>
                                    CROSS_REFERENCE
                                </div>
                                <div className="space-y-2">
                                    {movie.similar?.results?.slice(0, 3).map(sim => (
                                        <Link key={sim.id} to={`/movie/${sim.id}`} state={{ category: 'popular', fromHome: true }} className="group flex justify-between items-center border border-white/10 p-2 hover:bg-white/5 transition-colors">
                                            <span className="text-white/80 text-xs font-mono truncate max-w-[200px] uppercase">{sim.title}</span>
                                            <ArrowRight className="h-3 w-3 text-white/30 group-hover:text-white transition-colors" />
                                        </Link>
                                    ))}
                                    {(!movie.similar?.results || movie.similar.results.length === 0) && (
                                        <div className="text-white/30 text-xs font-mono uppercase">NO_DATA_AVAILABLE</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="hidden md:block"></div>
                            <div className="flex justify-center">
                                <Link to={`/movie/${movie.id}`} state={{ category: 'popular', fromHome: true }} className="group inline-flex items-center gap-4 bg-white text-black px-6 py-3 hover:bg-neutral-200 transition-colors duration-300 w-auto justify-center uppercase tracking-wider text-xs font-mono font-bold">
                                    <span>Full_Data_Analysis</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>



            </div>
        </motion.div>
    );
};

export default Home;
