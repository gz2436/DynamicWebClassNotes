import React, { useRef, useState, useEffect } from 'react';

const SharePosterModal = ({ movie, onClose, isDaily }) => {
    const posterRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [posterSrc, setPosterSrc] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [error, setError] = useState(null);

    // 1. Strict Base64 Preload (Kept for speed and reliability)
    useEffect(() => {
        let isMounted = true;
        if (!movie?.poster_path) {
            setError('No poster available');
            return;
        }

        const loadBase64 = async () => {
            try {
                // Force fresh request to get CORS headers
                const originalUrl = `https://image.tmdb.org/t/p/w780${movie.poster_path}?t=${new Date().getTime()}`;
                const response = await fetch(originalUrl, { mode: 'cors' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (isMounted) setPosterSrc(reader.result);
                };
                reader.onerror = () => {
                    if (isMounted) setError('Failed to process image');
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error('Poster fetch failed:', err);
                if (isMounted) setError('Network blocked image');
            }
        };

        loadBase64();
        return () => { isMounted = false; };
    }, [movie?.poster_path]);

    // --- NATIVE CANVAS GENERATION ---
    const handleDownload = async () => {
        if (!posterSrc) return;
        setIsGenerating(true);

        try {
            await document.fonts.ready;

            // 1. Setup High-Res Canvas (3x Scale of 375x667)
            const WIDTH = 375 * 3;  // 1125
            const HEIGHT = 667 * 3; // 2001
            const SCALE = 3;

            const canvas = document.createElement('canvas');
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            const ctx = canvas.getContext('2d');

            // 2. Load Assets Manually
            const loadImage = (src) => new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });

            const [mainImage, qrImage] = await Promise.all([
                loadImage(posterSrc),
                loadImage('/IMG_2764.PNG')
            ]);

            // 3. Draw Background (Black)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // Draw Main Poster (Object-Fit: Cover)
            if (mainImage) {
                const imgAspect = mainImage.width / mainImage.height;
                const canvasAspect = WIDTH / HEIGHT;
                let drawWidth, drawHeight, offsetX, offsetY;

                if (imgAspect > canvasAspect) {
                    drawHeight = HEIGHT;
                    drawWidth = HEIGHT * imgAspect;
                    offsetY = 0;
                    offsetX = (WIDTH - drawWidth) / 2;
                } else {
                    drawWidth = WIDTH;
                    drawHeight = WIDTH / imgAspect;
                    offsetX = 0;
                    offsetY = (HEIGHT - drawHeight) / 2;
                }

                ctx.save();
                // 1. Natural Color & Brightness (User Request)
                ctx.globalAlpha = 0.85; // Much brighter
                // No grayscale, slight contrast to pop
                ctx.filter = 'contrast(110%)';
                ctx.drawImage(mainImage, offsetX, offsetY, drawWidth, drawHeight);
                ctx.restore();
            }

            // Vignette Gradient (Softer)
            const gradTop = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.3);
            gradTop.addColorStop(0, 'rgba(0,0,0,0.8)');
            gradTop.addColorStop(1, 'transparent');
            ctx.fillStyle = gradTop;
            ctx.fillRect(0, 0, WIDTH, HEIGHT * 0.3);

            const gradBottom = ctx.createLinearGradient(0, HEIGHT * 0.5, 0, HEIGHT);
            gradBottom.addColorStop(0, 'transparent');
            gradBottom.addColorStop(0.5, 'rgba(0,0,0,0.6)'); // More separation
            gradBottom.addColorStop(0.85, 'rgba(0,0,0,0.9)');
            gradBottom.addColorStop(1, '#000000');
            ctx.fillStyle = gradBottom;
            ctx.fillRect(0, HEIGHT * 0.5, WIDTH, HEIGHT * 0.5);


            // --- TYPOGRAPHY ---
            const fontMono = (size, weight = 'bold') =>
                `${weight} ${size * SCALE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

            const fontSans = (size, weight = '900') =>
                `${weight} ${size * SCALE}px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

            const centerX = WIDTH / 2;
            const PAD = 24 * SCALE;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#FFFFFF';

            // 1. TOP: BRAND (Optical Center)
            ctx.font = fontMono(10, 'bold');
            const topY = 40 * SCALE; // Slightly lower

            const brandText = "DAILY_FILM";
            const letterGap = 4 * SCALE; // Tracking
            // Geometric width = chars + gaps
            const totalGeoWidth = ctx.measureText(brandText).width + ((brandText.length - 1) * letterGap);

            // Draw
            // Start X = Center - Half Width
            let cursorX = centerX - (totalGeoWidth / 2);

            for (let i = 0; i < brandText.length; i++) {
                ctx.fillText(brandText[i], cursorX + (ctx.measureText(brandText[i]).width / 2), topY); // fillText center anchor
                cursorX += ctx.measureText(brandText[i]).width + letterGap;
            }

            // Date (if daily)
            if (isDaily) {
                const dateText = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
                const yearText = new Date().getFullYear().toString();

                ctx.font = fontMono(14, 'bold');
                ctx.fillText(dateText, centerX, topY + (24 * SCALE)); // Tighter gap

                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.font = fontMono(10, 'normal');
                ctx.fillText(yearText, centerX, topY + (42 * SCALE));
            }


            // 2. CENTER-BOTTOM: MOVIE INFO
            // We align based on bottom anchor to ensure it sits above QR code
            const qrSize = 64 * SCALE;
            const footerMargin = 32 * SCALE;
            const qrY = HEIGHT - footerMargin - qrSize - (16 * SCALE); // Anchor for QR top

            let cursorY = qrY - (40 * SCALE); // Start above QR

            // Specs Row: YEAR  |  RUNTIME  |  RATING
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = fontMono(10, 'bold');

            const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
            const runtime = `${movie.runtime}m`;
            const rating = `★ ${movie.vote_average?.toFixed(1)}`;
            const specs = `${releaseYear}   |   ${runtime}   |   ${rating}`;

            ctx.fillText(specs, centerX, cursorY);

            // Move Up for Title
            cursorY -= (24 * SCALE);

            // Title (Centered, Huge)
            ctx.fillStyle = '#FFFFFF';
            // Soft Glow
            ctx.shadowColor = 'rgba(255,255,255,0.3)';
            ctx.shadowBlur = 25 * SCALE;

            ctx.font = fontSans(42, '900');
            const titleSpacing = -0.05 * 42 * SCALE; // tracking-tighter
            const lineHeight = 42 * 1.0 * SCALE;
            const maxTitleWidth = WIDTH - (PAD * 3); // Padding on sides

            const words = (movie.title || '').toUpperCase().split(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const width = ctx.measureText(currentLine + " " + words[i]).width;
                if (width < maxTitleWidth) {
                    currentLine += " " + words[i];
                } else {
                    lines.push(currentLine);
                    currentLine = words[i];
                }
            }
            lines.push(currentLine);

            lines.reverse().forEach(line => {
                cursorY -= lineHeight;
                if ('letterSpacing' in ctx) ctx.letterSpacing = `${titleSpacing}px`;
                ctx.fillText(line, centerX, cursorY);
            });

            if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
            ctx.shadowColor = 'transparent';

            // Tagline
            if (movie.tagline) {
                cursorY -= (16 * SCALE);
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.font = fontMono(9, 'italic');
                ctx.fillText(`“ ${movie.tagline.toUpperCase()} ”`, centerX, cursorY);
            }

            // 3. FOOTER: QR
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 12 * SCALE;
            ctx.drawImage(qrImage, centerX - (qrSize / 2), qrY, qrSize, qrSize);
            ctx.restore();

            // "SCAN FOR INFO"
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = fontMono(8, 'normal');
            ctx.fillText("SCAN FOR INFO", centerX, qrY + qrSize + (12 * SCALE));

            // --- DONE ---
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `DailyFilm_${(movie.title || 'Poster').replace(/[^a-z0-9]/gi, '_')}.png`;
            link.href = dataUrl;
            link.click();

        } catch (err) {
            console.error('Canvas Generation Failed:', err);
            alert(`Generation Error: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const isBase64 = posterSrc?.startsWith('data:');
    const canSave = posterSrc && isImageLoaded && !isGenerating && !error;

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 animate-in fade-in duration-300 backdrop-blur-md">

            {/* Viewport Wrapper: DOM PREVIEW ONLY */}
            <div className="relative flex flex-col items-center justify-center w-full h-full max-h-[85vh] p-4">

                {/* Scale Container */}
                <div className="relative shadow-2xl overflow-hidden"
                    style={{
                        width: '375px',
                        height: '667px',
                        transform: 'scale(min(1, 80vh / 667px))',
                        transformOrigin: 'center center'
                    }}>

                    {/* The Actual Poster (DOM Preview - Minimal Centered) */}
                    <div
                        ref={posterRef}
                        className="relative w-full h-full overflow-hidden flex flex-col items-center"
                        style={{
                            width: '375px',
                            height: '667px',
                            backgroundColor: '#000000',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        {/* 1. Background */}
                        <div className="absolute inset-0 z-0" style={{ backgroundColor: '#101010' }}>
                            {posterSrc ? (
                                <img
                                    src={posterSrc}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: 'contrast(110%)', // Removed grayscale
                                        opacity: isImageLoaded ? 0.85 : 0 // Brighter
                                    }}
                                    crossOrigin={isBase64 ? undefined : "anonymous"}
                                    onLoad={() => setIsImageLoaded(true)}
                                    onError={() => setError('Image rendering failed')}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-mono text-xs"
                                    style={{ color: 'rgba(255,255,255,0.2)' }}>
                                    {error || 'LOADING...'}
                                </div>
                            )}
                            {/* Gradients: Softer Top, Stronger Bottom */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 30%, rgba(0,0,0,0.6) 70%, #000000 100%)' }}
                            />
                        </div>

                        {/* 2. Top Area (Centered) */}
                        <div className="relative z-10 w-full pt-10 flex flex-col items-center justify-center gap-1">
                            <div className="flex flex-col items-center">
                                {/* Visual Center: No more dot, slightly looser tracking visually balanced */}
                                <span className="font-mono font-bold tracking-[0.3em] text-[10px] uppercase text-white">
                                    DAILY_FILM
                                </span>
                            </div>

                            {isDaily && (
                                <div className="flex flex-col items-center text-center mt-3">
                                    <span className="text-[14px] font-bold tracking-widest font-mono text-white">
                                        {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
                                    </span>
                                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/60 mt-1">
                                        {new Date().getFullYear()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 3. Bottom Area (Centered) */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 w-full p-8 pb-10 flex flex-col items-center justify-end gap-6 text-center">

                            {/* Text Group */}
                            <div className="flex flex-col items-center gap-3">
                                {movie.tagline && (
                                    <p className="text-[9px] font-mono italic tracking-widest text-white/80 opacity-80">
                                        “ {movie.tagline.toUpperCase()} ”
                                    </p>
                                )}

                                <h1 className="text-4xl font-black uppercase leading-[1.0] tracking-tighter font-sans break-words w-full px-2"
                                    style={{ color: '#ffffff', textShadow: '0 0 25px rgba(255,255,255,0.3)' }}>
                                    {movie.title}
                                </h1>

                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/80 mt-1">
                                    <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                                    <span className="opacity-40">|</span>
                                    <span>{movie.runtime}m</span>
                                    <span className="opacity-40">|</span>
                                    <span>★ {movie.vote_average?.toFixed(1)}</span>
                                </div>
                            </div>

                            {/* QR Floating Centered */}
                            <div className="flex flex-col items-center gap-3 shrink-0 mt-4">
                                <div className="w-16 h-16">
                                    <img
                                        src="/IMG_2764.PNG"
                                        alt="QR"
                                        className="w-full h-full object-contain block"
                                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}
                                    />
                                </div>
                                <span className="text-[8px] font-mono tracking-widest uppercase text-white/40">
                                    SCAN FOR INFO
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-white/20 bg-black/60 text-white font-mono text-xs tracking-widest hover:bg-white hover:text-black hover:border-white transition-all backdrop-blur-md"
                    >
                        CLOSE
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!canSave}
                        className="px-8 py-2 bg-white text-black font-mono font-bold text-xs tracking-widest hover:bg-gray-200 shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? 'SAVING...' : error ? 'UNAVAILABLE' : !isImageLoaded ? 'LOADING' : 'SAVE_POSTER'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SharePosterModal;
