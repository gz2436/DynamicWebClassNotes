import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationTheme } from '../hooks';

const IMAGES = {
    mobile: '/presentation-assets/docs/DailyFilm_Zootopia_1.png',
    web: '/presentation-assets/docs/DailyFilm_Zootopia_2.png'
};

// --- V1: The Pipeline (Source -> Output) ---
// Focus: From Data to Visual
export const VisualsSlide: React.FC = () => {
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
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Visuals</span>
                </motion.h2>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-7xl">
                {/* Left: Code Block */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-[450px] h-[480px] flex-shrink-0"
                >
                    <div className={`w-full h-full ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'} rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs md:text-sm border ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                        {/* Mac Window Header */}
                        <div className={`h-8 ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-100'} flex items-center px-4 gap-2 border-b ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            <div className="flex-1 text-center opacity-50 text-[10px]">services/tmdbClient.ts</div>
                        </div>
                        {/* Real Code Content */}
                        <div className="p-6 overflow-auto text-blue-400 leading-relaxed">
                            <span className="text-gray-500">// Architecture: Proxy Middleware</span><br />
                            <span className="text-purple-400">const</span> BASE_URL = <span className="text-green-400">'/api/tmdb'</span>;<br />
                            <br />
                            <span className="text-gray-500">// Intercept all requests to hide API Key</span><br />
                            tmdb.interceptors.request.use(config ={'>'} {'{'}<br />
                            <div className="pl-4">
                                <span className="text-purple-400">if</span> (!config.url.startsWith(BASE_URL)) {'{'}<br />
                                <div className="pl-4">
                                    <span className="text-gray-500">// Rewrite URL param to endpoint</span><br />
                                    config.params = {'{'}<br />
                                    <div className="pl-4">
                                        ...config.params,<br />
                                        <span className="text-blue-300">endpoint</span>: config.url<br />
                                    </div>
                                    {'}'};<br />
                                    config.url = BASE_URL;<br />
                                </div>
                                {'}'}<br />
                                <span className="text-purple-400">return</span> config;<br />
                            </div>
                            {'}'});<br />
                        </div>
                    </div>
                </motion.div>

                {/* Render Arrow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-2 text-white/50"
                >
                    <span className="text-[10px] font-mono tracking-widest uppercase">Render</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-90 md:rotate-0 text-green-500 w-8 h-8">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </motion.div>

                {/* Right: Visual Output */}
                <div className="h-[480px] flex-shrink-0 flex items-center justify-center relative">
                    {/* Clean Image Display - Interactive Hover */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        <img
                            src={IMAGES.web}
                            alt="Web Poster"
                            className="h-full w-auto object-contain shadow-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] hover:-translate-y-2 cursor-zoom-in"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
