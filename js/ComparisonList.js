export default class ComparisonList {
    constructor(containerElement) {
        if (!(containerElement instanceof HTMLElement)) {
            console.error('ComparisonList constructor requires a valid HTML element.');
            return;
        }
        this.containerElement = containerElement;
        this.companies = {}; 
        this.render();
    }

    addCompany(company) {
        if (!this.companies[company.symbol]) {
            this.companies[company.symbol] = company;
            this.render();
        }
    }

    removeCompany(symbol) {
        delete this.companies[symbol];
        this.render();
    }

    render() {
        const companySymbols = Object.keys(this.companies);
        const hasCompanies = companySymbols.length > 0;

        this.containerElement.innerHTML = `
            ${hasCompanies ? `
            <div class="comparison-list-wrapper">
                <div class="company-buttons">
                    ${companySymbols.map(symbol => `
                        <button class="company-compare-item" data-symbol="${symbol}">
                            ${symbol} <span class="remove-btn">x</span>
                        </button>
                    `).join('')}
                </div>
                <button class="compare-page-btn" ${hasCompanies ? '' : 'disabled'}>
                    Compare
                </button>
            </div>
            ` : ''}
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        this.containerElement.querySelectorAll('.company-compare-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const symbol = e.currentTarget.dataset.symbol;
                this.removeCompany(symbol);
            });
        });

        const comparePageButton = this.containerElement.querySelector('.compare-page-btn');
        if (comparePageButton) {
            comparePageButton.addEventListener('click', () => {
                const symbols = Object.keys(this.companies);
                if (symbols.length < 2) {
                    alert('Please add at least two companies to compare.');
                    return;
                }
                console.log("Navigating to comparison page with symbols:", symbols);
                alert("This would navigate to a new page to compare companies.");
            });
        }
    }
}