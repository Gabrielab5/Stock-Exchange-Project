import { stockModel } from './stockModel.js';
import { searchView } from './searchView.js';

export const searchController = {
    init: () => {
        searchView.bindSearchButton(searchController.handleSearch);
    },

    // Handles the search button click or Enter key press event.
    handleSearch: async () => {
        const query = searchView.getSearchQuery();

        if (!query) {
            searchView.displayError('Please enter a company name or symbol.');
            searchView.clearResults();
            return;
        }

        searchView.showLoading();
        searchView.clearResults(); 

        try {
            const companies = await stockModel.searchCompanies(query);
            searchView.renderResults(companies);
        } catch (error) {
            console.error("Search failed:", error);
            searchView.displayError('Failed to fetch search results. Please try again later.');
        } finally {
            searchView.hideLoading();
        }
    }
};