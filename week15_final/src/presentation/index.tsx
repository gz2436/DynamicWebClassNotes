import React from 'react';
import { CinematicLayout } from './CinematicLayout';
import { CoverSlide } from './slides/Slide1_Cover';
import { VideoSlide } from './slides/Slide2_Video';
import { PhilosophySlide } from './slides/Slide3_Philosophy';
import { ArchitectureSlide } from './slides/Slide4_Architecture';
import { GlitchSlide } from './slides/Slide5_Glitch';
import { LogicSlide } from './slides/Slide6_Logic';
import { VisualsSlide } from './slides/Slide7_Visuals';
import { CinemaSlide } from './slides/Slide8_Cinema';
import { FinalSlide } from './slides/Slide9_Finale';
import './presentation.css';

const slides = [
    CoverSlide,
    VideoSlide,
    PhilosophySlide,
    ArchitectureSlide,
    GlitchSlide,
    LogicSlide,
    VisualsSlide,
    CinemaSlide,
    FinalSlide,
];

export const Presentation: React.FC = () => {
    return <CinematicLayout slides={slides} />;
};
