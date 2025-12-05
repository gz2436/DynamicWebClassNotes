# DAILY FILM

**DAILY FILM** is a cinematic discovery platform with a rigorous industrial aesthetic. It stands against the "choice paralysis" of modern streaming by offering **one single, curated film per day**.

Built with **React 19**, **Vite**, and **Tailwind CSS**, it features a sophisticated client-side recommendation engine that deterministically selects movies based on date, theme, and premiere schedules—without requiring a backend database.

---

## Quick Start

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
3.  **Open the application:**
    `http://localhost:5173`

---

## Technical Architecture

*   **Core**: React 19, Vite
*   **Styling**: Tailwind CSS (Utility-first, Custom "Industrial" Config)
*   **Animation**: Framer Motion (Page transitions, Micro-interactions)
*   **Data**: TMDB API (The Movie Database)
*   **Routing**: React Router DOM v7
*   **Proxy**: Vercel Serverless Function + Vite Plugin Middleware

### Key Engineering Features
*   **Zero-DB Recommendation Engine**: A custom deterministic algorithm (`src/services/recommendationEngine.js`) uses the current date as a seed to generate unique daily picks.
*   **Secure API Proxy**: A dual-strategy proxy architecture ensures the TMDB API Key is never exposed to the client. Requests are routed through a Node.js Serverless function (Production) or a robust Vite middleware (Development/Preview).
*   **Config-Driven Curation**: All curation logic (Weekly Themes, Holiday Rules, Manual Overrides) is decoupled in `src/config/curation.js`.
*   **Component Architecture**: Complex views like `Home.jsx` are decomposed into atomic sub-components (`HomeHero`, `DailyContextSidebar`, `AnalysisGrid`) for maintainability.

---

## Technical Challenges & Solutions

### 1. Global Timezone Synchronization
**Problem**: A user in Tokyo and a user in New York might see different "Daily Films" if the app relied on local client time.
**Solution**: We implemented strict **UTC-based Date Normalization**.
```javascript
// From src/utils/dateUtils.js
const today = new Date();
today.setUTCHours(0, 0, 0, 0); // Force midnight UTC
```
This ensures that "Today's Film" refreshes simultaneously worldwide, creating a shared global moment.

### 2. Database-Free "Non-Repetition"
**Problem**: How to ensure we don't recommend the same movie twice in a short period without a database to store history?
**Solution**: **Seeded Permutation Slicing**.
We pre-fetch a large pool of candidates (e.g., 20 top-rated Sci-Fi movies). Instead of picking random indices, we use a **Linear Congruential Generator (LCG)** seeded by the *year* to shuffle the list deterministically. We then map the *day of the year* to an index in this shuffled list.
Result: A guaranteed unique sequence for the entire year, purely client-side.

### 3. Handling "Global Premieres" vs. "Evergreen"
**Problem**: We wanted the app to automatically feature major blockbusters (like *Zootopia 2*) on their release day, but revert to "Classic Gems" on normal days.
**Solution**: **3-Tier Priority System**.
1.  **Manual Override**: Checks `src/config/curation.js` for hardcoded dates (e.g., Holidays, Premieres).
2.  **Global Premiere**: Queries TMDB for major releases with high outgoing buzz (`popularity > 1500`) dropping *today*.
3.  **Weekly Theme**: Falls back to the recurring schedule (e.g., "Sci-Fi Tuesday", "Hidden Gem Sunday").

### 4. Taming the Monolith
**Problem**: The `Home.jsx` component grew to >700 lines, mixing data fetching, complex grid layouts, and state management.
**Solution**: **Refactoring & Decomposition**.
We extracted logical clusters into dedicated components:
*   `HomeHero.jsx`: Encapsulates the immersive cover, glitch logo, and date navigation.
*   `AnalysisGrid.jsx`: Reusable UI for the data-heavy analysis sections.
*   `DailyContextSidebar.jsx`: Isolates the dynamic "Why This Film Today" logic.
This reduced `Home.jsx` to a clean coordinator view (~250 lines).

### 5. API Security & Rate Limiting
**Problem**: Client-side API calls exposed the TMDB Key and risked hitting rate limits (429 Too Many Requests) under load.
**Solution**: **Serverless Proxy + Caching**.
We deployed a Vercel Serverless Function (`api/tmdb.js`) to act as a secure gateway. This hides the key from the browser. Furthermore, we integrated **Redis (@vercel/kv)** at the edge to cache popular requests (like the "Daily Movie" payload) for 1 hour. This reduced API calls by >90% and improved response time from 300ms to <20ms for cached hits.

---

## Project Structure

```
src/
├── components/         # Reusable UI atoms
│   ├── home/           # Home-specific ecosystem (Hero, Sidebar, Grid)
│   └── ...
├── config/             # Strategic configuration (Curation Rules)
├── hooks/              # Custom logic (ScrollRestoration)
├── pages/              # Route views
└── services/           # Business logic (TMDB API, Recommendation Engine)
```

---

*Data provided by The Movie Database (TMDb).*
