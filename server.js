const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const COMMENTS_FILE = path.join(__dirname, 'data', 'comments.json');

const pendingAuths = {};
const tmdbCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify([]));
}

// Utility to read files
const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE));
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

const getComments = () => JSON.parse(fs.readFileSync(COMMENTS_FILE));
const saveComments = (comments) => fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));

// Hash password
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Authentication Endpoints
 */

// Register
app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = getUsers();

    if (users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password: hashPassword(password),
        settings: {
            include_adult: false
        },
        library: {}, // { "movie_123": "watching" }
        history: [], // [{ id, type, title, poster, timestamp }]
        progress: {}, // { "tv_123": { season, episode } }
        ratings: {} // { "movie_123": 8 }
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword, token: `fake-jwt-${newUser.id}` });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === hashPassword(password));

    if (!user) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: `fake-jwt-${user.id}` });
});

// Update Settings
app.post('/api/auth/settings', (req, res) => {
    const { token, settings } = req.body;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = parseInt(token.replace('fake-jwt-', ''));
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    users[userIndex].settings = { ...users[userIndex].settings, ...settings };
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
});

// Update Item in Library (Watching, Planned, etc.)
app.post('/api/user/library', (req, res) => {
    try {
        const { token, itemId, type, status } = req.body;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const userId = parseInt(token.replace('fake-jwt-', ''));
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

        if (!users[userIndex].library) {
            users[userIndex].library = {};
        }

        const key = `${type}_${itemId}`;
        if (status === 'none') {
            delete users[userIndex].library[key];
        } else {
            // Store with metadata for easy rendering in profile
            const { item } = req.body;
            users[userIndex].library[key] = {
                status,
                id: itemId,
                type,
                title: item?.title || item?.name,
                poster: item?.poster_path || item?.poster,
                rating: item?.vote_average || item?.rating,
                timestamp: Date.now()
            };
        }

        saveUsers(users);

        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        console.error('[Library] Server Error:', err);
        res.status(500).json({ error: 'Failed to update library' });
    }
});
// Clear Watch History
app.delete('/api/user/history/clear', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = parseInt(token.replace('fake-jwt-', ''));
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    users[userIndex].history = [];
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
});

