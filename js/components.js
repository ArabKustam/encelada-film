// UI Components for rendering movie cards, banners, headers, etc.
import { formatRating, formatYear, truncateText, getImageUrl, getBackdropUrl, formatDate, isContentSafe } from './utils.js';

/**
 * Render header with navigation
 */
export function renderHeader() {
    return `
        <header class="bg-black bg-opacity-90 fixed w-full z-50 px-4 md:px-8 py-4">
            <nav class="flex items-center justify-between max-w-7xl mx-auto">
                <a href="index.html" class="text-xl md:text-2xl lg:text-3xl font-black text-white hover:text-red-500 transition flex items-center gap-3 group">
                    <div class="relative w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-red-600 transition shadow-lg">
                        <img src="images/logo.webp" alt="Encelada Logo" class="w-full h-full object-cover">
                    </div>
                    <span class="tracking-tighter uppercase">Encelada</span>
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
                        <div id="header-avatar-container" class="w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
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
                        <p class="text-sm">Encelada — онлайн кинотеатр с большой коллекцией фильмов, сериалов и аниме.</p>
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
                    <p>&copy; 2024 Encelada. Все права защищены.</p>
                </div>
            </div>
        </footer>
    `;
}

export function renderMovieCard(item, isTV = false) {
    if (!item || !isContentSafe(item)) return '';

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const settings = user.settings || {};
    const cardSize = settings.card_size || 'medium';
    const hoverClass = settings.card_hover_disabled ? 'hover-disabled' : '';

    const isActuallyTV = isTV || item.media_type === 'tv' || !!item.name;
    const title = isActuallyTV ? (item.name || 'Без названия') : (item.title || 'Без названия');
    const posterUrl = getImageUrl(item.poster_path || item.poster, 'w500');
    const rating = formatRating(item.vote_average || item.rating);
    const releaseDate = isActuallyTV ? item.first_air_date : item.release_date;
    const year = formatYear(releaseDate);
    const overview = truncateText(item.overview, 100) || 'Описание отсутствует';

    return `
        <a href="details.html?id=${item.id}&type=${isActuallyTV ? 'tv' : 'movie'}" 
           class="movie-card group block flex-shrink-0 size-${cardSize} ${hoverClass}"
           data-id="${item.id}" data-type="${isActuallyTV ? 'tv' : 'movie'}">
            <div class="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-800 transition">
                <img 
                    src="${posterUrl}" 
                    alt="${title}"
                    class="w-full h-full object-cover transition duration-500 ${settings.card_hover_disabled ? '' : 'group-hover:scale-110 group-hover:opacity-40'}"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'"
                >
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition p-4 bg-black/60">
                    <div class="text-center">
                        <p class="text-white text-xs mb-2 line-clamp-4">${overview}</p>
                        <div class="flex items-center justify-center space-x-4 text-white text-xs font-bold">
                            <span class="flex items-center gap-1"><svg class="w-3 h-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${rating}</span>
                            ${year ? `<span class="flex items-center gap-1"><svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${year}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-2 text-center md:text-left">
                <h3 class="text-white font-semibold text-xs md:text-sm line-clamp-2 leading-tight group-hover:text-red-500 transition">${title}</h3>
                <div class="flex items-center justify-center md:justify-start space-x-2 mt-1">
                    <span class="text-yellow-400 text-[10px] flex items-center gap-0.5"><svg class="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${rating}</span>
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
    const backdropUrl = getBackdropUrl(item.backdrop_path, 'w1280');
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
                    ${processedMovies.map(movie => renderMovieCard(movie, isTV)).join('')}
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

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const cardSize = user.settings?.card_size || 'medium';

    // Widths mapping for dynamic grid
    const widths = {
        'small': '120px',
        'medium': '160px',
        'large': '200px'
    };
    const minWidth = widths[cardSize];

    return `
        <div class="grid gap-4 md:gap-6 px-4 md:px-8" style="grid-template-columns: repeat(auto-fill, minmax(${minWidth}, 1fr))">
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
                                <div class="absolute left-0 right-0 top-full bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden hidden group-hover/status:block z-50">
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
        <div class="relative w-full h-full bg-black group/trailer">
            <!-- Loader Spinner -->
            <div class="absolute inset-0 flex items-center justify-center z-0">
                <div class="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
            </div>
            
            <iframe 
                src="https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0" 
                class="relative z-10 w-full h-full" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
            ></iframe>
        </div>
    `;
}

