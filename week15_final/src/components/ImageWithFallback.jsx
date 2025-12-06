import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackText = "daily_film", loading = "lazy", ...props }) => {
    const [error, setError] = useState(false);

    const imgSrc = props.desktopSrc || src;

    if (error || !imgSrc) {
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

    if (props.mobileSrc) {
        return (
            <picture className={className}>
                <source media="(max-width: 768px)" srcSet={props.mobileSrc} />
                <source media="(min-width: 769px)" srcSet={props.desktopSrc || src} />
                <img
                    src={props.desktopSrc || src}
                    alt={alt}
                    className={className}
                    onError={() => setError(true)}
                    loading={loading}
                    {...props}
                />
            </picture>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            loading={loading}
            {...props}
        />
    );
};

export default ImageWithFallback;
