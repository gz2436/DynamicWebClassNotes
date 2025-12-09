import React from 'react';
import { motion } from 'framer-motion';

const IMAGES = {
    bg: '/presentation-assets/docs/01.png'
};

export const PhilosophySlide: React.FC = () => {
    return (
        <div className="w-full h-full relative bg-black overflow-hidden flex">
            {/* Left Side: Image (Independent) */}
            <div className="w-1/2 h-full relative">
                <img
                    src={IMAGES.bg}
                    alt="DailyFilm Philosophy"
                    className="w-full h-full object-cover object-[20%_center]"
                />
            </div>

            {/* Right Side: Text (Independent) */}
            <div className="w-1/2 h-full flex flex-col justify-center p-12 pl-0 bg-black z-10 border-l-0 border-transparent">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-12 pl-32 border-l-0 border-transparent"
                >
                    <h2 className="text-8xl font-black text-white leading-none uppercase tracking-tighter text-left">
                        One Day.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">One Film.</span>
                    </h2>

                    <div className="h-2 w-32 bg-white" />

                    <p className="text-2xl font-mono text-gray-300 leading-relaxed text-left">
                        In an era of infinite scroll,<br />
                        we chose <span className="text-white font-bold border-b-2 border-white">curation</span>.<br />
                        A single masterpiece,<br />
                        every 24 hours.
                    </p>

                    <div className="pt-8 opacity-50 font-mono text-sm tracking-widest text-left">
                        // DAILY_FILM_PROTOCOL_V3.0
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
