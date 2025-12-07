import React, { useEffect, useState, useLayoutEffect, useMemo, MouseEvent, KeyboardEvent } from 'react';

// Force Refresh 3 (Removed comment)
import BionicText from '../components/BionicText'; // Import without extension if possible, or matches
import { getCuratedMovies, discoverMovies } from '../services/tmdbClient';
import { recommendationEngine } from '../services/recommendationEngine';
import { MOOD_PRESETS } from '../config/curation';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Layers, Aperture, Film, Mic2 } from 'lucide-react';

import AnalysisGrid from '../components/home/AnalysisGrid.tsx';
import HomeHero from '../components/home/HomeHero.tsx';
import DailyContextSidebar from '../components/home/DailyContextSidebar.tsx';

import { motion } from 'framer-motion';
// Removed unused useScrollRestoration if not used? It was imported in JSX
// import useScrollRestoration from '../hooks/useScrollRestoration';
// Wait, hook logic was inline: useLayoutEffect.
// Let's keep imports clean.

import { useMovie } from '../hooks/useMovies';
// useEngagement is internal to HomeHero, but Home acts as parent? No HomeHero uses it.
// Home uses useMovie.
import { Movie } from '../types/tmdb';

interface MovieCandidate extends Partial<Movie> {
    source?: string;
    recommendationContext?: {
        name: string;
        description: string;
    };
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Handle explicit scroll reset (e.g. clicking DAILY_FILM logo)
    useLayoutEffect(() => {
        if (location.state?.resetScroll) {
            window.scrollTo(0, 0);
            sessionStorage.removeItem('home_scroll_pos');
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Random Nav Logic
    const handleRandomNavigation = async (e: MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        try {
            const randomPage = Math.floor(Math.random() * 5) + 1;
            const response = await getCuratedMovies(randomPage);
            const movies = response.results || [];
            if (movies && movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                navigate(`/movie/${randomMovie.id}`, { state: { category: 'random' } });
                window.scrollTo(0, 0);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Cache for daily movies: { 'YYYY-MM-DD': movieData }
    const [dailyCache, setDailyCache] = useState<Record<string, MovieCandidate>>({});
    const [currentIndex, setCurrentIndex] = useState(0);

    // Replacement for currentMovieDetail + loading
    const [candidateId, setCandidateId] = useState<number | null>(null);
    const [candidateContext, setCandidateContext] = useState<MovieCandidate | null>(null);
    const [loading, setLoading] = useState(true); // Still needed for selection phase
    const [errorCode, setErrorCode] = useState<string | null>(null);

    // V3.0 Mood Discovery
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    // Responsive Date Formatting
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Date Logic (UTC)
    const getUTCDate = (dateStr: string) => new Date(dateStr.endsWith('Z') ? dateStr : dateStr + 'Z');
    const startDate = getUTCDate('2025-01-01T00:00:00');
    const targetToday = getUTCDate('2025-12-02T00:00:00');
    // Use Local Time instead of UTC to prevent "Tomorrow's Movie" showing up at 8PM EST
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const realNow = getUTCDate(todayStr + 'T00:00:00');
    const latestDate = realNow > targetToday ? realNow : targetToday;

    // Generate Available Dates (Memoized)
    const availableDates = useMemo(() => {
        const dates: Date[] = [];
        let d = new Date(latestDate);
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

    // Fetch Movie for Current Date (Or Mood)
    useEffect(() => {
        const fetchDailyMovie = async () => {
            setLoading(true);
            try {
                let movieCandidate: MovieCandidate | undefined;

                // Priority 1: Mood Filtering (V3.0)
                if (selectedMood) {
                    const moodConfig = MOOD_PRESETS.find(m => m.id === selectedMood);
                    if (moodConfig) {
                        try {
                            const randomPage = Math.floor(Math.random() * 3) + 1;
                            const response = await discoverMovies({ ...moodConfig.params, page: randomPage });

                            if (response.results && response.results.length > 0) {
                                const randomIdx = Math.floor(Math.random() * response.results.length);
                                const candidate = response.results[randomIdx] as MovieCandidate;
                                candidate.source = 'MOOD_DISCOVERY';
                                candidate.recommendationContext = {
                                    name: moodConfig.label,
                                    description: `Curated for the ${moodConfig.label} vibe.`
                                };
                                movieCandidate = candidate;
                            }
                        } catch (e) {
                            console.error("Mood fetch failed", e);
                        }
                    }
                }

                // Priority 2: Cache or Rec Engine (Standard Flow)
                if (!movieCandidate) {
                    if (dailyCache[dateKey] && !selectedMood) {
                        movieCandidate = dailyCache[dateKey];
                    } else {
                        // Ask Recommendation Engine
                        const recMovie = await recommendationEngine.getDailyMovie(displayDate) as MovieCandidate;
                        movieCandidate = recMovie;

                        if (!selectedMood && movieCandidate) {
                            setDailyCache(prev => ({ ...prev, [dateKey]: movieCandidate! }));
                        }
                    }
                }

                if (!movieCandidate) {
                    setErrorCode("NO_MOVIE_SELECTED");
                    return;
                }

                // Set candidate ID to trigger the useMovie hook
                if (movieCandidate.id) setCandidateId(movieCandidate.id);

                // Store context for merging later
                setCandidateContext({
                    source: movieCandidate.source,
                    recommendationContext: movieCandidate.recommendationContext
                });

            } catch (err) {
                console.error("Daily Movie Selection Error:", err);
                setErrorCode("ENGINE_FAILURE");
            } finally {
                setLoading(false);
            }
        };

        fetchDailyMovie();
    }, [dateKey, selectedMood]);

    // React Query: Fetch Full Details for the selected candidate
    // Cast null ID to skip query (enabled: false)
    const { data: movieDetail, isLoading: isDetailLoading, error: detailError } = useMovie(candidateId || 0);
    // Note: useMovie has enabled: !!id, so passing 0 is fine/safe.

    // Merge Context into Detail
    const finalMovie = useMemo(() => {
        if (!movieDetail) return null;
        return {
            ...movieDetail,
            source: candidateContext?.source,
            recommendationContext: candidateContext?.recommendationContext
        };
    }, [movieDetail, candidateContext]);

    // Unified Loading/Error State
    const isLoading = loading || (!!candidateId && isDetailLoading);
    const error = errorCode || (detailError ? "DETAILS_FETCH_FAILED" : null);

    // PERSISTENCE VISUAL LOGIC (Prevents unmounting/flashing)
    const [displayedMovie, setDisplayedMovie] = useState<any | null>(null);

    useEffect(() => {
        if (finalMovie && !isLoading) {
            setDisplayedMovie(finalMovie);
        }
    }, [finalMovie, isLoading]);

    // Use displayedMovie if loading, otherwise live finalMovie
    const activeMovie = finalMovie || displayedMovie;

    const handlePrev = () => {
        if (selectedMood) setSelectedMood(null);
        const maxIndex = Math.floor((latestDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (selectedMood) setSelectedMood(null);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleDateSelect = (index: number) => {
        setSelectedMood(null);
        setCurrentIndex(index);
    };

    const handleMoodSelect = (moodId: string | null) => {
        if (!moodId || moodId === selectedMood) {
            setSelectedMood(null);
        } else {
            setSelectedMood(moodId);
        }
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

    // Only show full loading screen if we have NO movie to show at all (Initial Load)
    if (!activeMovie) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono animate-pulse">
                {/* Silent Loading */}
            </div>
        );
    }

    const movie = activeMovie;
    const isToday = currentIndex === 0 && !selectedMood;

    // Dynamic Coordinates
    // const lat = movie ? (movie.id % 90).toFixed(4) : '00.0000';
    // const lon = movie ? (movie.id % 180).toFixed(4) : '00.0000';
    const dir = movie?.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'UNKNOWN';

    // Smart Review Selection Logic
    const selectedReview = (() => {
        if (!movie.reviews?.results?.length) return null;

        const clean = (text: string) => text
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/https?:\/\/\S+/g, '')
            .replace(/FULL SPOILER-FREE REVIEW @/i, '')
            .replace(/Rating:\s*[A-Z+-]+\s*"?/i, '')
            .replace(/^["\s]+/, '');

        const candidates = movie.reviews.results.map((r: any) => ({ ...r, cleanContent: clean(r.content) }));

        let best = candidates.find((r: any) => r.cleanContent.length >= 150 && r.cleanContent.length <= 800);
        if (!best) {
            best = candidates.find((r: any) => r.cleanContent.length >= 150);
        }
        return best || null;
    })();

    return (
        <motion.div
            key={location.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="min-h-screen bg-[#080808] text-white font-mono selection:bg-white selection:text-black leading-relaxed"
        >

            {/* Navigation - Left (Prev) */}
            <div
                role="button"
                tabIndex={0}
                onClick={handlePrev}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePrev(); }}
                aria-label="Previous Day"
                className={`fixed inset-y-0 left-0 w-16 min-[2050px]:w-[calc(50vw-960px)] z-30 flex items-center justify-center group cursor-pointer md:hover:bg-white/5 transition-colors outline-none focus-visible:bg-white/10 pointer-events-none md:pointer-events-auto ${currentIndex >= Math.floor((latestDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) && !selectedMood ? 'hidden' : ''}`}
            >
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
                    <ChevronRight className="hidden md:block text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                </div>
            )}

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
                // V3 Props
                currentMood={selectedMood}
                onMoodSelect={handleMoodSelect}
            />


            {/* SECTION 2: BEHIND THE STORY */}
            <div className="relative z-20 bg-black border-t border-white/10">
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Left: Label (Daily Context Sidebar) */}
                    <DailyContextSidebar movie={movie} />

                    {/* Right: Content */}
                    <div className="md:col-span-9 space-y-12 md:space-y-24 relative z-10">

                        {/* Background Overlay (Topographic / Grid) */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                        {/* The Hook (Kinetic Typography) */}
                        {/* The Hook (Kinetic Typography) */}
                        <div className="space-y-6 relative border-l-2 border-white/10 pl-8 md:pl-12 py-4">
                            <div className="text-6xl text-white/10 font-black leading-none absolute -top-2 -left-3 md:-left-4 select-none bg-[#080808] pb-2">“</div>
                            <div className="">
                                {/* Fixed height container to prevent layout jump */}
                                <div className="min-h-[120px] md:min-h-[80px]">
                                    <p className="text-base md:text-xl leading-relaxed text-white font-mono tracking-tight mb-4">
                                        <TypewriterText text={selectedReview ? selectedReview.cleanContent : (movie.tagline || movie.overview)} />
                                    </p>
                                </div>
                                {selectedReview && (
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase tracking-widest text-[#00ff41] font-mono border-b border-[#00ff41]/30 pb-1">
                                            // INTELLIGENCE_SOURCE: {selectedReview.author}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Analysis Grid 1: Thematic & Market */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            <AnalysisGrid title="THEMATIC_INDEX" icon={Layers} className="h-full">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] text-white/40 mb-1">PRIMARY_GENRES</div>
                                        <div className="text-white font-bold">{movie.genres?.map((g: any) => g.name).join(' / ') || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 mb-1">KEY_KEYWORDS</div>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.keywords?.keywords?.slice(0, 5).map((k: any) => (
                                                <span key={k.id} className="bg-white/10 px-2 py-0.5 text-[10px] uppercase rounded-sm border border-white/5">{k.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </AnalysisGrid>

                            <AnalysisGrid title="MARKET_METRICS" icon={Aperture} className="h-full">
                                <div className="space-y-6">
                                    {/* Dynamic Vote Gauge */}
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-[10px] text-white/40 mb-1">GLOBAL_RESONANCE</div>
                                            <div className="text-[10px] text-white/60 mb-2">{movie.vote_count} Verified Logged Votes</div>

                                            {/* Merged Score Text */}
                                            <div className="text-3xl font-bold text-[#00ff41] flex items-baseline gap-1">
                                                {movie.vote_average?.toFixed(1)}
                                                <span className="text-xs text-white/40 font-normal">/10</span>
                                            </div>
                                        </div>

                                        {/* Real Dynamic SVG Gauge */}
                                        <div className="relative w-16 h-16 flex-shrink-0">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                {/* Background Circle */}
                                                <path
                                                    className="text-white/10"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                />
                                                {/* Progress Circle */}
                                                <path
                                                    className="text-[#00ff41] transition-all duration-1000 ease-out"
                                                    strokeDasharray={`${(movie.vote_average || 0) * 10}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                                                {Math.round((movie.vote_average || 0) * 10)}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trend Sparkline */}
                                    <div>
                                        <div className="text-[10px] text-white/40 mb-2 flex justify-between">
                                            <span>TREND_INDEX</span>
                                            <span className="text-white">{movie.popularity?.toFixed(0)} PTS</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 overflow-hidden relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${Math.min(movie.popularity, 100)}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-[#ff3300]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </AnalysisGrid>
                        </div>

                        {/* Analysis Grid 2: Swapped Positions (Linguistic Left, Production Right) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            {/* Replaced Linguistic Data with Financial Intelligence */}
                            <AnalysisGrid title="FINANCIAL_INTELLIGENCE" icon={Mic2} className="h-full">
                                <div className="space-y-4 h-full flex flex-col justify-center">
                                    <div className="flex justify-between border-b border-white/5 pb-2 border-dashed">
                                        <span className="text-white/40 text-[10px]">BUDGET</span>
                                        <span className="text-right font-bold text-xs">{movie.budget > 0 ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'CLASSIFIED'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2 border-dashed">
                                        <span className="text-white/40 text-[10px]">REVENUE</span>
                                        <span className="text-right font-bold text-xs">{movie.revenue > 0 ? `$${(movie.revenue / 1000000).toFixed(1)}M` : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between border-b-0 pb-0">
                                        <span className="text-white/40 text-[10px]">ROI_INDEX</span>
                                        <span className={`text-right font-bold text-xs ${movie.revenue > movie.budget ? 'text-[#00ff41]' : 'text-red-500'}`}>
                                            {movie.budget > 0 && movie.revenue > 0
                                                ? `${((movie.revenue - movie.budget) / movie.budget * 100).toFixed(0)}%`
                                                : 'UNK'}
                                        </span>
                                    </div>
                                </div>
                            </AnalysisGrid>

                            <AnalysisGrid title="PRODUCTION_DATA" icon={Film} className="h-full">
                                <div className="space-y-4 h-full flex flex-col justify-center">
                                    <div className="flex justify-between border-b border-white/5 pb-2 border-dashed">
                                        <span className="text-white/40 text-[10px]">STUDIO</span>
                                        <span className="text-right font-bold text-xs max-w-[60%] truncate">{movie.production_companies?.[0]?.name || 'INDEPENDENT'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2 border-dashed">
                                        <span className="text-white/40 text-[10px]">RELEASE_DATE</span>
                                        <span className="text-right font-bold text-xs">{new Date(movie.release_date).toLocaleDateString('en-US', { dateStyle: 'medium' }).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between border-b-0 pb-0">
                                        <span className="text-white/40 text-[10px]">STATUS</span>
                                        <span className="text-right font-bold text-xs text-[#00ff41] uppercase">{movie.status}</span>
                                    </div>
                                </div>
                            </AnalysisGrid>
                        </div>

                        {/* Section 3: Cross Reference (Film Strip) */}
                        <div className="border-t border-white/10 pt-12">
                            <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[10px] font-bold font-mono mb-8">
                                <div className="h-4 w-4 border border-white/50 flex items-center justify-center text-[8px]">X</div>
                                CROSS_REFERENCE_DATABASE
                            </div>

                            {/* Film Strip Container */}
                            <div className="flex overflow-x-auto gap-4 pb-8 scrollbar-hide snap-x">
                                {movie.similar?.results?.slice(0, 6).map((sim: any) => (
                                    <Link
                                        key={sim.id}
                                        to={`/movie/${sim.id}`}
                                        state={{ category: 'popular', fromHome: true }}
                                        className="snap-center shrink-0 w-[140px] group relative aspect-[2/3] bg-white/5 border border-white/10 overflow-hidden hover:border-white/40 transition-colors"
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/w342${sim.poster_path}`}
                                            alt={sim.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <div className="text-[9px] font-bold text-white leading-tight uppercase line-clamp-2">{sim.title}</div>
                                            <div className="text-[8px] text-[#00ff41] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">ACCESS_FILE {`->`}</div>
                                        </div>
                                    </Link>
                                ))}
                                {(!movie.similar?.results || movie.similar.results.length === 0) && (
                                    <div className="w-full text-center py-12 text-white/30 text-xs font-mono uppercase border border-dashed border-white/10">NO_DATA_AVAILABLE</div>
                                )}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="hidden md:block"></div>
                            <div className="flex justify-center md:justify-end">
                                <Link to={`/movie/${movie.id}`} state={{ category: 'popular', fromHome: true }} className="group inline-flex items-center gap-4 bg-white text-black px-6 py-3 hover:bg-neutral-200 transition-colors duration-300 w-full md:w-auto justify-center uppercase tracking-wider text-xs font-mono font-bold">
                                    <span>Access_Full_Dossier</span>
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

const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);
        let i = 0;
        const speed = 15; // ms per char

        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                setIsComplete(true);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text]);

    return (
        <span className="relative inline-block w-full">
            {/* Invisible Phantom Text to hold layout height */}
            <span className="opacity-0 select-none pointer-events-none">{text}</span>

            {/* Visible Typewriter Text overlay */}
            <span className="absolute top-0 left-0 w-full h-full">
                {displayedText}
                {!isComplete && <span className="animate-pulse inline-block w-2 h-4 bg-[#00ff41] ml-1 align-middle" />}
            </span>
        </span>
    );
};

export default Home;
