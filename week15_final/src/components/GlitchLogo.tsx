import React, { useState, useEffect, useRef } from 'react';

interface GlitchLogoProps {
    onClick?: () => void;
    enableGlitch?: boolean;
    className?: string; // Allow style overrides
}

const GlitchLogo: React.FC<GlitchLogoProps> = ({ onClick, enableGlitch = true, className }) => {
    const [logoText, setLogoText] = useState('DAILY_FILM');
    const [isGlitching, setIsGlitching] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval ID

    useEffect(() => {
        // Auto-glitch on mount if enabled
        if (enableGlitch) {
            handleGlitch();
        }
        return () => {
            setLogoText('DAILY_FILM');
            setIsGlitching(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enableGlitch]);

    const handleGlitch = (e?: React.MouseEvent) => {
        // Trigger parent onClick (reset logic) ONLY if it's a user interaction (event exists)
        if (e && onClick) onClick();

        // If glitch is disabled via prop (e.g. for static center logo), do NOT trigger visual glitch
        if (!enableGlitch && !e) return;
        // Note: If user CLICKS, should it glitch? 
        // User Requirement: "Center logo is static". 
        // If they click, it transitions away instantly, so glitch state doesn't matter much.
        // But let's allow glitch on click even if auto-start is off, for responsiveness?
        // Actually, if it transitions, the component unmounts. So we won't see it.
        // If enableGlitch is strictly false, we skip visual glitch logic completely.
        // But let's keep it simple: enableGlitch controls AUTO start.
        // If enableGlitch is false, do we allow click-glitch? 
        // The user wants "Frosted Glass" -> "Move Top" -> "Glitch At Top".
        // Center: Static. Top: Glitch.
        // So Center should simply NOT glitch.

        if (isGlitching) return;
        setIsGlitching(true);

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
            className={`block border border-white px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors font-mono font-bold min-w-[120px] text-center ${className || ''}`}
        >
            {logoText}
        </button>
    );
};

export default GlitchLogo;
