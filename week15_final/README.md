# Daily Film

**DAILY FILM** is a cinematic discovery platform with a rigorous industrial aesthetic. It stands against the "choice paralysis" of modern streaming by offering **one single, curated film per day**.

Built with **React 19**, **Vite**, and **Tailwind CSS**, it features a sophisticated client-side recommendation engine that deterministically selects movies based on date, theme, and premiere schedules—without requiring a backend database.

---

### Engineering Release Log

**v2.0: Visual Overhaul & Performance**
*   **Native Canvas Rendering**: Replaced `html2canvas` with native `CanvasRenderingContext2D` to solve cross-origin tainting and pixel-fuzzy rendering.
*   **Atmosphere Calibration**: Implemented "Let the Light In" strategy (Hero Opacity 60% → 80%, removed `multiply` blends) to solve visual "suffocation".
*   **Industrial UI Language**: Implemented **Glitch Effects** and **Bionic Reading** (highlighting initial letters) to enhance data readability and brand identity.
*   **Dual-Mode Poster Engine**: Engineered a responsive generator outputting 16:9 Cinematic wallpapers (Desktop) and 9:16 Story assets (Mobile).
*   **Alternate Vision Engine**: Algorithmic selection of "B-Side" wallpapers for detail pages. Filters for high-res alternate angles to prevent visual redundancy.
*   **Local Timezone Synchronization**: Switched from strict UTC to Local System Time. Solved the issue where "Tomorrow's Movie" appeared prematurely for users in Western timezones (e.g., EST evenings).
*   **WYSIWYG Synchronization**: Aligned Canvas calculation engine strictly with DOM Tailwind classes (e.g., Padding 48px) for pixel-perfect downloads.

**v1.5: Core Systems & Resiliency**
*   **Dual-Strategy Proxy**: Engineered a hybrid proxy (Serverless for Prod, Middleware for Dev) to secure the TMDB API Key.
*   **Edge Caching Layer**: Integrated Vercel KV (Redis) to cache high-volume API responses, reducing latency from 300ms to <20ms.
*   **Axios Interceptor**: Implemented global request interception with **Exponential Backoff Retry** logic to handle API timeouts gracefully.
*   **Deterministic Algorithm**: Designed a "Seeded Chaos" recommendation engine using the current date (`YYYY-MM-DD`) as a seed for global content synchronization.

**v1.0: Foundation & UX**
*   **PWA Readiness**: Configured `manifest.json` and meta tags for native-like installability on mobile devices (Add to Home Screen).
*   **Smart State Management**: Implemented `useScrollRestoration` hook and `sessionStorage` caching to persist scroll positions and API data across navigation.
*   **Dynamic Open Graph**: Implemented dynamic SEO meta tags (`og:image`) for rich social link previews.
*   **Resilient Fallback System**: Engineered cascading image loaders (`ImageWithFallback`) to prevent broken UI states.
*   **Vite Architecture**: Migrated from Next.js to Vite for optimized static deployment.

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
