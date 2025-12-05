import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackText = "daily_film", loading = "lazy", ...props }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`flex items-center justify-center bg-neutral-900 border border-white/10 ${className}`}>
                <div className="border border-white/20 px-2 py-1 bg-[#080808]/20 backdrop-blur-md">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 text-center block leading-none font-bold">
                        DAILY_FILM
                    </span>
                </div>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            loading={loading}
            {...props}
        />
    );
};

export default ImageWithFallback;
