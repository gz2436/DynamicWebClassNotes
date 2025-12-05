import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp, History, Aperture, Globe, Calendar, Infinity } from 'lucide-react';
import { motion } from 'framer-motion';

const Manifesto = () => {
    const navigate = useNavigate();

    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="min-h-screen bg-[#080808] text-white font-mono selection:bg-white selection:text-black p-6 md:p-12 flex flex-col justify-center"
        >
            <div className="max-w-4xl mx-auto pt-24 md:pt-0 space-y-12 md:space-y-16">

                {/* Title Section */}
                <section className="space-y-8 border-b border-white/20 pb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                        Protocol<br />V2.0
                    </h1>
                    <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between">
                        <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
                            The DAILY_FILM engine has evolved. Our new curatorial algorithm fuses global theatrical synchronization with mathematical non-repetition.
                        </p>
                        <div className="text-xs font-mono text-white/40 uppercase tracking-widest">
                            UPDATED // 2025.12
                        </div>
                    </div>
                </section>

                {/* Dimensions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                    {/* Dimension 1: Global Premiere */}
                    <div className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Tier_01_Priority</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 h-8">
                            <Globe className="h-5 w-5" /> Global Synchronization
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed h-20">
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
                            <div className="w-full h-1 bg-white/10 mt-2">
                                <div className="h-full w-full bg-red-600"></div>
                            </div>
                        </div>
                    </div>

                    {/* Dimension 2: Thematic Schedule */}
                    <div className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Tier_02_Context</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 h-8">
                            <Calendar className="h-5 w-5" /> Thematic Resonance
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed h-20">
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
                            <div className="w-full h-1 bg-white/10 mt-2 flex">
                                <div className="h-full w-1/7 bg-white/20"></div>
                                <div className="h-full w-1/7 bg-white/40"></div>
                                <div className="h-full w-1/7 bg-white/60"></div>
                                <div className="h-full w-1/7 bg-white/80"></div>
                                <div className="h-full w-3/7 bg-white"></div>
                            </div>
                        </div>
                    </div>

                    {/* Dimension 3: Infinite Permutation */}
                    <div className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Tier_03_Math</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 h-8">
                            <Infinity className="h-5 w-5" /> The Infinite Loop
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed h-20">
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
                            <div className="w-full h-1 bg-white/10 mt-2">
                                <div className="h-full w-full bg-gradient-to-r from-white/20 to-white"></div>
                            </div>
                        </div>
                    </div>

                    {/* Dimension 4: Quality Control */}
                    <div className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Tier_04_Filter</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 h-8">
                            <Aperture className="h-5 w-5" /> Signal-to-Noise
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed h-20">
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
                            <div className="w-full h-1 bg-white/10 mt-2">
                                <div className="h-full w-[95%] bg-white"></div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </motion.div>
    );
};

export default Manifesto;
