
import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    const { method, query } = request;

    // 1. Authenticate
    const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'Server misconfiguration: API Key missing' });
    }

    if (method !== 'GET') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Parse Endpoint & Params
    const { endpoint, ...queryParams } = query;
    if (!endpoint) {
        return response.status(400).json({ error: 'Missing endpoint parameter' });
    }

    // Security: Validate Endpoint
    // Must start with /, no double dots
    if (!endpoint.startsWith('/') || endpoint.includes('..')) {
        return response.status(403).json({ error: 'Invalid Endpoint' });
    }

    // 3. Cache Strategy (Redis)
    try {
        // Sort keys to ensure consistent cache key regardless of param order
        const sortedParams = Object.keys(queryParams).sort().reduce((acc, key) => {
            acc[key] = queryParams[key];
            return acc;
        }, {});

        const cacheKey = `tmdb_cache:${endpoint}:${new URLSearchParams(sortedParams).toString()}`;

        // Try Cache
        const cachedData = await kv.get(cacheKey);
        if (cachedData) {
            response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
            response.setHeader('X-Cache', 'HIT');
            return response.status(200).json(cachedData);
        }

        // Cache MISS -> Fetch TMDB
        const url = `https://api.themoviedb.org/3${endpoint}`;
        const searchParams = new URLSearchParams(queryParams);
        searchParams.append('api_key', apiKey);

        const tmdbRes = await fetch(`${url}?${searchParams.toString()}`, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!tmdbRes.ok) {
            return response.status(tmdbRes.status).json({ error: 'TMDB API Error' });
        }

        const data = await tmdbRes.json();

        // Write to Cache (Expire in 1 hour)
        // Fire and forget usually ok, but await ensures it's saved
        await kv.set(cacheKey, data, { ex: 3600 });

        response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        response.setHeader('X-Cache', 'MISS');
        return response.status(200).json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        // Fallback: If KV fails, still return data but no caching
        // Note: For production reliability, we might just bypass cache on error
        return response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
