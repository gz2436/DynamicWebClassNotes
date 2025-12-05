import { discoverMovies } from './tmdb';

// --- CONFIGURATION: WEEKLY SCHEDULE ---
// Each day of the week gets a curated "Vibe" / "Theme".
// This ensures variety and gives a "Reason" for the recommendation.

const WEEKLY_THEMES = [
    // SUNDAY (0): Hidden Gems (Relaxed, High Quality, Discovery)
    {
        id: 'HIDDEN_GEM',
        name: 'Sunday Discovery',
        description: 'Critically acclaimed films that deserve more attention.',
        params: {
            sort_by: 'vote_average.desc',
            'vote_average.gte': 7.5,
            'vote_count.lte': 3000,
            'vote_count.gte': 100,
            'primary_release_date.gte': '2010-01-01'
        }
    },
    // MONDAY (1): Critics' Choice (Serious, Top Rated, Start the week strong)
    {
        id: 'CRITICS_CHOICE',
        name: 'Critics\' Choice Monday',
        description: 'Universally praised masterpieces to start your week.',
        params: {
            sort_by: 'vote_average.desc',
            'vote_average.gte': 8.0,
            'vote_count.gte': 1000
        }
    },
    // TUESDAY (2): Sci-Fi / Future (Tech, Imagination)
    {
        id: 'SCIFI_TUESDAY',
        name: 'Sci-Fi Tuesday',
        description: 'Exploring the future, space, and technology.',
        params: {
            with_genres: '878', // Science Fiction
            sort_by: 'popularity.desc',
            'vote_average.gte': 6.5
        }
    },
    // WEDNESDAY (3): Mid-Week Action (Energy boost)
    {
        id: 'ACTION_WEDNESDAY',
        name: 'Mid-Week Adrenaline',
        description: 'High-octane action to power through the week.',
        params: {
            with_genres: '28', // Action
            sort_by: 'revenue.desc', // Blockbusters
            'vote_average.gte': 6.0
        }
    },
    // THURSDAY (4): Throwback (Movies before 2010)
    {
        id: 'THROWBACK_THURSDAY',
        name: 'Throwback Thursday',
        description: 'Modern classics and nostalgia trips.',
        params: {
            'primary_release_date.lte': '2010-01-01',
            sort_by: 'vote_count.desc', // Most iconic
            'vote_average.gte': 7.0
        }
    },
    // FRIDAY (5): Pop Culture / Trending (Party, Social)
    {
        id: 'POP_CULTURE_FRIDAY',
        name: 'Pop Culture Friday',
        description: 'The most popular movies defining the zeitgeist.',
        params: {
            sort_by: 'popularity.desc',
            'vote_count.gte': 500
        }
    },
    // SATURDAY (6): Visual Spectacle (Fantasy, Adventure, Animation)
    {
        id: 'SPECTACLE_SATURDAY',
        name: 'Spectacle Saturday',
        description: 'Immersive worlds, fantasy, and adventure.',
        params: {
            with_genres: '12,14', // Adventure, Fantasy
            sort_by: 'revenue.desc',
            'vote_average.gte': 6.5
        }
    }
];

// --- HOLIDAY RULES ---
const MANUAL_OVERRIDES = {
    // Exact Date Overrides
    '11-26': 1084242, // Zootopia 2 (Premiere)
};
const CALENDAR_RULES = {
    '01-01': { name: 'New Year', description: 'Fresh starts and new beginnings.', params: { with_keywords: '193630', sort_by: 'popularity.desc' } },
    '02-14': { name: 'Valentine\'s Day', description: 'Love is in the air.', params: { with_genres: '10749', sort_by: 'popularity.desc' } },
    '10-31': { name: 'Halloween', description: 'Spooky selections for the season.', params: { with_genres: '27', with_keywords: '3335', sort_by: 'popularity.desc' } },
    '12-24': { name: 'Christmas Eve', description: 'Festive favorites.', params: { with_keywords: '207317', sort_by: 'popularity.desc' } },
    '12-25': { name: 'Christmas', description: 'Merry Christmas!', params: { with_keywords: '207317', sort_by: 'popularity.desc' } },
    '06': { name: 'Pride Month', description: 'Celebrating LGBTQ+ stories.', params: { with_keywords: '158718', sort_by: 'popularity.desc' } },
};

// --- CORE UTILS ---

// Helper: Get Day of Year (0-365)
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Helper: Seed Generator
function generateSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Helper: Permutation Slicing (The Magic No-Collision Algorithm)
// Given a 'poolSize' and a 'dayIndex', return a unique index.
// Strategy: Use a large prime stride to traverse the pool.
function getPermutationIndex(dayIndex, poolSize, yearOffset) {
    // 1. Stride: A prime number roughly 70% of pool size to jump around
    // Just needs to be coprime with poolSize. Prime is safest.
    const stride = 997;

    // 2. Start Offset: Shifts the starting point each year so 2026 != 2025
    const startOffset = yearOffset * 123;

    // 3. Formula: (Start + Day * Stride) % Size
    return (startOffset + (dayIndex * stride)) % poolSize;
}

