import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, TrendingUp, History, Aperture } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

const Manifesto = () => {
    const navigate = useNavigate();

    // Scroll to top on mount (since we removed global reset)
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
            {/* Header */}
            {/* Back Button Removed as per request */}



            <div className="max-w-4xl mx-auto pt-24 md:pt-0 space-y-12 md:space-y-16">

                {/* Title Section */}
                <section className="space-y-8 border-b border-white/20 pb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                        Curation<br />Protocol
                    </h1>
                    <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between">
                        <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
                            The DAILY_MOVIE archive is not a random collection. Every entry is selected based on a multi-dimensional analysis of quality, impact, and legacy.
                        </p>
                        <div className="text-xs font-mono text-white/40 uppercase tracking-widest">
                            v1.0 // 2025
                        </div>
                    </div>
                </section>

                {/* Dimensions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                    {/* Dimension 1: The Soul */}
                    <div className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">The_Algorithmic_Soul</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 h-8">
                            <Star className="h-5 w-5" /> The 50/50 Protocol
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed h-20">
                            We reject the tyranny of "Top 100" lists. Our engine enforces a strict balance: 50% Viral Hits (The Zeitgeist) and 50% Hidden Gems (High Score, Low Visibility).
                        </p>
                        <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs space-y-2 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-white/50">POOL_A (POPULAR)</span>
                                <span className="text-white">50%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">POOL_B (NICHE)</span>
                                <span className="text-white">50%</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 mt-2 flex">
                                <div className="h-full w-1/2 bg-white"></div>
                                <div className="h-full w-1/2 bg-white/50"></div>
                            </div>
                        </div>
                    </div>

                    {/* Dimension 2: Velocity */}
                    <div className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Dimension_02</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 h-8">
                            <TrendingUp className="h-5 w-5" /> Cultural Velocity
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed h-20">
                            We track viral phenomena and box-office breakers. A film that captures the global zeitgeist deserves documentation.
                        </p>
                        <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs space-y-2 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-white/50">METRIC</span>
                                <span>POPULARITY</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">THRESHOLD</span>
                                <span className="text-blue-400">≥ 2000</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 mt-2">
                                <div className="h-full w-[90%] bg-white"></div>
                            </div>
                        </div>
                    </div>

                    {/* Dimension 3: Temporal Relevance */}
                    <div className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Dimension_03</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 h-8">
                            <History className="h-5 w-5" /> Temporal Relevance
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed h-20">
                            Context is everything. We manually override the algorithm for significant cultural moments, ensuring the archive reflects the pulse of the present.
                        </p>
                        <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs space-y-2 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-white/50">TRIGGER</span>
                                <span>EVENT_DATE</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">PRIORITY</span>
                                <span className="text-purple-400">ABSOLUTE</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 mt-2">
                                <div className="h-full w-[100%] bg-white"></div>
                            </div>
                        </div>
                    </div>

                    {/* Dimension 4: Innovation (New) */}
                    <div className="space-y-4 group">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 group-hover:text-white transition-colors">Dimension_04</div>
                        <h2 className="text-xl font-bold uppercase flex items-center gap-2 h-8">
                            <Aperture className="h-5 w-5" /> Technical Innovation
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed h-20">
                            Pushing the boundaries of the medium. We value films that introduce new visual languages or production techniques.
                        </p>
                        <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs space-y-2 group-hover:bg-white/10 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-white/50">METRIC</span>
                                <span>BUDGET_EFFICIENCY</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">THRESHOLD</span>
                                <span className="text-yellow-400">HIGH</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 mt-2">
                                <div className="h-full w-[85%] bg-white"></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Statement */}


            </div>
        </motion.div>
    );
};

export default Manifesto;
