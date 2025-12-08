import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Share2, X } from 'lucide-react';
import { Movie } from '../../types/tmdb';

const getImageUrl = (path: string | null | undefined, size = 'w780') => {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

interface SharePosterModalProps {
    movie: Movie;
    onClose: () => void;
    isDaily?: boolean;
    date?: Date | string;
}

const loadImg = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
});

const drawPosterContent = async (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    posterSrc: string,
    qrImage: HTMLImageElement,
    movie: Movie,
    isLandscape: boolean,
    scale: number,
    isDaily?: boolean,
    date?: Date | string
) => {
    // Fill Background
    ctx.fillStyle = '#101010';
    ctx.fillRect(0, 0, width, height);

    // Draw Main Image
    try {
        const mainImage = await loadImg(posterSrc);
        const imgAspect = mainImage.width / mainImage.height;
        const canvasAspect = width / height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
            drawHeight = height;
            drawWidth = height * imgAspect;
            offsetY = 0;
            offsetX = (width - drawWidth) / 2;
        } else {
            drawWidth = width;
            drawHeight = width / imgAspect;
            offsetX = 0;
            offsetY = (height - drawHeight) / 2;
        }

        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.filter = 'contrast(120%) saturate(60%)';
        ctx.drawImage(mainImage, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();
    } catch (e) {
        console.error("Failed to draw main image", e);
    }

    // Gradients
    if (isLandscape) {
        const gradBottom = ctx.createLinearGradient(0, height / 2, 0, height);
        gradBottom.addColorStop(0, 'transparent');
        gradBottom.addColorStop(0.6, 'rgba(0,0,0,0.4)');
        gradBottom.addColorStop(1, 'rgba(0,0,0,0.95)');
        ctx.fillStyle = gradBottom;
        ctx.fillRect(0, 0, width, height);
    } else {
        const gradBottom = ctx.createLinearGradient(0, height * 0.5, 0, height);
        gradBottom.addColorStop(0, 'transparent');
        gradBottom.addColorStop(0.5, 'rgba(0,0,0,0.6)');
        gradBottom.addColorStop(0.85, 'rgba(0,0,0,0.9)');
        gradBottom.addColorStop(1, '#000000');
        ctx.fillStyle = gradBottom;
        ctx.fillRect(0, height * 0.5, width, height * 0.5);
    }

    const gradTop = ctx.createLinearGradient(0, 0, 0, height * 0.2);
    gradTop.addColorStop(0, 'rgba(0,0,0,0.8)');
    gradTop.addColorStop(1, 'transparent');
    ctx.fillStyle = gradTop;
    ctx.fillRect(0, 0, width, height * 0.2);

    // Fonts
    const fontMono = (size: number, weight = 'bold') =>
        `${weight} ${size * scale}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

    const fontSans = (size: number, weight = '900') =>
        `${weight} ${size * scale}px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

    const centerX = width / 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = fontMono(10, 'bold');
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';

    // Top Logo Box
    const topY = 30 * scale;
    const brandText = "DAILY_FILM";
    const letterGap = 4 * scale;
    const textMetrics = ctx.measureText(brandText);
    const textWidth = textMetrics.width + ((brandText.length - 1) * letterGap);
    const textHeight = 10 * scale;

    const boxPadX = 12 * scale;
    const boxPadY = 6 * scale;
    const boxWidth = textWidth + (boxPadX * 2);
    const boxHeight = textHeight + (boxPadY * 2);

    const boxX = centerX - (boxWidth / 2);
    const boxY = topY - (boxHeight / 2);
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.textBaseline = 'top';
    let cursorX = centerX - (textWidth / 2);
    const textStartY = boxY + boxPadY;

    for (let i = 0; i < brandText.length; i++) {
        ctx.fillText(brandText[i], cursorX + (ctx.measureText(brandText[i]).width / 2), textStartY);
        cursorX += ctx.measureText(brandText[i]).width + letterGap;
    }

    // Date
    const displayDate = date ? new Date(date) : (isDaily ? new Date() : null);
    const useUTC = !!date;

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
        ctx.fillText(dateText, centerX, boxY + boxHeight + (16 * scale));

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = fontMono(10, 'normal');
        ctx.fillText(yearText, centerX, boxY + boxHeight + (34 * scale));
    }

    // Text Content & QR
    if (isLandscape) {
        const p12 = 40 * scale;
        const pb16 = 40 * scale;

        const qrSize = 44 * scale;
        const qrRightMargin = p12;
        const qrBottomMargin = pb16;

        const qrX = width - qrRightMargin - qrSize;
        const qrY = height - qrBottomMargin - qrSize;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 12 * scale;
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
        ctx.restore();

        ctx.textAlign = 'left';
        let cursorY = height - pb16;

        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = fontMono(12, 'bold');
        const specs = `${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}   |   ${movie.runtime}m   |   ★ ${movie.vote_average?.toFixed(1)}`;
        ctx.fillText(specs, p12, cursorY);

        cursorY -= (12 * scale);
        cursorY -= (24 * scale);

        const titleSize = 72;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = fontSans(titleSize, '900');
        const titleSpacing = -0.05 * titleSize * scale;
        const lineHeight = titleSize * 0.9 * scale;
        const maxTitleWidth = width * 0.65;

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
            ctx.fillText(line, p12, cursorY);
        });
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';

        if (movie.tagline) {
            cursorY -= (16 * scale);
            cursorY -= (10 * scale);
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = fontMono(10, 'italic');
            ctx.fillText(`“ ${movie.tagline.toUpperCase()} ”`, p12, cursorY);
        }

    } else {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const pSide = 32 * scale;
        const pBottom = 48 * scale;

        const qrSize = 50 * scale;
        const qrX = width - pSide - qrSize;
        const qrY = height - pBottom - qrSize;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 12 * scale;
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
        ctx.restore();

        let cursorY = height - pBottom;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = fontMono(12, 'bold');
        const specs = `${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}   |   ${movie.runtime}m   |   ★ ${movie.vote_average?.toFixed(1)}`;
        ctx.fillText(specs, pSide, cursorY);

        cursorY -= (14 * scale);
        cursorY -= (20 * scale);

        ctx.fillStyle = '#FFFFFF';
        // Add stronger shadow for readability in portrait
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 40 * scale;

        const titleSize = 56;
        ctx.font = fontSans(titleSize, '900');
        const titleSpacing = -0.05 * titleSize * scale;
        const lineHeight = titleSize * 0.9 * scale;
        const maxTitleWidth = width - (pSide * 2) - qrSize - 20;

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

        if (movie.tagline) {
            cursorY -= (16 * scale);
            cursorY -= (10 * scale);
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = fontMono(10, 'italic');
            ctx.fillText(`“ ${movie.tagline.toUpperCase()} ”`, pSide, cursorY);
        }
    }
};

