// Trends page logic
import { renderHeader, renderFooter, renderMovieGrid, renderFilters } from './components.js';
import { showLoading, showError, initMobileMenu, updateAuthLinks, initSearch } from './utils.js';
import { getTrending, getMovieGenres, getTVGenres, searchMulti, getMovies, getTVSeries } from './api.js';

const app = document.getElementById('app');
let currentType = 'all'; // all, movie, tv
let selectedGenres = [];
let currentMovies = [];
let genres = [];
let isSearchMode = false;
let searchQuery = '';

async function initTrendsPage() {
    try {
        app.innerHTML = '';
        app.insertAdjacentHTML('afterbegin', renderHeader());
        initMobileMenu();
        updateAuthLinks();

        const performSearch = (query) => {
            if (query) {
                isSearchMode = true;
                searchQuery = query;
                loadTrending(currentType);
            } else {
                isSearchMode = false;
                searchQuery = '';
                loadTrending(currentType);
            }
        };

        // Check for search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQueryFromUrl = urlParams.get('search');
        if (searchQueryFromUrl) {
            isSearchMode = true;
            searchQuery = searchQueryFromUrl;
        }

        initSearch(performSearch, async (query) => {
            const data = await searchMulti(query);
            return data.results || [];
        });

        window.addEventListener('executeSearch', (e) => {
            performSearch(e.detail);
            document.querySelectorAll('.search-live-results').forEach(c => c.classList.add('hidden'));
        });

        const mainContent = document.createElement('main');
        mainContent.className = 'pt-16 pb-8';
        app.appendChild(mainContent);

        showLoading(mainContent);

        // Fetch genres
        const [movieGenresData, tvGenresData] = await Promise.all([
            getMovieGenres(),
            getTVGenres()
        ]);

        // Combine genres
        genres = [...movieGenresData.genres, ...tvGenresData.genres];

        // Load trending content
        await loadTrending();

        app.insertAdjacentHTML('beforeend', renderFooter());

    } catch (error) {
        console.error('Error initializing trends page:', error);
        app.innerHTML = '';
        app.insertAdjacentHTML('afterbegin', renderHeader());
        initMobileMenu(); updateAuthLinks();
        const mainContent = document.createElement('main');
        mainContent.className = 'pt-16';
        app.appendChild(mainContent);
        showError(mainContent, 'Не удалось загрузить данные');
        app.insertAdjacentHTML('beforeend', renderFooter());
    }
}

async function loadTrending(type = 'all') {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    try {
        showLoading(mainContent);

        let data;
        if (isSearchMode) {
            data = await searchMulti(searchQuery);
        } else if (selectedGenres.length > 0) {
            // Trending with filters isn't a direct TMDB endpoint, 
            // so we use discover with popularity sorting to simulate it
            const params = {
                with_genres: selectedGenres.join(','),
                sort_by: 'popularity.desc'
            };
            if (type === 'movie') {
                data = await getMovies(params);
            } else if (type === 'tv') {
                data = await getTVSeries(params);
            } else {
                // If 'all' and genres selected, we show movies (most common)
                data = await getMovies(params);
            }
        } else {
            data = await getTrending(type, 'day');
        }

        currentMovies = data.results || [];
        currentType = type;

        renderContent();

    } catch (error) {
        console.error('Error loading trending:', error);
        showError(mainContent, 'Не удалось загрузить тренды');
    }
}

function renderContent() {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const title = currentType === 'all' ? 'Тренды за сегодня' :
        currentType === 'movie' ? 'Трендовые фильмы' : 'Трендовые сериалы';

    mainContent.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-6">${title}</h1>
            
            ${isSearchMode ? '' : renderFilters(genres, selectedGenres)}

            <div id="movies-grid" class="mt-8">
                ${renderMovieGrid(currentMovies, currentType === 'tv')}
            </div>
        </div>
    `;
}

// Global functions for onclick handlers
window.changeTrendingType = (type) => {
    loadTrending(type);
};

window.currentFilterChange = (genreId) => {
    if (genreId === '') {
        selectedGenres = [];
    } else {
        const index = selectedGenres.indexOf(genreId.toString());
        if (index > -1) {
            selectedGenres.splice(index, 1);
        } else {
            selectedGenres.push(genreId.toString());
        }
    }
    loadTrending(currentType);
};

// Initialize page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrendsPage);
} else {
    initTrendsPage();
}

