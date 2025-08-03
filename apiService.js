const API_KEY = 'Wseb4tU2ghk1PEv4i5D72uqQLGaGdn4b'; 
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

export const apiService = {
    // Searches for companies based on a query, limit, and exchange.
    searchCompanies: async (query, limit = 10, exchange = 'NASDAQ') => {
        const url = `${BASE_URL}/search?query=${query}&limit=${limit}&exchange=${exchange}&apikey=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching company search data:", error);
            throw error; 
        }
    },

    getCompanyDetails: async (symbol) => {
        const url = `${BASE_URL}/profile/${symbol}?apikey=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching details for ${symbol}:`, error);
            throw error;
        }
    }
};