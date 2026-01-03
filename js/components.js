// UI Components for rendering movie cards, banners, headers, etc.
import { formatRating, formatYear, truncateText, getImageUrl, getBackdropUrl, formatDate, isContentSafe } from './utils.js';

/**
 * Render header with navigation
 */
export function renderHeader() {
    return `
        <header class="bg-black bg-opacity-90 fixed w-full z-50 px-4 md:px-8 py-4">
            <nav class="flex items-center justify-between max-w-7xl mx-auto">
                <a href="index.html" class="text-xl md:text-2xl lg:text-3xl font-bold text-red-600 hover:text-red-700 transition">
                    🎬 Кинотеатр
                </a>
                
                <!-- Search Bar -->
                <div class="hidden lg:flex items-center flex-1 max-w-md mx-8">
                    <div class="relative w-full">
                        <input 
                            type="text" 
                            id="search-input"
                            placeholder="Поиск фильмов, сериалов..." 
                            class="w-full bg-gray-900 text-white rounded-full py-2 px-10 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                        >
                        <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <a href="index.html" class="text-white hover:text-red-600 transition">Главная</a>
                    <a href="trends.html" class="text-white hover:text-red-600 transition">Тренды</a>
                    <a href="movies.html" class="text-white hover:text-red-600 transition">Фильмы</a>
                    <a href="series.html" class="text-white hover:text-red-600 transition">Сериалы</a>
                    <a href="anime.html" class="text-white hover:text-red-600 transition">Аниме</a>
                </div>
                <!-- Profile/Auth -->
                <div class="hidden md:flex items-center space-x-4">
                    <button id="auth-btn" class="text-white hover:text-red-600 transition flex items-center space-x-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span id="profile-text">Войти</span>
                    </button>
                </div>
                <!-- Mobile Menu Button -->
                <button 
                    id="mobile-menu-btn"
                    class="md:hidden text-white hover:text-red-600 transition p-2"
                    aria-label="Меню"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </nav>
            <!-- Mobile Navigation -->
            <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4">
                <div class="flex flex-col space-y-3">
                    <a href="index.html" class="text-white hover:text-red-600 transition py-2">Главная</a>
                    <a href="trends.html" class="text-white hover:text-red-600 transition py-2">Тренды</a>
                    <a href="movies.html" class="text-white hover:text-red-600 transition py-2">Фильмы</a>
                    <a href="series.html" class="text-white hover:text-red-600 transition py-2">Сериалы</a>
                    <a href="anime.html" class="text-white hover:text-red-600 transition py-2">Аниме</a>
                    <a href="#" id="mobile-auth-btn" class="text-white hover:text-red-600 transition py-2">Профиль</a>
                    <div class="pt-2">
                        <input 
                            type="text" 
                            id="mobile-search-input"
                            placeholder="Поиск..." 
                            class="w-full bg-gray-900 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                    </div>
                </div>
            </div>
        </header>
    `;
}

/**
 * Render footer
 */
export function renderFooter() {
    return `
        <footer class="bg-black text-gray-400 py-8 mt-16">
            <div class="max-w-7xl mx-auto px-4 md:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-white text-lg font-semibold mb-4">О нас</h3>
                        <p class="text-sm">Онлайн кинотеатр с большой коллекцией фильмов, сериалов и аниме.</p>
                    </div>
                    <div>
                        <h3 class="text-white text-lg font-semibold mb-4">Навигация</h3>
                        <ul class="space-y-2 text-sm">
                            <li><a href="index.html" class="hover:text-red-600 transition">Главная</a></li>
                            <li><a href="trends.html" class="hover:text-red-600 transition">Тренды</a></li>
                            <li><a href="movies.html" class="hover:text-red-600 transition">Фильмы</a></li>
                            <li><a href="series.html" class="hover:text-red-600 transition">Сериалы</a></li>
                            <li><a href="anime.html" class="hover:text-red-600 transition">Аниме</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-white text-lg font-semibold mb-4">Контакты</h3>
                        <p class="text-sm">Данные предоставлены The Movie Database (TMDB)</p>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; 2024 Онлайн Кинотеатр. Все права защищены.</p>
                </div>
            </div>
        </footer>
    `;
}

