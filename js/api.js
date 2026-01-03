// TMDB API integration via backend proxy

const TMDB_BASE_URL = '/api/tmdb';
const TMDB_LANGUAGE = 'ru-RU';

/**
 * Make API request to TMDB via backend proxy
 */
async function apiRequest(endpoint, params = {}) {
    const queryParams = new URLSearchParams({
        language: TMDB_LANGUAGE,
        ...params
    });

    const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;

    // Include token for adult content filtering
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

/**
 * Get trending movies and TV series
 */
export async function getTrending(mediaType = 'all', timeWindow = 'day') {
    return await apiRequest(`/trending/${mediaType}/${timeWindow}`);
}

/**
 * Get popular movies (excluding animation and low-vote local items)
 */
export async function getPopularMovies(page = 1) {
    return await apiRequest('/discover/movie', {
        page,
        sort_by: 'popularity.desc',
        without_genres: '16',
        'vote_count.gte': 500
    });
}

/**
 * Get top rated movies (excluding animation and low-vote local items)
 */
export async function getTopRatedMovies(page = 1) {
    return await apiRequest('/discover/movie', {
        page,
        sort_by: 'vote_average.desc',
        'vote_count.gte': 1000,
        without_genres: '16'
    });
}
// Keep these for backward compatibility or niche uses if needed
export async function getNowPlayingMovies(page = 1) { return await apiRequest('/movie/now_playing', { page }); }
export async function getUpcomingMovies(page = 1) { return await apiRequest('/movie/upcoming', { page }); }

/**
 * Get movies by genre
 */
export async function getMoviesByGenre(genreId, page = 1) {
    return await apiRequest('/discover/movie', {
        with_genres: genreId,
        without_genres: genreId.toString() === '16' ? '' : '16',
        'vote_count.gte': 100,
        page
    });
}

/**
 * Get all movies with filters
 */
export async function getMovies(params = {}) {
    return await apiRequest('/discover/movie', {
        without_genres: '16',
        'vote_count.gte': 300,
        ...params
    });
}

/**
 * Get movie details
 */
export async function getMovieDetails(movieId) {
    return await apiRequest(`/movie/${movieId}`);
}

/**
 * Get popular TV series (excluding animation and low-vote local items)
 */
export async function getPopularTVSeries(page = 1) {
    return await apiRequest('/discover/tv', {
        page,
        sort_by: 'popularity.desc',
        without_genres: '16',
        'vote_count.gte': 200
    });
}

/**
 * Get top rated TV series (excluding animation and low-vote local items)
 */
export async function getTopRatedTVSeries(page = 1) {
    return await apiRequest('/discover/tv', {
        page,
        sort_by: 'vote_average.desc',
        'vote_count.gte': 500,
        without_genres: '16'
    });
}

/**
 * Get TV series by genre
 */
export async function getTVSeriesByGenre(genreId, page = 1) {
    return await apiRequest('/discover/tv', {
        with_genres: genreId,
        without_genres: genreId.toString() === '16' ? '' : '16',
        'vote_count.gte': 50,
        page
    });
}

/**
 * Get all TV series with filters
 */
export async function getTVSeries(params = {}) {
    return await apiRequest('/discover/tv', {
        without_genres: '16',
        'vote_count.gte': 100,
        ...params
    });
}

/**
 * Get TV series details
 */
export async function getTVSeriesDetails(seriesId) {
    return await apiRequest(`/tv/${seriesId}`);
}

/**
 * Get anime (movies and TV with Animation genre)
 */
export async function getAnime(mediaType = 'movie', page = 1, extraGenres = []) {
    const genres = [16, ...extraGenres].join(',');
    const params = {
        with_genres: genres,
        with_keywords: '210024', // Anime keyword ID
        'vote_count.gte': 20,
        page
    };

    if (mediaType === 'movie') {
        return await apiRequest('/discover/movie', params);
    } else {
        return await apiRequest('/discover/tv', params);
    }
}

/**
 * Search movies and TV series
 */
export async function searchMovies(query, page = 1) {
    return await apiRequest('/search/movie', {
        query,
        page
    });
}

/**
 * Search TV series
 */
export async function searchTVSeries(query, page = 1) {
    return await apiRequest('/search/tv', {
        query,
        page
    });
}

/**
 * Multi search (movies, TV, people)
 */
export async function searchMulti(query, page = 1) {
    return await apiRequest('/search/multi', {
        query,
        page
    });
}

/**
 * Get genres list
 */
export async function getMovieGenres() {
    return await apiRequest('/genre/movie/list');
}

/**
 * Get TV genres list
 */
export async function getTVGenres() {
    return await apiRequest('/genre/tv/list');
}

/**
 * Get item credits (cast and crew)
 */
export async function getItemCredits(type, id) {
    return await apiRequest(`/${type}/${id}/credits`);
}

/**
 * Get item videos (trailers, teasers)
 */
export async function getItemVideos(type, id) {
    return await apiRequest(`/${type}/${id}/videos`);
}

/**
 * Update user library status for an item
 */
export async function updateLibraryStatus(itemId, type, status, item = null) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized');

    const response = await fetch('/api/user/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), itemId, type, status, item })
    });

    if (!response.ok) {
        throw new Error('Failed to update library status');
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
}

/**
 * Add item to watch history
 */
export async function addToHistory(item, type) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const historyItem = {
        id: item.id,
        type: type,
        title: item.title || item.name,
        poster: item.poster_path || item.poster,
        rating: item.vote_average || item.rating
    };

    console.log('[API] Saving to history:', historyItem);

    const response = await fetch('/api/user/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), item: historyItem })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('[API] History updated:', data.user.username);
        localStorage.setItem('user', JSON.stringify(data.user));
    } else {
        const err = await response.json();
        console.error('[API] History update failed:', err.error);
    }
}

/**
 * Remove item from watch history
 */
export async function removeFromHistory(itemId) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('/api/user/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), itemId })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
}

/**
 * Clear entire watch history
 */
export async function clearHistory() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('/api/user/history/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', '') })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
}

/**
 * Update viewing progress (season/episode)
 */
export async function updateWatchProgress(itemId, type, progress) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), itemId, type, progress })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
    }
}

/**
 * Get comments for media
 */
export async function getComments(mediaId, mediaType) {
    const response = await fetch(`/api/comments/${mediaType}/${mediaId}`);
    return await response.json();
}

/**
 * Post a comment
 */
export async function postComment(mediaId, mediaType, text, isSpoiler = false, parentId = null) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized');

    const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), mediaId, mediaType, text, isSpoiler, parentId })
    });

    return await response.json();
}

/**
 * Vote for a comment
 */
export async function voteComment(commentId, voteType) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized');

    const response = await fetch(`/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), voteType })
    });

    return await response.json();
}

/**
 * Rate a movie or TV show
 */
export async function rateMedia(itemId, type, rating) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('/api/user/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), itemId, type, rating })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
}

/**
 * Initialize Telegram Login
 */
export async function initTelegramAuth() {
    const response = await fetch('/api/auth/telegram/init');
    return await response.json();
}

/**
 * Update user profile
 */
export async function updateUserProfile(username, avatar, tgUsername) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized');

    const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), username, avatar, tgUsername })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
    throw new Error('Failed to update profile');
}

/**
 * Update user settings
 */
export async function updateSettings(settings) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized');

    const response = await fetch('/api/auth/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), settings })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
    throw new Error('Failed to update settings');
}


// Apply settings on load
import('./utils.js').then(utils => {
    utils.applyGlobalSettings();
});
