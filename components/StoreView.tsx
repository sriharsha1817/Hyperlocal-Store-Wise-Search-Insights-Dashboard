
import React, { useState, useEffect } from 'react';
import type { Store } from '../types';
import { SearchTrendChart } from './charts';
import { generateStoreSummary } from '../services/data';

const KeywordCloud: React.FC<{ keywords: Store['topKeywords'] }> = ({ keywords }) => {
    const sortedKeywords = [...keywords].sort((a, b) => b.value - a.value);
    const maxVal = sortedKeywords[0]?.value || 100;

    const getSizeClass = (value: number) => {
        const percentage = (value / maxVal) * 100;
        if (percentage > 90) return 'text-2xl text-sky-300';
        if (percentage > 75) return 'text-xl text-sky-400';
        if (percentage > 60) return 'text-lg text-slate-300';
        return 'text-base text-slate-400';
    };

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {sortedKeywords.map(kw => (
                <span key={kw.text} className={`${getSizeClass(kw.value)} font-semibold`}>
                    {kw.text}
                </span>
            ))}
        </div>
    );
};

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse [animation-delay:0.4s]"></div>
        <span className="text-sm text-slate-400">Generating AI Insights...</span>
    </div>
);


export const StoreView: React.FC<{ store: Store }> = ({ store }) => {
    const [aiSummary, setAiSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            const summary = await generateStoreSummary(store);
            setAiSummary(summary);
            setIsLoading(false);
        };

        fetchSummary();
    }, [store]);

    const sentimentColor = store.sentiment === 'Positive' ? 'text-green-400' : store.sentiment === 'Neutral' ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-slate-700 pb-4">
                <h2 className="text-2xl font-bold text-white">{store.brand} - {store.locality}</h2>
                <p className="text-sky-400">{store.city}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-700/50 p-4 rounded-md">
                    <p className="text-sm text-slate-400">Average Rating</p>
                    <p className="text-2xl font-semibold text-white">{store.averageRating.toFixed(1)} <span className="text-lg">/ 5</span></p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-md">
                    <p className="text-sm text-slate-400">Sentiment</p>
                    <p className={`text-2xl font-semibold ${sentimentColor}`}>{store.sentiment}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-md">
                    <p className="text-sm text-slate-400">Avg. Daily Searches</p>
                    <p className="text-2xl font-semibold text-white">{store.totalSearches}</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Summary</h3>
                <div className="bg-slate-900/70 p-4 rounded-md min-h-[100px] flex items-center justify-center">
                    {isLoading ? <LoadingSpinner /> : <p className="text-slate-300 text-sm leading-relaxed">{aiSummary}</p>}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Search Volume Trend & Forecast</h3>
                <SearchTrendChart data={store.searchTrend} />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Top Searched Keywords</h3>
                <div className="bg-slate-700/50 p-4 rounded-md">
                    <KeywordCloud keywords={store.topKeywords} />
                </div>
            </div>
        </div>
    );
};
