import React, { useState, useEffect, useRef } from 'react';

interface GlitchLogoProps {
    onClick?: () => void;
}

const GlitchLogo: React.FC<GlitchLogoProps> = ({ onClick }) => {
    const [logoText, setLogoText] = useState('DAILY_FILM');
    const [isGlitching, setIsGlitching] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval ID

    useEffect(() => {
        // Auto-glitch on mount
        handleGlitch();

        return () => {
            // Cleanup on unmount
            setLogoText('DAILY_FILM');
            setIsGlitching(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current); // Clear interval if component unmounts during glitch
            }
        };
    }, []);

    const handleGlitch = () => {
        if (isGlitching) return;
        setIsGlitching(true);

        // Trigger parent onClick (reset logic)
        if (onClick) onClick();

        const originalText = 'DAILY_FILM';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

        let iteration = 0;
        const totalIterations = 25; // Increased frames for longer duration

        intervalRef.current = setInterval(() => { // Store interval ID in ref
            // Calculate how many characters from the left should be resolved
            const resolvedCount = Math.floor((iteration / totalIterations) * originalText.length);

            setLogoText(prev =>
                originalText.split('').map((char, index) => {
                    if (index < resolvedCount) {
                        return originalText[index];
                    }
                    // Unresolved characters keep scrambling every frame
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );

            iteration++;

            if (iteration > totalIterations) {
                if (intervalRef.current) clearInterval(intervalRef.current); // Clear interval using ref
                intervalRef.current = null; // Reset ref
                setLogoText(originalText);
                setIsGlitching(false);
            }
        }, 45); // Slightly slower frame rate (45ms) for better pacing
    };

    return (
        <button
            onClick={handleGlitch}
            className="block border border-white px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors font-mono font-bold min-w-[120px] text-center"
        >
            {logoText}
        </button>
    );
};

export default GlitchLogo;
