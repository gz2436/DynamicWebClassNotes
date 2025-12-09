import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationTheme } from '../hooks';

const DigitalTumbler = ({ theme }: { theme: string }) => {
    const [locks, setLocks] = useState([false, false, false]);

    useEffect(() => {
        let timers: NodeJS.Timeout[] = [];

        const runSequence = () => {
            // 0. Reset to spinning (unlock)
            setLocks([false, false, false]);

            // 1. Lock Sequence
            const delays = [1500, 3000, 4500]; // Start locking

            delays.forEach((delay, index) => {
                const timer = setTimeout(() => {
                    setLocks(prev => {
                        const newLocks = [...prev];
                        newLocks[index] = true;
                        return newLocks;
                    });
                }, delay);
                timers.push(timer);
            });

            // 2. Reset and Loop (Wait for result to be seen, then restart)
            const loopTimer = setTimeout(() => {
                runSequence();
            }, 8000); // 8 seconds total cycle
            timers.push(loopTimer);
        };

        runSequence();

        return () => timers.forEach(clearTimeout);
    }, []);

    const values = ['28', '997', '12'];
    const labels = ['Day', 'Stride', 'Offset'];

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="flex gap-4 font-mono text-4xl md:text-5xl font-bold">
                {labels.map((label, i) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                        <div className={`w-24 h-32 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'} border rounded-lg flex items-center justify-center overflow-hidden relative shadow-inner`}>
                            <AnimatePresence mode="popLayout">
                                {!locks[i] ? (
                                    <motion.div
                                        key="spinner"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5, y: [0, -1000] }}
                                        exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                                        transition={{ y: { duration: 1, repeat: Infinity, ease: "linear" } }}
                                        className="absolute top-0 flex flex-col items-center gap-4 py-4 blur-[2px]"
                                    >
                                        {[...Array(20)].map((_, j) => (
                                            <span key={j}>{Math.floor(Math.random() * 99)}</span>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="value"
                                        initial={{ scale: 2, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="z-20 text-green-500"
                                    >
                                        {values[i]}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="z-10 bg-gradient-to-b from-transparent via-green-500/5 to-transparent absolute inset-0 pointer-events-none" />
                        </div>
                        <span className="text-[10px] opacity-40 uppercase tracking-widest">{label}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 h-20">
                <motion.span
                    animate={{ opacity: locks[2] ? 0.3 : 0 }}
                    className="text-2xl"
                >
                    =
                </motion.span>
                <div className="relative">
                    {/* Placeholder to keep height */}
                    <span className="text-6xl font-black opacity-0">042</span>

                    {locks[2] && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="absolute inset-0 text-6xl font-black text-green-500 tracking-tighter flex items-center justify-center"
                        >
                            042
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const LogicSlide: React.FC = () => {
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
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Logic</span>
                </motion.h2>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-7xl relative z-10">
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
                            <div className="flex-1 text-center opacity-50 text-[10px]">services/recommendationEngine.ts</div>
                        </div>
                        {/* Real Code Content */}
                        <div className="p-6 overflow-auto text-blue-400 leading-relaxed">
                            <span className="text-gray-500">// Source: services/recommendationEngine.ts</span><br />
                            <span className="text-purple-400">export function</span> <span className="text-yellow-400">getPermutationIndex</span>(<br />
                            <span className="pl-4">dayIndex: <span className="text-green-400">number</span>,</span><br />
                            <span className="pl-4">poolSize: <span className="text-green-400">number</span>,</span><br />
                            <span className="pl-4">yearOffset: <span className="text-green-400">number</span></span><br />
                            ): <span className="text-green-400">number</span> {'{'}<br />
                            <div className="pl-4">
                                <span className="text-gray-500">// 1. Stride: Large Prime for pseudo-randomness</span><br />
                                <span className="text-purple-400">const</span> stride = <span className="text-green-400">997</span>;<br />
                                <br />
                                <span className="text-gray-500">// 2. Start Offset: Shifts per year</span><br />
                                <span className="text-purple-400">const</span> offset = yearOffset * <span className="text-green-400">123</span>;<br />
                                <br />
                                <span className="text-gray-500">// 3. The Formula</span><br />
                                <span className="text-purple-400">return</span> (offset + (dayIndex * stride)) % poolSize;<br />
                            </div>
                            {'}'}<br />
                        </div>
                    </div>
                </motion.div>

                {/* Right: Visualization Container - Tumbler Only */}
                <div className="w-[450px] h-[480px] flex-shrink-0 flex items-center justify-center border border-white/5 rounded-xl bg-black/20 relative overflow-hidden p-8">
                    <DigitalTumbler theme={theme} />

                    <div className="absolute bottom-6 font-mono text-xs opacity-40 text-center w-full">
                        Deterministic Index Locking
                    </div>
                </div>
            </div>
        </div>
    );
};
