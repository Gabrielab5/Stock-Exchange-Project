import Marquee from './Marquee.js';
import SearchForm from './SearchForm.js';    
import SearchResult from './SearchResult.js'; 


document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const marquee = new Marquee(document.getElementById('stockMarquee'));
    marquee.init();

    if (currentPath === '/' || currentPath.includes('index.html') || currentPath.includes('search.html')) {
        const formContainer = document.getElementById('form');
        const resultsContainer = document.getElementById('searchResults');

        if (formContainer && resultsContainer) {
            const searchForm = new SearchForm(formContainer);
            const searchResults = new SearchResult(resultsContainer);

            searchForm.onSearch((state) => {
                searchResults.renderResults(state);
            });

            searchResults.onCompare((company) => {
                console.log("Compare button clicked! Company object:", company);
            });
        }
    }
});

