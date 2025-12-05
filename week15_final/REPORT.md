# DAILY MOVIE v1.0 - Project Report

## 1. Project Abstract
DAILY MOVIE is a curated cinema discovery platform designed to counteract the "choice paralysis" often found in modern streaming services. Instead of overwhelming users with infinite scrolling, the application focuses on a single, algorithmically selected "Movie of the Day," presented with an industrial, data-rich aesthetic. The project leverages the TMDb API to provide comprehensive data analysis, including financial metrics, production history, and cast filmographies, all wrapped in a high-performance, responsive Single Page Application (SPA).

## 2. Design Philosophy
The user interface departs from the standard "Netflix-style" card grids, adopting a "Utilitarian/Industrial" design language. Key design pillars include:

*   **Information Density:** Data is presented with the precision of a technical dashboard. Financials, production codes, and specifications are front-and-center.
*   **Bionic Reading:** To enhance readability of long-form text (synopses, reviews), a custom Bionic Text component highlights the initial letters of words, guiding the eye and increasing reading speed.
*   **Mobile-First Responsiveness:** The complex grid layouts of the desktop view gracefully collapse into streamlined, touch-friendly interfaces on mobile devices without sacrificing data depth.
*   **Visual Continuity:** A consistent "glassmorphism" and monochromatic palette (with strategic accent colors) unifies the experience, using Framer Motion for seamless page transitions.

## 3. Technical Architecture

### Core Stack
The application is built on a modern React ecosystem, prioritizing performance and developer experience:
*   **Framework:** React 19 (Latest) for robust component architecture.
*   **Build Tool:** Vite for lightning-fast HMR and optimized production builds.
*   **Styling:** Tailwind CSS v4 for utility-first, maintainable styling.
*   **Routing:** React Router DOM v7 for client-side routing with deep linking support.
*   **Animation:** Framer Motion for layout animations and page transitions.
*   **Icons:** Lucide React for consistent, lightweight vector iconography.

### State Management & Caching
To ensure a snappy user experience while respecting API rate limits:
*   **Session Storage Caching:** API responses (movie details, category lists) are cached in `sessionStorage`. This minimizes network requests on navigation back/forth.
*   **URL-Driven State:** Search parameters (page number, sort order, genre filters) are synchronized with the URL. This ensures that the "Back" button works as expected and users can share deep links to specific views.

### Performance Optimization
*   **Image Optimization:** A custom `ImageWithFallback` component handles image loading states, errors, and provides a consistent "DAILY MOVIE" branded fallback for missing assets.
*   **Code Splitting:** Route-based code splitting ensures users only download the JavaScript needed for the current page.
*   **Memoization:** Expensive calculations (such as the 90-day calendar generation) are memoized using `useMemo` to prevent unnecessary re-renders.

## 4. Key Features Implementation

### The "Daily" Engine
The core feature is the deterministic selection of a daily movie. The `recommendationEngine` service uses the current date to seed a selection algorithm, ensuring every user sees the same "Movie of the Day" without requiring a backend database. It handles "Special Events" (manual overrides for holidays) and "Zeitgeist" picks (trending movies).

### Deep Data Analysis
Beyond basic metadata, the application visualizes complex relationships:
*   **Financials:** Recharts is used to render bar charts comparing Budget vs. Revenue.
*   **Filmography & Archives:** The Person and Company detail pages feature sortable and searchable data tables, allowing users to explore an actor's career or a studio's output by popularity, rating, or release date.

### Navigation & Scroll Restoration
A common pain point in SPAs is losing scroll position when navigating. I implemented a custom `useScrollRestoration` hook that:
1.  Saves the scroll position of the current page to `sessionStorage` before unmounting.
2.  Restores the position when the user returns to that specific history entry.
3.  For new content (like clicking a movie card), a `useScrollToTop` hook ensures the user starts at the top of the page.

## 5. Challenges & Solutions

### Challenge: API Rate Limiting & Stability
**Problem:** The TMDb API occasionally times out or returns errors under load.
**Solution:** I implemented an Axios interceptor with retry logic (exponential backoff). If a request fails, the system automatically retries up to 3 times before showing a user-friendly error message ("SYSTEM_FAILURE").

### Challenge: Mobile Layout Adaptation
**Problem:** The "Industrial" layout relies heavily on wide, multi-column grids which break on narrow screens.
**Solution:** I used a "Mobile-First" approach for critical components. For example, the "Full Data Analysis" button was initially stretching too wide on mobile; I adjusted it to `w-auto` to fit the content. The complex "Hero" grid collapses into a vertical stack, and the navigation simplifies to a touch-friendly bottom bar or simplified header.

### Challenge: Image Consistency
**Problem:** Many older or obscure movies/actors lack high-quality images, leading to broken UI elements.
**Solution:** I created a robust `ImageWithFallback` component. Instead of a generic "broken image" icon, it renders a styled "DAILY MOVIE" placeholder that matches the site's aesthetic, maintaining visual immersion even when data is missing.

## 6. Conclusion
DAILY MOVIE v1.0 successfully demonstrates how a data-heavy application can still offer a compelling, cinematic user experience. By combining rigorous engineering practices (caching, error handling, componentization) with a strong design identity, the project stands out as a polished, professional-grade web application.
