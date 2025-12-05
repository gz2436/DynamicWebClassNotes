import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Production-grade Scroll Restoration Hook for LIST PAGES.
 * 
 * Usage:
 * - Use this ONLY on pages where you want to save/restore scroll position (e.g. CategoryPage).
 * - Do NOT use on Detail pages where you always want to start at the top.
 * 
 * Features:
 * 1. Uses location.key to bind scroll position to specific history entries.
 * 2. Smart Restoration: Polls scrollHeight via rAF.
 * 3. Efficient Saving: Uses rAF to throttle sessionStorage writes.
 */
const useScrollRestoration = (storageKeyPrefix = 'scroll') => {
    const location = useLocation();
    const navType = useNavigationType();
    const restoredRef = useRef(false);

    // Unique key for this specific history entry
    const key = `${storageKeyPrefix}:${location.key}`;

    // Smart Restoration Logic
    const restoreScroll = (targetPos) => {
        let attempts = 0;
        const maxAttempts = 20; // Try for ~300-400ms (assuming 60fps)

        const step = () => {
            attempts += 1;
            const doc = document.documentElement;
            // Calculate maximum possible scroll position
            const maxScrollable = doc.scrollHeight - window.innerHeight;

            // If we can scroll to the target, or if we've tried enough times (fallback)
            if (maxScrollable >= targetPos || attempts >= maxAttempts) {
                window.scrollTo(0, Math.min(targetPos, maxScrollable));
                return;
            }

            // Continue polling if content hasn't loaded enough height yet
            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    // Handle Navigation (Restore vs Top)
    useLayoutEffect(() => {
        // Reset restoration flag on navigation
        restoredRef.current = false;

        if (navType === 'POP') {
            const saved = sessionStorage.getItem(key);
            if (saved) {
                const target = parseInt(saved, 10) || 0;
                restoreScroll(target);
                restoredRef.current = true;
            }
        } else {
            // PUSH or REPLACE -> Always start at top
            window.scrollTo(0, 0);
        }
    }, [navType, key]); // Re-run only when history entry changes

    // Efficient Scroll Saving (Throttled)
    useEffect(() => {
        let timeoutId = null;
        let lastY = window.scrollY;

        const save = () => {
            try {
                sessionStorage.setItem(key, String(lastY));
            } catch (e) {
                // Ignore quota errors
            }
            timeoutId = null;
        };

        const onScroll = () => {
            lastY = window.scrollY;
            if (!timeoutId) {
                timeoutId = setTimeout(save, 200);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // Also save on visibility change (mobile tab switching)
        const onVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                save();
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            if (timeoutId) clearTimeout(timeoutId);
            save(); // Ensure final position is saved
        };
    }, [key]);
};

export default useScrollRestoration;
