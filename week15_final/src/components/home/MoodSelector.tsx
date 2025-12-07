import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MOOD_PRESETS } from '../../config/curation';

interface MoodSelectorProps {
    currentMood: string | null;
    onSelect: (moodId: string | null) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
};

const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onSelect }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full relative group max-w-[100vw] pointer-events-none">
            <motion.div
                ref={containerRef}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 pb-8 px-6 md:px-12 md:justify-center mask-linear pointer-events-auto"
            >
                {MOOD_PRESETS.map((mood) => {
                    const isActive = currentMood === mood.id;
                    return (
                        <motion.button
                            key={mood.id}
                            variants={itemVariants}
                            onClick={() => onSelect(isActive ? null : mood.id)}
                            className={`
                                relative flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all duration-300 border
                                ${isActive
                                    ? 'bg-white text-black border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                    : 'bg-black/40 text-white/40 border-white/10 hover:border-white/40 hover:text-white/80'
                                }
                            `}
                        >
                            {mood.label}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Reset Button (Only shows when mood is active) - Moved Below */}
            <AnimatePresence>
                {currentMood && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { delay: 0.4, duration: 0.4 }
                        }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.2 }
                        }}
                        className="flex justify-center -mt-2 mb-2 pointer-events-auto"
                    >
                        <button
                            onClick={() => onSelect(null)}
                            className="text-[9px] uppercase tracking-widest text-red-400/80 hover:text-red-400 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-red-500/20 hover:border-red-500/50 transition-all"
                        >
                            <X className="w-3 h-3" />
                            RESET FILTER
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fade Edges for Scroll Indication on Mobile */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none md:hidden" />
        </div>
    );
};

export default MoodSelector;
