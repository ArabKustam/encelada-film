const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Models
const User = require('./backend/models/User');
const Comment = require('./backend/models/Comment');
const TmdbCache = require('./backend/models/TmdbCache');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log('⏳ Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    socketTimeoutMS: 45000,
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('Check your MONGODB_URI and IP whitelist in Atlas.');
    });


const pendingAuths = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours for persistent cache

// Hashing utility remains the same
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};


/**
 * Authentication Endpoints
 */

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }

        const newUser = new User({
            username,
            email,
            password: hashPassword(password)
        });

        await newUser.save();

        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.json({ user: userWithoutPassword, token: `fake-jwt-${newUser._id}` });
    } catch (err) {
        console.error('[Register] Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password: hashPassword(password) });

        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ user: userWithoutPassword, token: `fake-jwt-${user._id}` });
    } catch (err) {
        console.error('[Login] Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Helper to get userId from token
const getUserId = (token) => {
    if (!token) return null;
    const id = token.replace('fake-jwt-', '').replace('Bearer ', '');
    return mongoose.Types.ObjectId.isValid(id) ? id : null;
};

// Sync User Data
app.post('/api/user/sync', async (req, res) => {
    try {
        const userId = getUserId(req.body.token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password: _, ...safeUser } = user.toObject();
        res.json({ user: safeUser });
    } catch (err) {
        console.error('[Sync] Error:', err);
        res.status(500).json({ error: 'Sync failed' });
    }
});


// Update Settings
app.post('/api/auth/settings', async (req, res) => {
    try {
        const { token, settings } = req.body;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { settings: settings } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Update settings failed' });
    }
});


// Update Item in Library (Watching, Planned, etc.)
app.post('/api/user/library', async (req, res) => {
    try {
        const { token, itemId, type, status } = req.body;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const key = `${type}_${itemId}`;
        if (status === 'none') {
            user.library.delete(key);
        } else {
            const { item } = req.body;
            user.library.set(key, {
                status,
                id: itemId,
                type,
                title: item?.title || item?.name,
                poster: item?.poster_path || item?.poster,
                rating: item?.vote_average || item?.rating,
                timestamp: Date.now()
            });
        }

        await user.save();
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        console.error('[Library] Server Error:', err);
        res.status(500).json({ error: 'Failed to update library' });
    }
});

// Clear Watch History
app.delete('/api/user/history/clear', async (req, res) => {
    try {
        const userId = getUserId(req.body.token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { history: [] } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Failed to clear history' });
    }
});


// Update Profile (Username/Avatar)
app.post('/api/user/update', async (req, res) => {
    try {
        const { token, username, avatar, tgUsername } = req.body;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const updateData = {};
        if (username) updateData.username = username;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (tgUsername !== undefined) updateData.tgUsername = tgUsername;

        const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});


// Update Watch History (keep last 20)
app.post('/api/user/history', async (req, res) => {
    try {
        const { token, item } = req.body;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!item || (!item.id && !item.tmdbId)) {
            return res.status(400).json({ error: 'Invalid item data' });
        }

        // Normalize data
        const historyItem = {
            id: (item.id || item.tmdbId).toString(),
            type: item.type || item.media_type || (item.name ? 'tv' : 'movie'),
            title: item.title || item.name || 'Unknown',
            poster: item.poster || item.poster_path,
            rating: item.rating || item.vote_average || 0,
            timestamp: Date.now()
        };

        // Move to top and filter duplicates
        user.history = user.history.filter(h => h.id !== historyItem.id);
        user.history.unshift(historyItem);

        if (user.history.length > 20) {
            user.history = user.history.slice(0, 20);
        }

        await user.save();
        const { password: _, ...safeUser } = user.toObject();
        res.json({ success: true, user: safeUser });
    } catch (err) {
        console.error('[History] Server Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete from Watch History
app.delete('/api/user/history', async (req, res) => {
    try {
        const { token, itemId } = req.body;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.history = user.history.filter(h => h.id !== itemId.toString());
        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete from history' });
    }
});


// Update TV Show/Movie Progress
app.post('/api/user/progress', async (req, res) => {
    try {
        const { token, itemId, type, progress } = req.body;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const key = `${type}_${itemId}`;
        const currentProgress = user.progress.get(key) || {};

        user.progress.set(key, {
            ...currentProgress,
            ...progress,
            updatedAt: Date.now()
        });

        await user.save();
        const { password: _, ...userWithoutPassword } = user.toObject();
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

        const userId = getUserId(token);
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const user = await User.findById(userId);
            if (user && user.settings) {
                includeAdult = user.settings.include_adult;
            }
        }

        const cacheKey = `${tmdbPath}_${JSON.stringify(req.query)}_${includeAdult}`;
        const cached = await TmdbCache.findOne({ key: cacheKey });

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
            const nsfwKeywords = [
                'hentai', 'porn', 'порно', 'erotica', 'эротика',
                'uncensored', 'без цензуры', 'naked', 'голая', 'голый',
                'ecchi', 'экки', 'экчи', 'hentai-anime', 'хентай-аниме'
            ];

            const checkUnsafe = (item) => {
                if (!item) return false;
                if (item.adult === true) return true;
                const title = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
                const overview = (item.overview || '').toLowerCase();
                if (nsfwKeywords.some(kw => title.includes(kw) || overview.includes(kw))) return true;
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

        // Cache the result in DB
        await TmdbCache.findOneAndUpdate(
            { key: cacheKey },
            { data, timestamp: Date.now() },
            { upsert: true, new: true }
        );

        res.json(data);
    } catch (error) {
        console.error('TMDB Proxy Error:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
});


// --- User Ratings ---
app.post('/api/user/rate', async (req, res) => {
    try {
        const { token, itemId, type, rating } = req.body;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.ratings.set(`${type}_${itemId}`, rating);
        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Failed to rate' });
    }
});


// --- Comments System ---

// Get comments for a movie/series
app.get('/api/comments/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const comments = await Comment.find({ mediaType: type, mediaId: id.toString() }).sort({ timestamp: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});


// Post a comment or reply
app.post('/api/comments', async (req, res) => {
    try {
        const { token, mediaId, mediaType, text, isSpoiler, parentId } = req.body;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const newComment = new Comment({
            userId: user._id,
            username: user.username,
            userRating: user.ratings.get(`${mediaType}_${mediaId}`) || null,
            mediaId: mediaId.toString(),
            mediaType,
            text: text.substring(0, 1500),
            isSpoiler: !!isSpoiler,
            parentId: parentId || null,
            timestamp: Date.now()
        });

        await newComment.save();
        res.json({ success: true, comment: newComment });
    } catch (err) {
        console.error('[Comments] Error:', err);
        res.status(500).json({ error: 'Failed to post comment' });
    }
});


// Like/Dislike a comment
app.post('/api/comments/:id/vote', async (req, res) => {
    try {
        const { token, voteType } = req.body; // 'like' or 'dislike'
        const { id } = req.params;
        const userId = getUserId(token);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        // Remove existing votes
        comment.likes = comment.likes.filter(uid => uid.toString() !== userId.toString());
        comment.dislikes = comment.dislikes.filter(uid => uid.toString() !== userId.toString());

        // Add new vote if not removing
        if (voteType === 'like') comment.likes.push(userId);
        if (voteType === 'dislike') comment.dislikes.push(userId);

        await comment.save();
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
                            let user = await User.findOne({ telegramId: from.id });

                            if (!user) {
                                user = new User({
                                    telegramId: from.id,
                                    username: from.username || from.first_name || `user_${from.id}`,
                                    tgUsername: from.username || null,
                                    avatar: avatar,
                                    email: `tg_${from.id}@telegram.com`,
                                    password: hashPassword(Math.random().toString())
                                });
                            } else {
                                user.tgUsername = from.username || user.tgUsername;
                                user.avatar = avatar || user.avatar;
                            }

                            await user.save();

                            const { password: _, ...safeUser } = user.toObject();
                            pendingAuths[tempToken] = {
                                status: 'success',
                                user: safeUser,
                                token: `fake-jwt-${user._id}`
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
