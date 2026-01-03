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
 * Get popular movies
 */
export async function getPopularMovies(page = 1) {
    return await apiRequest('/movie/popular', { page });
}

/**
 * Get top rated movies
 */
export async function getTopRatedMovies(page = 1) {
    return await apiRequest('/movie/top_rated', { page });
}

/**
 * Get now playing movies
 */
export async function getNowPlayingMovies(page = 1) {
    return await apiRequest('/movie/now_playing', { page });
}

/**
 * Get upcoming movies
 */
export async function getUpcomingMovies(page = 1) {
    return await apiRequest('/movie/upcoming', { page });
}

/**
 * Get movies by genre
 */
export async function getMoviesByGenre(genreId, page = 1) {
    return await apiRequest('/discover/movie', {
        with_genres: genreId,
        page
    });
}

/**
 * Get all movies with filters
 */
export async function getMovies(params = {}) {
    return await apiRequest('/discover/movie', params);
}

/**
 * Get movie details
 */
export async function getMovieDetails(movieId) {
    return await apiRequest(`/movie/${movieId}`);
}

/**
 * Get popular TV series
 */
export async function getPopularTVSeries(page = 1) {
    return await apiRequest('/tv/popular', { page });
}

/**
 * Get top rated TV series
 */
export async function getTopRatedTVSeries(page = 1) {
    return await apiRequest('/tv/top_rated', { page });
}

/**
 * Get TV series on the air
 */
export async function getTVSeriesOnTheAir(page = 1) {
    return await apiRequest('/tv/on_the_air', { page });
}

/**
 * Get TV series by genre
 */
export async function getTVSeriesByGenre(genreId, page = 1) {
    return await apiRequest('/discover/tv', {
        with_genres: genreId,
        page
    });
}

/**
 * Get all TV series with filters
 */
export async function getTVSeries(params = {}) {
    return await apiRequest('/discover/tv', params);
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
export async function updateLibraryStatus(itemId, type, status) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized');

    const response = await fetch('/api/user/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.replace('Bearer ', ''), itemId, type, status })
    });

    if (!response.ok) {
        throw new Error('Failed to update library status');
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
}

