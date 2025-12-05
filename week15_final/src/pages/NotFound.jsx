import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen bg-[#080808] text-white font-mono flex flex-col items-center justify-center p-6"
        >
            <h1 className="text-9xl font-black text-white/10 mb-4">404</h1>
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">Page Not Found</h2>
            <Link
                to="/"
                className="px-6 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-widest"
            >
                Return Home
            </Link>
        </motion.div>
    );
};

export default NotFound;
