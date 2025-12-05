import axios from 'axios';

// PROXY ARCHITECTURE:
// We now route requests through our own /api/tmdb endpoint.
// This hides the API Key from the client-side network tab.

// Detect if we are in "Proxy Mode" (Production/Preview) or "Direct Mode" (Local without Proxy)
// ideally we use proxy for both.
const BASE_URL = '/api/tmdb';

// Simple in-memory cache
const cache = new Map();

// Create an axios instance
const tmdb = axios.create({
    baseURL: '', // We constructs full URL manually to adapt for the proxy
    timeout: 10000,
});

// Helper to standardise calls to the proxy
// Old call: tmdb.get('/movie/popular', { params: { page: 1 } })
// New call: tmdb.get('', { params: { endpoint: '/movie/popular', page: 1 } })
tmdb.interceptors.request.use(config => {
    if (config.url && config.url.startsWith('/')) {
        // Move the url path to 'endpoint' param
        config.params = { ...config.params, endpoint: config.url };
        config.url = BASE_URL;
    }
    return config;
});

// Retry Logic
tmdb.interceptors.response.use(null, async (error) => {
    const { config, response } = error;
    if (!config || !config.retry) {
        config.retry = 0;
    }

    // Retry on 429 (Rate Limit) or 5xx (Server Error)
    if (config.retry < 3 && (response?.status === 429 || response?.status >= 500 || error.code === 'ECONNABORTED')) {
        config.retry += 1;
        const delay = Math.pow(2, config.retry) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.warn(`Retrying request to ${config.url} (Attempt ${config.retry}) in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return tmdb(config);
    }

    // Dispatch error event for UI
    const message = error.code === 'ECONNABORTED' ? 'Connection Timeout' : 'Network Error';
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('API_ERROR', { detail: { message } }));
    }

    return Promise.reject(error);
});

export const getPopularMovies = async (page = 1) => {
    try {
        const response = await tmdb.get('/movie/popular', { params: { page } });
        return response.data;
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return { results: [], total_pages: 0 };
    }
};

// Algorithm of Truth: Curated Popular Movies
// Filters out "popular trash" (low rating) while keeping "divisive blockbusters".
export const getCuratedMovies = async (page = 1) => {
    try {
        const response = await tmdb.get('/discover/movie', {
            params: {
                page,
                sort_by: 'popularity.desc',
                'vote_average.gte': 6.0, // The "Decency Floor"
                'vote_count.gte': 100,   // Minimum consensus
                include_adult: false
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching curated movies:", error);
        return { results: [], total_pages: 0 };
    }
};

// Pool B: Hidden Gems (High Quality, Lower Visibility)
// "The 50% Niche"
export const getHiddenGems = async (page = 1) => {
    try {
        const response = await tmdb.get('/discover/movie', {
            params: {
                page,
                sort_by: 'vote_average.desc',
                'vote_average.gte': 7.5,
                'vote_count.gte': 100,
                'vote_count.lte': 5000, // Not "blockbusters"
                include_adult: false,
                'primary_release_date.gte': '2000-01-01' // Modern classics, avoid too old for now if needed
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching hidden gems:", error);
        return { results: [], total_pages: 0 };
    }
};

export const getMovieDetails = async (id) => {
    // We don't cache details globally as they might change or be too many, 
    // but sessionStorage in the component handles per-session caching.
    try {
        const response = await tmdb.get(`/movie/${id}`, {
            params: {
                append_to_response: 'credits,release_dates,similar,keywords,videos,reviews'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for movie ${id}:`, error);
        return null;
    }
};

export const getPersonDetails = async (id) => {
    try {
        const response = await tmdb.get(`/person/${id}`, {
            params: {
                append_to_response: 'movie_credits,images'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for person ${id}:`, error);
        return null;
    }
};

export const getCompanyDetails = async (id) => {
    try {
        // Company details endpoint doesn't support append_to_response for movies directly in the same way as person
        // So we might need two calls or use discover
        const details = await tmdb.get(`/company/${id}`);

        // Fetch movies by this company
        const movies = await tmdb.get('/discover/movie', {
            params: {
                with_companies: id,
                sort_by: 'popularity.desc'
            }
        });

        return { ...details.data, movies: movies.data };
    } catch (error) {
        console.error(`Error fetching details for company ${id}:`, error);
        return null;
    }
};

export const discoverMovies = async (params = {}) => {
    try {
        const response = await tmdb.get('/discover/movie', {
            params: {
                include_adult: false,
                include_video: false,
                language: 'en-US',
                sort_by: 'popularity.desc',
                ...params
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error discovering movies:", error);
        return { results: [], total_pages: 0 };
    }
};

export const searchMovies = async (query) => {
    try {
        const response = await tmdb.get('/search/movie', {
            params: {
                query,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};

export const getImageUrl = (path, size = 'original') => {
    if (!path) return null;
    // Supported sizes: w92, w154, w185, w342, w500, w780, original
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper for simple fetches
const fetchCategory = async (endpoint, page = 1) => {
    try {
        const response = await tmdb.get(endpoint, { params: { page } });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return { results: [], total_pages: 0 };
    }
};

export const getNowPlayingMovies = (page = 1) => fetchCategory('/movie/now_playing', page);
export const getUpcomingMovies = (page = 1) => fetchCategory('/movie/upcoming', page);
export const getTopRatedMovies = (page = 1) => fetchCategory('/movie/top_rated', page);
export const getCompanyMovies = async (companyId, page = 1) => {
    try {
        const response = await tmdb.get('/discover/movie', {
            params: {
                with_companies: companyId,
                sort_by: 'popularity.desc',
                page,
                include_adult: false
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching company movies:", error);
        return { results: [], total_pages: 0 };
    }
};
