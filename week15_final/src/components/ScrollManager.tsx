import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollManager: React.FC = () => {
    const location = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // On PUSH (new page) or REPLACE, scroll to top.
        // On POP (back button), do nothing (let browser restore).
        if (navType !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, navType]);

    return null;
};

export default ScrollManager;
