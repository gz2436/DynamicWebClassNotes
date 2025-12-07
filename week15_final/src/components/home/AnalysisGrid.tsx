import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnalysisGridProps {
    children: React.ReactNode;
    title: string;
    icon?: LucideIcon;
    className?: string;
}

const AnalysisGrid: React.FC<AnalysisGridProps> = ({ children, title, icon: Icon, className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`relative group ${className}`}
        >
            {/* Industrial Card Container */}
            <div className="bg-white/5 border border-white/5 p-6 relative overflow-hidden transition-colors duration-500 hover:bg-white/10 hover:border-white/10 h-full flex flex-col">

                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30" />

                {/* Header */}
                <div className="flex items-center gap-3 text-white/50 uppercase tracking-widest text-[10px] font-bold font-mono mb-4 border-b border-white/5 pb-2 border-dashed">
                    {Icon && <Icon className="h-3 w-3" />}
                    {title}
                </div>

                {/* Content */}
                <div className="text-white/80 text-sm font-mono leading-relaxed relative z-10">
                    {children}
                </div>

                {/* Decorative Scan Line (Hover) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10 translate-y-[-100%] group-hover:translate-y-[400%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            </div>
        </motion.div>
    );
};

export default AnalysisGrid;
