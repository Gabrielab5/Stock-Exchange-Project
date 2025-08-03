export const searchView = {
    searchInput: document.getElementById('searchInput'),
    searchButton: document.getElementById('searchButton'),
    searchResultsDiv: document.getElementById('searchResults'),
    loadingIndicator: document.getElementById('loadingIndicator'),

    // Initializes the search view, binds events, and sets up the UI.
    init: () => {
        searchView.bindSearchButton();
    },

    // Renders the search results in the UI -takes an array of companies and dynamically creates list items.
    renderResults: (companies) => {
        searchView.clearResults(); 
        if (companies.length === 0) {
            searchView.searchResultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        const ul = document.createElement('ul'); 
        companies.forEach(company => {
            const li = document.createElement('li');
            const companyImageHtml = `<img src="${company.image}" alt="${company.symbol} Logo" class="company-list-logo" onerror="this.onerror=null; this.src='img/placeholder-logo.png';">`;
            let percentageClass = '';
            if (company.changesPercentage !== null && company.changesPercentage !== undefined) {
                if (company.changesPercentage > 0) percentageClass = 'positive-change';
                else if (company.changesPercentage < 0)  percentageClass = 'negative-change';               
            }
            const percentageText = company.changesPercentage !== null && company.changesPercentage !== undefined
             ? `${company.changesPercentage.toFixed(2)}%` : 'N/A';

            li.innerHTML = `
                <div class="company-info-left">
                    ${companyImageHtml}
                    <div>
                        <a href="/company.html?symbol=${company.symbol}">${company.name}</a>
                        <span class="company-symbol">(${company.symbol})</span>
                    </div>
                </div>
                <div class="company-info-right">
                    <span class="stock-change-percentage ${percentageClass}">${percentageText}</span>
                </div>
            `;
            ul.appendChild(li);
        });
        searchView.searchResultsDiv.appendChild(ul);
    },

    showLoading: () => {
        searchView.loadingIndicator.style.display = 'block';
    },

    hideLoading: () => {
        searchView.loadingIndicator.style.display = 'none';
    },

    clearResults: () => {
        searchView.searchResultsDiv.innerHTML = '';
    },

    displayError: (message) => {
        searchView.clearResults();
        searchView.searchResultsDiv.innerHTML = `<p class="error-message" style="color: red;">Error: ${message}</p>`;
    },

    bindSearchButton: (handler) => {
        searchView.searchButton.addEventListener('click', handler);
        searchView.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handler();
            }
        });
    },

    getSearchQuery: () => {
        return searchView.searchInput.value.trim();
    }
};