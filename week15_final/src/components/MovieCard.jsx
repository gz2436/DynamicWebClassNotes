import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movie/${movie.id}`} className="block group relative flex-shrink-0 w-[220px]">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-indigo-500/20 group-hover:-translate-y-2">
                <ImageWithFallback
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay (Removed Text, kept for potential future use or just removed entirely if only scale is needed) */}
                {/* Actually, user said "just a zoom to indicate selection". The image already has group-hover:scale-110. 
                    So we can remove this overlay entirely as it blocks the view. */}

                {/* Floating Rating Badge */}
                <div className="absolute top-3 right-3 bg-[#080808]/40 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/10 shadow-lg">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                </div>
            </div>

            <div className="mt-4 px-1 space-y-1">
                <h3 className="text-white font-semibold truncate text-lg group-hover:text-indigo-400 transition-colors">{movie.title}</h3>
                <div className="flex items-center gap-3 text-white/40 text-sm">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(movie.release_date).getFullYear()}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
