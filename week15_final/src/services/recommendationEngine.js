import { getCuratedMovies, getHiddenGems } from './tmdb';

const HISTORY_KEY = 'daily_movie_history_v1';
const HISTORY_LIMIT = 30; // Keep last 30 days to avoid repeats

// Deterministic Random Number Generator (Mulberry32)
// Seed must be an integer.
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

// Generate a numeric seed from a date string "YYYY-MM-DD"
function generateDailySeed(dateString) {
    // Simple hash of the date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

const CACHE_KEY = 'recommendation_candidates_v1';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours

// Helper: Get Candidates with Caching
async function getCandidates() {
    // 1. Try Memory/Local Storage
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) {
                console.log("Using cached recommendation candidates");
                return data;
            }
        }
    } catch (e) {
        console.warn("Cache read failed", e);
    }

    console.log("Fetching new recommendation candidates...");

    // 2. Fetch Fresh Data (Parallel)
    // We fetch a few pages from both pools to get a good mix
    // 2. Fetch Fresh Data (Parallel with Fault Tolerance)
    // We fetch a few pages from both pools to get a good mix
    const results = await Promise.allSettled([
        getCuratedMovies(1),
        getCuratedMovies(2),
        getHiddenGems(1),
        getHiddenGems(2)
    ]);

    const successfulData = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

    if (successfulData.length === 0) {
        console.error("Critical Failure: All recommendation sources failed.");
        return [];
    }

    // Flatten results
    const poolA = [];
    const poolB = [];

    // We know the order: 0,1 are Popular; 2,3 are Gems
    // But since we filtered, indices are lost. Let's just merge all results.
    // Ideally we should keep track, but for simplicity, let's just dump them into a common pool first
    // OR, we can be smarter:

    const p1 = results[0].status === 'fulfilled' ? results[0].value : { results: [] };
    const p2 = results[1].status === 'fulfilled' ? results[1].value : { results: [] };
    const g1 = results[2].status === 'fulfilled' ? results[2].value : { results: [] };
    const g2 = results[3].status === 'fulfilled' ? results[3].value : { results: [] };

    poolA.push(...(p1.results || []), ...(p2.results || []));
    poolB.push(...(g1.results || []), ...(g2.results || []));

    // 3. Merge & Deduplicate
    const allCandidates = new Map();

    // Add Pool A (Popular)
    poolA.forEach(m => allCandidates.set(m.id, { ...m, source: 'ZEITGEIST' }));

    // Add Pool B (Gems) - Overwrites duplicates (prioritize Gem status if in both?)
    // Actually, if it's in both, it's a popular gem. Let's keep it as Zeitgeist or mark as Hybrid?
    // For simplicity, let's prioritize Hidden Gem source if we want to emphasize quality.
    // But usually Zeitgeist is stronger signal for "Popular".
    // Let's stick to: If it's in Pool B, it's a Gem.
    poolB.forEach(m => {
        // If already exists, we can overwrite or skip.
        // Let's overwrite to ensure "Hidden Gem" badge appears if it qualifies.
        allCandidates.set(m.id, { ...m, source: 'HIDDEN_GEM' });
    });

    const candidateList = Array.from(allCandidates.values());

    // 4. Save to Cache
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: candidateList
        }));
    } catch (e) {
        console.warn("Cache write failed", e);
    }

    return candidateList;
}

export const recommendationEngine = {
    // Main Entry Point
    getDailyMovie: async (dateObj) => {
        const dateString = dateObj.toISOString().split('T')[0];

        // 1. Get Candidate Pool (Cached)
        const finalPool = await getCandidates();

        if (!finalPool || finalPool.length === 0) {
            console.error("No candidates available for recommendation.");
            return null;
        }

        // 2. Deterministic Selection
        const seed = generateDailySeed(dateString);
        const rng = mulberry32(seed);

        // Select Movie
        const selectedIndex = Math.floor(rng() * finalPool.length);
        const selectedMovie = finalPool[selectedIndex];

        // 3. History Check (Client Side)
        // We don't want to recommend the same movie too close together,
        // BUT for a deterministic "Daily Movie", everyone should see the same thing.
        // So we should NOT filter by user history for the *Global* Daily Movie.
        // However, if we want to prevent *consecutive days* having same movie,
        // the RNG usually handles this, but we can add a check if needed.
        // For now, pure deterministic is best for "Watercooler" effect.

        return selectedMovie;
    }
};
