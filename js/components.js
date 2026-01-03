// UI Components for rendering movie cards, banners, headers, etc.
import { formatRating, formatYear, truncateText, getImageUrl, getBackdropUrl, formatDate, isContentSafe } from './utils.js';

/**
 * Render header with navigation
 */
export function renderHeader() {
    return `
        <header class="bg-black bg-opacity-90 fixed w-full z-50 px-4 md:px-8 py-4">
            <nav class="flex items-center justify-between max-w-7xl mx-auto">
                <a href="index.html" class="text-xl md:text-2xl lg:text-3xl font-bold text-red-600 hover:text-red-700 transition flex items-center gap-2">
                    <svg class="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4h-2l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"></path></svg>
                    <span>Кинотеатр</span>
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
        <a href="details.html?id=${item.id}&type=${isActuallyTV ? 'tv' : 'movie'}" class="movie-card block group" data-id="${item.id}" data-type="${isActuallyTV ? 'tv' : 'movie'}">
            <div class="relative overflow-hidden rounded-lg shadow-lg">
                <img 
                    src="${posterUrl}" 
                    alt="${title}"
                    class="w-full h-auto transition duration-500 group-hover:scale-110"
                    loading="lazy"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div class="text-center px-4">
                        <p class="text-white text-sm mb-2">${overview}</p>
                        <div class="flex items-center justify-center space-x-4 text-white text-sm font-bold">
                            <span class="flex items-center gap-1"><svg class="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${rating}</span>
                            ${year ? `<span class="flex items-center gap-1"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${year}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-2">
                <h3 class="text-white font-semibold text-sm md:text-base line-clamp-2 leading-tight group-hover:text-red-500 transition">${title}</h3>
                <div class="flex items-center space-x-2 mt-1">
                    <span class="text-yellow-400 text-xs flex items-center gap-0.5"><svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${rating}</span>
                    ${year ? `<span class="text-gray-400 text-xs flex items-center gap-0.5"><svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${year}</span>` : ''}
                </div>
            </div>
        </a>
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
                                <svg class="w-4 h-4 md:w-5 md:h-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                <span class="font-semibold">${rating}</span>
                            </span>
                            ${year ? `<span class="flex items-center gap-1"><svg class="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${year}</span>` : ''}
                        </div>
                        <p class="text-white text-sm sm:text-base md:text-lg mb-4 md:mb-6 drop-shadow-md line-clamp-3 md:line-clamp-none">
                            ${overview || 'Описание отсутствует'}
                        </p>
                        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <a href="watch.html?id=${item.id}&type=${isActuallyTV ? 'tv' : 'movie'}" class="px-4 py-2 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition text-sm md:text-base text-center">
                                ▶ Смотреть
                            </a>
                            <a href="details.html?id=${item.id}&type=${isActuallyTV ? 'tv' : 'movie'}" class="px-4 py-2 sm:px-6 sm:py-3 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg border border-gray-600 transition text-sm md:text-base text-center">
                                ℹ Подробнее
                            </a>
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

/**
 * Render movie details page
 */
export function renderMovieDetails(item, type, credits = {}) {
    if (!item) return '';

    const isTV = type === 'tv';
    const crew = credits.crew || [];

    // Find directors or creators
    const directors = crew.filter(c => c.job === 'Director').map(d => d.name);
    const creators = item.created_by?.map(c => c.name) || [];
    const authors = isTV ? creators : directors;
    const title = isTV ? (item.name || item.original_name) : (item.title || item.original_title);
    const releaseDate = isTV ? item.first_air_date : item.release_date;
    const year = formatYear(releaseDate);
    const rating = formatRating(item.vote_average);
    const backdropUrl = getBackdropUrl(item.backdrop_path, 'original');
    const posterUrl = getImageUrl(item.poster_path, 'w500');

    // Status in library
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const libraryStatus = user.library?.[`${type}_${item.id}`] || 'none';

    const getStatusLabel = (status) => {
        const labels = {
            'none': 'Добавить в список',
            'watching': '<span class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Смотрю</span>',
            'planned': '<span class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> В планах</span>',
            'watched': '<span class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Просмотрено</span>',
            'dropped': '<span class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> Брошено</span>'
        };
        return labels[status] || 'Добавить в список';
    };

    return `
        <div class="relative min-h-screen max-w-full overflow-x-hidden">
            <!-- Background Backdrop -->
            <div class="absolute inset-0 h-[60vh] md:h-[80vh]">
                <img src="${backdropUrl}" class="w-full h-full object-cover opacity-30 mask-image-gradient" alt="">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            </div>

            <div class="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-16">
                <div class="flex flex-col md:flex-row gap-8 md:gap-12">
                    <!-- Left Column: Poster -->
                    <div class="w-[250px] md:w-[350px] mx-auto md:mx-0 flex-shrink-0">
                        <img src="${posterUrl}" class="w-full rounded-2xl shadow-2xl border border-gray-800" alt="${title}">
                        
                        <!-- Actions -->
                        <div class="mt-6 space-y-3">
                            <a href="watch.html?id=${item.id}&type=${type}" class="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 text-lg">
                                <span>▶ СМОТРЕТЬ</span>
                            </a>
                            
                            <!-- Status Selector -->
                            <div class="relative group/status w-full">
                                <button class="w-full py-3 bg-gray-900 border border-gray-700 hover:border-gray-500 text-white font-semibold rounded-xl transition flex items-center justify-between px-4">
                                    <span>${getStatusLabel(libraryStatus)}</span>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                <div class="absolute left-0 right-0 bottom-full bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden hidden group-hover/status:block z-50">
                                    <button onclick="window.updateStatus('${item.id}', '${type}', 'watching')" class="w-full px-4 py-3 text-left hover:bg-gray-800 text-white transition flex items-center space-x-3"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> <span>Смотрю</span></button>
                                    <button onclick="window.updateStatus('${item.id}', '${type}', 'planned')" class="w-full px-4 py-3 text-left hover:bg-gray-800 text-white transition flex items-center space-x-3"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>В планах</span></button>
                                    <button onclick="window.updateStatus('${item.id}', '${type}', 'watched')" class="w-full px-4 py-3 text-left hover:bg-gray-800 text-white transition flex items-center space-x-3"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>Просмотрено</span></button>
                                    <button onclick="window.updateStatus('${item.id}', '${type}', 'dropped')" class="w-full px-4 py-3 text-left hover:bg-gray-800 text-white transition flex items-center space-x-3"><svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>Брошено</span></button>
                                    <button onclick="window.updateStatus('${item.id}', '${type}', 'none')" class="w-full px-4 py-3 text-left hover:bg-gray-800 text-gray-400 transition flex items-center space-x-3 border-t border-gray-800"><svg class="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> <span>Удалить из списка</span></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Info -->
                    <div class="flex-1 min-w-0 text-white">
                        <div class="flex flex-wrap items-center gap-3 mb-4">
                            <span class="px-2 py-0.5 bg-red-600 text-[10px] font-bold rounded uppercase">${type === 'tv' ? 'Сериал' : 'Фильм'}</span>
                            <span class="text-gray-400 text-sm flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${year}</span>
                            <div class="flex items-center space-x-1">
                                <svg class="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                <span class="font-bold">${rating}</span>
                                <span class="text-gray-500 text-xs">(${item.vote_count})</span>
                            </div>
                        </div>
                        
                        <h1 class="text-3xl md:text-5xl lg:text-6xl font-black mb-4">${title}</h1>
                        <p class="text-gray-400 text-lg md:text-xl font-medium mb-6 italic">"${item.tagline || ''}"</p>
                        
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-3 border-b border-red-600 pb-1 w-fit">О сериале</h2>
                            <p class="text-gray-300 leading-relaxed text-lg">${item.overview || 'Описание отсутствует.'}</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm md:text-base mb-12">
                            <div><span class="text-gray-500">Оригинальное название:</span> <span class="ml-2">${item.original_title || item.original_name}</span></div>
                            <div><span class="text-gray-500">Жанры:</span> <span class="ml-2">${item.genres?.map(g => g.name).join(', ')}</span></div>
                            <div><span class="text-gray-500">${isTV ? 'Создатели' : 'Режиссер'}:</span> <span class="ml-2">${authors.join(', ') || 'Н/Д'}</span></div>
                            <div><span class="text-gray-500">Производство:</span> <span class="ml-2">${item.production_countries?.map(c => c.name).join(', ') || 'Н/Д'}</span></div>
                            <div><span class="text-gray-500">Длительность:</span> <span class="ml-2">${item.runtime ? item.runtime + ' мин.' : (item.episode_run_time && item.episode_run_time[0] ? item.episode_run_time[0] + ' мин. (сер.)' : 'Н/Д')}</span></div>
                            ${isTV ? `<div><span class="text-gray-500">Сезонов:</span> <span class="ml-2">${item.number_of_seasons}</span></div>` : ''}
                        </div>

                        <!-- Trailer Section -->
                        <div id="trailer-container" class="mb-16 w-full max-w-4xl">
                            <h2 class="text-2xl font-bold mb-6 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM10 7l6 4-6 4V7z"></path></svg> Трейлер
                            </h2>
                            <div id="trailer-player" class="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                                <div class="w-full h-full flex items-center justify-center text-gray-500">Загрузка трейлера...</div>
                            </div>
                        </div>

                        <!-- Cast Section -->
                        <div id="cast-container" class="w-full overflow-hidden">
                            <h2 class="text-2xl font-bold mb-6 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Актеры и создатели
                            </h2>
                            <div id="cast-list" class="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                                <div class="text-gray-500">Загрузка актеров...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render cast list
 */
export function renderCast(cast) {
    if (!cast || cast.length === 0) return '<p class="text-gray-500">Информация об актерах недоступна</p>';

    return cast.slice(0, 15).map(person => `
        <div class="flex-shrink-0 w-24 md:w-32 group">
            <div class="aspect-[2/3] mb-3 rounded-xl overflow-hidden border border-gray-800 group-hover:border-red-600 transition duration-300 shadow-lg">
                <img 
                    src="${getImageUrl(person.profile_path, 'w185')}" 
                    class="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                    alt="${person.name}"
                    onerror="this.src='https://via.placeholder.com/185x278/1a1a1a/666666?text=Нет+фото'"
                >
            </div>
            <div class="text-sm font-bold text-white truncate group-hover:text-red-500 transition">${person.name}</div>
            <div class="text-[10px] md:text-xs text-gray-500 truncate">${person.character}</div>
        </div>
    `).join('');
}

/**
 * Render trailer iframe
 */
export function renderTrailer(videos) {
    if (!videos || videos.length === 0) {
        return '<div class="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">Трейлер не найден</div>';
    }

    // Prefer Official Trailer, then Trailer, then any Video
    const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ||
        videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
        videos.find(v => v.site === 'YouTube');

    if (!trailer) {
        return '<div class="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">Трейлер на YouTube не найден</div>';
    }

    return `
        <iframe 
            src="https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0" 
            class="w-full h-full" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
        ></iframe>
    `;
}
