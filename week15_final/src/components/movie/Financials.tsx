import React from 'react';
import { BarChart, Bar, Tooltip, Cell, Legend } from 'recharts';
import { DollarSign } from 'lucide-react';
import { Movie } from '../../types/tmdb';

interface FinancialsProps {
    movie: Movie;
}

const Financials: React.FC<FinancialsProps> = ({ movie }) => {
    const budget = movie.budget || 0;
    const revenue = movie.revenue || 0;

    // Use ResizeObserver to drive chart size manually, bypassing ResponsiveContainer's initial -1 state warning.
    const containerRef = React.useRef<HTMLDivElement>(null);
    // Default to mobile size (96px) or desktop (192px) based on initial window check to minimize layout shift
    const getInitialSize = () => (typeof window !== 'undefined' && window.innerWidth >= 768 ? 192 : 96);
    const [chartSize, setChartSize] = React.useState({ width: getInitialSize(), height: getInitialSize() });

    // Track mobile state for bar size
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : true);

    React.useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setChartSize({ width, height });
                    setIsMobile(window.innerWidth < 768);
                }
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const financialData = [
        { name: 'Budget', value: budget, color: '#333333' },
        { name: 'Revenue', value: revenue, color: '#ffffff' },
    ];

    const formatCurrency = (value: number) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="px-10 py-6 md:p-12 border-r border-white/10 flex flex-col h-full">
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-6 font-mono flex items-center gap-2">
                <DollarSign className="hidden md:block h-4 w-4" /> // FINANCIAL_METRICS
            </h3>

            {/* Mobile: Row Layout (Chart Left, Data Right) */}
            <div className="flex flex-row gap-4 md:gap-8 flex-1 items-center md:items-stretch">
                {/* Chart (Fixed small width on mobile) */}
                <div
                    ref={containerRef}
                    className="w-24 h-24 md:w-48 md:h-48 border border-white/10 bg-white/5 p-1 md:p-2 shrink-0 relative"
                >
                    <BarChart width={chartSize.width} height={chartSize.height} data={financialData}>
                        <Tooltip
                            cursor={{ fill: '#ffffff10' }}
                            contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff30', fontFamily: 'Inter', fontSize: '10px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => formatCurrency(value)}
                        />
                        <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={isMobile ? 10 : 20} isAnimationActive={false}>
                            {financialData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                            ))}
                        </Bar>
                    </BarChart>
                </div>

                {/* Data Points (Right) */}
                <div className="flex flex-col justify-between py-1 text-right flex-1 min-w-0">
                    {/* Top: Popularity & Vote */}
                    <div className="space-y-1 md:space-y-2 w-full mb-auto">
                        <div className="flex justify-between md:justify-end items-center md:items-baseline gap-2">
                            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider">POPULARITY</span>
                            <span className="text-[10px] md:text-xs font-mono font-bold">{movie.popularity?.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between md:justify-end items-center md:items-baseline gap-2">
                            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider">VOTE_COUNT</span>
                            <span className="text-[10px] md:text-xs font-mono font-bold">{movie.vote_count}</span>
                        </div>
                    </div>

                    {/* Bottom: Budget, Revenue, ROI */}
                    <div className="space-y-1 md:space-y-2 w-full mt-2">
                        <div className="flex justify-between md:justify-end items-center md:items-baseline gap-2 border-b border-white/10 pb-0.5">
                            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider">BUDGET</span>
                            <span className="text-[10px] md:text-xs font-mono font-bold truncate">{formatCurrency(movie.budget)}</span>
                        </div>
                        <div className="flex justify-between md:justify-end items-center md:items-baseline gap-2 border-b border-white/10 pb-0.5">
                            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider">REVENUE</span>
                            <span className="text-[10px] md:text-xs font-mono font-bold truncate">{formatCurrency(movie.revenue)}</span>
                        </div>
                        <div className="flex justify-between md:justify-end items-center md:items-baseline gap-2 border-b border-white/10 pb-0.5">
                            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider">ROI</span>
                            <span className="text-[10px] md:text-xs font-mono font-bold text-emerald-500">
                                {movie.budget > 0 ? ((movie.revenue - movie.budget) / movie.budget * 100).toFixed(1) + '%' : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Financials;
