import { stockModel } from './models/stockModel.js'; 

class Marquee {
    constructor(containerElement) {
        if (!(containerElement instanceof HTMLElement)) {
            console.error('Marquee constructor requires a valid HTML element.');
            return;
        }
        this.containerElement = containerElement;
        this.contentElement = null; 
        this.animationDuration = 60; 

        this.containerElement.className = 'stock-marquee-container';
        this.containerElement.innerHTML = `
            <div class="stock-marquee-content">
                Loading stock ticker data...
            </div>
        `;
        this.contentElement = this.containerElement.querySelector('.stock-marquee-content');
    }

    async init() {
        try {
            const stocks = await stockModel.getMarqueeStocks(20); 
            this.render(stocks);
            this.setupAnimation();
        } catch (error) {
            console.error("Error initializing marquee:", error);
            this.contentElement.textContent = 'Failed to load stock ticker data.';
            this.containerElement.style.display = 'none'; 
        }
    }

    // Renders stock items into the marquee content element.
    render(stocks) {
        if (!this.contentElement) return;

        this.contentElement.innerHTML = ''; 

        if (stocks.length === 0) {
            this.contentElement.textContent = 'No real-time stock data available.';
            return;
        }

        stocks.forEach(stock => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'stock-marquee-item';

            let percentageClass = '';
            if (stock.changesPercentage !== null && stock.changesPercentage !== undefined) {
                if (stock.changesPercentage > 0) {
                    percentageClass = 'positive-change';
                } else if (stock.changesPercentage < 0) {
                    percentageClass = 'negative-change';
                }
            }
            const percentageText = stock.changesPercentage !== null && stock.changesPercentage !== undefined
                                 ? `${stock.changesPercentage.toFixed(2)}%`
                                 : 'N/A';
            const priceText = stock.price !== null && stock.price !== undefined
                            ? `$${stock.price.toFixed(2)}`
                            : 'N/A';

            itemDiv.innerHTML = `
                <span>${stock.symbol}</span>
                <span class="price">${priceText}</span>
                <span class="${percentageClass}">${percentageText}</span>
            `;
            this.contentElement.appendChild(itemDiv);
        });
    }

    setupAnimation() {
        this.contentElement.style.animationDuration = `${this.animationDuration}s`;
    }
}

export default Marquee; 