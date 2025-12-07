import { useState, useEffect } from 'react';

const STORAGE_KEY = 'daily_film_engagement';

interface EngagementData {
    seen: number[];
    bucket: number[];
}

interface UseEngagementResult {
    isSeen: boolean;
    isInBucket: boolean;
    toggleSeen: () => void;
    toggleBucket: () => void;
}

const useEngagement = (movieId: number): UseEngagementResult => {
    const [isSeen, setIsSeen] = useState(false);
    const [isInBucket, setIsInBucket] = useState(false);

    // Load initial state
    useEffect(() => {
        if (!movieId) return;

        try {
            const data: EngagementData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{ "seen": [], "bucket": [] }');
            setIsSeen(data.seen?.includes(movieId) || false);
            setIsInBucket(data.bucket?.includes(movieId) || false);
        } catch (e) {
            console.error("Engagement storage error", e);
        }
    }, [movieId]);

    const saveToStorage = (type: 'seen' | 'bucket', id: number, add: boolean) => {
        try {
            const data: EngagementData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{ "seen": [], "bucket": [] }');
            // Ensure arrays exist
            if (!data.seen) data.seen = [];
            if (!data.bucket) data.bucket = [];

            const list = data[type];
            if (add) {
                if (!list.includes(id)) list.push(id);
            } else {
                const index = list.indexOf(id);
                if (index > -1) list.splice(index, 1);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

            // Dispatch event for cross-component sync (within same tab)
            window.dispatchEvent(new Event('engagement-update'));
        } catch (e) {
            console.error("Failed to save engagement", e);
        }
    };

    const toggleSeen = () => {
        const newState = !isSeen;
        setIsSeen(newState);
        saveToStorage('seen', movieId, newState);
    };

    const toggleBucket = () => {
        const newState = !isInBucket;
        setIsInBucket(newState);
        saveToStorage('bucket', movieId, newState);
    };

    // Listen for updates from other components
    useEffect(() => {
        const handleUpdate = () => {
            try {
                const data: EngagementData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{ "seen": [], "bucket": [] }');
                setIsSeen(data.seen?.includes(movieId) || false);
                setIsInBucket(data.bucket?.includes(movieId) || false);
            } catch (e) { }
        };

        window.addEventListener('engagement-update', handleUpdate);
        return () => window.removeEventListener('engagement-update', handleUpdate);
    }, [movieId]);

    return {
        isSeen,
        isInBucket,
        toggleSeen,
        toggleBucket
    };
};

export default useEngagement;
