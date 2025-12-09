import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePresentationTheme } from '../hooks';

export const GlitchSlide: React.FC = () => {
    const { theme } = usePresentationTheme();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const originalText = 'DAILY_FILM';
    const [displayText, setDisplayText] = useState(originalText);

    // Authentic Glitch Logic Animation
    useEffect(() => {
        let interval: NodeJS.Timeout;

        const runGlitch = () => {
            let iteration = 0;
            const totalIterations = 30; // Frames for full resolve

            clearInterval(interval);
            interval = setInterval(() => {
                setDisplayText(prev =>
                    originalText.split('').map((char, index) => {
                        // Logic: Resolve from left to right based on progress
                        if (index < Math.floor((iteration / totalIterations) * originalText.length)) {
                            return originalText[index];
                        }
                        // Otherwise return random noise
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('')
                );

                if (iteration >= totalIterations) {
                    clearInterval(interval);
                    // Wait a bit then restart
                    setTimeout(runGlitch, 2000);
                }

                // Speed Adjustment: Faster resolution
                iteration += 0.5; // Faster progress (approx 3-4s total)
            }, 60); // Faster frame rate (60ms)
        };

        runGlitch();
        return () => clearInterval(interval);
    }, []);

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
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Glitch</span>
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
                            <div className="flex-1 text-center opacity-50 text-[10px]">GlitchLogo.tsx</div>
                        </div>
                        {/* Real Code Content */}
                        <div className="p-6 overflow-auto text-blue-400 leading-relaxed">
                            <span className="text-gray-500">// Source: components/GlitchLogo.tsx</span><br />
                            <span className="text-purple-400">setInterval</span>(() ={'>'} {'{'}<br />
                            <div className="pl-4">
                                <span className="text-gray-500">// Logic: Progressive Resolution</span><br />
                                <span className="text-purple-400">const</span> resolved = <span className="text-blue-300">Math</span>.floor(<br />
                                <span className="pl-4">(iteration / total) * length</span><br />
                                <span className="pl-4">);</span><br />
                                <br />
                                <span className="text-purple-400">setLogoText</span>(chars.map((c, i) ={'>'} {'{'}<br />
                                <div className="pl-4">
                                    <span className="text-purple-400">if</span> (i &lt; resolved) <span className="text-purple-400">return</span> original[i];<br />
                                    <span className="text-purple-400">return</span> randomChar();<br />
                                </div>
                                {'}'}));<br />
                            </div>
                            {'}'}, <span className="text-green-400">45</span>);
                        </div>
                    </div>
                </motion.div>

                {/* Right: Visual Demo */}
                <div className="w-[450px] h-[480px] flex-shrink-0 flex flex-col items-center justify-center border border-white/5 rounded-xl bg-black/20 relative overflow-hidden p-8">
                    <motion.div
                        key="demo-text"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-5xl font-bold tracking-[0.1em] font-mono text-center whitespace-nowrap"
                    >
                        {displayText.split('').map((c, i) => (
                            <span
                                key={i}
                                className={`inline-block w-[0.7em] text-center ${c === originalText[i] ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-green-500'}`}
                            >
                                {c}
                            </span>
                        ))}
                    </motion.div>

                    <div className="mt-12 text-center opacity-50 font-mono text-xs">
                        <p>Visualizing Algorithmic Decryption</p>
                        <div className="w-full bg-gray-700 h-1 mt-2 rounded overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                animate={{ width: ["0%", "100%", "100%", "0%"] }}
                                transition={{ duration: 2, times: [0, 0.5, 0.9, 1], repeat: Infinity, repeatDelay: 2 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
