import React from 'react';
import { getImageUrl } from '../../services/tmdb';
import ImageWithFallback from '../ImageWithFallback';
import FloatingBackButton from '../FloatingBackButton';

const MovieHero = ({ movie, crew }) => {
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
        id
    } = movie;

    const director = crew?.find(person => person.job === 'Director');
    const writers = crew?.filter(person => person.department === 'Writing').slice(0, 2);

    return (
        <div className="relative w-full min-h-[90vh] flex items-end text-white overflow-hidden">
            {/* Floating Back Button */}
            <FloatingBackButton />

            {/* Background Image */}
            <div className="absolute inset-0">
                <ImageWithFallback
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-[#080808]/20 mix-blend-multiply" />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
            </div>

            {/* Industrial Grid Lines (Overlay) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="w-full h-full border-x border-white/10 relative max-w-[1920px] mx-auto">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-white/5"></div>
                    <div className="absolute top-0 right-1/4 w-px h-full bg-white/5"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-white/10"></div>
                </div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 max-w-[1920px] mx-auto">



                {/* Status Block (Above Title) */}
                <div className="flex flex-col items-start gap-1 mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">STATUS: {movie.status}</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/50">RELEASE: {movie.release_date}</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/50 border border-white/20 px-2 py-1 mt-1">REF_ID: {movie.id}</span>
                </div>

                {/* Main Title Area */}
                <div className="mb-8">
                    {movie.tagline && (
                        <p className="text-white/60 text-sm font-mono mb-2 tracking-wide max-w-2xl uppercase">
                            // {movie.tagline}
                        </p>
                    )}
                    <h1 className="text-5xl md:text-8xl font-black leading-none tracking-tighter uppercase text-white mix-blend-overlay opacity-90">
                        {movie.title}
                    </h1>
                </div>

                {/* Bottom Specs Bar */}
                <div className="flex flex-wrap gap-8 md:gap-16 border-t border-white/20 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">RATING</span>
                        <span className="text-xl font-bold">{(movie.vote_average || 0).toFixed(1)} <span className="text-xs text-white/40 font-normal">/ 10</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">RUNTIME</span>
                        <span className="text-xl font-bold">{movie.runtime} <span className="text-xs text-white/40 font-normal">MIN</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">GENRE</span>
                        <div className="flex gap-2">
                            {(movie.genres || []).map(g => (
                                <span key={g.id} className="text-sm font-bold uppercase">{g.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieHero;
