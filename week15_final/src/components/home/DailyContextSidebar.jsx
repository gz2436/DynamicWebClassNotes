import React from 'react';

const DailyContextSidebar = ({ movie }) => {
    return (
        <div className="md:col-span-3">
            <div className="sticky top-12">
                <h2 className="text-3xl mb-4 leading-none text-white/40 uppercase font-mono font-black tracking-tighter">Why<br />This<br />Film<br />Today?</h2>
                <span className="border border-white/30 px-2 py-1 rounded-full text-white/50 uppercase tracking-widest text-[10px] font-mono font-bold -ml-2">Curator's Note</span>

                {/* Recommendation Factors */}
                <div className="mt-8 space-y-4">
                    {/* DYNAMIC CONTEXT (NEW) */}
                    {movie.recommendationContext && (
                        <div className="flex flex-col gap-2 border-l-2 border-white/20 pl-4">
                            <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${movie.recommendationContext.label === 'GLOBAL_PREMIERE'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-white/20 text-white'
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

                    {/* STANDARD METRICS */}
                    <div className="pt-4 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                            <span className={`w-1.5 h-1.5 rounded-full ${movie.vote_average >= 7 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <span>Audience Score: {movie.vote_average?.toFixed(1)}/10</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span>Verified Count: {movie.vote_count?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyContextSidebar;
