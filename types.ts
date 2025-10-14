
export enum City {
    Hyderabad = 'Hyderabad',
    Bangalore = 'Bangalore',
    Chennai = 'Chennai',
    Pune = 'Pune',
}

export interface KeywordData {
    text: string;
    value: number;
}

export interface DailySearchData {
    date: string;
    // FIX: Made 'actual' optional to accommodate forecast-only data points.
    actual?: number;
    forecast?: number;
}

export interface Store {
    id: string;
    brand: string;
    city: City;
    locality: string;
    latitude: number;
    longitude: number;
    topKeywords: KeywordData[];
    averageRating: number;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    searchTrend: DailySearchData[];
    aiSummary?: string;
    totalSearches: number;
}