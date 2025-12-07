import React, { useState, MouseEvent, KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onDateSelect: (index: number) => void;
    availableDates: Date[];
    currentDate: Date | null;
}

const CalendarDropdown = ({
    isOpen,
    onClose,
    onDateSelect,
    availableDates,
    currentDate
}: CalendarDropdownProps) => {
    if (!isOpen) return null;

    const [viewDate, setViewDate] = useState<Date>(currentDate || new Date());
    const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

    // Sync viewDate with currentDate when calendar opens
    React.useEffect(() => {
        if (isOpen && currentDate) {
            setViewDate(currentDate);
            setViewMode('days'); // Reset to days view on open
        }
    }, [isOpen, currentDate]);

    const daysInMonth = new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth() + 1, 0)).getUTCDate();
    const firstDayOfMonth = new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth(), 1)).getUTCDay();

    const handlePrev = (e: MouseEvent) => {
        e.stopPropagation();
        if (viewMode === 'days') {
            setViewDate(new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth() - 1, 1)));
        } else if (viewMode === 'months') {
            setViewDate(new Date(Date.UTC(viewDate.getUTCFullYear() - 1, viewDate.getUTCMonth(), 1)));
        } else if (viewMode === 'years') {
            setViewDate(new Date(Date.UTC(viewDate.getUTCFullYear() - 10, viewDate.getUTCMonth(), 1)));
        }
    };

    const handleNext = (e: MouseEvent) => {
        e.stopPropagation();
        if (viewMode === 'days') {
            setViewDate(new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth() + 1, 1)));
        } else if (viewMode === 'months') {
            setViewDate(new Date(Date.UTC(viewDate.getUTCFullYear() + 1, viewDate.getUTCMonth(), 1)));
        } else if (viewMode === 'years') {
            setViewDate(new Date(Date.UTC(viewDate.getUTCFullYear() + 10, viewDate.getUTCMonth(), 1)));
        }
    };

    const handleHeaderClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (viewMode === 'days') setViewMode('months');
        else if (viewMode === 'months') setViewMode('years');
    };

    const handleMonthSelect = (monthIndex: number) => {
        setViewDate(new Date(Date.UTC(viewDate.getUTCFullYear(), monthIndex, 1)));
        setViewMode('days');
    };

    const handleYearSelect = (year: number) => {
        setViewDate(new Date(Date.UTC(year, viewDate.getUTCMonth(), 1)));
        setViewMode('months');
    };

    // Render Days View
    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="w-6 h-6" />);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth(), i));
            const dateString = date.toISOString().split('T')[0];
            const availableIndex = availableDates.findIndex(d => d.toISOString().split('T')[0] === dateString);
            const isAvailable = availableIndex !== -1;
            const isSelected = currentDate ? currentDate.toISOString().split('T')[0] === dateString : false;

            days.push(
                <div key={i} className="flex items-center justify-center w-6 h-6">
                    <button
                        disabled={!isAvailable}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isAvailable) onDateSelect(availableIndex);
                        }}
                        className={`w-full h-full flex items-center justify-center text-[10px] font-mono transition-all rounded-full
                            ${isSelected ? 'bg-white text-black font-bold' : ''}
                            ${!isSelected && isAvailable ? 'text-white hover:bg-white/20 cursor-pointer border border-transparent hover:border-white/30' : ''}
                            ${!isSelected && !isAvailable ? 'text-white/10 cursor-default' : ''}
                        `}
                    >
                        {i}
                    </button>
                </div>
            );
        }
        return (
            <>
                <div className="grid grid-cols-7 mb-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-[10px] text-white/40 font-bold font-mono">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center">
                    {days}
                </div>
            </>
        );
    };

    // Render Months View
    const renderMonths = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return (
            <div className="grid grid-cols-3 gap-2">
                {months.map((m, i) => (
                    <button
                        key={m}
                        onClick={(e) => { e.stopPropagation(); handleMonthSelect(i); }}
                        className={`p-2 text-[10px] font-mono uppercase tracking-widest rounded hover:bg-white/20 transition-colors ${viewDate.getUTCMonth() === i ? 'bg-white/10 text-white font-bold' : 'text-white/60'}`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        );
    };

    // Render Years View
    const renderYears = () => {
        const currentYear = viewDate.getUTCFullYear();
        const startYear = currentYear - 5;
        const years = [];
        for (let i = 0; i < 12; i++) {
            years.push(startYear + i);
        }
        return (
            <div className="grid grid-cols-3 gap-2">
                {years.map(y => (
                    <button
                        key={y}
                        onClick={(e) => { e.stopPropagation(); handleYearSelect(y); }}
                        className={`p-2 text-[10px] font-mono uppercase tracking-widest rounded hover:bg-white/20 transition-colors ${currentYear === y ? 'bg-white/10 text-white font-bold' : 'text-white/60'}`}
                    >
                        {y}
                    </button>
                ))}
            </div>
        );
    };

    const getHeaderText = () => {
        if (viewMode === 'days') return viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
        if (viewMode === 'months') return viewDate.getUTCFullYear().toString();
        if (viewMode === 'years') {
            const start = viewDate.getUTCFullYear() - 5;
            return `${start} - ${start + 11}`;
        }
        return '';
    };

    return (
        <div
            className="absolute top-full right-0 mt-4 bg-[#080808]/90 backdrop-blur-md border border-white/10 p-4 z-[100] w-60 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Calendar Date Picker"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrev}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                    aria-label="Previous"
                >
                    <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                    onClick={handleHeaderClick}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono text-white hover:text-white/70 transition-colors"
                    aria-label={`Change view, currently ${viewMode}`}
                >
                    {getHeaderText()}
                </button>
                <button
                    onClick={handleNext}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                    aria-label="Next"
                >
                    <ChevronRight className="h-3 w-3" />
                </button>
            </div>

            {viewMode === 'days' && renderDays()}
            {viewMode === 'months' && renderMonths()}
            {viewMode === 'years' && renderYears()}
        </div>
    );
};

export default CalendarDropdown;