/**
 * Render movie/TV card
 */
export function renderMovieCard(item, isTV = false) {
    if (!item) return '';

    // Auto-detect type if media_type is present (common in trending)
    const isActuallyTV = isTV || item.media_type === 'tv';

    // Fallback chain for title: Russian -> Original -> Placeholder
    const title = isActuallyTV
        ? (item.name || item.original_name || 'Без названия')
        : (item.title || item.original_title || 'Без названия');

    const releaseDate = isActuallyTV ? item.first_air_date : item.release_date;
    const year = formatYear(releaseDate);
    const rating = formatRating(item.vote_average);
    const posterUrl = getImageUrl(item.poster_path, 'w300');
    const overview = truncateText(item.overview, 100) || 'Описание отсутствует';

    return `
        <div class="movie-card cursor-pointer" data-id="${item.id}" data-type="${isTV ? 'tv' : 'movie'}">
            <div class="relative group">
                <img 
                    src="${posterUrl}" 
                    alt="${title}"
                    class="w-full h-auto rounded-lg shadow-lg"
                    loading="lazy"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div class="text-center px-4">
                        <p class="text-white text-sm mb-2">${overview}</p>
                        <div class="flex items-center justify-center space-x-4 text-white text-sm">
                            <span>⭐ ${rating}</span>
                            ${year ? `<span>📅 ${year}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-2">
                <h3 class="text-white font-semibold text-sm md:text-base line-clamp-2">${title}</h3>
                <div class="flex items-center space-x-2 mt-1">
                    <span class="text-yellow-400 text-xs">⭐ ${rating}</span>
                    ${year ? `<span class="text-gray-400 text-xs">${year}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render hero banner with featured movie/TV
 */
export function renderHeroBanner(item, isTV = false) {
    if (!item || !isContentSafe(item)) return '';

    // Auto-detect type
    const isActuallyTV = isTV || item.media_type === 'tv' || !!item.name;

    // Fallback chain for title: Russian -> Original -> Placeholder
    const title = isActuallyTV
        ? (item.name || item.original_name || 'Без названия')
        : (item.title || item.original_title || 'Без названия');

    const releaseDate = isActuallyTV ? item.first_air_date : item.release_date;
    const year = formatYear(releaseDate);
    const rating = formatRating(item.vote_average);
    const backdropUrl = getBackdropUrl(item.backdrop_path, 'original');
    const overview = truncateText(item.overview, 300) || 'Описание на русском языке пока отсутствует для этого фильма. TMDB работает над переводом.';

    return `
        <div class="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full overflow-hidden">
            <div 
                class="absolute inset-0 bg-cover bg-center"
                style="background-image: url('${backdropUrl}')"
            ></div>
            <div class="hero-overlay absolute inset-0"></div>
            <div class="relative z-10 h-full flex items-center">
                <div class="max-w-7xl mx-auto px-4 md:px-8 w-full">
                    <div class="max-w-2xl">
                        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
                            ${title}
                        </h1>
                        <div class="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4 text-white text-sm md:text-base">
                            <span class="flex items-center space-x-1">
                                <span>⭐</span>
                                <span class="font-semibold">${rating}</span>
                            </span>
                            ${year ? `<span>📅 ${year}</span>` : ''}
                        </div>
                        <p class="text-white text-sm sm:text-base md:text-lg mb-4 md:mb-6 drop-shadow-md line-clamp-3 md:line-clamp-none">
                            ${overview || 'Описание отсутствует'}
                        </p>
                        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <button class="px-4 py-2 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition text-sm md:text-base">
                                ▶ Смотреть
                            </button>
                            <button class="px-4 py-2 sm:px-6 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded transition text-sm md:text-base">
                                ℹ Подробнее
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render movie row with horizontal scrolling
 */
export function renderMovieRow(movies, title, isTV = false) {
    if (!movies || movies.length === 0) {
        return '';
    }

    const rowId = `row-${title.replace(/\s+/g, '-').toLowerCase()}`;
    const processedMovies = movies.filter(isContentSafe);

    if (processedMovies.length === 0) return '';

    return `
        <section class="mb-8 md:mb-12">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 px-4 md:px-8">
                ${title}
            </h2>
            <div class="relative group/row">
                <div 
                    id="${rowId}" 
                    class="flex space-x-4 overflow-x-auto pb-4 px-4 md:px-8 scrollbar-hide"
                    style="scroll-behavior: smooth;"
                >
                    ${processedMovies.map(movie => `
                        <div class="flex-shrink-0 w-[150px] md:w-[200px]">
                            ${renderMovieCard(movie, isTV)}
                        </div>
                    `).join('')}
                </div>
                <button 
                    onclick="document.getElementById('${rowId}').scrollBy({left: -400, behavior: 'smooth'})"
                    class="absolute left-0 top-0 bottom-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 opacity-0 group-hover/row:opacity-100 transition z-10"
                >
                    ‹
                </button>
                <button 
                    onclick="document.getElementById('${rowId}').scrollBy({left: 400, behavior: 'smooth'})"
                    class="absolute right-0 top-0 bottom-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 opacity-0 group-hover/row:opacity-100 transition z-10"
                >
                    ›
                </button>
            </div>
        </section>
    `;
}

/**
 * Render grid of movies
 */
export function renderMovieGrid(movies, isTV = false) {
    if (!movies || movies.length === 0) {
        return '<p class="text-gray-400 text-center py-20">Ничего не найдено</p>';
    }

    // Secondary local safety filter
    const processedMovies = movies.filter(isContentSafe);

    if (processedMovies.length === 0) {
        return '<p class="text-gray-400 text-center py-20">Контент скрыт фильтром безопасности</p>';
    }

    return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            ${processedMovies.map(movie => renderMovieCard(movie, isTV)).join('')}
        </div>
    `;
}

/**
 * Render pagination controls
 */
export function renderPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return `
        <div class="flex justify-center items-center space-x-2 mt-8 mb-8">
            ${currentPage > 1 ? `
                <button 
                    onclick="window.currentPageChange && window.currentPageChange(${currentPage - 1})"
                    class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                >
                    ‹ Назад
                </button>
            ` : ''}
            
            ${pages.map(page => `
                <button 
                    onclick="window.currentPageChange && window.currentPageChange(${page})"
                    class="px-4 py-2 ${page === currentPage ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded transition"
                >
                    ${page}
                </button>
            `).join('')}
            
            ${currentPage < totalPages ? `
                <button 
                    onclick="window.currentPageChange && window.currentPageChange(${currentPage + 1})"
                    class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                >
                    Вперед ›
                </button>
            ` : ''}
        </div>
    `;
}

/**
 * Render filters with multi-select support
 */
export function renderFilters(genres, selectedGenres = [], onFilterChange) {
    const isSelected = (id) => selectedGenres.includes(id.toString());

    return `
        <div class="mb-6 px-4 md:px-8">
            <div class="flex flex-wrap gap-2">
                <button 
                    onclick="window.currentFilterChange && window.currentFilterChange('')"
                    class="px-4 py-2 ${selectedGenres.length === 0 ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-full transition text-sm font-medium"
                >
                    Все
                </button>
                ${genres.map(genre => `
                    <button 
                        onclick="window.currentFilterChange && window.currentFilterChange('${genre.id}')"
                        class="px-4 py-2 ${isSelected(genre.id) ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-full transition text-sm font-medium"
                    >
                        ${genre.name}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

