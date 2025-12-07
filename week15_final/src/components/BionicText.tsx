import React from 'react';

interface BionicTextProps {
    text: string;
    className?: string;
}

const BionicText: React.FC<BionicTextProps> = ({ text, className = "" }) => {
    if (!text) return null;

    const processWord = (word: string): { bold: string; normal: string } => {
        // Simple heuristic for fixation point
        const length = word.length;
        let boldLength = 0;

        if (length <= 3) boldLength = 1;
        else if (length <= 5) boldLength = 2;
        else if (length <= 8) boldLength = 3;
        else boldLength = 4;

        // Adjust for punctuation at the start (e.g. "Hello)
        // This is a simplified version.

        return {
            bold: word.slice(0, boldLength),
            normal: word.slice(boldLength)
        };
    };

    return (
        <span className={className}>
            {text.split(/\s+/).map((word, index) => {
                const { bold, normal } = processWord(word);
                return (
                    <React.Fragment key={index}>
                        <span className="font-bold text-white/[0.75]">{bold}</span>
                        <span className="font-normal text-white/50">{normal}</span>
                        {' '}
                    </React.Fragment>
                );
            })}
        </span>
    );
};

export default BionicText;
