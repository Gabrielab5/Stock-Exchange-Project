class SearchResult {
    constructor(containerElement) {
        if (!(containerElement instanceof HTMLElement)) {
            console.error('SearchResult constructor requires a valid HTML element.');
            return;
        }
        this.containerElement = containerElement;
        this.containerElement.className = 'search-results'; 

        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator';
        this.loadingIndicator.textContent = 'Loading...';
        this.loadingIndicator.style.display = 'none'; 

        this.errorMessage = document.createElement('div');
        this.errorMessage.className = 'error-message';
        this.errorMessage.style.display = 'none'; 

        this.containerElement.appendChild(this.loadingIndicator);
        this.containerElement.appendChild(this.errorMessage);
    }

    renderResults(state) {
        this.containerElement.querySelector('ul')?.remove()
        this.loadingIndicator.style.display = 'none';
        this.errorMessage.style.display = 'none';

        if (state.type === 'loading') {
            this.loadingIndicator.style.display = 'block';
            return;
        }

        if (state.type === 'error') {
            this.errorMessage.textContent = `Error: ${state.message}`;
            this.errorMessage.style.display = 'block';
            return;
        }

        if (state.type === 'success') {
            const companies = state.data;
            if (companies.length === 0) {
                this.containerElement.innerHTML += '<p>No results found.</p>';
                return;
            }

            const ul = document.createElement('ul');
            companies.forEach(company => {
                const li = document.createElement('li');

                const companyImageHtml = `<img src="${company.image}" alt="${company.symbol} Logo" class="company-list-logo" onerror="this.onerror=null; this.src='img/placeholder-logo.png';">`;

                let percentageClass = '';
                if (company.changesPercentage !== null && company.changesPercentage !== undefined) {
                    if (company.changesPercentage > 0) {
                        percentageClass = 'positive-change';
                    } else if (company.changesPercentage < 0) {
                        percentageClass = 'negative-change';
                    }
                }
                const percentageText = company.changesPercentage !== null && company.changesPercentage !== undefined
                                     ? `${company.changesPercentage.toFixed(2)}%`
                                     : 'N/A';

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
            this.containerElement.appendChild(ul);
        }
    }
}

export default SearchResult;