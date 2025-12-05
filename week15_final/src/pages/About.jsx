import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, School, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

const About = () => {
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
            className="min-h-screen bg-[#080808] text-white font-mono selection:bg-white selection:text-black p-6 md:p-12"
        >
            {/* Header */}
            {/* Back Button Removed as per request */}



            <div className="max-w-4xl mx-auto pt-32 space-y-24">

                {/* Intro */}
                <section className="space-y-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                        Academic<br />Project
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
                        DAILY_MOVIE is an experimental cinema archive built as a final project for the Dynamic Web Development course at NYU.
                    </p>
                </section>

                {/* Details Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">

                    {/* Course Info */}
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                            <BookOpen className="h-4 w-4" /> Course
                        </div>
                        <h2 className="text-2xl font-bold">Dynamic Web Development</h2>
                        <p className="text-white/60 text-sm leading-relaxed">
                            A deep dive into modern web technologies, focusing on React, API integration, and interactive design patterns.
                        </p>
                        <a
                            href="https://wp.nyu.edu/idmclasses/dm-gy-9103-dynamic-web/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors mt-auto h-[34px] flex items-center justify-center w-fit"
                        >
                            Course Website
                        </a>
                    </div>

                    {/* School Info */}
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                            <School className="h-4 w-4" /> Institution
                        </div>
                        <h2 className="text-2xl font-bold">NYU Tandon School of Engineering</h2>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Integrated Design & Media (IDM).<br />
                            Master of Science (M.S.).
                        </p>
                        <a
                            href="https://engineering.nyu.edu/academics/programs/integrated-design-media-ms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors mt-auto h-[34px] flex items-center justify-center w-fit"
                        >
                            Visit Department
                        </a>
                    </div>
                </section>

                {/* Credits */}
                <section className="border-t border-white/10 pt-12 space-y-8">
                    <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                        <User className="h-4 w-4" /> Credits
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase mb-2">Instructor</h3>
                            <p className="text-white/60 text-sm">Katie Adee</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase mb-2">Developed By</h3>
                            <p className="text-white/60 text-sm">Gavin Cheung</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase mb-2">Tech Stack</h3>
                            <p className="text-white/60 text-sm">React, Tailwind CSS, TMDB API</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase mb-2">Year</h3>
                            <p className="text-white/60 text-sm">Fall 2025</p>
                        </div>
                    </div>
                </section>

            </div>
        </motion.div>
    );
};

export default About;
