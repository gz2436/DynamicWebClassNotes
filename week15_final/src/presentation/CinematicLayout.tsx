import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';

interface PresentationContextType {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

const PresentationContext = createContext<PresentationContextType>({ theme: 'dark', toggleTheme: () => { } });

export const usePresentationTheme = () => useContext(PresentationContext);

interface PresentationLayoutProps {
    slides: React.ComponentType[];
}

export const CinematicLayout: React.FC<PresentationLayoutProps> = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [scale, setScale] = useState(1);
    const navigate = useNavigate();

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    // 16:9 Aspect Ratio Scaling Logic
    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const targetWidth = 1920;
            const targetHeight = 1080;

            const scaleX = windowWidth / targetWidth;
            const scaleY = windowHeight / targetHeight;

            // Use the smaller scale factor to ensure it fits (contain)
            setScale(Math.min(scaleX, scaleY));
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const paginate = useCallback((newDirection: number) => {
        const nextIndex = currentIndex + newDirection;
        if (nextIndex >= 0 && nextIndex < slides.length) {
            setDirection(newDirection);
            setCurrentIndex(nextIndex);
        }
    }, [currentIndex, slides.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.code === 'Space') {
                paginate(1);
            } else if (e.key === 'ArrowLeft') {
                paginate(-1);
            } else if (e.key === 'Escape') {
                navigate('/');
            } else if (e.key === 't') {
                toggleTheme();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [paginate, navigate]);

    const CurrentSlide = slides[currentIndex];

    // Slide Transitions
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1920 : -1920,
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)'
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)'
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1920 : -1920,
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)'
        })
    };

    // Force Dark Mode
    const bgColor = 'bg-black';

    return (
        <PresentationContext.Provider value={{ theme: 'dark', toggleTheme: () => { } }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className={`fixed inset-0 w-screen h-screen ${bgColor} text-white overflow-hidden flex items-center justify-center font-sans selection:bg-white/20`}
            >

                {/* Scale Wrapper: 1920x1080 Fixed Container */}
                <div
                    style={{
                        width: '1920px',
                        height: '1080px',
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center'
                    }}
                    className="relative shadow-2xl overflow-hidden bg-black"
                >
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <CurrentSlide />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Overlays (Hover to reveal) */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 z-50 flex items-end justify-between p-12 pointer-events-none">
                        <div className="text-white/30 font-mono text-sm pointer-events-auto">
                            {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                        </div>

                        <div className="flex gap-4 pointer-events-auto">
                            <button
                                onClick={() => paginate(-1)}
                                className="p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 group"
                                disabled={currentIndex === 0}
                            >
                                <ArrowLeft className={`w-6 h-6 ${currentIndex === 0 ? 'opacity-30' : 'opacity-70 group-hover:opacity-100'}`} />
                            </button>
                            <button
                                onClick={() => paginate(1)}
                                className="p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 group"
                                disabled={currentIndex === slides.length - 1}
                            >
                                <ArrowRight className={`w-6 h-6 ${currentIndex === slides.length - 1 ? 'opacity-30' : 'opacity-70 group-hover:opacity-100'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </PresentationContext.Provider>
    );
};
