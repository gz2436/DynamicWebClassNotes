import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp, History, Aperture, Globe, Calendar, Infinity } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
} as const;

const barVariants = {
    hidden: { width: 0 },
    show: { width: "100%", transition: { duration: 1, ease: "circOut", delay: 0.5 } }
} as const;

// Glitch/Flicker for icons
const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 200 }
    },
    hover: {
        opacity: [1, 0.5, 1, 0.8, 0.2, 1],
        x: [0, -2, 2, -1, 0],
        transition: { duration: 0.5 }
    }
};

const Manifesto: React.FC = () => {
    const navigate = useNavigate();

    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#080808] text-white font-mono selection:bg-white selection:text-black px-8 py-8 md:p-12 relative overflow-hidden">

            {/* Background Watermark */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03] select-none">
                <h1 className="text-[20vw] font-black leading-none tracking-tighter text-white">V3.0</h1>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-4xl mx-auto pt-20 md:pt-24 space-y-8 md:space-y-12 relative z-10"
            >

                {/* Title Section */}
                <motion.section variants={itemVariants} className="space-y-6 md:space-y-8 border-b border-white/20 pb-8 md:pb-12 text-left">
                    <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-black uppercase tracking-tighter leading-none">
                        Protocol<br />V3.0
                    </h1>
                    <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between">
                        <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
                            The DAILY_FILM engine has evolved. Our new curatorial algorithm fuses global theatrical synchronization with mathematical non-repetition.
                        </p>
                        <div className="text-xs font-mono text-white/40 uppercase tracking-widest">
                            UPDATED // 2025.12
                        </div>
                    </div>
                </motion.section>

                {/* Dimensions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">

                    {/* Dimension 1: Global Premiere */}
                    <motion.div variants={itemVariants} className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Tier_01_Priority</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 mb-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <Globe className="h-5 w-5" />
                            </motion.div>
                            Global Synchronization
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                            The engine scans global theatrical databases daily. Major premieres (e.g. "Zootopia 2", "Avatar 3") override all other logic to ensure you are the first to know.
                        </p>
                        <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs space-y-2 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-white/50">TRIGGER</span>
                                <span>RELEASE_DATE == TODAY</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">STATUS</span>
                                <span className="text-red-500 font-bold">OVERRIDE</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 mt-2 overflow-hidden">
                                <motion.div variants={barVariants} className="h-full bg-red-600" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Dimension 2: Thematic Schedule */}
                    <motion.div variants={itemVariants} className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Tier_02_Context</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 mb-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <Calendar className="h-5 w-5" />
                            </motion.div>
                            Thematic Resonance
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                            Every day serves a specific curatorial purpose. From "Critics' Choice Mondays" to "Pop Culture Fridays", the vibe shifts to match the human weekly cycle.
                        </p>
                        <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs space-y-2 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-white/50">VIBE_SHIFT</span>
                                <span>DAILY</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">VARIANCE</span>
                                <span className="text-blue-400">HIGH</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 mt-2 flex overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "14.28%" }} transition={{ duration: 0.5, delay: 0.6 }} className="h-full bg-white/20"></motion.div>
                                <motion.div initial={{ width: 0 }} animate={{ width: "14.28%" }} transition={{ duration: 0.5, delay: 0.7 }} className="h-full bg-white/40"></motion.div>
                                <motion.div initial={{ width: 0 }} animate={{ width: "14.28%" }} transition={{ duration: 0.5, delay: 0.8 }} className="h-full bg-white/60"></motion.div>
                                <motion.div initial={{ width: 0 }} animate={{ width: "14.28%" }} transition={{ duration: 0.5, delay: 0.9 }} className="h-full bg-white/80"></motion.div>
                                <motion.div initial={{ width: 0 }} animate={{ width: "42.8%" }} transition={{ duration: 0.5, delay: 1.0 }} className="h-full bg-white"></motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Dimension 3: Infinite Permutation */}
                    <motion.div variants={itemVariants} className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Tier_03_Math</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 mb-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <Infinity className="h-5 w-5" />
                            </motion.div>
                            The Infinite Loop
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                            We use valid permutation slicing to map dates to unique coordinates in a 5,000+ movie pool. No repeats. No randomness. Just pure mathematical exploration.
                        </p>
                        <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs space-y-2 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-white/50">COLLISION_RATE</span>
                                <span>0.00%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">CYCLE_LENGTH</span>
                                <span className="text-white">&gt; 3 YEARS</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 mt-2 overflow-hidden">
                                <motion.div variants={barVariants} className="h-full w-full bg-gradient-to-r from-white/20 to-white" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Dimension 4: Quality Control */}
                    <motion.div variants={itemVariants} className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Tier_04_Filter</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 mb-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <Aperture className="h-5 w-5" />
                            </motion.div>
                            Signal-to-Noise
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                            The database is vast, but our filter is strict. We mandate minimum vote counts and popularity thresholds to ensure only culturally significant works enter the archive.
                        </p>
                        <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs space-y-2 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-white/50">JUNK_FILTER</span>
                                <span>ACTIVE</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">MIN_VOTES</span>
                                <span className="text-yellow-400">100-3000</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 mt-2 overflow-hidden">
                                <motion.div variants={barVariants} className="h-full bg-white" />
                            </div>
                        </div>
                    </motion.div>

                </div>

            </motion.div>
        </div>
    );
};

export default Manifesto;
