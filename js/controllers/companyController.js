import { stockModel } from '../models/stockModel.js';     
import { companyView } from '../views/companyView.js';   

export const companyController = {
    init: async () => {
        companyView.clearContent();
        companyView.showLoading();  

        const urlParams = new URLSearchParams(window.location.search);
        const symbol = urlParams.get('symbol');

        if (!symbol) {
            companyView.displayError('No company symbol provided in the URL.');
            companyView.hideLoading();
            return;
        }

        try {
            const companyData = await stockModel.getCompanyDetails(symbol);
            companyView.renderCompanyDetails(companyData);
            companyView.renderPriceChart(companyData.historical);
        } catch (error) {
            console.error(`Error loading company details for ${symbol}:`, error);
            let errorMessage = 'Failed to load company details. Please try again later.';
            if (error.message.includes('No profile data found')) {
                errorMessage = `Could not find company data for symbol: ${symbol}. It might not exist or data is unavailable.`;
            } else if (error.message.includes('40')) { 
                errorMessage = `Could not retrieve data for ${symbol}. Please check the symbol or API key.`;
            }
            companyView.displayError(errorMessage);
        } finally {
            companyView.hideLoading(); 
        }
    }
};