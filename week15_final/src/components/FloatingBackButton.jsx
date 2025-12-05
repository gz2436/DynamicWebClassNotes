import React from 'react';
import BackButton from './BackButton';

const FloatingBackButton = () => {
    return (
        <div className="fixed top-0 left-0 z-50 pointer-events-none w-full px-6 md:px-12 pt-[calc(1.5rem+env(safe-area-inset-top))]">
            <div className="pointer-events-auto mt-1 md:mt-4 inline-block">
                <BackButton />
            </div>
        </div>
    );
};

export default FloatingBackButton;
