import { searchController } from './searchController.js';

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        searchController.init();
    }

});