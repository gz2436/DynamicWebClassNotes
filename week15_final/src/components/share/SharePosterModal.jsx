import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const SharePosterModal = ({ movie, onClose, isDaily }) => {
    const posterRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!posterRef.current) return;
        setIsGenerating(true);
        try {
            // Use html2canvas to screenshot the div
            // useCORS is critical for external images (TMDB)
            const canvas = await html2canvas(posterRef.current, {
                useCORS: true,
                scale: 2, // Retina quality
                backgroundColor: '#000000',
            });

            const link = document.createElement('a');
            link.download = `DailyFilm_${movie.title.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Poster generation failed:', error);
            alert('Could not generate poster. Please try screen capture.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300 backdrop-blur-sm">

            {/* Poster Container (To be captured) */}
            <div
                ref={posterRef}
                className="relative w-full max-w-sm aspect-[9/16] bg-black overflow-hidden flex flex-col items-center justify-between border border-white/10 shadow-2xl"
            >
                {/* 1. Full Background Backdrop */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover opacity-60 grayscale-[30%] contrast-125"
                        crossOrigin="anonymous"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
                </div>

                {/* 2. Brand Header (Minimal) */}
                <div className="relative z-10 pt-8 flex items-center justify-center">
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        <span className="text-white font-mono font-bold tracking-[0.3em] text-[10px] uppercase">DAILY FILM</span>
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                    </div>
                </div>

                {/* 3. Center Visual: Title & Tagline */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
                    {/* Tagline */}
                    {movie.tagline && (
                        <p className="text-white/60 text-[10px] font-mono tracking-[0.2em] uppercase mb-4 text-center">
                            // {movie.tagline}
                        </p>
                    )}

                    {/* Title - "Crystal Glass" Gradient Effect */}
                    {/* Uses gradient mask to create depth without losing contrast */}
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 uppercase leading-[0.85] tracking-tighter mb-6 font-sans break-words w-full text-center drop-shadow-2xl">
                        {movie.title}
                    </h1>

                    {/* Specs Line - Clean */}
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/80">
                        <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                        <span className="opacity-30">|</span>
                        <span>{movie.runtime} MIN</span>
                        <span className="opacity-30">|</span>
                        <span>★ {movie.vote_average?.toFixed(1)}</span>
                    </div>
                </div>

                {/* 4. Glass Footer Bar: Date & QR */}
                <div className="relative z-10 w-full bg-black/40 backdrop-blur-md border-t border-white/10 p-4 flex items-center justify-between">
                    {/* Left: Date - Only show if it is the Daily Pick */}
                    <div className="flex flex-col items-start min-h-[24px] justify-center">
                        {isDaily ? (
                            <>
                                <span className="text-[8px] text-white/40 font-mono tracking-widest uppercase mb-1">RECOMMENDED DATE</span>
                                <span className="text-xs text-white font-bold tracking-widest font-mono">
                                    {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                                </span>
                            </>
                        ) : (
                            <span className="text-[8px] text-white/40 font-mono tracking-widest uppercase mb-1">DATABASE ARCHIVE</span>
                        )}
                    </div>

                    {/* Right: Minimal QR */}
                    <div className="flex items-center gap-3">
                        <span className="text-[8px] text-right text-white/40 font-mono tracking-widest uppercase leading-tight hidden md:block">
                            SCAN FOR<br />MORE INFO
                        </span>
                        <div className="bg-white p-1 w-10 h-10 shadow-lg">
                            <img src="/official_qr.png" alt="QR" className="w-full h-full block" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls (Outside capture area) */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 z-50">
                <button
                    onClick={onClose}
                    className="px-6 py-2 border border-white/20 bg-black/60 text-white font-mono text-xs tracking-widest hover:bg-white hover:text-black hover:border-white transition-all backdrop-blur-md"
                >
                    CLOSE
                </button>
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="px-8 py-2 bg-white text-black font-mono font-bold text-xs tracking-widest hover:bg-gray-200 shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? 'SAVING...' : 'SAVE_POSTER'}
                </button>
            </div>
        </div>
    );
};

export default SharePosterModal;
