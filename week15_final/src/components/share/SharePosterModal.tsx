
import React, { useRef, useState, useEffect } from 'react';
import { Movie } from '../../types/tmdb';

const getImageUrl = (path: string | null | undefined, size = 'w780') => {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

interface SharePosterModalProps {
    movie: Movie;
    onClose: () => void;
    isDaily?: boolean; // Keep for layout distinction if needed
    date?: Date | string; // The specific date for this movie recommendation
}

const SharePosterModal: React.FC<SharePosterModalProps> = ({ movie, onClose, isDaily, date }) => {
    const posterRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [posterSrc, setPosterSrc] = useState<string | null>(null);
    const [qrSrc, setQrSrc] = useState<HTMLImageElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Responsive Mode: Default to Landscape on Desktop, Portrait on Mobile
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>(
        window.innerWidth >= 768 ? 'landscape' : 'portrait'
    );

    useEffect(() => {
        const handleResize = () => {
            setOrientation(window.innerWidth >= 768 ? 'landscape' : 'portrait');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Constants
    const isLandscape = orientation === 'landscape';
    const WIDTH = isLandscape ? 1920 : 1125;
    const HEIGHT = isLandscape ? 1080 : 2001;
    const PREVIEW_W = isLandscape ? 800 : 375;
    const PREVIEW_H = isLandscape ? 450 : 667;
    const SCALE = isLandscape ? 1920 / 800 : 3;

    // 1. Load Assets (Poster + QR)
    useEffect(() => {
        let isMounted = true;
        const loadAssets = async () => {
            setError(null);
            setIsImageLoaded(false);
            setPosterSrc(null); // Clear previous poster
            setQrSrc(null); // Clear previous QR

            try {
                // Select Source based on Orientation
                const imagePath = isLandscape ? movie.backdrop_path : movie.poster_path;
                if (!imagePath) {
                    setError('No poster/backdrop available');
                    return;
                }
                const size = 'original'; // Use high res for both

                // 1. Main Image (Cross-Origin safe)
                const imgUrl = getImageUrl(imagePath, size);
                // Add cache buster to avoid CORS from disk cache
                const safeImgUrl = `${imgUrl}?t=${new Date().getTime()}`;

                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = safeImgUrl;

                // Convert to Base64 to bypass Tainted Canvas completely
                await new Promise<void>((resolve, reject) => {
                    img.onload = () => {
                        if (!isMounted) return resolve();
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(img, 0, 0);
                            try {
                                const dataURL = canvas.toDataURL('image/jpeg', 0.9); // JPEG for speed/size
                                if (isMounted) setPosterSrc(dataURL);
                                resolve();
                            } catch (e) {
                                // Fallback if CORS fails (server rejection)
                                console.warn("CORS/Base64 failed, using URL");
                                if (isMounted) setPosterSrc(safeImgUrl);
                                resolve();
                            }
                        } else {
                            resolve(); // Should not happen
                        }
                    };
                    img.onerror = (e) => {
                        console.error("Image load error:", e);
                        if (isMounted) setError('Failed to load image');
                        reject(e);
                    };
                });

                // 2. QR Code
                const qrCodeUrl = "/IMG_2764.PNG";
                const qrImg = new Image();
                qrImg.src = qrCodeUrl;
                await new Promise<void>((resolve, reject) => {
                    qrImg.onload = () => {
                        if (isMounted) setQrSrc(qrImg);
                        resolve();
                    };
                    qrImg.onerror = (e) => {
                        console.error("QR load error:", e);
                        if (isMounted) setError('Failed to load QR');
                        reject(e);
                    };
                });

                // 3. Fonts Ready
                await document.fonts.ready;
                if (isMounted) setIsImageLoaded(true); // Indicate all assets are ready

            } catch (err) {
                console.error("Asset Load Failed", err);
                if (isMounted) setError("Failed to load resources");
            }
        };

        if (movie) loadAssets();
        return () => { isMounted = false; };
    }, [movie, orientation, isLandscape]);

    // --- NATIVE CANVAS GENERATION ---
    const handleDownload = async () => {
        if (!posterSrc || !qrSrc) return;
        setIsGenerating(true);

        try {
            // Create Offscreen Canvas
            const canvas = document.createElement('canvas');
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Canvas context init failed");

            // Load Main Image Object
            const mainImage = await new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous"; // Important even for Data URL sometimes
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = posterSrc;
            });

            const qrImage = qrSrc;

            // --- DRAWING ---

            // Draw Background (Black)
            ctx.fillStyle = '#101010';
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
                // 1. Natural Color & Brightness
                ctx.globalAlpha = 0.85;
                ctx.filter = 'contrast(110%)';
                // 1. Atmosphere: Cinematic "Bleach Bypass" feel
                // Less saturation (60%), higher contrast (120%)
                ctx.globalAlpha = 1.0;
                ctx.filter = 'contrast(120%) saturate(60%)';
                ctx.drawImage(mainImage, offsetX, offsetY, drawWidth, drawHeight);
                ctx.restore();
            }

            // Vignette Gradients (Adaptive)
            if (isLandscape) {
                // Landscape: Darker bottom-left for text readibility
                const gradBottom = ctx.createLinearGradient(0, HEIGHT / 2, 0, HEIGHT);
                gradBottom.addColorStop(0, 'transparent');
                gradBottom.addColorStop(0.6, 'rgba(0,0,0,0.4)');
                gradBottom.addColorStop(1, 'rgba(0,0,0,0.95)');
                ctx.fillStyle = gradBottom;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
            } else {
                // Portrait: Standard bottom fade
                const gradBottom = ctx.createLinearGradient(0, HEIGHT * 0.5, 0, HEIGHT);
                gradBottom.addColorStop(0, 'transparent');
                gradBottom.addColorStop(0.5, 'rgba(0,0,0,0.6)');
                gradBottom.addColorStop(0.85, 'rgba(0,0,0,0.9)');
                gradBottom.addColorStop(1, '#000000');
                ctx.fillStyle = gradBottom;
                ctx.fillRect(0, HEIGHT * 0.5, WIDTH, HEIGHT * 0.5);
            }

            // Top Gradient (Unified)
            const gradTop = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.2);
            gradTop.addColorStop(0, 'rgba(0,0,0,0.8)');
            gradTop.addColorStop(1, 'transparent');
            ctx.fillStyle = gradTop;
            ctx.fillRect(0, 0, WIDTH, HEIGHT * 0.2);


            // --- TYPOGRAPHY ---
            const fontMono = (size: number, weight = 'bold') =>
                `${weight} ${size * SCALE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

            const fontSans = (size: number, weight = '900') =>
                `${weight} ${size * SCALE}px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

            const centerX = WIDTH / 2;
            const PAD = isLandscape ? 100 * SCALE : 24 * SCALE; // More padding on desktop

            ctx.fillStyle = '#FFFFFF';

            // 1. TOP: BRAND (Nameplate Style)
            // Let's keep Top Center inside a box
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle'; // Easier for centering in box
            ctx.font = fontMono(10, 'bold');
            ctx.lineWidth = 1.5 * SCALE; // Border thickness
            ctx.strokeStyle = '#FFFFFF';

            const topY = isLandscape ? 30 * SCALE : 30 * SCALE; // Center of the box

            const brandText = "DAILY_FILM";
            const letterGap = 4 * SCALE;
            const textMetrics = ctx.measureText(brandText);
            const textWidth = textMetrics.width + ((brandText.length - 1) * letterGap);
            const textHeight = 10 * SCALE; //Approx cap height

            // Box Dims
            const boxPadX = 12 * SCALE;
            const boxPadY = 6 * SCALE; // Tight vertical padding
            const boxWidth = textWidth + (boxPadX * 2);
            const boxHeight = textHeight + (boxPadY * 2);

            // Draw Box
            const boxX = centerX - (boxWidth / 2);
            const boxY = topY - (boxHeight / 2);
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

            // Draw Text
            ctx.textBaseline = 'top';
            // Manual centering adjustment for 'top' baseline
            // topY is center of box. boxY is top of box. 
            // Text Y should be boxY + boxPadY... roughly.
            // Let's rely on calculation

            let cursorX = centerX - (textWidth / 2);
            const textStartY = boxY + boxPadY; // Start drawing text inside padding

            for (let i = 0; i < brandText.length; i++) {
                ctx.fillText(brandText[i], cursorX + (ctx.measureText(brandText[i]).width / 2), textStartY);
                cursorX += ctx.measureText(brandText[i]).width + letterGap;
            }

            // Date (Moved down slightly due to box)
            // Logic: Show date if provided (priority) OR if isDaily (fallback to today)
            const displayDate = date ? new Date(date) : (isDaily ? new Date() : null);
            const useUTC = !!date; // If date provided, it's a UTC midnight record. If fallback to new Date(), it's local.

            if (displayDate) {
                const dateText = displayDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    timeZone: useUTC ? 'UTC' : undefined
                }).toUpperCase();

                const yearText = displayDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    timeZone: useUTC ? 'UTC' : undefined
                });

                ctx.textBaseline = 'top';
                ctx.font = fontMono(14, 'bold');
                ctx.fillText(dateText, centerX, boxY + boxHeight + (16 * SCALE));

                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.font = fontMono(10, 'normal');
                ctx.fillText(yearText, centerX, boxY + boxHeight + (34 * SCALE));
            }


            // --- LAYOUT SWITCH ---

            if (isLandscape) {
                // === LANDSCAPE LAYOUT (Cinematic Wide) ===
                // Match DOM: p-12 (48px), pb-16 (64px), gap-4 (16px)
                // Reference Base: 800px width

                const p12 = 40 * SCALE;
                const pb16 = 40 * SCALE;
                const mr2 = 0;

                // QR Logic (Bottom Right)
                const qrSize = 44 * SCALE;
                const qrRightMargin = p12;
                const qrBottomMargin = pb16;

                const qrX = WIDTH - qrRightMargin - qrSize;
                const qrY = HEIGHT - qrBottomMargin - qrSize;

                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 12 * SCALE;
                ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
                ctx.restore();


                // Text Content (Bottom Left)
                // DOM: p-12 pb-16. 
                // Specs: mb-2 (8px)? No, there's gap-4 between title and specs.

                ctx.textAlign = 'left';
                let cursorY = HEIGHT - pb16; // Bottom anchor of text block

                // Specs (Bottom-most element of left group)
                // DOM says: Specs has 'mt-2' (8px) margin from Title.
                // So Title Bottom is at cursorY - specsHeight - mt2.
                // Let's draw specs first.

                // Specs Font: text-[12px] => 12
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.font = fontMono(12, 'bold');
                const specs = `${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}   |   ${movie.runtime}m   |   ★ ${movie.vote_average?.toFixed(1)}`;
                ctx.fillText(specs, p12, cursorY);

                // Move up for Title
                // Specs height approx 12 + gap-4 (16px) + mt-2 (8px)? 
                // DOM has gap-4 between Title and Specs group. And Specs has mt-2 inside?
                // Left group gap-4: Tagline | Title | SpecsGroup.
                // SpecsGroup has mt-2.
                // So spacing = 16px (gap-4) + 8px (mt-2 in specs div) = 24px is safe.

                cursorY -= (12 * SCALE); // Height of specs text roughly
                cursorY -= (24 * SCALE); // Gap above specs

                // Title (HUGE)
                // DOM: text-7xl (72px), leading-[0.9], font-black
                const titleSize = 72;
                ctx.fillStyle = '#FFFFFF';
                ctx.font = fontSans(titleSize, '900');
                const titleSpacing = -0.05 * titleSize * SCALE;
                const lineHeight = titleSize * 0.9 * SCALE; // LEADING 0.9
                const maxTitleWidth = WIDTH * 0.65; // Max 65% width per DOM

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

                // Draw Upwards
                lines.reverse().forEach((line, index) => {
                    // For the last line (which was first physically), we don't subtract lineheight yet?
                    // Actually standard loop is fine.
                    // Wait, textBaseline 'top' default? Or reset?
                    // We set textBaseline 'top' earlier. 
                    // To draw upwards from baseline, we need to be careful.
                    // Let's use fillText but adjust Y to be "Top" of the line.

                    cursorY -= lineHeight; // Move to top of this line

                    if ('letterSpacing' in ctx) (ctx as any).letterSpacing = `${titleSpacing}px`;

                    // Small tweak: Visual adjustment for 'leading-0.9'
                    // leading-0.9 means line height is 90% of font size.
                    // If we draw at Y, characters render below Y.
                    // We moved cursorY up by lineHeight.
                    ctx.fillText(line, p12, cursorY);
                });
                if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';

                // Tagline
                if (movie.tagline) {
                    // DOM: gap-4 (16px) above title
                    cursorY -= (16 * SCALE);
                    // Tagline height
                    cursorY -= (10 * SCALE);

                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.font = fontMono(10, 'italic');
                    ctx.fillText(`“ ${movie.tagline.toUpperCase()} ”`, p12, cursorY);
                }

            } else {
                // === PORTRAIT LAYOUT (Optimized: Similar to Landscape) ===
                // Align Left
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';

                const pSide = 32 * SCALE;
                const pBottom = 48 * SCALE;

                // 2. QR Code (Bottom Right)
                const qrSize = 50 * SCALE;
                const qrX = WIDTH - pSide - qrSize;
                const qrY = HEIGHT - pBottom - qrSize;

                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 12 * SCALE;
                ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
                ctx.restore();

                // 3. MOVIE INFO (Bottom Left)
                let cursorY = HEIGHT - pBottom;

                // Specs
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.font = fontMono(12, 'bold');
                const specs = `${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}   |   ${movie.runtime}m   |   ★ ${movie.vote_average?.toFixed(1)}`;
                ctx.fillText(specs, pSide, cursorY);

                // Move up
                cursorY -= (14 * SCALE);
                cursorY -= (20 * SCALE);

                // Title
                ctx.fillStyle = '#FFFFFF';
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 40 * SCALE;

                const titleSize = 56; // Larger on mobile
                ctx.font = fontSans(titleSize, '900');
                const titleSpacing = -0.05 * titleSize * SCALE;
                const lineHeight = titleSize * 0.9 * SCALE;
                const maxTitleWidth = WIDTH - (pSide * 2) - qrSize - 20; // Avoid QR intersection? Or just wrap.

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

                lines.reverse().forEach((line) => {
                    cursorY -= lineHeight;
                    if ('letterSpacing' in ctx) (ctx as any).letterSpacing = `${titleSpacing}px`;
                    ctx.fillText(line, pSide, cursorY);
                });
                if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';
                ctx.shadowColor = 'transparent';

                // Tagline
                if (movie.tagline) {
                    cursorY -= (16 * SCALE);
                    cursorY -= (10 * SCALE);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.font = fontMono(10, 'italic');
                    ctx.fillText(`“ ${movie.tagline.toUpperCase()} ”`, pSide, cursorY);
                }
            }

            // --- DONE ---
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `DailyFilm_${(movie.title || 'Poster').replace(/[^a-z0-9]/gi, '_')}.png`;
            link.href = dataUrl;
            link.click();

        } catch (err) {
            console.error('Canvas Generation Failed:', err);
            if (err instanceof Error) {
                alert(`Generation Error: ${err.message}`);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const isBase64 = posterSrc?.startsWith('data:');
    const canSave = posterSrc && qrSrc && isImageLoaded && !isGenerating && !error;

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 animate-in fade-in duration-300 backdrop-blur-md">

            {/* Viewport Wrapper: DOM PREVIEW ONLY */}
            <div className="relative flex flex-col items-center justify-center w-full h-full max-h-[85vh] p-4">

                {/* Scale Container - DYNAMIC ASPECT RATIO */}
                <div className="relative shadow-2xl overflow-hidden transition-all duration-500"
                    style={{
                        width: `${PREVIEW_W}px`,
                        height: `${PREVIEW_H}px`,
                        // Scale down to fit viewport logic
                        transform: `scale(${isLandscape
                            ? 'min(1, 80vw / 800px)' // Limit landscape by width mostly
                            : 'min(1, 80vh / 667px)' // Limit portrait by height
                            })`,
                        transformOrigin: 'center center'
                    }}>

                    {/* The Actual Poster (DOM Preview) */}
                    <div
                        ref={posterRef}
                        className="relative w-full h-full overflow-hidden flex flex-col"
                        style={{
                            width: `${PREVIEW_W}px`,
                            height: `${PREVIEW_H}px`,
                            backgroundColor: '#000000',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            alignItems: isLandscape ? 'flex-start' : 'center', // Landscape = Left, Portrait = Center
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
                                        filter: 'contrast(120%) saturate(60%)', // Cinematic Bleach Bypass
                                        opacity: isImageLoaded ? 1.0 : 0
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
                            {/* Gradients */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: isLandscape
                                        ? `linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 25%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.95) 100%)`
                                        : `linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 30%, rgba(0,0,0,0.6) 70%, #000000 100%)`
                                }}
                            />
                            {/* Extra Dark Corner for Landscape text */}
                            {isLandscape && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            )}
                        </div>

                        {/* 2. Top Area (Centered Brand for both) */}
                        <div className={`relative z-10 w-full flex flex-col items-center justify-center gap-1 ${isLandscape ? 'pt-6' : 'pt-6'}`}>
                            <div className="flex flex-col items-center">
                                {/* NAMEPLATE STYLE: Border + Tight Padding */}
                                <div className="border border-white/90 px-3 py-[3px] flex items-center justify-center">
                                    <span className="font-mono font-bold tracking-[0.3em] text-[10px] uppercase text-white drop-shadow-md leading-none">
                                        DAILY_FILM
                                    </span>
                                </div>
                            </div>

                            {(isDaily || date) && (() => {
                                const displayDate = date ? new Date(date) : new Date();
                                const useUTC = !!date;
                                return (
                                    <div className="flex flex-col items-center text-center mt-3">
                                        <span className="text-[14px] font-bold tracking-widest font-mono text-white drop-shadow-md">
                                            {displayDate.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: '2-digit',
                                                timeZone: useUTC ? 'UTC' : undefined
                                            }).toUpperCase()}
                                        </span>
                                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/60 mt-1 drop-shadow-md">
                                            {displayDate.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                timeZone: useUTC ? 'UTC' : undefined
                                            })}
                                        </span>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* 3. Bottom Area */}
                        {isLandscape ? (
                            // === LANDSCAPE DOM (Left Bottom) ===
                            <div className="absolute bottom-0 left-0 w-full p-10 pb-10 flex items-end justify-between z-10">
                                {/* Left: Text Content */}
                                <div className="flex flex-col items-start text-left max-w-[65%] gap-4">
                                    {movie.tagline && (
                                        <p className="text-[10px] font-mono italic tracking-widest text-white/80 opacity-80 pl-1">
                                            “ {movie.tagline.toUpperCase()} ”
                                        </p>
                                    )}

                                    <h1 className="text-7xl font-black uppercase leading-[0.9] tracking-tighter font-sans break-words w-full text-white drop-shadow-2xl">
                                        {movie.title}
                                    </h1>

                                    <div className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-wider text-white/80 mt-2 pl-1 font-mono">
                                        <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                                        <span className="opacity-40">|</span>
                                        <span>{movie.runtime}m</span>
                                        <span className="opacity-40">|</span>
                                        <span>★ {movie.vote_average?.toFixed(1)}</span>
                                    </div>
                                </div>

                                {/* Right: QR Code */}
                                <div className="flex flex-col items-center gap-3 shrink-0 mb-0 mr-0">
                                    <div className="w-12 h-12 bg-white/10 p-1 backdrop-blur-sm rounded-sm">
                                        <img
                                            src="/IMG_2764.PNG"
                                            alt="QR"
                                            className="w-full h-full object-contain block"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // === PORTRAIT DOM (Unified Left-Align) ===
                            <div className="absolute bottom-0 left-0 w-full p-8 pb-12 flex items-end justify-between z-10">
                                {/* Left: Text Content */}
                                <div className="flex flex-col items-start text-left max-w-[65%] gap-3">
                                    {movie.tagline && (
                                        <p className="text-[10px] font-mono italic tracking-widest text-white/80 opacity-80 pl-1">
                                            “ {movie.tagline.toUpperCase()} ”
                                        </p>
                                    )}

                                    <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter font-sans break-words w-full text-white drop-shadow-2xl">
                                        {movie.title}
                                    </h1>

                                    <div className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-wider text-white/80 mt-2 pl-1 font-mono">
                                        <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                                        <span className="opacity-40">|</span>
                                        <span>{movie.runtime}m</span>
                                        <span className="opacity-40">|</span>
                                        <span>★ {movie.vote_average?.toFixed(1)}</span>
                                    </div>
                                </div>

                                {/* Right: QR Code */}
                                <div className="flex flex-col items-center gap-3 shrink-0 mb-0 mr-0">
                                    <div className="w-12 h-12 bg-white/10 p-1 backdrop-blur-sm rounded-sm">
                                        <img
                                            src="/IMG_2764.PNG"
                                            alt="QR"
                                            className="w-full h-full object-contain block"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
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