// --- ENGINE ---

export const recommendationEngine = {

    getDailyMovie: async (dateObj) => {
        const dateString = dateObj.toISOString().split('T')[0];
        const monthDay = dateString.substring(5); // "MM-DD"
        const month = dateString.substring(5, 7); // "MM"

        let context = null;
        let params = null;
        let poolSize = 200; // Smaller pool for holidays (Top 10 pages)

        // --- STEP 1: MANUAL OVERRIDES ---
        if (MANUAL_OVERRIDES[monthDay]) {
            console.log(`[RecEngine] Manual Override for ${dateString}: ${MANUAL_OVERRIDES[monthDay]}`);
            return { id: MANUAL_OVERRIDES[monthDay], source: 'MANUAL_EVENT', recommendationContext: { name: 'Special Event', description: 'Curated selection for this date.' } };
        }

        // --- STEP 1.5: GLOBAL PREMIERE CHECK (Trend Following) ---
        // Prioritize major theatrical releases on their opening day
        try {
            // Search for movies releasing on this specific date
            const premiereResp = await discoverMovies({
                'primary_release_date.gte': dateString,
                'primary_release_date.lte': dateString,
                sort_by: 'popularity.desc',
                'popularity.gte': 100, // Threshold for "Major" release
                with_release_type: '3|2', // Theatrical releases
                page: 1
            });

            // If a major movie is found (Pop > 100 is quite high for day-1)
            if (premiereResp.results && premiereResp.results.length > 0) {
                const premiere = premiereResp.results[0];
                // Double check popularity/vote count to avoid junk
                if (premiere.popularity > 50) {
                    console.log(`[RecEngine] Premiere Detected: ${premiere.title}`);
                    return {
                        ...premiere,
                        source: 'GLOBAL_PREMIERE',
                        recommendationContext: {
                            label: 'GLOBAL_PREMIERE',
                            name: 'Global Premiere',
                            description: `World premiere of ${premiere.title}. Be the first to watch.`
                        }
                    };
                }
            }
        } catch (e) {
            console.warn("Premiere check failed", e);
        }

        // --- STEP 2: HOLIDAY / EVENT RULES ---
        if (CALENDAR_RULES[monthDay]) {
            const rule = CALENDAR_RULES[monthDay];
            context = { label: 'HOLIDAY_EVENT', name: rule.name, description: rule.description };
            params = rule.params;
        } else if (CALENDAR_RULES[month]) {
            // 10% chance to trigger Monthly theme? Or enforce?
            // Let's enforce it on Fridays or Weekends?
            // Or just make it the default Vibe for the month if no other strong signal.
            // For now, let's keep it simple: Exact Day match only for V1.
            // Uncomment to enable monthly: 
            // const rule = CALENDAR_RULES[month];
            // params = rule.params;
        }

        // 2. Weekly Schedule (Default)
        if (!params) {
            const dayOfWeek = dateObj.getUTCDay(); // 0 (Sun) - 6 (Sat)
            const theme = WEEKLY_THEMES[dayOfWeek];

            context = {
                label: theme.id,
                name: theme.name,
                description: theme.description
            };
            params = theme.params;
            poolSize = 1000; // Large pool for general recommendation (50 pages)
        }

        // 3. Coordinate Calculation (The "Why" logic)
        // We need to map [Date] -> [Unique Movie in Pool]
        // Assumption: Each query returns ~20 predictable results per page.
        // Pool is conceptual: Page 1..N concatenated.

        const year = dateObj.getFullYear();
        const dayOfYear = getDayOfYear(dateObj);

        // Use Permutation to find index in the pool (0 to poolSize-1)
        const targetIndex = getPermutationIndex(dayOfYear, poolSize, year);

        const resultsPerPage = 20;
        const targetPage = Math.floor(targetIndex / resultsPerPage) + 1;
        const indexInPage = targetIndex % resultsPerPage;

        // 4. Fetch
        try {
            // console.log(`[RecEngine] ${dateString} | Theme: ${context.name} | PoolIdx: ${targetIndex} -> Pg ${targetPage}, Idx ${indexInPage}`);

            const response = await discoverMovies({ ...params, page: targetPage });

            if (response.results && response.results.length > indexInPage) {
                const movie = response.results[indexInPage];
                return {
                    ...movie,
                    source: context.label, // Legacy field
                    recommendationContext: context // New rich context
                };
            } else {
                // Determine fallback: Just take the first item of page 1 if index out of bounds
                // (Shouldn't happen if poolSize matches reality, but API changes)
                console.warn("[RecEngine] Index out of bounds, falling back to P1");
                const fallback = await discoverMovies({ ...params, page: 1 });
                return { ...fallback.results[0], source: context.label, recommendationContext: context };
            }

        } catch (e) {
            console.error("[RecEngine] Error", e);
            return null;
        }
    }
};
