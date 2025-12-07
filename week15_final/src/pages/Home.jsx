import React, { useEffect, useState } from 'react';
import BionicText from '../components/BionicText';
import { getPopularMovies, getCuratedMovies, getMovieDetails } from '../services/tmdb';
import { recommendationEngine } from '../services/recommendationEngine';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Layers, Aperture, Film, Mic2 } from 'lucide-react';

import AnalysisGrid from '../components/home/AnalysisGrid';
import HomeHero from '../components/home/HomeHero';
import DailyContextSidebar from '../components/home/DailyContextSidebar';

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
    // State for HomeHero moved to component
    const [error, setError] = useState(null);

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
    // Use Local Time instead of UTC to prevent "Tomorrow's Movie" showing up at 8PM EST
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
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
            <HomeHero
                movie={movie}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                dateString={dateString}
                availableDates={availableDates}
                displayDate={displayDate}
                handleDateSelect={handleDateSelect}
                handleRandomNavigation={handleRandomNavigation}
                dir={dir}
            />


            {/* SECTION 2: BEHIND THE STORY */}
            <div className="relative z-20 bg-black border-t border-white/10">
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Left: Label */}
                    <DailyContextSidebar movie={movie} />

                    {/* Right: Content */}
                    <div className="md:col-span-9 space-y-12 md:space-y-24">

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 border-t border-white/10 pt-8 md:pt-12">
                            <AnalysisGrid title="THEMATIC_INDEX" icon={Layers}>
                                Primary Genres: {movie.genres?.map(g => g.name).join(', ') || 'N/A'}.
                                <br />
                                Key Themes: {movie.keywords?.keywords?.slice(0, 5).map(k => k.name).join(' / ') || 'N/A'}.
                            </AnalysisGrid>
                            <AnalysisGrid title="MARKET_METRICS" icon={Aperture}>
                                Global Resonance: {movie.vote_count} verified votes with an average rating of {movie.vote_average?.toFixed(1)}/10.
                                <br />
                                Trend Index: {movie.popularity?.toFixed(0)} points.
                            </AnalysisGrid>
                        </div>

                        {/* Analysis Grid 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 border-t border-white/10 pt-8 md:pt-12">
                            <AnalysisGrid title="PRODUCTION_DATA" icon={Film}>
                                Produced by {movie.production_companies?.map(c => c.name).join(', ') || 'Independent Studios'}.
                                <br />
                                Released on {new Date(movie.release_date).toLocaleDateString('en-US', { dateStyle: 'long' })}.
                            </AnalysisGrid>
                            <AnalysisGrid title="LINGUISTIC_DATA" icon={Mic2}>
                                Original Audio: {movie.original_language?.toUpperCase() || 'UNK'}.
                                <br />
                                Available Languages: {movie.spoken_languages?.map(l => l.english_name).join(', ') || 'N/A'}.
                            </AnalysisGrid>
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
