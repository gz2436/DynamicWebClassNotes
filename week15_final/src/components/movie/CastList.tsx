import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { getImageUrl } from '../../services/tmdbClient';
import ImageWithFallback from '../ImageWithFallback';
import { CastMember } from '../../types/tmdb';

interface CastListProps {
    cast: CastMember[];
}

const CastList: React.FC<CastListProps> = ({ cast }) => {
    const [castSearch, setCastSearch] = useState('');
    const [isCastExpanded, setIsCastExpanded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const filteredCast = cast.filter(actor =>
        actor.name.toLowerCase().includes(castSearch.toLowerCase()) ||
        actor.character.toLowerCase().includes(castSearch.toLowerCase())
    );

    // Auto-scroll logic for Cast
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const scrollContainer = scrollRef.current;
        if (!scrollContainer || castSearch || isCastExpanded) return;

        let animationFrameId: number;
        let scrollPos = scrollContainer.scrollLeft;
        const speed = 0.2;
        let isInteracting = false;

        const onInteractStart = () => { isInteracting = true; };
        const onInteractEnd = () => {
            isInteracting = false;
            if (scrollContainer) scrollPos = scrollContainer.scrollLeft;
        };

        if (scrollContainer) {
            scrollContainer.addEventListener('mousedown', onInteractStart);
            scrollContainer.addEventListener('touchstart', onInteractStart);
            scrollContainer.addEventListener('mouseup', onInteractEnd);
            scrollContainer.addEventListener('touchend', onInteractEnd);
        }

        const scroll = () => {
            if (!isInteracting && scrollContainer) {
                scrollPos += speed;
                if (scrollPos >= scrollContainer.scrollWidth / 2) {
                    scrollPos = 0;
                }
                scrollContainer.scrollLeft = scrollPos;
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (scrollContainer) {
                scrollContainer.removeEventListener('mousedown', onInteractStart);
                scrollContainer.removeEventListener('touchstart', onInteractStart);
                scrollContainer.removeEventListener('mouseup', onInteractEnd);
                scrollContainer.removeEventListener('touchend', onInteractEnd);
            }
        };
    }, [castSearch, isCastExpanded, cast]); // Added cast dependency

    return (
        <div className="p-6 md:p-12 border-b border-white/10 overflow-hidden">
            <div className="flex flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4 shrink-0">
                    <h3 className="text-xs uppercase tracking-widest text-white/50 font-mono flex items-center gap-2">
                        {/* Start mobile optimization: Remove icon on mobile if requested, or just remove icon entirely as per user "delete left icon" */}
                        <span className="hidden md:inline"><Users className="h-4 w-4" /></span> // PERSONNEL_MANIFEST
                    </h3>
                    <button
                        onClick={() => setIsCastExpanded(!isCastExpanded)}
                        className="text-[10px] uppercase border border-white/20 px-2 py-1 hover:bg-white hover:text-black transition-colors hidden md:block"
                    >
                        {isCastExpanded ? 'COLLAPSE_VIEW' : 'VIEW_FULL_MANIFEST'}
                    </button>
                </div>

                {/* Search Input - Right Aligned on same row */}
                <div className="relative group w-32 md:w-64">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH..." // Shortened placeholder for mobile
                        value={castSearch}
                        onChange={(e) => setCastSearch(e.target.value)}
                        className="w-full bg-[#080808] border border-white/20 py-1.5 pl-7 pr-2 text-[10px] md:text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors uppercase"
                    />
                </div>
            </div>

            {/* Scrollable Container */}
            <div className="relative w-full">
                {isCastExpanded ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredCast.map((actor, index) => (
                            <Link to={`/person/${actor.id}`} key={`${actor.id}-${index}`} className="group cursor-pointer block">
                                <div className="aspect-[3/4] w-full overflow-hidden relative border border-white/10 bg-white/5 mb-3">
                                    <ImageWithFallback
                                        src={getImageUrl(actor.profile_path, 'w300') || undefined}
                                        alt={actor.name}
                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white uppercase truncate group-hover:text-white/80 transition-colors">{actor.name}</span>
                                    <span className="text-[10px] text-white/40 uppercase truncate">{actor.character}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto md:overflow-hidden no-scrollbar" ref={scrollRef}>
                        <div className={`flex ${!castSearch ? '' : 'overflow-x-auto pb-4 scrollbar-hide gap-4'}`}>
                            {(castSearch ? filteredCast : [...filteredCast, ...filteredCast, ...filteredCast, ...filteredCast]).map((actor, index) => (
                                <Link to={`/person/${actor.id}`} key={`${actor.id}-${index}`} className={`flex-none w-[140px] md:w-[160px] group cursor-pointer block ${!castSearch ? 'pr-4' : ''}`}>
                                    <div className="aspect-[3/4] w-full overflow-hidden relative border border-white/10 bg-white/5 mb-3">
                                        <ImageWithFallback
                                            src={getImageUrl(actor.profile_path, 'w300') || undefined}
                                            alt={actor.name}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white uppercase truncate group-hover:text-white/80 transition-colors">{actor.name}</span>
                                        <span className="text-[10px] text-white/40 uppercase whitespace-normal leading-tight">{actor.character}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {filteredCast.length === 0 && (
                    <div className="w-full py-8 text-center text-white/30 text-xs uppercase">
                        NO_MATCHING_PERSONNEL_FOUND
                    </div>
                )}
            </div>
        </div>
    );
};

export default CastList;
