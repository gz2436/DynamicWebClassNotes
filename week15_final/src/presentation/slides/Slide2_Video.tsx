import React from 'react';
import { motion } from 'framer-motion';

export const VideoSlide: React.FC = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <motion.div
                className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <video
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    src="/presentation-assets/12.9_final.mov"
                >
                    Your browser does not support the video tag.
                </video>
            </motion.div>
        </div>
    );
};
