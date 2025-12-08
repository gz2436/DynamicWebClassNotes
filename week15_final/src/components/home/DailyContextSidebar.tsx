import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../../types/tmdb';

interface DailyMovie extends Movie {
    source?: string;
    recommendationContext?: {
        name: string;
        description: string;
        label?: string; // Support both just in case, but prioritize name
    };
}

interface DailyContextSidebarProps {
    movie: DailyMovie;
}

const DailyContextSidebar: React.FC<DailyContextSidebarProps> = ({ movie }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            className="md:col-span-3"
        >
            <div className="md:sticky md:top-12">
                <div className="flex flex-row md:flex-col items-baseline md:items-start justify-between md:justify-start gap-4 mb-4 md:mb-4">
                    <h2 className="text-xl md:text-3xl leading-none text-white/40 uppercase font-mono font-black tracking-tighter whitespace-nowrap md:whitespace-normal">
                        <span className="md:hidden">Why This Film Today?</span>
                        <span className="hidden md:inline">
                            Why<br />This<br />Film<br />Today?
                        </span>
                    </h2>
                    <span className="border border-white/30 px-2 py-0.5 md:py-1 rounded-full text-white/50 uppercase tracking-widest text-[9px] md:text-[10px] font-mono font-bold md:-ml-2 shrink-0">
                        Curator's Note
                    </span>
                </div>

                {/* Recommendation Factors */}
                <div className="mt-8 space-y-4">
                    {/* DYNAMIC CONTEXT (NEW) */}
                    {movie.recommendationContext && (
                        <div className="flex flex-col gap-2 border-l-2 border-white/20 pl-4">
                            <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${movie.recommendationContext.name === 'GLOBAL_PREMIERE' ? 'bg-red-600 text-white' :
                                        movie.recommendationContext.label === 'THE_FINAL_CHAPTER' ? 'bg-red-900/50 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(220,38,38,0.3)] animate-pulse' :
                                            'bg-white/20 text-white'
                                    }`}>
                                    {movie.recommendationContext.name}
                                </span>
                            </div>
                            <span className="text-sm text-white/50 font-mono italic">
                                "{movie.recommendationContext.description}"
                            </span>
                        </div>
                    )}

                    {/* FALLBACK / LEGACY LABELS (If no rich context) */}
                    {!movie.recommendationContext && movie.source === 'ZEITGEIST' && (
                        <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold">ZEITGEIST</span>
                            <span>High Viral Velocity</span>
                        </div>
                    )}
                    {!movie.recommendationContext && movie.source === 'HIDDEN_GEM' && (
                        <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">HIDDEN_GEM</span>
                            <span>Critical Acclaim / Low Visibility</span>
                        </div>
                    )}
                    {movie.source === 'MANUAL_EVENT' && (
                        <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                            <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-[10px] font-bold">EVENT</span>
                            <span>Temporal Relevance Override</span>
                        </div>
                    )}

                    {/* CREATIVE TEAM (Better Value) */}
                    <div className="pt-6 border-t border-white/10 space-y-4">
                        {/* Director */}
                        <div className="space-y-1">
                            <div className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Visionary</div>
                            <div className="text-white font-bold text-sm font-mono leading-tight">
                                {movie.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'UNKNOWN'}
                            </div>
                        </div>

                        {/* Top Cast */}
                        <div className="space-y-1">
                            <div className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Starring</div>
                            <div className="text-white/80 text-xs font-mono leading-relaxed flex flex-col gap-1">
                                {movie.credits?.cast?.slice(0, 3).map((c: any) => (
                                    <span key={c.id}>{c.name}</span>
                                )) || <span className="text-white/50">Various Artists</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DailyContextSidebar;
