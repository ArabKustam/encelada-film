// TV Series page logic
import { renderHeader, renderFooter, renderMovieGrid, renderFilters, renderPagination } from './components.js';
import { getTVSeries, getPopularTVSeries, getTVGenres } from './api.js';
import { showLoading, showError, initMobileMenu, updateAuthLinks, initSearch } from './utils.js';
import { searchTVSeries } from './api.js';

const app = document.getElementById('app');
let currentPage = 1;
let totalPages = 1;
let selectedGenres = [];
let currentSeries = [];
let genres = [];
let isSearchMode = false;
let searchQuery = '';

async function initSeriesPage() {
    try {
        app.innerHTML = '';
        app.insertAdjacentHTML('afterbegin', renderHeader());
        initMobileMenu();
        updateAuthLinks();

        const performSearch = (query) => {
            if (query) {
                isSearchMode = true;
                searchQuery = query;
                loadSeries(1);
            } else {
                isSearchMode = false;
                searchQuery = '';
                loadSeries(1);
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
            const data = await searchTVSeries(query);
            return (data.results || []).filter(s => !s.genre_ids?.includes(16));
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
        const genresData = await getTVGenres();
        genres = (genresData.genres || []).filter(g => g.id !== 16);

        // Load TV series
        await loadSeries();

        app.insertAdjacentHTML('beforeend', renderFooter());

    } catch (error) {
        console.error('Error initializing series page:', error);
        app.innerHTML = '';
        app.insertAdjacentHTML('afterbegin', renderHeader());
        initMobileMenu();
        updateAuthLinks();
        const mainContent = document.createElement('main');
        mainContent.className = 'pt-16';
        app.appendChild(mainContent);
        showError(mainContent, 'Не удалось загрузить данные');
        app.insertAdjacentHTML('beforeend', renderFooter());
    }
}

async function loadSeries(page = 1, genreId = '') {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    try {
        showLoading(mainContent);

        let data;
        if (isSearchMode) {
            data = await searchTVSeries(searchQuery, page);
            // Client-side filter for Anime/Animation in search
            data.results = (data.results || []).filter(s => !s.genre_ids?.includes(16));
        } else if (selectedGenres.length > 0) {
            data = await getTVSeries({
                page,
                with_genres: selectedGenres.join(','),
                sort_by: 'popularity.desc',
                without_genres: '16'
            });
        } else {
            data = await getPopularTVSeries(page);
        }

        currentSeries = data.results || [];
        currentPage = data.page || 1;
        totalPages = Math.min(data.total_pages || 1, 500);

        renderContent();

    } catch (error) {
        console.error('Error loading series:', error);
        showError(mainContent, 'Не удалось загрузить сериалы');
    }
}

function renderContent() {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-6">
                ${isSearchMode ? `Результаты поиска: "${searchQuery}"` : 'Сериалы'}
            </h1>
            
            ${isSearchMode ? '' : renderFilters(genres, selectedGenres)}
            
            <div id="movies-grid">
                ${renderMovieGrid(currentSeries, true)}
            </div>
            
            ${renderPagination(currentPage, totalPages, (page) => {
        loadSeries(page, currentGenre);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })}
        </div>
    `;

    window.currentPageChange = (page) => {
        loadSeries(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        loadSeries(1);
    };
}

// Initialize page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSeriesPage);
} else {
    initSeriesPage();
}

