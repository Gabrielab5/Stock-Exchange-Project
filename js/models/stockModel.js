import { apiService } from '../services/apiService.js';
const mockMarqueeStocks = [
    { symbol: 'APPL', name: 'Apple Inc.', price: 175.00, changesPercentage: 0.52 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 420.50, changesPercentage: -1.25 },
    { symbol: 'GOOG', name: 'Alphabet Inc.', price: 155.10, changesPercentage: 2.10 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 180.75, changesPercentage: -0.78 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 950.00, changesPercentage: 3.45 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 178.20, changesPercentage: 1.50 },
    { symbol: 'META', name: 'Meta Platforms', price: 485.30, changesPercentage: -0.99 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 630.40, changesPercentage: 0.75 },
];

export const stockModel = {
    // Searches for companies and returns a simplified list.
    searchCompanies: async (query) => {
        try {
            const basicResults = await apiService.searchCompanies(query, 10, 'NASDAQ');
            if (basicResults.length === 0) return [];
            const symbolsToFetch = basicResults.map(company => company.symbol);
            const detailedProfiles = await apiService.getMultipleCompanyProfiles(symbolsToFetch);

            const detailedProfileMap = detailedProfiles.reduce((map, profile) => {
                map[profile.symbol] = profile;
                return map;
            }, {}); 
            const finalResults = basicResults.map(company => {
                const profile = detailedProfileMap[company.symbol];

                let changesPercentage = null;
                let image = null;

                if (profile) {
                    changesPercentage = profile.changesPercentage;
                    image = profile.image; 
                }
                if (!image) image = `https://via.placeholder.com/36?text=${company.symbol.substring(0,2)}`;
                
                return {
                    name: company.name,
                    symbol: company.symbol,
                    currency: company.currency,
                    image: image, 
                    changesPercentage: parseFloat(changesPercentage) 
                };
            });

            return finalResults;

        } catch (error) {
            console.error("Error in stockModel.searchCompanies:", error);
            throw error; 
        }
    },

    getCompanyDetails: async (symbol) => {
        try {
            const [profile, historical] = await Promise.all([
                apiService.getCompanyProfile(symbol),
                apiService.getHistoricalPrice(symbol)
            ]);

            if (!profile) throw new Error(`No profile data found for ${symbol}`);
            
            if (!historical || !historical.historical) {
                console.warn(`No historical data found for ${symbol}`);
                historical.historical = [];
            }

            let latestPrice = null;
            let previousClose = null; 
            let changes = null;
            let changesPercentage = null;

            if (profile.price !== undefined) {
                latestPrice = profile.price;
                changes = profile.changes;
                changesPercentage = profile.changesPercentage;
            } else if (historical.historical.length > 0) {
                latestPrice = historical.historical[0].close;
                if (historical.historical.length > 1) {
                    previousClose = historical.historical[1].close;
                    changes = latestPrice - previousClose;
                    changesPercentage = (changes / previousClose) * 100;
                }
            }

            return {
                profile: profile,
                latestPrice: latestPrice,
                changes: changes,
                changesPercentage: changesPercentage,
                historical: historical.historical 
            };

        } catch (error) {
            console.error(`Error in stockModel.getCompanyDetails for ${symbol}:`, error);
            throw error;
        }
    },

    // Gets a subset of real-time stock quotes for the marquee.
    getMarqueeStocks: async (limit = 20, exchange = 'NASDAQ') => { 
        try {
            const allQuotes = await apiService.getExchangeQuotes(exchange);

             if (!allQuotes || allQuotes.length === 0) {
                console.warn('API returned no data for the marquee. Using mock data.');
                return mockMarqueeStocks.slice(0, limit);
            }

            const subsetQuotes = allQuotes.slice(0, limit);
            return subsetQuotes.map(quote => ({
                symbol: quote.symbol,
                name: quote.companyName || quote.name,
                price: quote.price,
                changesPercentage: quote.changesPercentage
            }));
        } catch (error) {
            console.error(`Error in stockModel.getMarqueeStocks for ${exchange}:`, error);
            return mockMarqueeStocks.slice(0, limit);
            throw error;
        }
    }
};