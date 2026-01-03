// Anime page logic
import { renderHeader, renderFooter, renderMovieGrid, renderFilters, renderPagination } from './components.js';
import { getAnime, getMovieGenres, searchMulti } from './api.js';
import { showLoading, showError, initMobileMenu, updateAuthLinks, initSearch } from './utils.js';

const app = document.getElementById('app');
let currentPage = 1;
let totalPages = 1;
let currentType = 'movie'; // movie or tv
let selectedGenres = [];
let currentAnime = [];
let genres = [];
let isSearchMode = false;
let searchQuery = '';

async function initAnimePage() {
    try {
        app.innerHTML = '';
        app.insertAdjacentHTML('afterbegin', renderHeader());
        initMobileMenu();
        updateAuthLinks();

        const performSearch = (query) => {
            if (query) {
                isSearchMode = true;
                searchQuery = query;
                loadAnime(1, currentType);
            } else {
                isSearchMode = false;
                searchQuery = '';
                loadAnime(1, currentType);
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

        // Fetch genres (for potential filtering)
        const genresData = await getMovieGenres();
        genres = genresData.genres || [];

        // Load anime
        await loadAnime();

        app.insertAdjacentHTML('beforeend', renderFooter());

    } catch (error) {
        console.error('Error initializing anime page:', error);
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

async function loadAnime(page = 1, type = 'movie') {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    try {
        showLoading(mainContent);

        let data;
        if (isSearchMode) {
            data = await searchMulti(searchQuery, page);
        } else {
            data = await getAnime(type, page, selectedGenres);
        }

        // Filter results if search mode (only anime related if possible, but for now just show results)
        currentAnime = data.results || [];
        currentPage = data.page || 1;
        totalPages = Math.min(data.total_pages || 1, 500);
        currentType = type;

        renderContent();

    } catch (error) {
        console.error('Error loading anime:', error);
        showError(mainContent, 'Не удалось загрузить аниме');
    }
}

function renderContent() {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const isTV = currentType === 'tv';

    mainContent.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-6">
                ${isSearchMode ? `Результаты поиска: "${searchQuery}"` : 'Аниме'}
            </h1>
            
            ${isSearchMode ? '' : `
            <div class="mb-6 flex flex-wrap gap-2">
                <button 
                    onclick="window.changeAnimeType && window.changeAnimeType('movie')"
                    class="px-4 py-2 ${currentType === 'movie' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-full transition text-sm font-medium"
                >
                    Аниме фильмы
                </button>
                <button 
                    onclick="window.changeAnimeType && window.changeAnimeType('tv')"
                    class="px-4 py-2 ${currentType === 'tv' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-full transition text-sm font-medium"
                >
                    Аниме сериалы
                </button>
            </div>
            
            ${renderFilters(genres, selectedGenres)}
            `}
            
            <div id="movies-grid" class="mt-8">
                ${renderMovieGrid(currentAnime, isTV)}
            </div>
            
            ${renderPagination(currentPage, totalPages)}
        </div>
    `;

    // Set up global functions
    window.currentPageChange = (page) => {
        loadAnime(page, currentType);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.changeAnimeType = (type) => {
        loadAnime(1, type);
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
        loadAnime(1, currentType);
    };
}

// Initialize page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimePage);
} else {
    initAnimePage();
}

