
import React from 'react';
import type { Store } from '../types';
import { City } from '../types';
import { StoreView } from './StoreView';
import { TopStoresChart } from './charts';
import { ChartBarIcon, LocationIcon, XCircleIcon } from './icons';

interface DashboardProps {
    stores: Store[];
    selectedStores: Store[];
    onClearSelection: () => void;
}

const WelcomeScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
        <LocationIcon className="w-24 h-24 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-300">Welcome to the Dashboard</h2>
        <p className="max-w-md mt-2">
            Select a store from the sidebar to view its deep-down analysis, or select two stores to compare them side-by-side.
        </p>
    </div>
);

const CityOverview: React.FC<{ stores: Store[] }> = ({ stores }) => {
    const city = stores[0]?.city || 'All';
    return (
        <div className="p-6 bg-slate-800/50 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Top Stores by Search Volume in {city}</h2>
             <TopStoresChart stores={stores} />
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ stores, selectedStores, onClearSelection }) => {

    const renderContent = () => {
        if (selectedStores.length === 0) {
             const cityStores = stores.filter(s => s.city === City.Hyderabad);
             return <CityOverview stores={cityStores} />;
        }
        if (selectedStores.length === 1) {
            return <StoreView store={selectedStores[0]} />;
        }
        if (selectedStores.length === 2) {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <StoreView store={selectedStores[0]} />
                    <StoreView store={selectedStores[1]} />
                </div>
            );
        }
        return <WelcomeScreen />;
    };
    
    const getHeaderText = () => {
        if (selectedStores.length === 0) return 'City Overview: Hyderabad';
        if (selectedStores.length === 1) return `Deep Dive: ${selectedStores[0].locality}`;
        if (selectedStores.length === 2) return `Comparison: ${selectedStores[0].locality} vs. ${selectedStores[1].locality}`;
        return 'Dashboard';
    }


    return (
        <main className="flex-1 p-6 overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <ChartBarIcon className="w-8 h-8 text-sky-400"/>
                    <h1 className="text-3xl font-bold text-white">{getHeaderText()}</h1>
                </div>
                {selectedStores.length > 0 && (
                    <button onClick={onClearSelection} className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30 transition-colors">
                        <XCircleIcon className="w-5 h-5"/>
                        <span>Clear Selection</span>
                    </button>
                )}
            </div>
            {renderContent()}
        </main>
    );
};
