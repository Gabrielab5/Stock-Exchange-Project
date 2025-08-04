import { stockModel } from './models/stockModel.js'; 

class SearchForm {
   
    constructor(containerElement) {
        if (!(containerElement instanceof HTMLElement)) {
            console.error('SearchForm constructor requires a valid HTML element.');
            return;
        }
        this.containerElement = containerElement;
        this.searchCallback = null; 

        this.render(); 
        this.addEventListeners();
    }

    render() {
        this.containerElement.className = 'search-container'; 
        this.containerElement.innerHTML = `
            <input type="text" id="searchInput" placeholder="Search for a company (e.g., Apple)">
            <button id="searchButton">Search</button>
        `;
        this.searchInput = this.containerElement.querySelector('#searchInput');
        this.searchButton = this.containerElement.querySelector('#searchButton');
    }

    addEventListeners() {
        this.searchButton.addEventListener('click', this.handleSearch.bind(this));
        this.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            alert('Please enter a company name or symbol.');
            return;
        }

        if (this.searchCallback) {
            this.searchCallback({ type: 'loading' });
        }

        try {
            const companies = await stockModel.searchCompanies(query);
            if (this.searchCallback) {
                this.searchCallback({ type: 'success', data: companies });
            }
        } catch (error) {
            console.error("SearchForm: Search failed:", error);
            if (this.searchCallback) {
                this.searchCallback({ type: 'error', message: 'Failed to fetch search results. Please try again later.' });
            }
        }
    }

    onSearch(callback) {
        this.searchCallback = callback;
    }
}

export default SearchForm;