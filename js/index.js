// Main page logic
import { renderHeader, renderFooter, renderHeroBanner, renderMovieRow } from './components.js';
import { getTrending, getPopularMovies, getPopularTVSeries, getTopRatedMovies, getAnime } from './api.js';
import { showLoading, showError, initMobileMenu, updateAuthLinks, initSearch } from './utils.js';
import { searchMulti } from './api.js';

const app = document.getElementById('app');
let isSearchActive = false;

async function initHomePage() {
    try {
        // Clear app and render structure
        app.innerHTML = '';

        // Render Header
        app.insertAdjacentHTML('afterbegin', renderHeader());
        initMobileMenu();
        updateAuthLinks();

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

        // Fetch data in parallel
        const [trendingData, popularMoviesData, popularTVData, topRatedData] = await Promise.all([
            getTrending('all', 'day'),
            getPopularMovies(1),
            getPopularTVSeries(1),
            getTopRatedMovies(1)
        ]);

        // Filter trending to avoid untranslated obscure items
        trendingData.results = trendingData.results.filter(item => (item.vote_count || 0) >= 50);

        // Get featured movie for hero banner
        const featuredMovie = trendingData.results[0] || popularMoviesData.results[0];

        // Render hero banner
        mainContent.innerHTML = renderHeroBanner(featuredMovie);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'py-8 md:py-12';
        mainContent.appendChild(contentContainer);

        // Render Recent History if exists
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.history && user.history.length > 0) {
            contentContainer.innerHTML += renderMovieRow(user.history, 'Продолжить просмотр');
        }

        // Render recommendations (using trending)
        const recommendations = trendingData.results.slice(1, 11);
        contentContainer.innerHTML += renderMovieRow(recommendations, 'Рекомендации для вас');

        // Render popular movies
        contentContainer.innerHTML += renderMovieRow(popularMoviesData.results.slice(0, 10), 'Популярные фильмы');

        // Render popular TV series
        contentContainer.innerHTML += renderMovieRow(popularTVData.results.slice(0, 10), 'Популярные сериалы', true);

        // Render popular anime
        const animeData = await getAnime('tv', 1);
        contentContainer.innerHTML += renderMovieRow(animeData.results.slice(0, 10), 'Популярное аниме', true);

        // Render top rated movies
        contentContainer.innerHTML += renderMovieRow(topRatedData.results.slice(0, 10), 'Лучшие фильмы');

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