// Update Profile (Username/Avatar)
app.post('/api/user/update', (req, res) => {
    try {
        const { token, username, avatar } = req.body;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const userId = parseInt(token.replace('fake-jwt-', ''));
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

        if (username) users[userIndex].username = username;
        if (avatar !== undefined) users[userIndex].avatar = avatar;
        if (tgUsername !== undefined) users[userIndex].tgUsername = tgUsername;

        saveUsers(users);
        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update Watch History (keep last 20)
app.post('/api/user/history', (req, res) => {
    try {
        const { token, item } = req.body;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const userIdStr = token.replace('fake-jwt-', '').trim();
        const userId = parseInt(userIdStr);
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId || u.id.toString() === userIdStr);

        if (userIndex === -1) {
            console.error(`[History] User not found for ID: ${userIdStr}`);
            return res.status(404).json({ error: 'User not found' });
        }

        if (!item || (!item.id && !item.tmdbId)) {
            console.error(`[History] Invalid item:`, item);
            return res.status(400).json({ error: 'Invalid item data' });
        }

        if (!users[userIndex].history) users[userIndex].history = [];

        // Normalize data
        const historyItem = {
            id: (item.id || item.tmdbId).toString(),
            type: item.type || item.media_type || (item.name ? 'tv' : 'movie'),
            title: item.title || item.name || 'Unknown',
            poster: item.poster || item.poster_path,
            rating: item.rating || item.vote_average || 0,
            timestamp: Date.now()
        };

        console.log(`[History] Success: Added "${historyItem.title}" (${historyItem.type}) for ${users[userIndex].username}`);

        // Move to top
        users[userIndex].history = users[userIndex].history.filter(h => h.id.toString() !== historyItem.id);
        users[userIndex].history.unshift(historyItem);

        if (users[userIndex].history.length > 20) {
            users[userIndex].history = users[userIndex].history.slice(0, 20);
        }

        saveUsers(users);
        const { password: _, ...safeUser } = users[userIndex];
        res.json({ success: true, user: safeUser });
    } catch (err) {
        console.error('[History] Server Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete from Watch History
app.delete('/api/user/history', (req, res) => {
    const { token, itemId } = req.body;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = parseInt(token.replace('fake-jwt-', ''));
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    console.log(`[History] Removing item ${itemId} for user ${users[userIndex].username}`);

    if (users[userIndex].history) {
        users[userIndex].history = users[userIndex].history.filter(h => h.id.toString() !== itemId.toString());
    }

    saveUsers(users);
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
});

// Update TV Show/Movie Progress
app.post('/api/user/progress', (req, res) => {
    try {
        const { token, itemId, type, progress } = req.body;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const userId = parseInt(token.replace('fake-jwt-', ''));
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

        if (!users[userIndex].progress) users[userIndex].progress = {};

        const key = `${type}_${itemId}`;

        // Merge progress data
        users[userIndex].progress[key] = {
            ...(users[userIndex].progress[key] || {}),
            ...progress,
            updatedAt: Date.now()
        };

        saveUsers(users);
        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        console.error('[Progress] Server Error:', err);
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

// API endpoint to get video players
// API endpoint to get video players
app.get('/api/players', async (req, res) => {
    try {
        const { id, type } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Missing id parameter' });
        }

        const mediaType = type === 'tv' ? 'tv' : 'movie';
        let players = [];
        let kinopoiskId = null;
        let imdbId = null;

        // 1. Get External IDs from TMDB (IMDB ID)
        try {
            const externalIdsResponse = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}/external_ids`, {
                params: { api_key: process.env.TMDB_API_KEY }
            });
            imdbId = externalIdsResponse.data.imdb_id;
        } catch (e) {
            console.error('Failed to get TMDB external IDs:', e.message);
        }

        // 2. Try to get Kinopoisk ID via Alloha API (using public token)
        try {
            const allohaToken = '04941a9a3ca3ac16e2b4327347bbc1';
            const allohaUrl = `https://api.alloha.tv/?token=${allohaToken}&tmdb=${id}`;
            const allohaResponse = await axios.get(allohaUrl);

            if (allohaResponse.data && allohaResponse.data.status === 'success' && allohaResponse.data.data) {
                kinopoiskId = allohaResponse.data.data.id_kp;
            }
        } catch (e) {
            console.error('Alloha API check failed:', e.message);
        }

        // 3. If we have Kinopoisk ID, fetch Russian players from Reyohoho
        if (kinopoiskId) {
            try {
                const reyohohoResponse = await axios.post('https://api4.rhserv.vu/cache',
                    `kinopoisk=${kinopoiskId}`,
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        timeout: 5000
                    }
                );

                if (Array.isArray(reyohohoResponse.data)) {
                    const ruPlayers = reyohohoResponse.data
                        .filter(p => p.iframe)
                        .map(p => ({
                            type: p.translate || p.name,
                            name: p.name,
                            iframeUrl: p.iframe,
                            quality: p.quality || 'HD',
                            lang: 'ru'
                        }));
                    players.push(...ruPlayers);
                }
            } catch (e) {
                console.error('Reyohoho API failed:', e.message);
            }
        }

        // 4. Add fallback English/International players (always valid)
        // VidSrc - supports both TMDB and IMDB
        players.push({
            type: 'VidSrc (ENG)',
            name: 'vidsrc',
            iframeUrl: type === 'tv'
                ? `https://vidsrc.xyz/embed/tv/${id}`
                : `https://vidsrc.xyz/embed/movie/${id}`,
            quality: 'HD',
            lang: 'en'
        });

        players.push({
            type: 'VidSrc.to (ENG)',
            name: 'vidsrcto',
            iframeUrl: type === 'tv'
                ? `https://vidsrc.to/embed/tv/${id}`
                : `https://vidsrc.to/embed/movie/${id}`,
            quality: 'HD',
            lang: 'en'
        });

        // SuperEmbed (Multi-lang aggregator)
        if (imdbId) {
            players.push({
                type: 'SuperEmbed (Multi)',
                name: 'superembed',
                iframeUrl: `https://multiembed.mov/?video_id=${imdbId}&tmdb=1`,
                quality: 'HD',
                lang: 'multi'
            });
        }

        res.json({ data: players });



    } catch (error) {
        console.error('Players API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch players', data: [] });
    }
});

// Proxy for TMDB API
app.get('/api/tmdb/*', async (req, res) => {
    try {
        const tmdbPath = req.params[0];
        const token = req.headers['authorization'];
        let includeAdult = false;

        if (token && token.startsWith('Bearer fake-jwt-')) {
            const userId = parseInt(token.replace('Bearer fake-jwt-', ''));
            const users = getUsers();
            const user = users.find(u => u.id === userId);
            if (user && user.settings) {
                includeAdult = user.settings.include_adult;
            }
        }

        const cacheKey = `${tmdbPath}_${JSON.stringify(req.query)}_${includeAdult}`;
        const cached = tmdbCache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            return res.json(cached.data);
        }

        const response = await axios.get(`https://api.themoviedb.org/3/${tmdbPath}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                ...req.query,
                include_adult: includeAdult
            }
        });

        let data = response.data;

        // Backend safety filter for results
        if (!includeAdult && data) {
            // Refined keywords: focus on explicit terms, exclude common words that cause false positives
            const nsfwKeywords = [
                'hentai', 'porn', 'порно', 'erotica', 'эротика',
                'uncensored', 'без цензуры', 'naked', 'голая', 'голый',
                'ecchi', 'экки', 'экчи', 'hentai-anime', 'хентай-аниме'
            ];

            // "Soft" keywords that only trigger if the item is also flagged as adult or has other suspicious traits
            const softKeywords = ['sex', 'секс', 'adult', 'для взрослых', '18+'];

            const checkUnsafe = (item) => {
                if (!item) return false;

                // 1. Strict TMDB flag
                if (item.adult === true) return true;

                // 2. Genre check (Adult genre ID is 10749 for Romance, but there is no specific Adult genre in TMDB standard movie list usually, 
                //    however, we can check for keywords/titles)

                const title = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
                const overview = (item.overview || '').toLowerCase();

                // Check strict keywords
                if (nsfwKeywords.some(kw => title.includes(kw) || overview.includes(kw))) return true;

                // Check soft keywords ONLY if they are prominent in the title AND it's a suspicious media type or has no votes
                // For now, let's just make it title-only for soft keywords to allow "Sex Education" but maybe block "Sex: The Movie"
                // Actually, let's just omit "sex" from auto-block and rely on TMDB's 'adult' flag for mainstream content.

                return false;
            };

            if (data.results && Array.isArray(data.results)) {
                data.results = data.results.filter(item => !checkUnsafe(item));
            } else {
                const parts = tmdbPath.split('/').filter(Boolean);
                if (parts.length === 2 && (parts[0] === 'movie' || parts[0] === 'tv')) {
                    if (checkUnsafe(data)) {
                        return res.status(403).json({ error: 'Контент скрыт фильтром безопасности', restricted: true });
                    }
                }
            }
        }

        // Cache the result
        tmdbCache.set(cacheKey, { data, timestamp: Date.now() });

        res.json(data);
    } catch (error) {
        console.error('TMDB Proxy Error:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
});

// --- User Ratings ---
app.post('/api/user/rate', (req, res) => {
    try {
        const { token, itemId, type, rating } = req.body;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const userId = parseInt(token.replace('fake-jwt-', ''));
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

        if (!users[userIndex].ratings) users[userIndex].ratings = {};

        users[userIndex].ratings[`${type}_${itemId}`] = rating;

        saveUsers(users);
        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Failed to rate' });
    }
});

// --- Comments System ---

// Get comments for a movie/series
app.get('/api/comments/:type/:id', (req, res) => {
    const { type, id } = req.params;
    const comments = getComments();
    const filtered = comments.filter(c => c.mediaType === type && c.mediaId.toString() === id.toString());
    res.json(filtered);
});

// Post a comment or reply
app.post('/api/comments', (req, res) => {
    try {
        const { token, mediaId, mediaType, text, isSpoiler, parentId } = req.body;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const userId = parseInt(token.replace('fake-jwt-', ''));
        const users = getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) return res.status(404).json({ error: 'User not found' });

        const comments = getComments();
        const newComment = {
            id: Date.now().toString(),
            userId: user.id,
            username: user.username,
            userRating: user.ratings?.[`${mediaType}_${mediaId}`] || null,
            mediaId: mediaId.toString(),
            mediaType,
            text: text.substring(0, 1500),
            isSpoiler: !!isSpoiler,
            parentId: parentId || null,
            likes: [],
            dislikes: [],
            timestamp: Date.now()
        };

        comments.push(newComment);
        saveComments(comments);
        res.json({ success: true, comment: newComment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

// Like/Dislike a comment
app.post('/api/comments/:id/vote', (req, res) => {
    try {
        const { token, voteType } = req.body; // 'like' or 'dislike'
        const { id } = req.params;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const userId = parseInt(token.replace('fake-jwt-', ''));
        const comments = getComments();
        const commentIndex = comments.findIndex(c => c.id === id);

        if (commentIndex === -1) return res.status(404).json({ error: 'Comment not found' });

        const comment = comments[commentIndex];

        // Remove existing votes
        comment.likes = (comment.likes || []).filter(uid => uid !== userId);
        comment.dislikes = (comment.dislikes || []).filter(uid => uid !== userId);

        // Add new vote if not removing
        if (voteType === 'like') comment.likes.push(userId);
        if (voteType === 'dislike') comment.dislikes.push(userId);

        saveComments(comments);
        res.json({ success: true, comment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to vote' });
    }
});

/**
 * Telegram Authentication Logic
 */

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_BOT_NAME = process.env.TELEGRAM_BOT_NAME;

async function startTelegramBot() {
    if (!TG_TOKEN) {
        console.warn('⚠️ TELEGRAM_BOT_TOKEN не настроен. Бот не запущен.');
        return;
    }

    let offset = 0;
    console.log('🤖 Telegram Бот запущен...');

    const poll = async () => {
        try {
            const response = await axios.get(`https://api.telegram.org/bot${TG_TOKEN}/getUpdates`, {
                params: { offset, timeout: 30 },
                timeout: 35000
            });

            const updates = response.data.result;
            for (const update of updates) {
                offset = update.update_id + 1;
                if (update.message && update.message.text) {
                    const text = update.message.text;
                    const chatId = update.message.chat.id;
                    const from = update.message.from;

                    if (text.startsWith('/start ')) {
                        const tempToken = text.split(' ')[1];
                        if (pendingAuths[tempToken]) {
                            // Fetch user profile photos
                            let avatar = null;
                            try {
                                const photos = await axios.get(`https://api.telegram.org/bot${TG_TOKEN}/getUserProfilePhotos`, {
                                    params: { user_id: from.id, limit: 1 }
                                });
                                if (photos.data.result.total_count > 0) {
                                    const fileId = photos.data.result.photos[0][0].file_id;
                                    const file = await axios.get(`https://api.telegram.org/bot${TG_TOKEN}/getFile`, {
                                        params: { file_id: fileId }
                                    });
                                    avatar = `https://api.telegram.org/file/bot${TG_TOKEN}/${file.data.result.file_path}`;
                                }
                            } catch (e) {
                                console.error('Failed to fetch TG avatar:', e.message);
                            }

                            // Create or update user
                            const users = getUsers();
                            let user = users.find(u => u.telegramId === from.id);

                            if (!user) {
                                user = {
                                    id: Date.now(),
                                    telegramId: from.id,
                                    username: from.username || from.first_name || `user_${from.id}`,
                                    tgUsername: from.username || null,
                                    avatar: avatar,
                                    email: `tg_${from.id}@telegram.com`,
                                    password: hashPassword(Math.random().toString()),
                                    settings: { include_adult: false },
                                    library: {},
                                    history: [],
                                    progress: {},
                                    ratings: {}
                                };
                                users.push(user);
                            } else {
                                user.tgUsername = from.username || user.tgUsername;
                                user.avatar = avatar || user.avatar;
                            }

                            saveUsers(users);

                            const { password: _, ...safeUser } = user;
                            pendingAuths[tempToken] = {
                                status: 'success',
                                user: safeUser,
                                token: `fake-jwt-${user.id}`
                            };

                            await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                                chat_id: chatId,
                                text: `✅ Авторизация успешна! Вы вошли как ${user.username}. Вернитесь на сайт.`
                            });
                        }
                    } else if (text === '/start') {
                        await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                            chat_id: chatId,
                            text: `👋 Привет! Чтобы войти на сайт, используйте кнопку "Войти через Telegram" на странице авторизации.`
                        });
                    }
                }
            }
        } catch (error) {
            if (error.code !== 'ECONNABORTED') {
                console.error('TG Bot Error:', error.message);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        poll();
    };
    poll();
}

startTelegramBot();

app.get('/api/auth/telegram/init', (req, res) => {
    const tempToken = crypto.randomBytes(16).toString('hex');
    pendingAuths[tempToken] = { status: 'pending', user: null, token: null };

    // Auto-cleanup after 5 mins
    setTimeout(() => {
        if (pendingAuths[tempToken]) delete pendingAuths[tempToken];
    }, 5 * 60 * 1000);

    res.json({
        tempToken,
        botUrl: `https://t.me/${TG_BOT_NAME}?start=${tempToken}`
    });
});

app.get('/api/auth/telegram/check/:tempToken', (req, res) => {
    const { tempToken } = req.params;
    const auth = pendingAuths[tempToken];

    if (!auth) return res.status(404).json({ error: 'Token expired or invalid' });

    if (auth.status === 'success') {
        const result = { ...auth };
        delete pendingAuths[tempToken]; // Complete auth
        res.json(result);
    } else {
        res.json({ status: 'pending' });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, './')));

// Handle all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 Сервер запущен!`);
    console.log(`🌐 Адрес: http://localhost:${PORT}`);
    console.log(`🔑 Ключ TMDB: ${process.env.TMDB_API_KEY ? 'Настроен ✅' : 'ОТСУТСТВУЕТ ❌'}\n`);
});
