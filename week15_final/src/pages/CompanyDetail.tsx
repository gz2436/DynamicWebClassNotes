
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCompanyDetails, getCompanyMovies, getImageUrl } from '../services/tmdbClient';
import { Globe, MapPin, Building2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import ImageWithFallback from '../components/ImageWithFallback';
import MovieCard from '../components/MovieCard';
import FloatingBackButton from '../components/FloatingBackButton';

import { CompanyDetails } from '../types/tmdb';

const CompanyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [company, setCompany] = useState<CompanyDetails | null>(() => {
        const cached = sessionStorage.getItem(`company_detail_${id}`);
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(() => !company);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popularity');

    // Scroll to Top on Mount

    useEffect(() => {
        if (company) return; // Already loaded from cache

        const fetchCompany = async () => {
            if (!id) return;
            const data = await getCompanyDetails(parseInt(id, 10));
            if (data) {
                setCompany(data);
                try {
                    sessionStorage.setItem(`company_detail_${id} `, JSON.stringify(data));
                } catch (e) {
                    // ignore
                }
            }
            setLoading(false);
        };
        fetchCompany();
    }, [id, company]);

    // PERSISTENCE (Stale-While-Revalidate)
    const [displayedCompany, setDisplayedCompany] = useState<CompanyDetails | null>(null);

    useEffect(() => {
        if (company && !loading) {
            setDisplayedCompany(company);
        }
    }, [company, loading]);

    const activeCompany = company || displayedCompany;

    if (loading && !activeCompany) {
        return (
            <div className="min-h-[100svh] bg-[#080808] text-white font-mono">
                <div className="h-screen w-full flex items-center justify-center">
                    {/* Silent Loading */}
                </div>
            </div>
        );
    }

    if (!activeCompany) {
        return (
            <div className="min-h-[100svh] bg-[#080808] text-white font-mono flex flex-col items-center justify-center p-6">
                <div className="text-4xl mb-4 opacity-50">∅</div>
                <div className="text-xs uppercase tracking-widest mb-4">DATA_MISSING</div>
                <Link to="/" className="border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors text-[10px] uppercase">
                    RETURN_TO_BASE
                </Link>
            </div>
        );
    }

    // Filter and Sort Logic
    const allMovies = activeCompany.movies?.results || [];
    const filteredMovies = allMovies
        .filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'popularity') return b.popularity - a.popularity;
            if (sortBy === 'date') return new Date(b.release_date || '0000').getTime() - new Date(a.release_date || '0000').getTime();
            if (sortBy === 'rating') return b.vote_average - a.vote_average;
            return 0;
        });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="min-h-[100svh] bg-[#080808] text-white font-mono selection:bg-white selection:text-black"
        >
            {/* Floating Back Button */}
            <FloatingBackButton />

            {/* Header */}
            <div className="max-w-7xl mx-auto pt-32 px-6 md:px-12 pb-24">

                {/* Profile Section */}
                <div className="border-b border-white/10 pb-12 mb-12">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Logo */}
                        <div className="w-full md:w-64 h-32 bg-white p-6 flex items-center justify-center border border-white/10">
                            {activeCompany.logo_path ? (
                                <ImageWithFallback
                                    src={getImageUrl(activeCompany.logo_path, 'w500')}
                                    alt={activeCompany.name}
                                    className="max-w-full max-h-full object-contain brightness-0"
                                    fallbackText="NO_LOGO"
                                />
                            ) : (
                                <span className="text-black font-bold text-xl uppercase text-center">{activeCompany.name}</span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                                    {activeCompany.name}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-white/50">
                                    {activeCompany.origin_country && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {activeCompany.origin_country}
                                        </span>
                                    )}
                                    {activeCompany.headquarters && (
                                        <span className="flex items-center gap-1">
                                            <Building2 className="h-3 w-3" /> {activeCompany.headquarters}
                                        </span>
                                    )}
                                    {activeCompany.homepage && (
                                        <a href={activeCompany.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                                            <Globe className="h-3 w-3" /> Official Website
                                        </a>
                                    )}
                                </div>
                            </div>

                            {activeCompany.description && (
                                <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-3xl">
                                    {activeCompany.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Production Archive */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/20 pb-4 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold uppercase tracking-tighter">
                                Production_Archive
                            </h2>
                            <span className="text-xs uppercase tracking-widest text-white/50">
                                {filteredMovies.length} Titles Found
                            </span>
                        </div>

                        {/* Search & Sort Controls */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative group flex-1 md:w-48">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="SEARCH..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black border border-white/20 py-1 pl-7 pr-2 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors uppercase"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-black border border-white/20 text-xs uppercase py-1 px-2 focus:outline-none focus:border-white transition-colors cursor-pointer"
                            >
                                <option value="popularity">Popularity</option>
                                <option value="date">Date</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredMovies.map(movie => (
                            <Link key={movie.id} to={`/ movie / ${movie.id} `} state={{ category: 'popular' }} className="group block">
                                <div className="aspect-[2/3] bg-white/5 border border-white/10 overflow-hidden relative mb-3">
                                    <ImageWithFallback
                                        src={getImageUrl(movie.poster_path, 'w300')}
                                        alt={movie.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 text-[10px] font-bold border border-white/20">
                                        {movie.vote_average.toFixed(1)}
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold uppercase truncate group-hover:text-white/80 transition-colors">{movie.title}</h3>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-white/40">
                                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                                    </span>
                                    <span className="text-[10px] text-white/40">
                                        POP: {movie.popularity.toFixed(0)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredMovies.length === 0 && (
                        <div className="py-12 text-center text-white/30 uppercase tracking-widest text-sm">
                            No production records found matching criteria.
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
};

export default CompanyDetail;