const SharePosterModal: React.FC<SharePosterModalProps> = ({ movie, onClose, isDaily, date }) => {
    const posterRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [posterSrc, setPosterSrc] = useState<string | null>(null);
    const [qrSrc, setQrSrc] = useState<HTMLImageElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isPreviewReady, setIsPreviewReady] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Responsive Mode
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>(
        (typeof window !== 'undefined' && window.innerWidth >= 768) ? 'landscape' : 'portrait'
    );

    useEffect(() => {
        const handleResize = () => {
            setOrientation(window.innerWidth >= 768 ? 'landscape' : 'portrait');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isLandscape = orientation === 'landscape';
    const WIDTH = isLandscape ? 1920 : 1125;
    const HEIGHT = isLandscape ? 1080 : 2001;
    const SCALE = isLandscape ? 1920 / 800 : 3;

    // 1. Load Assets
    useEffect(() => {
        let isMounted = true;
        const loadAssets = async () => {
            setError(null);
            setIsImageLoaded(false);
            setPosterSrc(null);
            setQrSrc(null);
            setIsPreviewReady(false);

            try {
                const imagePath = isLandscape ? movie.backdrop_path : movie.poster_path;
                if (!imagePath) {
                    setError('No poster/backdrop available');
                    return;
                }
                const size = 'original';

                const imgUrl = getImageUrl(imagePath, size);
                const safeImgUrl = `${imgUrl}?t=${new Date().getTime()}`;

                await new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";

                    img.onload = () => {
                        if (!isMounted) return resolve();
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(img, 0, 0);
                            try {
                                const dataURL = canvas.toDataURL('image/jpeg', 0.9);
                                if (isMounted) setPosterSrc(dataURL);
                                resolve();
                            } catch (e) {
                                console.warn("CORS/Base64 failed, using URL");
                                if (isMounted) setPosterSrc(safeImgUrl);
                                resolve();
                            }
                        } else {
                            resolve();
                        }
                    };
                    img.onerror = (e) => {
                        console.error("Image load error:", e);
                        if (isMounted) setError('Failed to load image');
                        reject(e);
                    };
                    img.src = safeImgUrl;
                });

                const qrCodeUrl = "/IMG_2764.PNG";
                await new Promise<void>((resolve, reject) => {
                    const qrImg = new Image();
                    qrImg.onload = () => {
                        if (isMounted) setQrSrc(qrImg);
                        resolve();
                    };
                    qrImg.onerror = (e) => {
                        console.error("QR load error:", e);
                        if (isMounted) setError('Failed to load QR');
                        reject(e);
                    };
                    qrImg.src = qrCodeUrl;
                });

                await document.fonts.ready;
                if (isMounted) setIsImageLoaded(true);

            } catch (err) {
                console.error("Asset Load Failed", err);
                if (isMounted) setError("Failed to load resources");
            }
        };

        if (movie) loadAssets();
        return () => { isMounted = false; };
    }, [movie, orientation, isLandscape]);

    // Draw Preview
    useEffect(() => {
        const renderPreview = async () => {
            if (!posterSrc || !qrSrc || !isImageLoaded || !canvasRef.current) return;

            const canvas = canvasRef.current;
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            await drawPosterContent(
                ctx,
                WIDTH,
                HEIGHT,
                posterSrc,
                qrSrc,
                movie,
                isLandscape,
                SCALE,
                isDaily,
                date
            );

            setIsPreviewReady(true);
        };

        renderPreview();
    }, [posterSrc, qrSrc, isImageLoaded, WIDTH, HEIGHT, SCALE, isLandscape, movie, isDaily, date]);


    const handleDownload = async () => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        if (!posterSrc || !qrSrc) return;
        setIsGenerating(true);

        try {
            const canvas = document.createElement('canvas');
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Canvas context init failed");

            await drawPosterContent(
                ctx,
                WIDTH,
                HEIGHT,
                posterSrc,
                qrSrc,
                movie,
                isLandscape,
                SCALE,
                isDaily,
                date
            );

            const dataUrl = canvas.toDataURL('image/png');

            if (isMobile) {
                setGeneratedImage(dataUrl);
            } else {
                const link = document.createElement('a');
                link.download = `DailyFilm_${(movie.title || 'Poster').replace(/[^a-z0-9]/gi, '_')}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error('Canvas Generation Failed:', err);
            if (err instanceof Error) {
                alert(`Generation Error: ${err.message}`);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const canSave = posterSrc && qrSrc && isImageLoaded && !isGenerating && !error && isPreviewReady;

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] backdrop-blur-md bg-black/90 md:gap-6" onClick={onClose}>

            {/* Main Content Area - Flexible Space on Mobile, Compact on Desktop */}
            <div className="relative flex-1 md:flex-none w-full flex items-center justify-center overflow-hidden min-h-0 py-4" onClick={e => e.stopPropagation()}>

                {/* Canvas Container - Frameless & Responsive */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {/* Shadow for depth against dark background */}
                    <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-300 md:scale-90 lg:scale-[0.85]">
                        <canvas
                            ref={canvasRef}
                            className={`max-w-full max-h-[75vh] md:max-h-[70vh] w-auto h-auto object-contain block ${generatedImage ? 'hidden' : 'block'}`}
                        />

                        {generatedImage && (
                            <div className="relative group">
                                <img
                                    src={generatedImage}
                                    alt="Generated Poster"
                                    className="max-w-full max-h-[75vh] w-auto h-auto object-contain block pointer-events-auto select-none"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur text-white/90 text-[10px] uppercase font-bold py-3 text-center pointer-events-none transition-opacity">
                                    Long Press to Save Image
                                </div>
                            </div>
                        )}

                        {/* Loading/Error Overlays */}
                        {(!isPreviewReady && !generatedImage) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm z-20">
                                <span className="text-xs uppercase tracking-widest text-white/70 animate-pulse font-mono">
                                    {error ? 'ERROR' : 'GENERATING PREVIEW...'}
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-20">
                                <span className="text-xs uppercase tracking-widest text-red-400 font-mono border border-red-500/50 px-4 py-2 bg-red-950/30 rounded">
                                    {error}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer / Buttons - Floating at bottom on Mobile, Centered below image on Desktop */}
            <div className="shrink-0 pb-24 md:pb-12 pt-0 flex gap-4 z-50" onClick={e => e.stopPropagation()}>
                {generatedImage ? (
                    <button
                        onClick={onClose}
                        className="px-10 py-3 bg-white text-black font-mono font-bold text-sm tracking-widest hover:bg-gray-200 shadow-xl transition-all rounded-sm uppercase"
                    >
                        DONE
                    </button>
                ) : (
                    <>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-white/20 bg-black/40 text-white font-mono text-xs tracking-widest hover:bg-white/10 transition-all backdrop-blur-md rounded-sm uppercase"
                        >
                            CLOSE
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={!canSave}
                            className="px-8 py-2 bg-white text-black font-mono font-bold text-xs tracking-widest hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-sm uppercase"
                        >
                            {isGenerating ? 'SAVING...' : error ? 'Error' : !isPreviewReady ? 'LOADING...' : 'SAVE POSTER'}
                        </button>
                    </>
                )}
            </div>

        </div>
    );
};

export default SharePosterModal;

