import React from 'react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { DollarSign } from 'lucide-react';

const Financials = ({ movie }) => {
    const budget = movie.budget || 0;
    const revenue = movie.revenue || 0;

    const financialData = [
        { name: 'Budget', value: budget, color: '#333333' },
        { name: 'Revenue', value: revenue, color: '#ffffff' },
    ];

    const formatCurrency = (value) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="px-10 py-6 md:p-12 border-r border-white/10 flex flex-col h-full">
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-6 font-mono flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> // FINANCIAL_METRICS
            </h3>

            <div className="flex flex-col md:flex-row gap-8 flex-1">
                {/* Chart (Responsive) */}
                <div className="w-full md:w-48 h-48 border border-white/10 bg-white/5 p-2 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financialData}>
                            <Tooltip
                                cursor={{ fill: '#ffffff10' }}
                                contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff30', fontFamily: 'Inter', fontSize: '10px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.5 }} />
                            <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={20}>
                                {financialData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Data Points (Right, Distributed Top/Bottom) */}
                <div className="flex flex-col justify-between py-1 text-right flex-1 items-end">
                    {/* Top: Popularity & Vote */}
                    <div className="space-y-2 w-full">
                        <div className="flex justify-end items-baseline gap-3">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">POPULARITY</span>
                            <span className="text-xs font-mono font-bold">{movie.popularity?.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-end items-baseline gap-3">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">VOTE_COUNT</span>
                            <span className="text-xs font-mono font-bold">{movie.vote_count}</span>
                        </div>
                    </div>

                    {/* Bottom: Budget, Revenue, ROI */}
                    <div className="space-y-2 w-full">
                        <div className="flex justify-end items-baseline gap-3 border-b border-white/10 pb-1">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">BUDGET</span>
                            <span className="text-xs font-mono font-bold">{formatCurrency(movie.budget)}</span>
                        </div>
                        <div className="flex justify-end items-baseline gap-3 border-b border-white/10 pb-1">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">REVENUE</span>
                            <span className="text-xs font-mono font-bold">{formatCurrency(movie.revenue)}</span>
                        </div>
                        <div className="flex justify-end items-baseline gap-3 border-b border-white/10 pb-1">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">ROI</span>
                            <span className="text-xs font-mono font-bold text-emerald-500">
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
