import React from 'react';
import { motion } from 'framer-motion';
import { Server, Layout, Box, Cpu, Zap, Globe, Code, Layers } from 'lucide-react';

const TECH_STACK = [
    {
        id: "01",
        category: "Visual Core",
        items: ["React 18", "Framer Motion", "WebGL Context"],
        icon: <Zap className="w-4 h-4" />
    },
    {
        id: "02",
        category: "Styling",
        items: ["TailwindCSS", "PostCSS", "Design Tokens"],
        icon: <Layout className="w-4 h-4" />
    },
    {
        id: "03",
        category: "Logic",
        items: ["TypeScript", "Custom Hooks", "State Machines"],
        icon: <Cpu className="w-4 h-4" />
    },
    {
        id: "04",
        category: "Routing",
        items: ["React Router v6", "Lazy Load", "Code Splitting"],
        icon: <Globe className="w-4 h-4" />
    }
];

export const ArchitectureSlide: React.FC = () => {
    return (
        <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Grid - Subtle */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Header - Fixed Position */}
            <div className="absolute top-12 left-0 w-full text-center z-20">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl font-black uppercase tracking-tighter"
                >
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Architecture</span>
                </motion.h2>
            </div>

            {/* Grid - Compact & Refined */}
            <div className="grid grid-cols-2 gap-4 max-w-4xl w-full relative z-10">
                {TECH_STACK.map((group, i) => (
                    <motion.div
                        key={group.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="group relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 hover:bg-white/[0.04] transition-colors"
                    >
                        {/* Card Header */}
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs text-white/40">{group.id}</span>
                                <h3 className="text-sm font-bold tracking-widest uppercase">{group.category}</h3>
                            </div>
                            <div className="opacity-40 group-hover:opacity-100 transition-opacity text-white">
                                {group.icon}
                            </div>
                        </div>

                        {/* List Items */}
                        <ul className="space-y-2">
                            {group.items.map((item, j) => (
                                <li
                                    key={item}
                                    className="font-mono text-[11px] text-gray-500 flex items-center gap-3"
                                >
                                    <span className="w-0.5 h-0.5 bg-white rounded-full opacity-40 group-hover:bg-green-500 group-hover:opacity-100 transition-all duration-500" />
                                    <span className="group-hover:text-gray-300 transition-colors">{item}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/20" />
                        <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/20" />
                        <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-white/20" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/20" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
