import React from 'react';

const AnalysisGrid = ({ children, title, icon: Icon, className = "" }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-2 text-white/50 uppercase tracking-wider text-[10px] font-bold font-mono">
                {Icon && <Icon className="h-4 w-4" />}
                {title}
            </div>
            <div className="text-white/60 text-sm font-mono">
                {children}
            </div>
        </div>
    );
};

export default AnalysisGrid;
