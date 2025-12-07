import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);
        let i = 0;
        const speed = 15; // ms per char

        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                setIsComplete(true);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text]);

    return (
        <span className="relative inline-block w-full">
            {/* Invisible Phantom Text to hold layout height */}
            <span className="opacity-0 select-none pointer-events-none">{text}</span>

            {/* Visible Typewriter Text overlay */}
            <span className="absolute top-0 left-0 w-full h-full">
                {displayedText}
                {!isComplete && <span className="animate-pulse inline-block w-2 h-4 bg-[#00ff41] ml-1 align-middle" />}
            </span>
        </span>
    );
};

interface ExpandableSectionProps {
    text: string;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // Threshold for "Too Long" - e.g., 300 chars
    const isLong = text.length > 300;

    return (
        <div>
            <div
                className={`relative transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-[160px]'}`}
                style={{
                    maskImage: !isExpanded && isLong ? 'linear-gradient(to bottom, black 50%, transparent 100%)' : 'none',
                    WebkitMaskImage: !isExpanded && isLong ? 'linear-gradient(to bottom, black 50%, transparent 100%)' : 'none'
                }}
            >
                <p className="text-base md:text-xl leading-relaxed text-white font-mono tracking-tight mb-4">
                    <TypewriterText text={text} />
                </p>
            </div>
            {isLong && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[10px] uppercase font-bold tracking-widest text-[#00ff41] hover:text-white flex items-center gap-2 mt-2 select-none md:ml-auto"
                >
                    {isExpanded ? 'COLLAPSE [-]' : 'READ_FULL_DOSSIER [+]'}
                </button>
            )}
        </div>
    );
};

export default ExpandableSection;
