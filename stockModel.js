import { apiService } from './apiService.js';

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
    }

};