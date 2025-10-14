
import React from 'react';
import type { DailySearchData, Store } from '../types';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar } from 'recharts';

interface SearchTrendChartProps {
    data: DailySearchData[];
}

export const SearchTrendChart: React.FC<SearchTrendChartProps> = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-700 p-2 border border-slate-600 rounded">
                    <p className="label">{`${label}`}</p>
                    {payload[0].payload.actual && <p className="text-sky-400">{`Actual: ${payload[0].payload.actual}`}</p>}
                    {payload[0].payload.forecast && <p className="text-amber-400">{`Forecast: ${payload[0].payload.forecast}`}</p>}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} fontSize={12} />
                <YAxis tick={{ fill: '#94a3b8' }} fontSize={12}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={2} dot={false} name="Actual Searches" />
                <Line type="monotone" dataKey="forecast" stroke="#facc15" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
            </LineChart>
        </ResponsiveContainer>
    );
};


interface TopStoresChartProps {
    stores: Store[];
}

export const TopStoresChart: React.FC<TopStoresChartProps> = ({ stores }) => {
    const sortedStores = [...stores].sort((a, b) => b.totalSearches - a.totalSearches).slice(0, 5);

    return (
         <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="vertical" data={sortedStores} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis type="number" tick={{ fill: '#94a3b8' }} fontSize={12} />
                <YAxis type="category" dataKey="locality" tick={{ fill: '#94a3b8' }} fontSize={12} width={80} />
                <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{backgroundColor: '#334155', border: 'none'}}/>
                <Legend />
                <Bar dataKey="totalSearches" name="Avg Daily Searches" fill="#38bdf8" />
            </BarChart>
        </ResponsiveContainer>
    );
}
