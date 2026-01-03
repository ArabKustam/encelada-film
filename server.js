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

// Database paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Utility to read users
const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE));
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

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
        progress: {} // { "tv_123": { season, episode } }
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
    res.json({ user: userWithoutPassword });
});

// Update Watch History (keep last 10)
app.post('/api/user/history', (req, res) => {
    const { token, item } = req.body;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = parseInt(token.replace('fake-jwt-', ''));
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    if (!users[userIndex].history) users[userIndex].history = [];

    // Remove if already exists to move to top
    users[userIndex].history = users[userIndex].history.filter(h => h.id.toString() !== item.id.toString());

    // Add to front
    users[userIndex].history.unshift({
        ...item,
        timestamp: Date.now()
    });

    // Keep only last 10
    if (users[userIndex].history.length > 10) {
        users[userIndex].history = users[userIndex].history.slice(0, 10);
    }

    saveUsers(users);
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
});

// Update TV Show/Movie Progress
app.post('/api/user/progress', (req, res) => {
    const { token, itemId, type, progress } = req.body;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = parseInt(token.replace('fake-jwt-', ''));
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    if (!users[userIndex].progress) users[userIndex].progress = {};

    const key = `${type}_${itemId}`;
    users[userIndex].progress[key] = {
        ...(users[userIndex].progress[key] || {}),
        ...progress
    };

    saveUsers(users);
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
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

        const response = await axios.get(`https://api.themoviedb.org/3/${tmdbPath}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                ...req.query,
                include_adult: includeAdult
            }
        });

        // Backend safety filter for results
        if (!includeAdult && response.data) {
            const nsfwKeywords = ['hentai', 'хентай', 'porn', 'порно', 'erotica', 'эротика', 'sex', 'секс', 'adult', 'для взрослых', '18+', 'uncensored', 'без цензуры', 'naked', 'голая', 'голый', 'ecchi', 'экки', 'экчи', 'hentai-anime', 'хентай-аниме'];
            const checkUnsafe = (item) => {
                if (!item) return false;
                if (item.adult === true) return true;
                const fieldsToCheck = [item.title, item.name, item.original_title, item.original_name, item.overview];
                return fieldsToCheck.some(field => field && nsfwKeywords.some(kw => field.toLowerCase().includes(kw)));
            };

            if (response.data.results && Array.isArray(response.data.results)) {
                response.data.results = response.data.results.filter(item => !checkUnsafe(item));
            } else {
                const parts = tmdbPath.split('/').filter(Boolean);
                if (parts.length === 2 && (parts[0] === 'movie' || parts[0] === 'tv')) {
                    if (checkUnsafe(response.data)) {
                        return res.status(403).json({ error: 'Контент скрыт фильтром безопасности', restricted: true });
                    }
                }
            }
        }

        res.json(response.data);
    } catch (error) {
        console.error('TMDB Proxy Error:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
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
