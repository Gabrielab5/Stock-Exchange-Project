export const marqueeView = {
    marqueeContentDiv: document.querySelector('.stock-marquee-content'),
  
    // Renders stock items into the marquee.
    renderMarquee: (stocks) => {
        if (!marqueeView.marqueeContentDiv) return;

        marqueeView.marqueeContentDiv.innerHTML = '';

        if (stocks.length === 0) {
            marqueeView.marqueeContentDiv.textContent = 'No real-time stock data available.';
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
            marqueeView.marqueeContentDiv.appendChild(itemDiv);
        });

    },

    hideMarquee: () => {
        const container = document.getElementById('stockMarquee');
        if (container) container.style.display = 'none';
    },

    showMarquee: () => {
        const container = document.getElementById('stockMarquee');
        if (container) container.style.display = 'block';
    }
};