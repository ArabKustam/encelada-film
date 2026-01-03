// Utility functions for formatting and error handling

/**
 * Format movie rating
 */
export function formatRating(rating) {
    if (!rating) return 'Н/Д';
    return rating.toFixed(1);
}

/**
 * Format date to readable format
 */
export function formatDate(dateString) {
    if (!dateString) return 'Дата неизвестна';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

/**
 * Format date to year only
 */
export function formatYear(dateString) {
    if (!dateString) return '';
    try {
        return new Date(dateString).getFullYear();
    } catch (e) {
        return '';
    }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Check if content is safe to display (NSFW filtering)
 */
export function isContentSafe(item) {
    if (!item) return false;

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // If include_adult is true, everything is safe
    if (user.settings?.include_adult) return true;

    // Check adult flag from TMDB
    if (item.adult === true) return false;

    const nsfwKeywords = [
        'hentai', 'хентай', 'porn', 'порно', 'erotica', 'эротика',
        'sex', 'секс', 'adult', 'для взрослых', '18+', 'uncensored',
        'без цензуры', 'naked', 'голая', 'голый', 'ecchi', 'экки', 'экчи',
        'hentai-anime', 'хентай-аниме'
    ];

    const fieldsToCheck = [
        item.title,
        item.name,
        item.original_title,
        item.original_name,
        item.overview
    ];

    const isMatch = fieldsToCheck.some(field => {
        if (!field) return false;
        const lowerField = field.toLowerCase();
        return nsfwKeywords.some(kw => lowerField.includes(kw));
    });

    return !isMatch;
}

/**
 * Format duration (minutes to hours and minutes)
 */
export function formatDuration(minutes) {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours} ч ${mins} мин`;
    }
    return `${mins} мин`;
}

/**
 * Get image URL from TMDB
 */
export function getImageUrl(path, size = 'w500') {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Get backdrop URL from TMDB
 */
export function getBackdropUrl(path, size = 'original') {
    if (!path) return 'https://via.placeholder.com/1920x1080?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Handle API errors
 */
export function handleError(error, defaultMessage = 'Произошла ошибка') {
    console.error('Error:', error);
    let message = defaultMessage;

    if (error.message) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }

    return message;
}

/**
 * Show loading indicator
 */
export function showLoading(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="flex justify-center items-center py-20">
            <div class="spinner"></div>
        </div>
    `;
}

/**
 * Show error message
 */
export function showError(container, message = 'Не удалось загрузить данные') {
    if (!container) return;
    container.innerHTML = `
        <div class="flex flex-col justify-center items-center py-20 px-4">
            <div class="text-red-500 text-xl mb-4">⚠️</div>
            <div class="text-gray-400 text-center">${message}</div>
            <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition">
                Обновить страницу
            </button>
        </div>
    `;
}

/**
 * Get genre name by ID (for Russian localization)
 */
export function getGenreName(genreId) {
    const genres = {
        28: 'Боевик',
        12: 'Приключения',
        16: 'Мультфильм',
        35: 'Комедия',
        80: 'Криминал',
        99: 'Документальный',
        18: 'Драма',
        10751: 'Семейный',
        14: 'Фэнтези',
        36: 'История',
        27: 'Ужасы',
        10402: 'Музыка',
        9648: 'Детектив',
        10749: 'Мелодрама',
        878: 'Фантастика',
        10770: 'Телевизионный фильм',
        53: 'Триллер',
        10752: 'Военный',
        37: 'Вестерн',
        10759: 'Экшн и приключения',
        10762: 'Детский',
        10763: 'Новости',
        10764: 'Реалити-шоу',
        10765: 'Sci-Fi и фэнтези',
        10766: 'Мыльная опера',
        10767: 'Разговорное',
        10768: 'Война и политика'
    };
    return genres[genreId] || 'Неизвестно';
}

/**
 * Debounce function for search
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initialize mobile menu toggle
 */
export function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

/**
 * Update auth related links in the header
 */
export function updateAuthLinks() {
    const authBtn = document.getElementById('auth-btn');
    const profileText = document.getElementById('profile-text');
    const mobileAuthBtn = document.getElementById('mobile-auth-btn');

    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
        try {
            const user = JSON.parse(userJson);
            const label = user.username || 'Профиль';
            if (profileText) profileText.textContent = label;
            if (mobileAuthBtn) mobileAuthBtn.textContent = label;

            const goToProfile = (e) => {
                e.preventDefault();
                window.location.href = 'profile.html';
            };

            if (authBtn) authBtn.onclick = goToProfile;
            if (mobileAuthBtn) mobileAuthBtn.onclick = goToProfile;
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    } else {
        const loginLabel = 'Войти';
        if (profileText) profileText.textContent = loginLabel;
        if (mobileAuthBtn) mobileAuthBtn.textContent = loginLabel;

        const goToLogin = (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        };

        if (authBtn) authBtn.onclick = goToLogin;
        if (mobileAuthBtn) mobileAuthBtn.onclick = goToLogin;
    }
}
/**
 * Initialize search functionality with live results
 */
/**
 * Initialize search functionality with live results
 */
export function initSearch(onSearch, onLiveResult) {
    const searchInputs = [
        document.getElementById('search-input'),
        document.getElementById('mobile-search-input')
    ].filter(Boolean);

    const createLiveResultsContainer = (parent) => {
        let container = parent.querySelector('.search-live-results');
        if (!container) {
            container = document.createElement('div');
            container.className = 'search-live-results absolute top-full left-0 right-0 bg-[#141414] border border-gray-800 rounded-b-xl shadow-2xl z-[100] mt-1 max-h-[500px] overflow-y-auto hidden scrollbar-hide';
            parent.appendChild(container);
        }
        return container;
    };

    const handleInput = debounce(async (e) => {
        const query = e.target.value.trim();
        const parent = e.target.closest('.relative') || e.target.parentElement;
        const container = createLiveResultsContainer(parent);

        if (query.length > 2) {
            if (onLiveResult) {
                const results = await onLiveResult(query);
                renderLiveResults(container, results, query);
            }
        } else {
            container.classList.add('hidden');
        }
    }, 300);

    const renderLiveResults = (container, results, query) => {
        if (!results || results.length === 0) {
            container.innerHTML = '<div class="p-6 text-gray-500 text-center">Ничего не найдено</div>';
        } else {
            // Secondary local safety filter
            const safeResults = results.filter(isContentSafe);

            if (safeResults.length === 0) {
                container.innerHTML = '<div class="p-6 text-gray-500 text-center">Контент скрыт фильтром безопасности</div>';
                container.classList.remove('hidden');
                return;
            }

            const featured = safeResults[0];
            const others = safeResults.slice(1, 6);

            let html = `
                <!-- Featured Result -->
                <div class="p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition group" onclick="location.href='index.html?search=${encodeURIComponent(featured.title || featured.name)}'">
                    <div class="relative h-32 w-full rounded-lg overflow-hidden mb-3">
                        <img src="${getBackdropUrl(featured.backdrop_path, 'w780')}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                        <div class="absolute bottom-2 left-3">
                            <span class="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase">TOP MATCH</span>
                        </div>
                    </div>
                    <div class="text-white font-bold text-lg leading-tight line-clamp-1">${featured.title || featured.name}</div>
                    <div class="text-gray-400 text-xs mt-1">⭐ ${formatRating(featured.vote_average)} • ${formatYear(featured.release_date || featured.first_air_date)}</div>
                </div>
                
                <!-- Other matches -->
                <div class="py-2">
                    ${others.map(item => `
                        <div class="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center space-x-3 transition group" onclick="location.href='index.html?search=${encodeURIComponent(item.title || item.name)}'">
                            <img src="${getImageUrl(item.poster_path, 'w92')}" class="w-8 h-12 object-cover rounded shadow" alt="">
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-semibold text-white truncate group-hover:text-red-500 transition">${item.title || item.name}</div>
                                <div class="text-[10px] text-gray-500">${formatYear(item.release_date || item.first_air_date)} • ⭐ ${formatRating(item.vote_average)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="p-3 text-center text-xs font-bold text-gray-400 border-t border-gray-800 cursor-pointer hover:bg-gray-800 hover:text-red-600 transition" onclick="window.dispatchEvent(new CustomEvent('executeSearch', {detail: '${query}'}))">
                    СМОТРЕТЬ ВСЕ РЕЗУЛЬТАТЫ
                </div>
            `;
            container.innerHTML = html;
        }
        container.classList.remove('hidden');
    };

    searchInputs.forEach(input => {
        input.addEventListener('input', handleInput);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                onSearch(e.target.value.trim());
                document.querySelectorAll('.search-live-results').forEach(c => c.classList.add('hidden'));
                // Hide mobile menu on search
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
        // Clear on ESC
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.search-live-results').forEach(c => c.classList.add('hidden'));
                input.blur();
            }
        });
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative') && !e.target.closest('#mobile-menu')) {
            document.querySelectorAll('.search-live-results').forEach(c => c.classList.add('hidden'));
        }
    });
}

