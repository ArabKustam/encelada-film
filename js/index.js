// Main page logic
import { renderHeader, renderFooter, renderHeroBanner, renderMovieRow } from './components.js';
import { getTrending, getPopularMovies, getPopularTVSeries, getTopRatedMovies, getAnime } from './api.js';
import { showLoading, showError, initMobileMenu, updateAuthLinks, initSearch } from './utils.js';
import { searchMulti } from './api.js';

const app = document.getElementById('app');
let isSearchActive = false;

async function initHomePage() {
    try {
        // Sync user data if logged in
        const { syncUser } = await import('./api.js');
        await syncUser();

        // Clear app and render structure
        app.innerHTML = '';

        // Render Header
        app.insertAdjacentHTML('afterbegin', renderHeader());
        initMobileMenu();
        updateAuthLinks();

        // Apply background/settings
        const { applyGlobalSettings } = await import('./utils.js');
        applyGlobalSettings();

        const performSearch = (query) => {
            if (query) {
                renderSearchResults(query);
            } else {
                initHomePage();
            }
        };

        // Check for search query in URL
        const urlParams = window.location.search ? new URLSearchParams(window.location.search) : null;
        const searchQueryFromUrl = urlParams ? urlParams.get('search') : null;
        if (searchQueryFromUrl) {
            isSearchActive = true;
        }

        initSearch(performSearch, async (query) => {
            const data = await searchMulti(query);
            return data.results || [];
        });

        window.addEventListener('executeSearch', (e) => {
            performSearch(e.detail);
            document.querySelectorAll('.search-live-results').forEach(c => c.classList.add('hidden'));
        });

        // Ensure main container exists
        let mainContent = document.querySelector('main');
        if (!mainContent) {
            mainContent = document.createElement('main');
            mainContent.className = 'pt-16';
            app.appendChild(mainContent);
        }

        // Check for search query in URL and execute
        if (searchQueryFromUrl) {
            await renderSearchResults(searchQueryFromUrl);
            app.insertAdjacentHTML('beforeend', renderFooter()); // Add footer after results
            return; // Don't load default homepage content
        }

        showLoading(mainContent);

        // 1. Fetch Trending FIRST for Hero Banner
        const trendingData = await getTrending('all', 'day');
        trendingData.results = trendingData.results.filter(item => (item.vote_count || 0) >= 50);
        const featuredMovie = trendingData.results[0];

        // 2. Render Hero Banner immediately
        mainContent.innerHTML = renderHeroBanner(featuredMovie);

        // 3. Create content container for rows
        const contentContainer = document.createElement('div');
        contentContainer.className = 'py-8 md:py-12';
        mainContent.appendChild(contentContainer);

        // 4. Render recommendations (from trending) immediately
        const recommendations = trendingData.results.slice(1, 11);
        contentContainer.innerHTML += renderMovieRow(recommendations, 'Рекомендации для вас');

        // 5. Fetch everything else in parallel
        Promise.all([
            getPopularMovies(1),
            getPopularTVSeries(1),
            getTopRatedMovies(1),
            getAnime('tv', 1)
        ]).then(([popularMoviesData, popularTVData, topRatedData, animeData]) => {
            // Render rows as they come (or all together here for simplicity but after banner)

            // Render Recent History if exists
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.history && user.history.length > 0) {
                // Prepend history
                const historyHtml = renderMovieRow(user.history, 'Продолжить просмотр');
                contentContainer.insertAdjacentHTML('afterbegin', historyHtml);
            }

            contentContainer.innerHTML += renderMovieRow(popularMoviesData.results.slice(0, 10), 'Популярные фильмы');
            contentContainer.innerHTML += renderMovieRow(popularTVData.results.slice(0, 10), 'Популярные сериалы', true);
            contentContainer.innerHTML += renderMovieRow(animeData.results.slice(0, 10), 'Популярное аниме', true);
            contentContainer.innerHTML += renderMovieRow(topRatedData.results.slice(0, 10), 'Лучшие фильмы');
        }).catch(err => {
            console.error('Error fetching additional rows:', err);
        });

        // Render footer
        app.insertAdjacentHTML('beforeend', renderFooter());


    } catch (error) {
        console.error('Error initializing home page:', error);
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

// Initialize page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}
async function renderSearchResults(query) {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    try {
        showLoading(mainContent);
        const data = await searchMulti(query);
        const results = data.results || [];

        const { renderMovieGrid } = await import('./components.js');
        mainContent.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div class="flex items-center justify-between mb-8">
                    <h1 class="text-2xl md:text-4xl font-bold text-white">Результаты поиска: "${query}"</h1>
                    <button onclick="location.href='index.html'" class="text-sm text-red-600 hover:underline">Вернуться на главную</button>
                </div>
                ${renderMovieGrid(results)}
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        showError(mainContent, 'Ошибка при поиске');
    }
}

