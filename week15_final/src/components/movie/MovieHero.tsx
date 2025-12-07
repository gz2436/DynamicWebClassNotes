import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/tmdbClient';
import ImageWithFallback from '../ImageWithFallback';
import SharePosterModal from '../share/SharePosterModal.tsx';
import GlitchLogo from '../GlitchLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, Bookmark, Plus } from 'lucide-react';
import useEngagement from '../../hooks/useEngagement';
import { Movie, Credits } from '../../types/tmdb';

interface MovieHeroProps {
    movie: Movie;
    crew?: Credits['crew'];
    isRandom?: boolean;
    showBack?: boolean;
}

const MovieHero: React.FC<MovieHeroProps> = ({
    movie,
    crew: propCrew,
    isRandom,
    showBack
}) => {
    const navigate = useNavigate();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const { isSeen, isInBucket, toggleSeen, toggleBucket } = useEngagement(movie.id);

    const {
        title,
        backdrop_path,
        poster_path,
        release_date,
        vote_average,
        overview,
        tagline,
        genres,
        runtime,
        status,
        id,
        videos
    } = movie;

    // Use passed crew or fallback to movie.credits.crew
    const crew = propCrew || movie.credits?.crew;

    const director = crew?.find(person => person.job === 'Director');
    const writers = crew?.filter(person => person.department === 'Writing').slice(0, 2);

    // ALTERNATE BACKDROP LOGIC
    const getAlternateBackdrop = () => {
        // Safety check for images array
        if (!movie?.images?.backdrops || movie.images.backdrops.length < 2) return movie.backdrop_path;

        // 1. Filter: Must be aspect ratio ~1.77 (16:9), High Res, and NOT the main one
        const candidates = movie.images.backdrops.filter(img =>
            img.file_path !== movie.backdrop_path &&
            img.width > 1280 &&
            (img.vote_average ?? 0) > 0 // decent quality
        );

        // 2. Sort by Popularity (vote_count) to find the "next best" official image
        if (candidates.length > 0) {
            candidates.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
            return candidates[0].file_path;
        }

        return movie.backdrop_path;
    };

    const heroImage = getAlternateBackdrop();

    // TRAILER LOGIC
    const trailer = videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos?.results?.find(v => v.site === 'YouTube');

    // Handle ESC key to close trailer
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowTrailer(false);
        };
        if (showTrailer) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showTrailer]);

    return (
        <div className="relative min-h-[100dvh] w-full flex items-end text-white overflow-hidden">

            {/* Share Modal - High Z-Index to ensure it sits on top */}
            {isShareOpen && (
                <div className="absolute inset-0 z-[100] pointer-events-auto">
                    <SharePosterModal
                        movie={movie}
                        isDaily={false}
                        onClose={() => setIsShareOpen(false)}
                    />
                </div>
            )}

            {/* Immersive Trailer Overlay */}
            <AnimatePresence>
                {showTrailer && trailer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4 md:p-12"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-6 right-6 md:top-12 md:right-12 z-50 text-white/50 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                            <span className="text-xs font-mono tracking-widest hidden md:block group-hover:tracking-[0.2em] transition-all">CLOSE THEATER</span>
                            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* Iframe Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="w-full max-w-6xl aspect-video bg-black shadow-2xl relative overflow-hidden ring-1 ring-white/10"
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                                title="Trailer"
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <ImageWithFallback
                    mobileSrc={getImageUrl(movie.poster_path, 'w780')}
                    desktopSrc={getImageUrl(heroImage, 'original')}
                    src={getImageUrl(heroImage, 'original')}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-80"
                />
                {/* Removed mix-blend-multiply for cleaner look */}
                <div className="absolute inset-0 bg-[#080808]/10" />
                {/* Gradient Overlay for Text Readability - kept but minimized if needed, for now standard gradient is fine */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
            </div>

            {/* Industrial Grid Lines (Overlay) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="w-full h-full border-[20px] border-transparent md:border-white/5 relative max-w-[1920px] mx-auto">
                    <div className="w-full h-full border border-white/10 relative">
                        <div className="absolute top-0 left-1/4 w-px h-full bg-white/5"></div>
                        <div className="absolute top-0 right-1/4 w-px h-full bg-white/5"></div>
                        <div className="absolute top-1/3 left-0 w-full h-px bg-white/5"></div>
                        <div className="absolute bottom-1/3 left-0 w-full h-px bg-white/5"></div>
                    </div>
                </div>
            </div>

            {/* Content Container - Centered Layout */}
            <div className="relative z-50 h-full w-full flex flex-col p-6 md:p-12 max-w-[1920px] mx-auto pointer-events-none">

                {/* Top Bar - Spacer for Global Header */}
                <div className="relative w-full h-16 md:h-20 shrink-0 pointer-events-none" />

                {/* Center Content: Title & Specs */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 z-20 pointer-events-auto min-h-0">

                    {/* Database Status - Centered & Safe */}
                    <div className="flex flex-col items-center gap-1 mb-2 opacity-60 hover:opacity-100 transition-opacity">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">// DATABASE_VIEW</span>
                        <div className="flex items-center gap-2 border border-white/10 px-2 py-0.5 rounded-full bg-black/20">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                            <span className="text-[10px] font-mono text-white/80">ID: {movie.id}</span>
                        </div>
                    </div>

                    {/* Tagline */}
                    {movie.tagline && (
                        <p className="text-white/50 text-xs md:text-sm font-mono tracking-[0.2em] uppercase max-w-2xl px-4">
                            // {movie.tagline}
                        </p>
                    )}

                    {/* Main Title - Centered & Huge */}
                    <h1 className="text-5xl md:text-9xl font-black leading-none tracking-tighter uppercase text-white opacity-100 w-full break-words px-2 drop-shadow-2xl">
                        {movie.title}
                    </h1>

                    {/* Specs Row - Centered Integers */}
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm font-bold uppercase tracking-wider text-white/80 mt-2">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-white/40">RATING</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white">{(movie.vote_average || 0).toFixed(1)}</span>
                        </div>
                        <span className="text-white/20">/</span>

                        {/* Runtime */}
                        <div className="flex items-center gap-2">
                            <span className="text-white/40">TIME</span>
                            <span>{movie.runtime} MIN</span>
                        </div>
                        <span className="text-white/20">/</span>

                        {/* Genre */}
                        <div className="text-white/90">
                            {(movie.genres || []).slice(0, 3).map(g => g.name).join(' · ')}
                        </div>
                    </div>

                    {/* Overview / Teaser (Optional - Short) */}
                    {/* <p className="max-w-lg text-white/60 text-sm line-clamp-3 md:line-clamp-none">{movie.overview}</p> */}
                </div>

                {/* Bottom: Action Buttons - Centered */}
                <div className="w-full flex justify-center items-end pb-safe shrink-0 z-30 pointer-events-auto mt-8 mb-8 md:mb-10">
                    <div className="flex items-center gap-4">

                        {/* Engagement: Seen It */}
                        <button
                            onClick={toggleSeen}
                            className={`group border ${isSeen ? 'border-green-500/50 bg-green-500/20 text-green-400' : 'border-white/20 bg-black/40 text-white/60'} backdrop-blur-md px-3 py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 w-10 md:w-auto hover:border-white hover:text-black rounded-none`}
                            title={isSeen ? "Seen" : "Mark as Seen"}
                        >
                            {isSeen ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span className="hidden md:inline">{isSeen ? 'SEEN' : 'SEEN'}</span>
                        </button>

                        {/* Engagement: Bucket List */}
                        <button
                            onClick={toggleBucket}
                            className={`group border ${isInBucket ? 'border-orange-500/50 bg-orange-500/20 text-orange-400' : 'border-white/20 bg-black/40 text-white/60'} backdrop-blur-md px-3 py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 w-10 md:w-auto hover:border-white hover:text-black rounded-none`}
                            title={isInBucket ? "In Bucket List" : "Add to Bucket List"}
                        >
                            {isInBucket ? <Bookmark className="w-4 h-4 fill-current" /> : <Plus className="w-4 h-4" />}
                            <span className="hidden md:inline">{isInBucket ? 'LIST' : 'LIST'}</span>
                        </button>
                        {trailer && (
                            <button
                                onClick={() => setShowTrailer(true)}
                                className="group border border-white/80 bg-white text-black px-6 py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition-all flex items-center gap-2 md:gap-3 rounded-none hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                title="Play Trailer"
                            >
                                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                <span>WATCH TRAILER</span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsShareOpen(true)}
                            className="group border border-white/20 bg-black/40 backdrop-blur-md px-3 py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2 md:gap-3 rounded-none hover:scale-105 active:scale-95"
                            title="Share Poster"
                        >
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                            <span>SHARE</span>
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="group border border-white/20 bg-black/40 backdrop-blur-md px-5 py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2 md:gap-3 rounded-none hover:scale-105 active:scale-95"
                            title="Return"
                        >
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:-translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            <span>BACK</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MovieHero;
