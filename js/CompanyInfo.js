import { stockModel } from './models/stockModel.js';

export default class CompanyInfo {
    constructor(containerElement, symbol) {
        if (!(containerElement instanceof HTMLElement)) {
            console.error('CompanyInfo constructor requires a valid HTML element.');
            return;
        }
        this.containerElement = containerElement;
        this.symbol = symbol;
        this.companyData = null;
        this.chartInstance = null;

        this.renderInitialStructure();
    }

    renderInitialStructure() {
        this.containerElement.innerHTML = `
            <a href="index.html" class="back-link">&larr; Back to Search</a>
            <h1>Company Details</h1>
            <div id="loadingIndicator" class="loading-indicator">Loading company data...</div>
            <div id="errorMessage" class="error-message" style="display: none; color: red;"></div>
            <div id="companyProfile" class="company-profile" style="display: none;">
                <img id="companyImage" src="" alt="Company Logo" class="company-logo" style="display: none;">
                <h2 id="companyName"></h2>
                <p><strong>Symbol:</strong> <span id="companySymbol"></span></p>
                <p><strong>Exchange:</strong> <span id="companyExchange"></span></p>
                <p id="companyDescription"></p>
                <p><a id="companyWebsite" href="#" target="_blank">Visit Website</a></p>
            </div>
            <div id="stockInfo" class="stock-info" style="display: none;">
                <h3>Current Stock Price</h3>
                <p><strong>Price:</strong> <span id="stockPrice"></span></p>
                <p><strong>Changes (Percentage):</strong> <span id="stockChangesPercentage"></span></p>
            </div>
            <div id="priceHistoryChart" class="price-history-chart" style="display: none;">
                <h3>Stock Price History</h3>
                <canvas id="myChart"></canvas>
            </div>
        `;
        this.elements = {
            loadingIndicator: this.containerElement.querySelector('#loadingIndicator'),
            errorMessage: this.containerElement.querySelector('#errorMessage'),
            companyProfileDiv: this.containerElement.querySelector('#companyProfile'),
            companyImage: this.containerElement.querySelector('#companyImage'),
            companyName: this.containerElement.querySelector('#companyName'),
            companySymbol: this.containerElement.querySelector('#companySymbol'),
            companyExchange: this.containerElement.querySelector('#companyExchange'),
            companyDescription: this.containerElement.querySelector('#companyDescription'),
            companyWebsite: this.containerElement.querySelector('#companyWebsite'),
            stockInfoDiv: this.containerElement.querySelector('#stockInfo'),
            stockPrice: this.containerElement.querySelector('#stockPrice'),
            stockChangesPercentage: this.containerElement.querySelector('#stockChangesPercentage'),
            priceHistoryChartDiv: this.containerElement.querySelector('#priceHistoryChart'),
            myChartCanvas: this.containerElement.querySelector('#myChart')
        };
    }

    showLoading() {
        this.elements.loadingIndicator.style.display = 'block';
        this.elements.companyProfileDiv.style.display = 'none';
        this.elements.stockInfoDiv.style.display = 'none';
        this.elements.priceHistoryChartDiv.style.display = 'none';
        this.elements.errorMessage.style.display = 'none';
    }

    hideLoading() {
        this.elements.loadingIndicator.style.display = 'none';
    }

    displayError(message) {
        this.elements.errorMessage.textContent = `Error: ${message}`;
        this.elements.errorMessage.style.display = 'block';
        this.elements.companyProfileDiv.style.display = 'none';
        this.elements.stockInfoDiv.style.display = 'none';
        this.elements.priceHistoryChartDiv.style.display = 'none';
    }

    renderCompanyDetails() {
        const { profile, latestPrice, changesPercentage } = this.companyData;

        this.elements.companyProfileDiv.style.display = 'block';
        this.elements.stockInfoDiv.style.display = 'block';

        if (profile?.image) {
            this.elements.companyImage.src = profile.image;
            this.elements.companyImage.style.display = 'block';
        } else this.elements.companyImage.style.display = 'none';

        this.elements.companyName.textContent = profile?.companyName || 'N/A';
        this.elements.companySymbol.textContent = profile?.symbol || 'N/A';
        this.elements.companyExchange.textContent = profile?.exchangeShortName || 'N/A';
        this.elements.companyDescription.textContent = profile?.description || 'No description available.';

        if (profile?.website) {
            this.elements.companyWebsite.href = profile.website;
            this.elements.companyWebsite.textContent = `Visit ${profile?.companyName || 'Company'} Website`;
            this.elements.companyWebsite.style.display = 'inline';
        } else this.elements.companyWebsite.style.display = 'none';
        
        if (latestPrice !== null && latestPrice !== undefined) {
            this.elements.stockPrice.textContent = `$${latestPrice.toFixed(2)}`;

            if (changesPercentage !== null && changesPercentage !== undefined) {
                const percentageText = `${changesPercentage.toFixed(2)}%`;
                this.elements.stockChangesPercentage.textContent = percentageText;

                if (changesPercentage > 0) {
                    this.elements.stockChangesPercentage.style.color = 'lightgreen';
                } else if (changesPercentage < 0) {
                    this.elements.stockChangesPercentage.style.color = 'red';
                } else this.elements.stockChangesPercentage.style.color = 'inherit';
            } else {
                this.elements.stockChangesPercentage.textContent = 'N/A';
                this.elements.stockChangesPercentage.style.color = 'inherit';
            }
        } else {
            this.elements.stockPrice.textContent = 'N/A';
            this.elements.stockChangesPercentage.textContent = 'N/A';
            this.elements.stockChangesPercentage.style.color = 'inherit';
        }
    }

    async load() {
        this.showLoading();
        try {
            if (!this.symbol) {
                this.displayError('No company symbol provided in the URL.');
                return;
            }
            this.companyData = await stockModel.getCompanyDetails(this.symbol);
            this.renderCompanyDetails();
        } catch (error) {
            console.error(`Error loading company details for ${this.symbol}:`, error);
            let errorMessage = 'Failed to load company details. Please try again later.';
            if (error.message.includes('No profile data found')) {
                errorMessage = `Could not find company data for symbol: ${this.symbol}. It might not exist or data is unavailable.`;
            } else if (error.message.includes('40')) {
                errorMessage = `Could not retrieve data for ${this.symbol}. Please check the symbol or API key.`;
            }
            this.displayError(errorMessage);
        } finally {
            this.hideLoading();
        }
    }

    addChart() {
        if (!this.companyData || !this.companyData.historical) return;

        this.elements.priceHistoryChartDiv.style.display = 'block';

        const historicalData = this.companyData.historical;
        const reversedData = [...historicalData].reverse();
        const labels = reversedData.map(entry => entry.date);
        const prices = reversedData.map(entry => entry.close);

        if (this.chartInstance) this.chartInstance.destroy();

        this.chartInstance = new Chart(this.elements.myChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stock Price ($)',
                    data: prices,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Historical Stock Price'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price ($)'
                        },
                        beginAtZero: false
                    }
                }
            }
        });
    }
}