import { apiService } from '../services/apiService.js';

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
    }
};