export const companyView = {
    loadingIndicator: document.getElementById('loadingIndicator'),
    errorMessage: document.getElementById('errorMessage'),
    companyProfileDiv: document.getElementById('companyProfile'),
    companyImage: document.getElementById('companyImage'),
    companyName: document.getElementById('companyName'),
    companySymbol: document.getElementById('companySymbol'),
    companyExchange: document.getElementById('companyExchange'),
    companyDescription: document.getElementById('companyDescription'),
    companyWebsite: document.getElementById('companyWebsite'),
    stockInfoDiv: document.getElementById('stockInfo'),
    stockPrice: document.getElementById('stockPrice'),
    stockChangesPercentage: document.getElementById('stockChangesPercentage'),
    priceHistoryChartDiv: document.getElementById('priceHistoryChart'),
    myChartCanvas: document.getElementById('myChart'),
    chartInstance: null, 

    renderCompanyDetails: (data) => {
        companyView.companyProfileDiv.style.display = 'block';
        companyView.stockInfoDiv.style.display = 'block';
        const { profile, latestPrice, changes, changesPercentage } = data;

        if (profile?.image) {
            companyView.companyImage.src = profile.image;
            companyView.companyImage.style.display = 'block';
        } else  companyView.companyImage.style.display = 'none'; 

        companyView.companyName.textContent = profile?.companyName || 'N/A';
        companyView.companySymbol.textContent = profile?.symbol || 'N/A';
        companyView.companyExchange.textContent = profile?.exchangeShortName || 'N/A';
        companyView.companyDescription.textContent = profile?.description || 'No description available.';

        if (profile?.website) {
            companyView.companyWebsite.href = profile.website;
            companyView.companyWebsite.textContent = `Visit ${profile?.companyName || 'Company'} Website`;
            companyView.companyWebsite.style.display = 'inline';
        } else  companyView.companyWebsite.style.display = 'none';
        
        if (latestPrice !== null && latestPrice !== undefined) {
            companyView.stockPrice.textContent = `$${latestPrice.toFixed(2)}`;

            if (changesPercentage !== null && changesPercentage !== undefined) {
                const percentageText = `${changesPercentage.toFixed(2)}%`;
                companyView.stockChangesPercentage.textContent = percentageText;

                if (changesPercentage > 0) {
                    companyView.stockChangesPercentage.style.color = 'lightgreen';
                } else if (changesPercentage < 0) {
                    companyView.stockChangesPercentage.style.color = 'red';
                } else  companyView.stockChangesPercentage.style.color = 'inherit'; 

            } else {
                companyView.stockChangesPercentage.textContent = 'N/A';
                companyView.stockChangesPercentage.style.color = 'inherit';
            }
        } else {
            companyView.stockPrice.textContent = 'N/A';
            companyView.stockChangesPercentage.textContent = 'N/A';
            companyView.stockChangesPercentage.style.color = 'inherit';
        }
    },

    renderPriceChart: (historicalData) => {
        companyView.priceHistoryChartDiv.style.display = 'block';

        const reversedData = [...historicalData].reverse();
        const labels = reversedData.map(entry => entry.date);
        const prices = reversedData.map(entry => entry.close);

        if (companyView.chartInstance)   companyView.chartInstance.destroy();

        companyView.chartInstance = new Chart(companyView.myChartCanvas, {
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
    },

    showLoading: () => {
        companyView.loadingIndicator.style.display = 'block';
        companyView.companyProfileDiv.style.display = 'none'; 
        companyView.stockInfoDiv.style.display = 'none';
        companyView.priceHistoryChartDiv.style.display = 'none';
        companyView.errorMessage.style.display = 'none'; 
    },

    hideLoading: () => {
        companyView.loadingIndicator.style.display = 'none';
    },

    displayError: (message) => {
        companyView.errorMessage.textContent = `Error: ${message}`;
        companyView.errorMessage.style.display = 'block';
        companyView.companyProfileDiv.style.display = 'none';
        companyView.stockInfoDiv.style.display = 'none';
        companyView.priceHistoryChartDiv.style.display = 'none';
    },

    clearContent: () => {
        companyView.companyProfileDiv.style.display = 'none';
        companyView.stockInfoDiv.style.display = 'none';
        companyView.priceHistoryChartDiv.style.display = 'none';
        companyView.errorMessage.style.display = 'none';
        if (companyView.chartInstance) {
            companyView.chartInstance.destroy();
            companyView.chartInstance = null;
        }
    }
};