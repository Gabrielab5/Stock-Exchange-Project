import { apiService } from '../services/apiService.js';

export const stockModel = {
    // Searches for companies and returns a simplified list.
    searchCompanies: async (query) => {
        try {
            const results = await apiService.searchCompanies(query, 10, 'NASDAQ');
            return results.map(company => ({
                name: company.name,
                symbol: company.symbol,
                currency: company.currency
            }));
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