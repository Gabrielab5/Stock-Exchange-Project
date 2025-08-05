import { stockModel } from './models/stockModel.js';

export default class ComparisonPage {
    constructor(containerElement, symbols) {
        this.containerElement = containerElement;
        this.symbols = symbols;
    }

    async load() {
        this.containerElement.innerHTML = '<div class="loading-indicator">Loading company data...</div>';

        try {
            const companyDetailsPromises = this.symbols.map(symbol => stockModel.getCompanyDetails(symbol));
            const companiesData = await Promise.all(companyDetailsPromises);

            this.render(companiesData);
        } catch (error) {
            console.error('Error loading comparison data:', error);
            this.containerElement.innerHTML = '<div class="error-message">Failed to load comparison data. Please try again.</div>';
        }
    }

    render(companiesData) {
        this.containerElement.innerHTML = '';
        companiesData.forEach(data => {
            const card = this.createCompanyCard(data);
            this.containerElement.appendChild(card);
            this.renderPriceChart(data.historical, card.querySelector('.compare-chart-canvas'));
        });
    }

    createCompanyCard(data) {
        const { profile, latestPrice, changesPercentage } = data;
        const card = document.createElement('div');
        card.className = 'compare-card';

        const priceClass = changesPercentage > 0 ? 'positive-change' : 'negative-change';
        const priceText = latestPrice !== undefined  ? latestPrice.toFixed(2) : 'N/A';
        const changesText = changesPercentage !== undefined  ? `${changesPercentage.toFixed(2)}%` : 'N/A';

        card.innerHTML = `
            <div class="card-header">
                <img src="${profile.image}" alt="${profile.symbol} Logo" class="compare-card-logo">
                <div class="header-text">
                    <h3 class="card-company-name">${profile.companyName}</h3>
                    <p class="card-symbol">${profile.symbol}</p>
                </div>
            </div>
            <div class="card-body">
                <p><strong>Stock price:</strong> $${priceText} <span class="${priceClass} stock-change-percentage">${changesText}</span></p>
                <p class="card-description">${profile.description.substring(0, 150)}...</p>
                <div class="compare-chart-wrapper">
                    <canvas class="compare-chart-canvas"></canvas>
                </div>
            </div>
        `;
        return card;
    }

    renderPriceChart(historicalData, canvas) {
        const reversedData = [...historicalData].reverse();
        const labels = reversedData.map(entry => entry.date);
        const prices = reversedData.map(entry => entry.close);
        
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stock Price',
                    data: prices,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                scales: {
                    xAxes: [{ display: false }],
                    yAxes: [{ display: false }]
                }
            }
        });
    }
}