import React from 'react';
import { motion } from 'framer-motion';
import { School, BookOpen, User, Code, Database, Layers } from 'lucide-react';

const About: React.FC = () => {
    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="relative min-h-[100svh] bg-[#080808] text-white selection:bg-white/20 selection:text-black px-8 py-8 md:p-12 relative overflow-hidden">

            {/* Giant Watermark */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03] select-none whitespace-nowrap">
                <h1 className="text-[15vw] font-black leading-none tracking-tighter text-white">ACADEMIC</h1>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-4xl mx-auto pt-20 md:pt-24 space-y-12 md:space-y-24 relative z-10"
            >

                {/* Header Section */}
                <motion.section variants={itemVariants} className="space-y-6 md:space-y-8">
                    <div className="relative">
                        {/* Glitch-style Header Layering */}
                        <h1 className="text-[clamp(3rem,8vw,8rem)] font-black uppercase tracking-tighter leading-none relative z-10 mix-blend-difference">
                            Academic<br />Project
                        </h1>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none absolute top-1 left-1 text-white/10 z-0 pointer-events-none select-none">
                            Academic<br />Project
                        </h1>
                    </div>

                    <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed border-l-2 border-white/20 pl-6">
                        DAILY_FILM is an experimental cinema archive built as a final project for the <span className="text-white font-bold">Dynamic Web</span> course at NYU.
                    </p>
                </motion.section>

                {/* Course & School Info (Industrial Cards) */}
                <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Course Card */}
                    <div className="group border border-white/10 bg-white/5 px-6 py-4 md:p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col items-start">
                        <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold mb-6">
                            <BookOpen className="h-3 w-3" /> Course_ID: DM-GY-9103
                        </div>
                        <h2 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">Dynamic Web</h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                            A deep dive into modern web technologies, focusing on React 19, Vite, and Serverless Architecture.
                        </p>
                        <a
                            href="https://wp.nyu.edu/idmclasses/dm-gy-9103-dynamic-web/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors"
                        >
                            Access Syllabus
                        </a>
                    </div>

                    {/* School Card */}
                    <div className="group border border-white/10 bg-white/5 px-6 py-4 md:p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col items-start">
                        <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold mb-6">
                            <School className="h-3 w-3" /> Institution
                        </div>
                        <h2 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">NYU Tandon</h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                            Integrated Design & Media (IDM).<br />
                            Master of Science (M.S.).
                        </p>
                        <a
                            href="https://engineering.nyu.edu/academics/programs/integrated-design-media-ms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors"
                        >
                            Visit Department
                        </a>
                    </div>
                </motion.section>

                {/* End Roll Credits */}
                <motion.section variants={itemVariants} className="border-t border-white/10 pt-16">
                    <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold mb-12 justify-center">
                        <User className="h-4 w-4" /> Production Credits
                    </div>

                    <div className="max-w-2xl mx-auto space-y-2">
                        {/* Instructor */}
                        <div className="flex justify-between items-end border-b border-white/5 pb-2 group hover:bg-white/5 px-2 transition-colors">
                            <span className="text-[10px] uppercase tracking-widest text-white/40">Instructor</span>
                            <span className="text-sm font-bold uppercase">Katie Adee</span>
                        </div>

                        {/* Developer */}
                        <div className="flex justify-between items-end border-b border-white/5 pb-2 group hover:bg-white/5 px-2 transition-colors">
                            <span className="text-[10px] uppercase tracking-widest text-white/40">Lead Engineer</span>
                            <span className="text-sm font-bold uppercase">Gavin Zhang</span>
                        </div>

                        {/* Term */}
                        <div className="flex justify-between items-end border-b border-white/5 pb-2 group hover:bg-white/5 px-2 transition-colors">
                            <span className="text-[10px] uppercase tracking-widest text-white/40">Semester</span>
                            <span className="text-sm font-bold uppercase">Fall 2025</span>
                        </div>

                        {/* Tech Stack Row */}
                        <div className="flex justify-between items-center border-b border-white/5 py-4 group hover:bg-white/5 px-2 transition-colors">
                            <span className="text-[10px] uppercase tracking-widest text-white/40">Tech Stack</span>
                            <div className="flex gap-2">
                                <Badge icon={<Code className="w-3 h-3" />} text="React 19" />
                                <Badge icon={<Layers className="w-3 h-3" />} text="Tailwind" />
                                <Badge icon={<Database className="w-3 h-3" />} text="TMDB" />
                            </div>
                        </div>

                    </div>
                </motion.section>

            </motion.div>
        </div>
    );
};

const Badge = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <span className="flex items-center gap-1 bg-white/10 border border-white/10 px-2 py-1 text-[9px] uppercase tracking-wider text-white/80 hover:bg-white hover:text-black transition-colors cursor-default">
        {icon} {text}
    </span>
);

export default About;
