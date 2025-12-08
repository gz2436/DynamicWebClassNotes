import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Plus, Check, Eye, Shuffle, Bookmark, Grid3x3, MoreVertical, X, ChevronUp, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchLogo from '../GlitchLogo';
import CalendarDropdown from '../CalendarDropdown.tsx';
import ImageWithFallback from '../ImageWithFallback';
import SharePosterModal from '../share/SharePosterModal.tsx';
import { getImageUrl } from '../../services/tmdbClient';
import useEngagement from '../../hooks/useEngagement'; // Hook

import { Movie } from '../../types/tmdb';

interface HomeHeroProps {
    movie: Movie;
    currentIndex: number;
    setCurrentIndex: (index: number | ((prev: number) => number)) => void;
    dateString: string;
    availableDates: Date[];
    displayDate: Date;
    handleDateSelect: (index: number) => void;
    handleRandomNavigation: (e: React.MouseEvent | React.KeyboardEvent) => void;
    dir: string;
}

const HomeHero: React.FC<HomeHeroProps> = ({
    movie,
    currentIndex,
    setCurrentIndex,
    dateString,
    availableDates,
    displayDate,
    handleDateSelect,
    handleRandomNavigation,
    dir,
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

    const resetIdleTimer = () => {
        setIsIdle(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            setIsIdle(true);
        }, 3000); // Hide after 3 seconds of inactivity
    };

    // Clean up timer on unmount or when modal closes
    useEffect(() => {
        if (!showTrailer) {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            setIsIdle(false);
        } else {
            resetIdleTimer();
        }
        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [showTrailer]);
    const { isSeen, isInBucket, toggleSeen, toggleBucket } = useEngagement(movie.id);

    // Refs
    const discoverRef = useRef<HTMLDivElement>(null);
    const calendarButtonRef = useRef<HTMLDivElement>(null);
    const calendarDropdownRef = useRef<HTMLDivElement>(null);

    // Handle Click Outside & Escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Discover Menu
            if (isDiscoverOpen && discoverRef.current && !discoverRef.current.contains(event.target as Node)) {
                setIsDiscoverOpen(false);
            }
            // Calendar Menu
            if (isCalendarOpen &&
                calendarDropdownRef.current && !calendarDropdownRef.current.contains(event.target as Node) &&
                calendarButtonRef.current && !calendarButtonRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        };

        const handleEsc = (event: KeyboardEvent) => {
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

    // TRAILER LOGIC

    const trailer = movie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || movie?.videos?.results?.find(v => v.site === 'YouTube');

    // Handle ESC key to close trailer
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowTrailer(false);
        };
        if (showTrailer) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showTrailer]);

    const microTextStyle = "text-[10px] opacity-50 uppercase tracking-widest font-mono";

    return (
        <div className="relative h-[100svh] w-full overflow-hidden">
            {/* Immersive Trailer Overlay */}
            <AnimatePresence>
                {showTrailer && trailer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-4 md:p-12"
                        onMouseMove={() => resetIdleTimer()}
                        onTouchStart={() => resetIdleTimer()}
                        onClick={() => resetIdleTimer()}
                    >
                        {/* Iframe Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="w-full max-w-6xl aspect-video bg-black shadow-2xl relative overflow-hidden ring-1 ring-white/10 shrink-0"
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                                title="Trailer"
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>

                        {/* Close Button (Below Video, Auto-Hide) */}
                        <div className={`mt-8 md:mt-10 transition-opacity duration-500 ${isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <button
                                onClick={() => setShowTrailer(false)}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/50 hover:bg-white hover:text-black transition-all flex items-center justify-center group"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={movie.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-0"
                >
                    <ImageWithFallback
                        mobileSrc={getImageUrl(movie.poster_path, 'w780') || undefined}
                        desktopSrc={getImageUrl(movie.backdrop_path, 'w1280') || undefined}
                        src={getImageUrl(movie.backdrop_path, 'w1280') || undefined}
                        alt={movie.title}
                        className="w-full h-full object-cover opacity-80"
                        loading="eager"
                    />
                    {/* Removed mix-blend-multiply for cleaner look */}
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
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
                    <div className="w-1/3 flex items-center pl-2">
                        <div className="relative pointer-events-auto" ref={discoverRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDiscoverOpen(!isDiscoverOpen);
                                }}
                                className="text-white hover:opacity-50 transition-opacity flex items-center p-2"
                                title="Discover"
                            >
                                {/* Mobile: Icon */}
                                <Menu className="w-5 h-5 stroke-[1.5] md:hidden" />
                                {/* Desktop: Text */}
                                <span className="hidden md:block text-xs font-bold uppercase tracking-widest ml-2">DISCOVER</span>
                            </button>
                            <AnimatePresence>
                                {isDiscoverOpen && (
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={{
                                            hidden: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
                                            visible: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                                            exit: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0, transition: { duration: 0.2 } }
                                        }}
                                        className="absolute top-full left-0 pt-4 z-50 origin-top"
                                    >
                                        <div className="bg-black/90 backdrop-blur-md border border-white/10 p-4 min-w-[160px] max-w-[90vw] flex flex-col gap-3 shadow-2xl ml-4">
                                            <Link to="/popular" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors">Popular</Link>
                                            <Link to="/now-playing" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors">Now Playing</Link>
                                            <Link to="/upcoming" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors">Upcoming</Link>
                                            <Link to="/top-rated" state={{ resetPage: true }} className="text-[10px] uppercase tracking-widest hover:text-white text-white/60 transition-colors">Top Rated</Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                    <div className="text-right w-1/3 flex flex-col items-end gap-1 pr-2">
                        <div className="relative flex items-center gap-3 pointer-events-auto" ref={calendarButtonRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCalendarOpen(!isCalendarOpen);
                                }}
                                className="group flex items-center gap-2 text-xs tracking-widest uppercase font-mono font-bold hover:opacity-50 transition-opacity cursor-pointer whitespace-nowrap"
                                title="View Archive"
                            >
                                {/* Desktop: FULL DATE (DEC 08 2024) - Underlined now */}
                                <span className="hidden md:inline underline decoration-white/50 underline-offset-4">
                                    {displayDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()} {displayDate.getDate().toString().padStart(2, '0')} {displayDate.getFullYear()}
                                </span>
                                {/* Mobile: MM/DD (12/08) + Underline */}
                                <span className="md:hidden underline decoration-white/50 underline-offset-4">
                                    {displayDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                                </span>
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

                {/* Mood Selector (V3.0) - More Spacing */}


                {/* Center: Title */}
                <div className="relative z-20 flex-1 flex items-end justify-between pb-4 pointer-events-auto">
                    <div className="text-left max-w-[70%] md:max-w-[60%]">
                        {movie.tagline && (
                            <p className="text-white/60 text-sm md:text-base font-mono mb-2 tracking-wide max-w-2xl">
                                {movie.tagline}
                            </p>
                        )}
                        <Link to={`/movie/${movie.id}`} state={{ category: 'popular', fromHome: true }} className="block group w-fit">
                            {/* REMOVED mix-blend-overlay from title for better visibility on brighter bg */}
                            <h1 className="text-[clamp(3.5rem,9vw,8rem)] font-black leading-none tracking-tighter uppercase opacity-100 drop-shadow-2xl font-mono group-hover:opacity-100 transition-opacity text-balance text-white">
                                {movie.title}
                                <span className="inline-block align-baseline ml-3 md:ml-4 text-[9px] md:text-xs opacity-50 font-normal text-white/60 border border-white/10 px-2 py-0.5 rounded-full tracking-widest relative -top-[2px] md:-top-[4px]">
                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                                </span>
                            </h1>
                        </Link>


                    </div>

                    {/* Action Group: Responsive Layout 
                       Mobile: 2 Columns (Vertical Stacks)
                       Desktop: Single Row (Horizontal) 
                    */}
                    {/* Desktop Action Group (Hidden on Mobile) */}
                    <div className="hidden md:flex flex-row items-center gap-2 ml-4 mb-1 mr-0">

                        {/* Group 1: Personal */}
                        <div className="flex flex-row items-center gap-2">
                            <button
                                onClick={toggleSeen}
                                className={`border ${isSeen ? 'border-green-500/50 bg-green-500/20 text-green-400' : 'border-white/20 bg-black/20 text-white'} backdrop-blur-sm p-2 md:p-3 md:px-5 md:py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 w-auto h-auto rounded-none`}
                                title={isSeen ? "Seen" : "Mark as Seen"}
                            >
                                {isSeen ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                <span>{isSeen ? 'SEEN' : 'SEEN'}</span>
                            </button>

                            <button
                                onClick={toggleBucket}
                                className={`border ${isInBucket ? 'border-orange-500/50 bg-orange-500/20 text-orange-400' : 'border-white/20 bg-black/20 text-white'} backdrop-blur-sm p-2 md:p-3 md:px-5 md:py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 w-auto h-auto rounded-none`}
                                title={isInBucket ? "In Bucket List" : "Add to Bucket List"}
                            >
                                {isInBucket ? <Bookmark className="w-4 h-4 fill-current" /> : <Plus className="w-4 h-4" />}
                                <span>{isInBucket ? 'LIST' : 'LIST'}</span>
                            </button>
                        </div>

                        {/* Divider (Vertically Centered, no extra margin, relying on parent gap) */}
                        <div className="w-px h-8 bg-white/20 self-center"></div>

                        {/* Group 2: Media */}
                        <div className="flex flex-row items-center gap-2">
                            <button
                                onClick={() => setIsShareOpen(true)}
                                className="border border-white/20 bg-black/20 backdrop-blur-sm p-2 md:p-3 md:px-5 md:py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 w-auto h-auto rounded-none"
                                title="Share"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                                <span>SHARE</span>
                            </button>

                            <button
                                onClick={handleRandomNavigation}
                                className="border border-white/20 bg-black/20 backdrop-blur-sm p-2 md:p-3 md:px-5 md:py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 w-auto h-auto rounded-none"
                                title="Switch to another candidate"
                            >
                                <Shuffle className="w-4 h-4" />
                                <span>REROLL</span>
                            </button>

                            {trailer && (
                                <button
                                    onClick={() => setShowTrailer(true)}
                                    className="border border-white/20 bg-black/20 backdrop-blur-sm p-2 md:p-3 md:px-5 md:py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 w-auto h-auto rounded-none"
                                    title="Play Trailer"
                                >
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                    <span>TRAILER</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Control Panel (Floating Glass Orbs) */}
                    <div className="md:hidden flex flex-col items-end gap-4 mb-2 ml-4 mr-5 relative z-50">

                        {/* Expandable Menu (Floating Bubbles) */}
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    // Origin bottom for upward expansion
                                    className="absolute bottom-full mb-4 right-0 flex flex-col items-center gap-3 origin-bottom"
                                    variants={{
                                        hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
                                        visible: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                                        exit: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, transition: { duration: 0.2 } }
                                    }}
                                >
                                    {/* MENU ITEMS: Rendered flat, animation handled by parent clip-path */}

                                    {/* SHARE */}
                                    <button
                                        onClick={() => {
                                            setIsShareOpen(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl text-white shadow-lg hover:bg-white hover:text-black transition-all active:scale-90"
                                        style={{ WebkitTapHighlightColor: 'transparent' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                                    </button>

                                    {/* SEEN */}
                                    <button
                                        onClick={() => {
                                            toggleSeen();
                                        }}
                                        className={`w-11 h-11 flex items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all active:scale-90 ${isSeen ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'border-white/10 bg-black/30 text-white'} hover:bg-white hover:text-black`}
                                        style={{ WebkitTapHighlightColor: 'transparent' }}
                                    >
                                        {isSeen ? <Check className="w-5 h-5 drop-shadow-[0_0_3px_rgba(74,222,128,0.5)]" strokeWidth={2} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                                    </button>

                                    {/* LIST */}
                                    <button
                                        onClick={() => {
                                            toggleBucket();
                                        }}
                                        className={`w-11 h-11 flex items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all active:scale-90 ${isInBucket ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'border-white/10 bg-black/30 text-white'} hover:bg-white hover:text-black`}
                                        style={{ WebkitTapHighlightColor: 'transparent' }}
                                    >
                                        {isInBucket ? <Bookmark className="w-5 h-5 fill-current drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]" /> : <Plus className="w-5 h-5" strokeWidth={1.5} />}
                                    </button>

                                    {/* REROLL */}
                                    <button
                                        onClick={(e) => {
                                            handleRandomNavigation(e);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl text-white shadow-lg hover:bg-white hover:text-black transition-all active:scale-90"
                                        style={{ WebkitTapHighlightColor: 'transparent' }}
                                    >
                                        <Shuffle className="w-5 h-5" strokeWidth={1.5} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Trigger Button (Menu) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`w-11 h-11 flex items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all z-40 ${isMobileMenuOpen ? 'border-white text-white bg-white/20' : 'border-white/10 text-white bg-black/30'}`}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <ChevronUp className="w-6 h-6" strokeWidth={1.5} />}
                        </button>

                        {/* Play Button (Anchor) */}
                        {trailer && (
                            <button
                                onClick={() => setShowTrailer(true)}
                                className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl text-white shadow-lg hover:scale-105 transition-transform z-40"
                            >
                                <svg className="w-5 h-5 fill-current mr-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom: Specs */}
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

            {/* Share Modal */}
            {
                isShareOpen && (
                    <SharePosterModal
                        movie={movie}
                        isDaily={true} // HomeHero is theoretically the "Daily" view, but can show past dates.
                        date={displayDate} // Explicitly pass the currently viewed date
                        onClose={() => setIsShareOpen(false)}
                    />
                )
            }
        </div>
    );
};

export default HomeHero;
