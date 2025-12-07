// --- CONFIGURATION: WEEKLY SCHEDULE ---
// Each day of the week gets a curated "Vibe" / "Theme".
// This ensures variety and gives a "Reason" for the recommendation.

export const WEEKLY_THEMES = [
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
export const MANUAL_OVERRIDES = {
    // Exact Date Overrides
    '11-26': 1084242, // Zootopia 2 (Premiere)
};

export const CALENDAR_RULES = {
    '01-01': { name: 'New Year', description: 'Fresh starts and new beginnings.', params: { with_keywords: '193630', sort_by: 'popularity.desc' } },
    '02-14': { name: 'Valentine\'s Day', description: 'Love is in the air.', params: { with_genres: '10749', sort_by: 'popularity.desc' } },
    '10-31': { name: 'Halloween', description: 'Spooky selections for the season.', params: { with_genres: '27', with_keywords: '3335', sort_by: 'popularity.desc' } },
    '12-24': { name: 'Christmas Eve', description: 'Festive favorites.', params: { with_keywords: '207317', sort_by: 'popularity.desc' } },
    '12-25': { name: 'Christmas', description: 'Merry Christmas!', params: { with_keywords: '207317', sort_by: 'popularity.desc' } },
    '06': { name: 'Pride Month', description: 'Celebrating LGBTQ+ stories.', params: { with_keywords: '158718', sort_by: 'popularity.desc' } },
};


