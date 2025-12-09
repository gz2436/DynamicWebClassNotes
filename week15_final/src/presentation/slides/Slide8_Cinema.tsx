import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationTheme } from '../hooks';

const POSTER_URL = '/presentation-assets/docs/DailyFilm_Cinema_Paradiso.png';

// V1: The Letter (Narrative/Emotional)
// Left: Large Poster, Right: Scrolling text/Message
export const CinemaSlide: React.FC = () => {
    const { theme } = usePresentationTheme();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-black text-white">
            {/* Header - Fixed Position */}
            <div className="absolute top-12 left-0 w-full text-center z-20">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl font-black uppercase tracking-tighter"
                >
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-900">Passion</span>
                </motion.h2>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-20 w-full max-w-7xl relative z-10">
                {/* Left: The Poster (Asymmetric/Larger) */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex-shrink-0"
                >
                    <div className="relative h-[600px] w-auto rounded-lg overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.4)] border-4 border-white/5 rotate-[-3deg] hover:rotate-0 transition-transform duration-700">
                        <img src={POSTER_URL} alt="Cinema Paradiso" className="h-full w-auto object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent mix-blend-overlay" />
                    </div>
                </motion.div>

                {/* Right: The Letter/Message */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-lg flex flex-col gap-8 text-left"
                >
                    <div className="flex flex-col gap-2">
                        <div className="h-1 w-24 bg-red-600 mb-4" />
                        <h3 className="text-5xl font-serif italic text-white leading-tight">
                            "Whatever you end up doing, <span className="text-red-500">love it</span>."
                        </h3>
                    </div>

                    <div className={`text-xl leading-relaxed font-serif text-gray-400`}>
                        <p>
                            Just like the lost kisses in the film, every project, every line of code, and every late night debugging session was a frame in our own movie.
                        </p>
                    </div>

                    <div className="text-xs font-mono opacity-40 uppercase tracking-[0.2em] mt-2 border-t border-white/10 pt-6">
                        From: Dynamic Web<br />To: The Future
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
