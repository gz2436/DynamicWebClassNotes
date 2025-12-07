import { discoverMovies } from './tmdbClient';
import { WEEKLY_THEMES, MANUAL_OVERRIDES, CALENDAR_RULES } from '../config/curation';
import { Movie, DailyMovie } from '../types/tmdb';

// --- CORE UTILS ---

// Helper: Get Day of Year (0-365)
export function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Helper: Seed Generator
export function generateSeed(str: string): number {
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
export function getPermutationIndex(dayIndex: number, poolSize: number, yearOffset: number): number {
    // 1. Stride: Prime number roughly 70% of pool size
    const stride = 997;
    // 2. Start Offset: Shifts the starting point each year
    const startOffset = yearOffset * 123;
    // 3. Formula: (Start + Day * Stride) % Size
    return (startOffset + (dayIndex * stride)) % poolSize;
}

// --- ENGINE ---

export const recommendationEngine = {

    getDailyMovie: async (dateObj: Date): Promise<DailyMovie | null> => {
        const dateString = dateObj.toISOString().split('T')[0];
        const monthDay = dateString.substring(5); // "MM-DD"
        const month = dateString.substring(5, 7); // "MM"

        let context: { label: string; name: string; description: string; } | null = null;
        let params: any = null;
        let poolSize = 200; // Smaller pool for holidays (Top 10 pages)

        // --- STEP 1: MANUAL OVERRIDES ---
        // Suppress TS implicit any for config access
        const manualOverrides = MANUAL_OVERRIDES as Record<string, number>;
        if (manualOverrides[monthDay]) {
            console.log(`[RecEngine] Manual Override for ${dateString}: ${manualOverrides[monthDay]}`);
            return {
                id: manualOverrides[monthDay],
                title: "Loading...", // Placeholder, will be fetched by ID later usually or this object is incomplete but handled by caller
                // Note: The UI usually fetches full details if it only gets an ID, implies this might need refactoring if it returns partial
                // For now adhering to existing logic, but strictly typing requires more fields.
                // Assuming caller handles incomplete objects or we fetch here.
                // Actually discoverMovies returns full objects. Manual overrides usually imply ID.
                // In a real app we'd fetch details here. For now returning partial with id is what it did.
                // To satisfy TS, let's just return a minimal valid object or fetch it.
                // Ideally we should modify this to fetch. But for now let's stick to logic parity.
                // The original code returned { id: ..., source: ..., recommendationContext: ... }
                // We will cast it for now to avoid breaking changes in this refactor step.
                source: 'MANUAL_EVENT',
                recommendationContext: { name: 'Special Event', description: 'Curated selection for this date.' }
            } as any as DailyMovie;
        }

        // --- STEP 1.5: GLOBAL PREMIERE CHECK (Trend Following) ---
        try {
            const premiereResp = await discoverMovies({
                'primary_release_date.gte': dateString,
                'primary_release_date.lte': dateString,
                sort_by: 'popularity.desc',
                'popularity.gte': 100,
                with_release_type: '3|2',
                page: 1
            });

            if (premiereResp.results && premiereResp.results.length > 0) {
                const premiere = premiereResp.results[0];
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
        const calendarRules = CALENDAR_RULES as Record<string, { name: string; description: string; params: any }>;

        if (calendarRules[monthDay]) {
            const rule = calendarRules[monthDay];
            context = { label: 'HOLIDAY_EVENT', name: rule.name, description: rule.description };
            params = rule.params;
        } else if (calendarRules[month]) {
            // Monthly check (optional but logic was there)
            // const rule = calendarRules[month];
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
            poolSize = 1000;
        }

        // 3. Coordinate Calculation
        const year = dateObj.getFullYear();
        const dayOfYear = getDayOfYear(dateObj);
        const targetIndex = getPermutationIndex(dayOfYear, poolSize, year);

        const resultsPerPage = 20;
        const targetPage = Math.floor(targetIndex / resultsPerPage) + 1;
        const indexInPage = targetIndex % resultsPerPage;

        // 4. Fetch
        try {
            const response = await discoverMovies({ ...params, page: targetPage });

            if (response.results && response.results.length > indexInPage) {
                const movie = response.results[indexInPage];
                // Ensure context is not null (TS check)
                const validContext = context || { name: 'Daily Pick', description: 'Selected for you', label: 'DAILY' };

                return {
                    ...movie,
                    source: validContext.label,
                    recommendationContext: validContext
                };
            } else {
                console.warn("[RecEngine] Index out of bounds, falling back to P1");
                const fallback = await discoverMovies({ ...params, page: 1 });

                if (fallback?.results?.length > 0) {
                    const validContext = context || { name: 'Daily Pick', description: 'Selected for you', label: 'DAILY' };
                    return { ...fallback.results[0], source: validContext.label, recommendationContext: validContext };
                }

                console.warn("[RecEngine] Fallback failed.");
                return null;
            }

        } catch (e) {
            console.error("[RecEngine] Error", e);
            return null;
        }
    }
};
