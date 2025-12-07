import React, { useState } from 'react';

interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackText?: string;
    mobileSrc?: string | null;
    desktopSrc?: string | null;
    fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    alt,
    className,
    fallbackText = "daily_film",
    loading = "lazy",
    mobileSrc,
    desktopSrc,
    ...props
}) => {
    const [error, setError] = useState(false);

    const imgSrc = desktopSrc || src;

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

    // Sanitize for DOM (img tag doesn't like null)
    const safeMobileSrc = mobileSrc || undefined;
    const safeDesktopSrc = desktopSrc || undefined;
    const safeSrc = (desktopSrc || src) || undefined;

    if (mobileSrc) {
        return (
            <picture className={className}>
                <source media="(max-width: 768px)" srcSet={safeMobileSrc} />
                <source media="(min-width: 769px)" srcSet={safeSrc} />
                <img
                    src={safeSrc}
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
            src={safeSrc}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            loading={loading}
            {...props}
        />
    );
};

export default ImageWithFallback;
