import { stockModel } from "../models/stockModel.js";
import { marqueeView } from "../views/marqueeView.js";

export const marqueeController = {

    init: async () => {
        try {
            const stocks = await stockModel.getMarqueeStocks(20, 'NASDAQ');
            marqueeView.renderMarquee(stocks);
        } catch (error) {
            console.error("Error initializing marquee:", error);
            marqueeView.marqueeContentDiv.textContent = 'Failed to load stock data.';
        }
    }
};