
import React, { useState } from 'react';
import type { Store } from '../types';
import { City } from '../types';
import { ChevronDownIcon, LocationIcon, CheckCircleIcon } from './icons';

interface SidebarProps {
    stores: Store[];
    selectedStores: Store[];
    onStoreSelect: (store: Store) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ stores, selectedStores, onStoreSelect }) => {
    const [expandedCity, setExpandedCity] = useState<City | null>(City.Hyderabad);

    const toggleCity = (city: City) => {
        setExpandedCity(expandedCity === city ? null : city);
    };

    const cities = Object.values(City);

    return (
        <aside className="w-80 bg-slate-800/50 p-4 flex flex-col space-y-4 border-r border-slate-700/50 overflow-y-auto">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-700">
                <LocationIcon className="w-8 h-8 text-sky-400" />
                <h1 className="text-xl font-bold text-white">Hyperlocal Insights</h1>
            </div>
             <p className="text-xs text-slate-400">Select up to two stores to compare.</p>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {cities.map(city => {
                        const storesInCity = stores.filter(s => s.city === city);
                        const isExpanded = expandedCity === city;
                        return (
                            <li key={city}>
                                <button
                                    onClick={() => toggleCity(city)}
                                    className="w-full flex justify-between items-center p-2 rounded-md hover:bg-slate-700 text-left"
                                >
                                    <span className="font-semibold text-white">{city}</span>
                                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                                {isExpanded && (
                                    <ul className="pl-4 mt-2 space-y-1">
                                        {storesInCity.map(store => {
                                            const isSelected = selectedStores.some(s => s.id === store.id);
                                            return (
                                                <li key={store.id}>
                                                    <button
                                                        onClick={() => onStoreSelect(store)}
                                                        className={`w-full text-left p-2 rounded-md flex items-center justify-between text-sm ${
                                                            isSelected ? 'bg-sky-500/20 text-sky-300' : 'hover:bg-slate-700/50'
                                                        }`}
                                                    >
                                                        {store.locality}
                                                        {isSelected && <CheckCircleIcon className="w-5 h-5 text-sky-400" />}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-700">
                Dashboard v1.0.0
            </div>
        </aside>
    );
};
