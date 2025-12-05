import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPersonDetails, getImageUrl } from '../services/tmdb';
import { ArrowLeft, Star, Calendar, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingBackButton from '../components/FloatingBackButton';
import ImageWithFallback from '../components/ImageWithFallback';

const PersonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(() => {
        const cached = sessionStorage.getItem(`person_detail_${id}`);
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(() => !person);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popularity'); // popularity, date, rating

    useEffect(() => {
        if (person) return; // Already loaded from cache

        const fetchPerson = async () => {
            try {
                const data = await getPersonDetails(id);
                if (data) {
                    setPerson(data);
                    try {
                        sessionStorage.setItem(`person_detail_${id}`, JSON.stringify(data));
                    } catch (e) {
                        // ignore
                    }
                } else {
                    console.error("No data found for person:", id);
                }
            } catch (error) {
                console.error("Error fetching person:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerson();
    }, [id, person]);

    // Scroll to Top on Mount


    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] text-white font-mono">
                <div className="h-screen w-full flex items-center justify-center">
                    {/* Silent Loading */}
                </div>
            </div>
        );
    }

    if (!person) {
        return (
            <div className="min-h-screen bg-[#080808] text-white font-mono flex flex-col items-center justify-center p-6">
                <div className="text-4xl mb-4 opacity-50">∅</div>
                <div className="text-xs uppercase tracking-widest mb-4">PERSONNEL_DATA_MISSING</div>
                <Link to="/" className="border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors text-[10px] uppercase">
                    RETURN_TO_BASE
                </Link>
            </div>
        );
    }

    // Filter and Sort Logic
    const allCredits = person.movie_credits?.cast || [];
    const filteredCredits = allCredits
        .filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'popularity') return b.popularity - a.popularity;
            if (sortBy === 'date') return new Date(b.release_date || '0000') - new Date(a.release_date || '0000');
            if (sortBy === 'rating') return b.vote_average - a.vote_average;
            return 0;
        });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="min-h-screen bg-[#080808] text-white font-mono selection:bg-white selection:text-black"
        >
            {/* Floating Back Button */}
            <FloatingBackButton />

            <div className="fixed top-6 right-6 md:right-12 z-40 pointer-events-none mix-blend-difference text-xs font-bold text-white hidden md:block">
                PERSONNEL_FILE: {person.id}
            </div>

            <div className="max-w-7xl mx-auto pt-32 px-6 md:px-12 pb-24">

                {/* Profile Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                    {/* Image */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="aspect-[2/3] w-full overflow-hidden border border-white/20 bg-white/5 relative">
                            <ImageWithFallback
                                src={getImageUrl(person.profile_path, 'h632')}
                                alt={person.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm p-4 border-t border-white/10">
                                <h1 className="text-xl font-bold uppercase leading-none">{person.name}</h1>
                                <div className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">{person.known_for_department}</div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-8">
                        {/* Bio */}
                        <div className="space-y-4">
                            <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                                // BIOGRAPHY
                            </h2>
                            <p className="text-sm md:text-base text-white/80 leading-relaxed whitespace-pre-line max-w-prose">
                                {person.biography || "NO_BIOGRAPHICAL_DATA_AVAILABLE."}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Born</div>
                                <div className="text-sm font-bold">{person.birthday || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Place of Birth</div>
                                <div className="text-sm font-bold">{person.place_of_birth || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Known For</div>
                                <div className="text-sm font-bold">{person.known_for_department}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Popularity</div>
                                <div className="text-sm font-bold">{person.popularity.toFixed(0)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filmography */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/20 pb-4 gap-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tighter">
                            Filmography_Archive
                        </h2>

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

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredCredits.map(movie => (
                            <Link key={movie.id} to={`/movie/${movie.id}`} state={{ category: 'popular' }} className="group block">
                                <div className="aspect-[2/3] bg-white/5 border border-white/10 overflow-hidden relative mb-2">
                                    <ImageWithFallback
                                        src={getImageUrl(movie.poster_path, 'w300')}
                                        alt={movie.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                    {movie.vote_average > 0 && (
                                        <div className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 text-[10px] font-bold border border-white/20">
                                            {movie.vote_average.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xs font-bold uppercase truncate group-hover:text-white/80 transition-colors">{movie.title}</h3>
                                <div className="text-[10px] text-white/40 truncate">
                                    {movie.character ? `as ${movie.character}` : 'Unknown Role'}
                                </div>
                                <div className="text-[10px] text-white/30">
                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                                </div>
                            </Link>
                        ))}
                        {filteredCredits.length === 0 && (
                            <div className="col-span-full py-12 text-center text-white/30 uppercase tracking-widest text-sm">
                                NO_MATCHING_RECORDS_FOUND
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default PersonDetail;
