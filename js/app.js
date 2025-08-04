import { searchController } from './controllers/searchController.js';
import { companyController } from './controllers/companyController.js';
import Marquee from './Marquee.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const marquee = new Marquee(document.getElementById('stockMarquee'));
    marquee.init();
    
    if (currentPath.includes('company.html')) {
        companyController.init();
    } else if (currentPath.includes('search.html')) {
        searchController.init();
    } else if (currentPath === '/' || currentPath.endsWith('index.html')) {
        searchController.init();
    }
});