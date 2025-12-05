import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Hook for Detail Pages (e.g. MovieDetail).
 * Enforces that the page ALWAYS starts at the top.
 * Does NOT save or restore scroll position.
 */
const useScrollToTop = () => {
    const location = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // Only scroll to top on PUSH or REPLACE, not on POP (back/forward)
        if (navType !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, navType]);
};

export default useScrollToTop;
