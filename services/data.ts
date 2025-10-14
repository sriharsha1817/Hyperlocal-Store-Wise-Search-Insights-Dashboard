
import { GoogleGenAI } from "@google/genai";
import { Store, City, DailySearchData, KeywordData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storeTemplates = {
    [City.Hyderabad]: ['Madhapur', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills'],
    [City.Bangalore]: ['Koramangala', 'Indiranagar', 'Whitefield', 'Marathahalli'],
    [City.Chennai]: ['T. Nagar', 'Adyar', 'Velachery', 'Anna Nagar'],
    [City.Pune]: ['Koregaon Park', 'Viman Nagar', 'Hinjewadi', 'Baner'],
};

const keywordPool: KeywordData[] = [
    { text: 'chicken bucket', value: 100 },
    { text: 'zinger burger', value: 90 },
    { text: 'hot wings', value: 85 },
    { text: 'kfc offers', value: 95 },
    { text: 'kfc near me', value: 80 },
    { text: 'popcorn chicken', value: 70 },
    { text: 'family meal', value: 75 },
    { text: 'midnight delivery', value: 60 },
];

const generateRandomTrend = (base: number, days: number): DailySearchData[] => {
    const trend: DailySearchData[] = [];
    let lastValue = base;
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        lastValue += (Math.random() - 0.5) * 20;
        lastValue = Math.max(20, lastValue);
        trend.push({ date: date.toISOString().split('T')[0], actual: Math.round(lastValue) });
    }
    // Add forecast for next 7 days
    for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        lastValue += (Math.random() - 0.45) * 15; // slightly positive drift for forecast
        lastValue = Math.max(20, lastValue);
        trend.push({ date: date.toISOString().split('T')[0], forecast: Math.round(lastValue) });
    }
    return trend;
};

const generateKeywords = (): KeywordData[] => {
    const selectedKeywords = [...keywordPool].sort(() => 0.5 - Math.random()).slice(0, 5);
    return selectedKeywords.map(kw => ({
        ...kw,
        value: Math.round(kw.value * (0.8 + Math.random() * 0.4))),
    );
};

export const generateMockData = (): Store[] => {
    const stores: Store[] = [];
    Object.keys(storeTemplates).forEach(city => {
        storeTemplates[city as City].forEach((locality, index) => {
            const rating = parseFloat((3.8 + Math.random()).toFixed(1));
            const baseSearches = 50 + Math.random() * 150;
            const searchTrend = generateRandomTrend(baseSearches, 30);
            const totalSearches = searchTrend.filter(d => d.actual).reduce((sum, day) => sum + (day.actual || 0), 0);

            stores.push({
                id: `${city}-${index}`,
                brand: 'KFC',
                city: city as City,
                locality: locality,
                latitude: 0, // Placeholder
                longitude: 0, // Placeholder
                averageRating: rating,
                sentiment: rating > 4.2 ? 'Positive' : rating > 3.9 ? 'Neutral' : 'Negative',
                topKeywords: generateKeywords(),
                searchTrend,
                totalSearches: Math.round(totalSearches / 30), // Daily average
            });
        });
    });
    return stores;
};

export const generateStoreSummary = async (store: Store): Promise<string> => {
    try {
        // FIX: Replaced `findLast` with a compatible alternative for older JS targets.
        const lastActual = [...store.searchTrend].reverse().find(d => d.actual !== undefined)?.actual || 0;
        const firstForecast = store.searchTrend.find(d => d.forecast !== undefined)?.forecast || 0;
        const forecastChange = firstForecast - lastActual;
        const forecastPercentage = lastActual > 0 ? (forecastChange / lastActual) * 100 : 0;
        const trendDirection = forecastPercentage > 5 ? 'a significant increase' : forecastPercentage > 0 ? 'a slight increase' : forecastPercentage < -5 ? 'a significant decrease' : 'a slight decrease';

        const prompt = `
        You are a business analyst AI. Summarize the following data for a KFC store in a concise, actionable insight for a regional manager.
        The summary should be a single paragraph of about 3-4 sentences.

        Store Location: KFC, ${store.locality}, ${store.city}
        Average Rating: ${store.averageRating.toFixed(1)} out of 5
        Customer Sentiment: ${store.sentiment}
        Top Searched Keywords: ${store.topKeywords.map(k => `"${k.text}"`).join(', ')}
        Next-Week Search Forecast: The trend shows ${trendDirection} of approximately ${Math.abs(forecastPercentage).toFixed(0)}%.

        Provide a brief summary highlighting strengths, weaknesses, and potential actions based on this data.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating AI summary:", error);
        return "Could not generate AI summary at this time. Please check your API key and connection.";
    }
};