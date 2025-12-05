# DAILY MOVIE - Week 15 Final Project

**DAILY MOVIE** is a cinematic discovery platform built with React 19. It features a curated "Movie of the Day," comprehensive data visualization for film enthusiasts, and a distinct industrial/brutalist aesthetic.

## Quick Start

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

3.  **Open the application:**
    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Tech Stack

*   **Core:** React 19, Vite
*   **Styling:** Tailwind CSS v4
*   **Routing:** React Router DOM v7
*   **Animation:** Framer Motion
*   **Data Visualization:** Recharts
*   **Icons:** Lucide React
*   **Data Source:** TMDb API

## Key Features

*   **Daily Curation:** A new, algorithmically selected movie every day.
*   **Deep Data:** Detailed breakdown of Budget vs. Revenue, Cast & Crew, and Production Companies.
*   **Smart Discovery:** Browse movies by Popularity, Now Playing, Upcoming, and Top Rated.
*   **Archives:** Explore Filmographies (Actors) and Production Archives (Studios) with Sort & Search capabilities.
*   **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.
*   **Bionic Reading:** Enhanced text readability for synopses and reviews.
*   **Robust Caching:** Session-based caching for fast navigation and reduced API usage.

## Project Structure

*   `src/pages`: Main route components (Home, MovieDetail, PersonDetail, etc.)
*   `src/components`: Reusable UI components (MovieCard, ImageWithFallback, etc.)
*   `src/services`: API integration (TMDb) and Recommendation Engine.
*   `src/hooks`: Custom hooks for scroll restoration and logic.

## Student Note
This project represents the culmination of the semester's work, integrating advanced React patterns, custom hooks, and responsive design principles into a cohesive "v1.0" product.

---
*Data provided by The Movie Database (TMDb).*
