import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ label = "Back" }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Go Back"
        >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
        </button>
    );
};

export default BackButton;
