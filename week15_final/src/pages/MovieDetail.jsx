import { useParams, Link, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import { getMovieDetails, getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from '../services/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import BionicText from '../components/BionicText';

// Sub-components
import MovieHero from '../components/movie/MovieHero';
import CastList from '../components/movie/CastList';
import Financials from '../components/movie/Financials';
import ProductionInfo from '../components/movie/ProductionInfo';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const navType = useNavigationType();

    // Determine context from location state
    // state can be: { category: 'top_rated' } or { list: [...] } (if we want to pass custom lists later)
    const contextCategory = location.state?.category || 'popular';

    const [movie, setMovie] = useState(() => {
        const cached = sessionStorage.getItem(`movie_detail_${id}`);
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(() => !movie);
    const [moviesList, setMoviesList] = useState([]);

    // Scroll Behavior: Always start at top for details

    useEffect(() => {
        // Ensure we start at the top when navigating to a new movie (PUSH/REPLACE),
        // but respect scroll restoration on Back (POP).
        if (navType !== 'POP') {
            window.scrollTo(0, 0);
        }

        // Reset movie if id changes and not in cache (though key prop on Route usually handles this, 
        // but good for safety if component is reused)
        const cached = sessionStorage.getItem(`movie_detail_${id}`);
        if (cached) {
            setMovie(JSON.parse(cached));
            setLoading(false);
        } else {
            setLoading(true);
            setMovie(null);
        }
    }, [id]);

    useEffect(() => {
        if (movie && movie.id && movie.id.toString() === id) return; // Already loaded correct movie

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getMovieDetails(id);
                if (data) {
                    setMovie(data);
                    try {
                        sessionStorage.setItem(`movie_detail_${id}`, JSON.stringify(data));
                    } catch (e) {
                        // ignore
                    }
                }

                // Fetch the list based on context
                let listResponse = { results: [] };
                switch (contextCategory) {
                    case 'top_rated':
                        listResponse = await getTopRatedMovies();
                        break;
                    case 'upcoming':
                        listResponse = await getUpcomingMovies();
                        break;
                    case 'now_playing':
                        listResponse = await getNowPlayingMovies();
                        break;
                    case 'popular':
                    default:
                        listResponse = await getPopularMovies();
                        break;
                }
                setMoviesList(listResponse.results || []);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, contextCategory]); // Re-run if id or category changes

    const handlePrev = () => {
        if (!moviesList.length || !movie) return;
        const currentIndex = moviesList.findIndex(m => m.id === movie.id);
        if (currentIndex !== -1 && currentIndex < moviesList.length - 1) {
            navigate(`/movie/${moviesList[currentIndex + 1].id}`, {
                state: { category: contextCategory },
                replace: true
            });
        }
    };

    const handleNext = () => {
        if (!moviesList.length || !movie) return;
        const currentIndex = moviesList.findIndex(m => m.id === movie.id);
        if (currentIndex > 0) {
            navigate(`/movie/${moviesList[currentIndex - 1].id}`, {
                state: { category: contextCategory },
                replace: true
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] text-white font-mono">
                <div className="h-screen w-full flex items-center justify-center">
                    {/* Silent Loading */}
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-[#080808] text-white font-mono flex flex-col items-center justify-center space-y-4">
                <div className="text-red-500 text-xl font-bold tracking-widest">DATA_CORRUPTED</div>
                <div className="text-white/50 text-xs">UNABLE TO RETRIEVE MOVIE ARCHIVE</div>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-widest">
                    RETURN_HOME
                </Link>
            </div>
        );
    }

    const currentIndex = moviesList.findIndex(m => m.id === movie.id);
    const isRandom = contextCategory === 'random';
    const hasPrev = !isRandom && currentIndex !== -1 && currentIndex < moviesList.length - 1;
    const hasNext = !isRandom && currentIndex > 0;

    const fromHome = location.state?.fromHome;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="min-h-screen bg-[#080808] text-white font-mono pb-20"
        >
            {/* Navigation Buttons */}
            {hasPrev && (
                <div
                    onClick={handlePrev}
                    className="fixed inset-y-0 left-0 w-12 z-40 flex items-center justify-center group cursor-pointer md:hover:bg-white/5 transition-colors"
                >
                    <ChevronLeft className="hidden md:block text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                    <button className="md:hidden w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                </div>
            )}

            {hasNext && (
                <div
                    onClick={handleNext}
                    className="fixed inset-y-0 right-0 w-12 z-40 flex items-center justify-center group cursor-pointer md:hover:bg-white/5 transition-colors"
                >
                    <ChevronRight className="hidden md:block text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                    <button className="md:hidden w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            )}

            {/* Hero Section */}
            <MovieHero movie={movie} isRandom={isRandom} showBack={!fromHome} />

            {/* Content Grid */}
            <div className="max-w-[1920px] mx-auto border-x border-white/10">

                {/* Row 1: Storyline & Context */}
                <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/10">
                    {/* Left: Storyline */}
                    <div className="p-6 md:p-12 border-r border-white/10">
                        <h3 className="text-xs uppercase tracking-widest text-white/50 mb-6 font-mono">// STORYLINE_ARCHIVE</h3>
                        <p className="text-sm md:text-base text-white/80 leading-relaxed font-mono text-justify max-w-prose">
                            <BionicText text={movie.overview} />
                        </p>
                    </div>

                    {/* Right: Crew & Tags */}
                    <div className="p-6 md:p-12 flex flex-col gap-8">
                        {/* Crew Log */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-mono">// CREW_LOG</h3>
                            <div className="space-y-3">
                                {(movie.credits?.crew || [])
                                    .filter(person => ['Director', 'Screenplay', 'Director of Photography', 'Editor', 'Original Music Composer'].includes(person.job))
                                    .slice(0, 5)
                                    .map((person, idx) => (
                                        <div key={`${person.id}-${idx}`} className="flex justify-between items-center border-b border-white/5 pb-1">
                                            <span className="text-[10px] text-white/40 uppercase tracking-wider">{person.job}</span>
                                            <span className="text-sm font-mono font-bold uppercase">{person.name}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Keywords */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-mono">// INDEX_TAGS</h3>
                            <div className="flex flex-wrap gap-2">
                                {movie.keywords?.keywords?.map(keyword => (
                                    <span key={keyword.id} className="text-[10px] uppercase border border-white/20 px-2 py-1 text-white/60 hover:bg-white hover:text-black transition-colors cursor-default">
                                        #{keyword.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Cast Manifest */}
                <CastList cast={movie.credits?.cast || []} />

                {/* Row 3: Metrics & Production & Media */}
                <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/10">
                    <Financials movie={movie} />
                    <ProductionInfo movie={movie} />
                </div>
            </div>
        </motion.div>
    );
};

export default MovieDetail;
