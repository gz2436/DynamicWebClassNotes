import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/tmdbClient';
import ImageWithFallback from '../ImageWithFallback';
import { Movie } from '../../types/tmdb';

interface ProductionInfoProps {
    movie: Movie;
}

const ProductionInfo: React.FC<ProductionInfoProps> = ({ movie }) => {
    return (
        <div className="p-6 md:p-12 flex flex-col gap-8">
            {/* Production Units */}
            {/* Production Units */}
            {/* Production Companies - Colorful & Linked (Original Layout) */}
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-1 font-mono text-left">
                // PRODUCTION_UNITS
            </h3>

            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                {movie.production_companies?.filter(c => c.logo_path).map(company => (
                    <Link key={company.id} to={`/company/${company.id}`} className="group relative">
                        <div className="bg-white p-3 h-12 flex items-center justify-center border border-white/10 hover:opacity-80 transition-opacity min-w-[80px]">
                            <img
                                src={getImageUrl(company.logo_path || null, 'w300') || undefined}
                                alt={company.name}
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Media Archive */}
            {movie.videos?.results && movie.videos.results.length > 0 && (
                <div>
                    <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-mono">// MEDIA_ARCHIVE</h3>
                    <div className="space-y-2">
                        {movie.videos.results.slice(0, 3).map(video => (
                            <a
                                key={video.id}
                                href={`https://www.youtube.com/watch?v=${video.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between border border-white/10 p-3 hover:bg-white/5 transition-colors group"
                            >
                                <span className="text-xs font-mono uppercase text-white/80 group-hover:text-white truncate max-w-[200px]">{video.name}</span>
                                <span className="text-[10px] text-red-500 font-bold uppercase border border-red-500/50 px-1 whitespace-nowrap bg-red-500/10">PLAY_LOG</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionInfo;
