import React, { useRef, useState, useEffect } from 'react';
import { Share2, X, Download } from 'lucide-react';
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

const SharePosterModal: React.FC<SharePosterModalProps> = ({ movie, onClose, isDaily, date }) => {
    const posterRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [posterSrc, setPosterSrc] = useState<string | null>(null);
    const [qrSrc, setQrSrc] = useState<HTMLImageElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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

            try {
                const imagePath = isLandscape ? movie.backdrop_path : movie.poster_path;
                if (!imagePath) {
                    setError('No poster/backdrop available');
                    return;
                }
                const size = 'original';

                const imgUrl = getImageUrl(imagePath, size);
                const safeImgUrl = `${imgUrl}?t=${new Date().getTime()}`;

                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = safeImgUrl;

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
                });

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

            const mainImage = await new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = posterSrc;
            });

            const qrImage = qrSrc;

            ctx.fillStyle = '#101010';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

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
                ctx.globalAlpha = 1.0;
                ctx.filter = 'contrast(120%) saturate(60%)';
                ctx.drawImage(mainImage, offsetX, offsetY, drawWidth, drawHeight);
                ctx.restore();
            }

            if (isLandscape) {
                const gradBottom = ctx.createLinearGradient(0, HEIGHT / 2, 0, HEIGHT);
                gradBottom.addColorStop(0, 'transparent');
                gradBottom.addColorStop(0.6, 'rgba(0,0,0,0.4)');
                gradBottom.addColorStop(1, 'rgba(0,0,0,0.95)');
                ctx.fillStyle = gradBottom;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
            } else {
                const gradBottom = ctx.createLinearGradient(0, HEIGHT * 0.5, 0, HEIGHT);
                gradBottom.addColorStop(0, 'transparent');
                gradBottom.addColorStop(0.5, 'rgba(0,0,0,0.6)');
                gradBottom.addColorStop(0.85, 'rgba(0,0,0,0.9)');
                gradBottom.addColorStop(1, '#000000');
                ctx.fillStyle = gradBottom;
                ctx.fillRect(0, HEIGHT * 0.5, WIDTH, HEIGHT * 0.5);
            }

            const gradTop = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.2);
            gradTop.addColorStop(0, 'rgba(0,0,0,0.8)');
            gradTop.addColorStop(1, 'transparent');
            ctx.fillStyle = gradTop;
            ctx.fillRect(0, 0, WIDTH, HEIGHT * 0.2);

            const fontMono = (size: number, weight = 'bold') =>
                `${weight} ${size * SCALE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

            const fontSans = (size: number, weight = '900') =>
                `${weight} ${size * SCALE}px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

            const centerX = WIDTH / 2;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = fontMono(10, 'bold');
            ctx.lineWidth = 1.5 * SCALE;
            ctx.strokeStyle = '#FFFFFF';
            ctx.fillStyle = '#FFFFFF';

            const topY = 30 * SCALE;

            const brandText = "DAILY_FILM";
            const letterGap = 4 * SCALE;
            const textMetrics = ctx.measureText(brandText);
            const textWidth = textMetrics.width + ((brandText.length - 1) * letterGap);
            const textHeight = 10 * SCALE;

            const boxPadX = 12 * SCALE;
            const boxPadY = 6 * SCALE;
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
                ctx.fillText(dateText, centerX, boxY + boxHeight + (16 * SCALE));

                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.font = fontMono(10, 'normal');
                ctx.fillText(yearText, centerX, boxY + boxHeight + (34 * SCALE));
            }

            if (isLandscape) {
                const p12 = 40 * SCALE;
                const pb16 = 40 * SCALE;

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

                ctx.textAlign = 'left';
                let cursorY = HEIGHT - pb16;

                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.font = fontMono(12, 'bold');
                const specs = `${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}   |   ${movie.runtime}m   |   ★ ${movie.vote_average?.toFixed(1)}`;
                ctx.fillText(specs, p12, cursorY);

                cursorY -= (12 * SCALE);
                cursorY -= (24 * SCALE);

                const titleSize = 72;
                ctx.fillStyle = '#FFFFFF';
                ctx.font = fontSans(titleSize, '900');
                const titleSpacing = -0.05 * titleSize * SCALE;
                const lineHeight = titleSize * 0.9 * SCALE;
                const maxTitleWidth = WIDTH * 0.65;

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
                    cursorY -= (16 * SCALE);
                    cursorY -= (10 * SCALE);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.font = fontMono(10, 'italic');
                    ctx.fillText(`“ ${movie.tagline.toUpperCase()} ”`, p12, cursorY);
                }

            } else {
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';

                const pSide = 32 * SCALE;
                const pBottom = 48 * SCALE;

                const qrSize = 50 * SCALE;
                const qrX = WIDTH - pSide - qrSize;
                const qrY = HEIGHT - pBottom - qrSize;

                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 12 * SCALE;
                ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
                ctx.restore();

                let cursorY = HEIGHT - pBottom;
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.font = fontMono(12, 'bold');
                const specs = `${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}   |   ${movie.runtime}m   |   ★ ${movie.vote_average?.toFixed(1)}`;
                ctx.fillText(specs, pSide, cursorY);

                cursorY -= (14 * SCALE);
                cursorY -= (20 * SCALE);

                ctx.fillStyle = '#FFFFFF';
                // Add stronger shadow for readability in portrait
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 40 * SCALE;

                const titleSize = 56;
                ctx.font = fontSans(titleSize, '900');
                const titleSpacing = -0.05 * titleSize * SCALE;
                const lineHeight = titleSize * 0.9 * SCALE;
                const maxTitleWidth = WIDTH - (pSide * 2) - qrSize - 20;

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
                    cursorY -= (16 * SCALE);
                    cursorY -= (10 * SCALE);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.font = fontMono(10, 'italic');
                    ctx.fillText(`“ ${movie.tagline.toUpperCase()} ”`, p12, cursorY);
                }
            }

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

    const isBase64 = posterSrc?.startsWith('data:');
    const canSave = posterSrc && qrSrc && isImageLoaded && !isGenerating && !error;

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 backdrop-blur-sm bg-black/80" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-[#080808] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#080808] z-10 shrink-0">
                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-[#00ff41]" />
                        Secure_Transmission
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center gap-6 custom-scrollbar">
                    <div className="relative shadow-2xl w-full max-w-[320px] mx-auto bg-black">
                        <canvas
                            ref={canvasRef}
                            className={`w-full h-auto block ${generatedImage ? 'hidden md:block' : 'block'}`}
                            style={{
                                boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                            }}
                        />

                        {generatedImage && (
                            <div className="relative group">
                                <img
                                    src={generatedImage}
                                    alt="Generated Poster"
                                    className="w-full h-auto block pointer-events-auto select-none"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur text-white text-[10px] uppercase font-bold py-2 text-center pointer-events-none opacity-100 transition-opacity">
                                    Long Press to Save Image
                                </div>
                            </div>
                        )}

                        {!posterSrc && !isGenerating && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/5 border border-white/10">
                                <span className="text-xs uppercase tracking-widest text-white/50 animate-pulse">Initializing...</span>
                            </div>
                        )}
                    </div>

                    <div className={`relative z-10 w-full flex flex-col items-center justify-center gap-1 ${isLandscape ? 'pt-6' : 'pt-6'}`}>
                        <div className="flex flex-col items-center">
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

                    {isLandscape ? (
                        <div className="absolute bottom-0 left-0 w-full p-10 pb-10 flex items-end justify-between z-10">
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
                        <div className="absolute bottom-0 left-0 w-full p-8 pb-12 flex items-end justify-between z-10">
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
    );
};

export default SharePosterModal;