/**
 * Render 10-star rating bar
 */
export function renderRatingBar(itemId, type, currentRating = null) {
    const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const isRated = currentRating !== null;

    return `
        <div id="rating-container-${itemId}" class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 mb-8 max-w-2xl">
            <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ${isRated ? 'Ваша оценка' : 'Оцените этот проект'}
            </h3>
            
            <div class="${isRated ? 'hidden' : 'block'}" id="rating-selector">
                <div class="flex items-center gap-1 mb-2">
                    ${stars.map(s => `
                        <button 
                            onclick="window.handleRate('${itemId}', '${type}', ${s})"
                            onmouseover="window.highlightStars(${s})"
                            onmouseout="window.resetStars()"
                            data-star="${s}"
                            class="star-btn p-1 text-gray-700 hover:text-yellow-500 transition-colors"
                        >
                            <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        </button>
                    `).join('')}
                </div>
                <div class="text-xs text-gray-500 font-bold uppercase transition" id="rating-label">Наведите на звезды</div>
            </div>

            <div class="${isRated ? 'flex' : 'hidden'} items-center justify-between" id="rating-display">
                <div class="flex items-center gap-3">
                    <span class="text-3xl font-black text-white">${currentRating}</span>
                    <span class="text-gray-600 text-sm font-bold uppercase tracking-tighter">/ 10 звезд</span>
                </div>
                <button onclick="window.showRatingSelector()" class="text-xs font-black text-gray-500 hover:text-red-500 uppercase transition border-b border-gray-800 hover:border-red-500">Изменить оценку</button>
            </div>
        </div>
    `;
}

/**
 * Render comments section
 */
export function renderCommentsSection(mediaId, mediaType, user = null) {
    return `
        <div class="mt-12 border-t border-gray-900 pt-12">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-black flex items-center gap-3">
                    <span class="w-2 h-8 bg-red-600 rounded-full"></span>
                    Комментарии
                </h2>
                <button 
                    onclick="window.toggleComments()" 
                    id="toggle-comments-btn"
                    class="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-xl border border-gray-800 text-white font-bold transition group"
                >
                    <span id="toggle-comments-text">Открыть комментарии</span>
                    <svg id="eye-icon" class="w-6 h-6 text-gray-500 group-hover:text-red-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path id="eye-open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path id="eye-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path id="eye-closed" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.046m4.596-4.596A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.105-2.105L3 3" />
                    </svg>
                </button>
            </div>

            <div id="comments-container" class="hidden space-y-8 animate-fade-in">
                ${user ? `
                    <div class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
                        <textarea 
                            id="comment-textarea" 
                            maxlength="1500"
                            placeholder="Напишите свое мнение..." 
                            class="w-full bg-gray-800/50 text-white rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-600 transition border border-gray-700 font-medium"
                        ></textarea>
                        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <div class="relative">
                                    <input type="checkbox" id="spoiler-check" class="sr-only peer">
                                    <div class="w-6 h-6 bg-gray-800 border-2 border-gray-700 rounded-md peer-checked:bg-red-600 peer-checked:border-red-600 transition"></div>
                                    <svg class="absolute inset-0 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <span class="text-sm font-bold text-gray-500 group-hover:text-red-500 transition uppercase tracking-widest">ЕСТЬ СПОЙЛЕРЫ</span>
                            </label>
                            <div class="flex items-center gap-4 w-full sm:w-auto">
                                <span id="char-count" class="text-xs text-gray-600 font-bold">1500 символов</span>
                                <button 
                                    onclick="window.submitComment('${mediaId}', '${mediaType}')"
                                    class="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition shadow-lg shadow-red-900/20"
                                >
                                    ОТПРАВИТЬ
                                </button>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="bg-red-900/10 border border-red-900/20 p-8 rounded-2xl text-center">
                        <p class="text-red-500 font-bold mb-4">Чтобы оставлять комментарии, нужно войти в аккаунт</p>
                        <button onclick="window.showAuthModal()" class="px-8 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">Войти</button>
                    </div>
                `}

                <div id="comments-list" class="space-y-6">
                    <!-- Loaded dynamically -->
                </div>
            </div>
        </div>
    `;
}

/**
 * Render individual comment
 */
