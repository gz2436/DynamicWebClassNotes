import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Grid3x3, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchLogo from '../GlitchLogo';
import CalendarDropdown from '../CalendarDropdown';
import ImageWithFallback from '../ImageWithFallback';
import SharePosterModal from '../share/SharePosterModal';
import { getImageUrl } from '../../services/tmdb';

const HomeHero = ({
    movie,
    currentIndex,
    setCurrentIndex,
    dateString,
    availableDates,
    displayDate,
    handleDateSelect,
    handleRandomNavigation,
    dir
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Refs
    const discoverRef = useRef(null);
    const calendarButtonRef = useRef(null);
    const calendarDropdownRef = useRef(null);

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

    const microTextStyle = "text-[10px] opacity-50 uppercase tracking-widest font-mono";

    return (
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

                {/* Center: Title */}
                <div className="relative z-20 flex-1 flex items-end justify-between pb-4 pointer-events-auto">
                    <div className="text-left max-w-[70%] md:max-w-[60%]">
                        {movie.tagline && (
                            <p className="text-white/60 text-sm md:text-base font-mono mb-2 tracking-wide max-w-2xl">
                                {movie.tagline}
                            </p>
                        )}
                        <Link to={`/movie/${movie.id}`} state={{ category: 'popular', fromHome: true }} className="block group w-fit">
                            <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter uppercase mix-blend-overlay opacity-90 drop-shadow-2xl font-mono group-hover:opacity-100 transition-opacity text-balance">
                                {movie.title}
                                <span className="inline-block align-middle ml-4 text-[9px] md:text-xs opacity-50 font-normal text-white/60 border border-white/10 px-2 py-0.5 rounded-full tracking-widest align-super">
                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                                </span>
                            </h1>
                        </Link>
                    </div>

                    {/* Action Group */}
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 ml-4 mb-1 mt-4 md:mt-0 translate-y-2 md:translate-y-0 mr-4 md:mr-0">
                        <button
                            onClick={() => setIsShareOpen(true)}
                            className="border border-white/20 bg-black/20 backdrop-blur-sm p-2 md:px-4 md:py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto rounded-none"
                            title="Share"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                            <span className="hidden md:inline">SHARE</span>
                        </button>

                        <button
                            onClick={handleRandomNavigation}
                            className="border border-white/20 bg-black/20 backdrop-blur-sm p-2 md:px-4 md:py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto rounded-none"
                            title="Switch to another candidate"
                        >
                            <Shuffle className="w-4 h-4" />
                            <span className="hidden md:inline">REROLL</span>
                        </button>
                    </div>
                </div>

                {/* Bottom: Specs */}
                <div className="relative z-20 flex justify-between items-end border-t border-white/20 pt-6 pointer-events-auto">
                    <div className="space-y-1">
                        <div className={microTextStyle}>DIR. {dir}</div>
                        <div className={microTextStyle}>DUR. {movie.runtime} MIN</div>
                    </div>

                    <div className="text-right space-y-1 mr-4 md:mr-0">
                        <div className={microTextStyle}>VOL. {movie.vote_average?.toFixed(1)}</div>
                        <div className={microTextStyle}>REF. {movie.id}</div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {isShareOpen && (
                <SharePosterModal
                    movie={movie}
                    isDaily={true}
                    onClose={() => setIsShareOpen(false)}
                />
            )}
        </div>
    );
};

export default HomeHero;
