import React from 'react';
import BackButton from './BackButton';

const InlineBackRow = () => {
    return (
        <div className="flex justify-center items-center mb-2 md:mb-4 relative z-10">
            <BackButton />
        </div>
    );
};

export default InlineBackRow;