export function renderCommentItem(comment, currentUserId = null, level = 0, hasReplies = false, repliesHtml = '') {
    const isSpoiler = comment.isSpoiler;
    const hasLiked = comment.likes?.includes(currentUserId);
    const hasDisliked = comment.dislikes?.includes(currentUserId);
    const date = new Date(comment.timestamp).toLocaleDateString();

    const indentation = level > 0 ? `ml-${Math.min(level * 4, 12)} md:ml-${Math.min(level * 8, 20)}` : '';
    const borderClass = level > 0 ? 'border-l-2 border-gray-800 pl-4 md:pl-8 mt-4' : '';

    return `
        <div class="comment-branch ${indentation} ${borderClass}">
            <div class="comment-item bg-gray-900/20 p-4 md:p-6 rounded-2xl border border-gray-800 group" id="comment-${comment.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center font-black text-white text-base md:text-lg shadow-lg flex-shrink-0">
                            ${comment.username[0].toUpperCase()}
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="font-black text-white hover:text-red-500 transition cursor-pointer truncate">${comment.username}</span>
                                ${comment.userRating ? `
                                    <span class="flex items-center gap-0.5 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md text-[10px] font-black">
                                        ${comment.userRating} <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    </span>
                                ` : ''}
                            </div>
                            <div class="text-[10px] text-gray-600 font-bold uppercase tracking-widest">${date}</div>
                        </div>
                    </div>
                </div>

                <div class="relative">
                    ${isSpoiler ? `
                        <div class="spoiler-container relative">
                            <p class="text-gray-300 text-sm md:text-base leading-relaxed font-medium transition duration-500 blur-md select-none" id="text-${comment.id}">
                                ${comment.text}
                            </p>
                            <div 
                                onclick="window.revealSpoiler('${comment.id}')"
                                id="reveal-${comment.id}"
                                class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl cursor-pointer hover:bg-black/20 transition group/spoiler"
                            >
                                <span class="px-3 py-1.5 bg-red-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest group-hover/spoiler:scale-110 transition">Открыть спойлер</span>
                            </div>
                        </div>
                    ` : `
                        <p class="text-gray-300 text-sm md:text-base leading-relaxed font-medium">${comment.text}</p>
                    `}
                </div>

                <div class="mt-4 md:mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-800/50 pt-4">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center bg-gray-800/50 rounded-lg p-0.5 border border-gray-800">
                            <button 
                                onclick="window.vote('${comment.id}', 'like')"
                                class="p-1.5 md:p-2 transition ${hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}"
                                title="Нравится"
                            >
                                <svg class="w-4 h-4 md:w-5 md:h-5" fill="${hasLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.708C19.743 10 20.5 10.895 20.5 12c0 .412-.1.82-.3 1.2l-2.292 4.584C17.508 18.584 16.75 19 16 19H9V10l3-7 1.5 1.5V10zM9 19H4V10h5V19z"></path></svg>
                            </button>
                            <span class="text-[10px] md:text-xs font-black text-white px-1 md:px-2">${(comment.likes?.length || 0) - (comment.dislikes?.length || 0)}</span>
                            <button 
                                onclick="window.vote('${comment.id}', 'dislike')"
                                class="p-1.5 md:p-2 transition ${hasDisliked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}"
                                title="Не нравится"
                            >
                                <svg class="w-4 h-4 md:w-5 md:h-5" fill="${hasDisliked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24" style="transform: rotate(180deg)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.708C19.743 10 20.5 10.895 20.5 12c0 .412-.1.82-.3 1.2l-2.292 4.584C17.508 18.584 16.75 19 16 19H9V10l3-7 1.5 1.5V10zM9 19H4V10h5V19z"></path></svg>
                            </button>
                        </div>
                        <button onclick="window.replyTo('${comment.id}', '${comment.username}')" class="text-[9px] md:text-xs font-black text-gray-500 hover:text-red-500 uppercase transition tracking-widest">ОТВЕТИТЬ</button>
                    </div>

                    ${hasReplies ? `
                        <button 
                            id="toggle-btn-${comment.id}"
                            onclick="window.toggleBranch('${comment.id}')"
                            class="flex items-center gap-2 text-[9px] md:text-xs font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition"
                        >
                            <span>Показать ответы</span>
                            <svg class="w-3 h-3 md:w-4 md:h-4 toggle-indicator transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
            
            ${hasReplies ? `
                <div id="branch-${comment.id}" class="hidden">
                    ${repliesHtml}
                </div>
            ` : ''}
        </div>
    `;
}
