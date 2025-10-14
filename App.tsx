
import React, { useState, useEffect, useCallback } from 'react';
import type { Store } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { generateMockData } from './services/data';

const App: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStores, setSelectedStores] = useState<Store[]>([]);

    useEffect(() => {
        setStores(generateMockData());
    }, []);

    const handleStoreSelect = useCallback((store: Store) => {
        setSelectedStores(prevSelected => {
            const isAlreadySelected = prevSelected.some(s => s.id === store.id);
            if (isAlreadySelected) {
                return prevSelected.filter(s => s.id !== store.id);
            }
            if (prevSelected.length < 2) {
                return [...prevSelected, store];
            }
            // If 2 are already selected, replace the last one
            return [prevSelected[1], store];
        });
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedStores([]);
    }, []);


    if (stores.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div className="flex h-screen font-sans">
            <Sidebar 
                stores={stores} 
                selectedStores={selectedStores}
                onStoreSelect={handleStoreSelect}
            />
            <Dashboard 
                stores={stores} 
                selectedStores={selectedStores}
                onClearSelection={handleClearSelection}
            />
        </div>
    );
};

export default App;
