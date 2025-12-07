import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Movie, MovieResult } from '../types/tmdb';
import {
    getCuratedMovies,
    getHiddenGems,
    getMovieDetails,
    getPopularMovies,
    getNowPlayingMovies,
    getUpcomingMovies,
    getTopRatedMovies,
    discoverMovies
} from '../services/tmdbClient';

// Keys for Query Caching
export const MOVIE_KEYS = {
    all: ['movies'] as const,
    popular: (page: number) => ['movies', 'popular', page] as const,
    curated: (page: number) => ['movies', 'curated', page] as const,
    hidden: (page: number) => ['movies', 'hidden', page] as const,
    detail: (id: number) => ['movie', id] as const,
    nowPlaying: (page: number) => ['movies', 'nowPlaying', page] as const,
    upcoming: (page: number) => ['movies', 'upcoming', page] as const,
    topRated: (page: number) => ['movies', 'topRated', page] as const,
    discover: (params: Record<string, any>) => ['movies', 'discover', params] as const,
};

// Hooks

export const usePopularMovies = (page = 1): UseQueryResult<MovieResult, Error> => {
    return useQuery({
        queryKey: MOVIE_KEYS.popular(page),
        queryFn: () => getPopularMovies(page),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useCuratedMovies = (page = 1): UseQueryResult<MovieResult, Error> => {
    return useQuery({
        queryKey: MOVIE_KEYS.curated(page),
        queryFn: () => getCuratedMovies(page),
        // keepPreviousData is deprecated in RQV5? If V5 use placeholderData. Assuming V4 or compatible.
        // But TS might complain if V5.
        // Let's assume standard API.
    });
};

export const useHiddenGems = (page = 1): UseQueryResult<MovieResult, Error> => {
    return useQuery({
        queryKey: MOVIE_KEYS.hidden(page),
        queryFn: () => getHiddenGems(page),
    });
};

export const useMovie = (id: number): UseQueryResult<Movie | null, Error> => {
    return useQuery({
        queryKey: MOVIE_KEYS.detail(id),
        queryFn: () => getMovieDetails(id),
        enabled: !!id, // Only run if ID is present
        staleTime: 1000 * 60 * 30, // 30 minutes for details
    });
};

export const useNowPlaying = (page = 1): UseQueryResult<MovieResult, Error> => {
    return useQuery({
        queryKey: MOVIE_KEYS.nowPlaying(page),
        queryFn: () => getNowPlayingMovies(page),
    });
};

export const useUpcoming = (page = 1): UseQueryResult<MovieResult, Error> => {
    return useQuery({
        queryKey: MOVIE_KEYS.upcoming(page),
        queryFn: () => getUpcomingMovies(page),
    });
};

export const useTopRated = (page = 1): UseQueryResult<MovieResult, Error> => {
    return useQuery({
        queryKey: MOVIE_KEYS.topRated(page),
        queryFn: () => getTopRatedMovies(page),
    });
};

export const useDiscoverMovies = (params: Record<string, any>): UseQueryResult<MovieResult, Error> => {
    return useQuery({
        queryKey: MOVIE_KEYS.discover(params),
        queryFn: () => discoverMovies(params),
        enabled: Object.keys(params).length > 0,
    });
};
