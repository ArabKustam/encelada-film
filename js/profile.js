import { renderHeader, renderFooter, renderMovieCard } from './components.js';
import { getMovieDetails, getTVSeriesDetails } from './api.js';
import { initMobileMenu, updateAuthLinks, initSearch, getImageUrl } from './utils.js';

const app = document.getElementById('app');
let activeTab = 'dashboard';

async function initProfilePage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }

    renderStructure();
    renderActiveTab();
}

function renderStructure() {
    app.innerHTML = renderHeader();
    initMobileMenu();
    updateAuthLinks();
    initSearch();

    const main = document.createElement('main');
    main.className = 'pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8';
    main.innerHTML = `
        <div class="flex flex-col md:flex-row items-center gap-6 mb-12 bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
            <div class="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-5xl font-black shadow-2xl shadow-red-900/20">
                ${JSON.parse(localStorage.getItem('user')).username[0].toUpperCase()}
            </div>
            <div class="text-center md:text-left">
                <h1 class="text-4xl font-black text-white mb-2">${JSON.parse(localStorage.getItem('user')).username}</h1>
                <p class="text-gray-400">${JSON.parse(localStorage.getItem('user')).email}</p>
            </div>
            <div class="flex-1"></div>
            <button id="logout-btn" class="px-6 py-2 bg-gray-800 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Выйти
            </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b border-gray-800 mb-8 overflow-x-auto scrollbar-hide">
            <button data-tab="dashboard" class="tab-btn px-6 py-4 flex items-center gap-2 font-bold whitespace-nowrap ${activeTab === 'dashboard' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-white'}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                Дашборд
            </button>
            <button data-tab="library" class="tab-btn px-6 py-4 flex items-center gap-2 font-bold whitespace-nowrap ${activeTab === 'library' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-white'}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Мой список
            </button>
            <button data-tab="history" class="tab-btn px-6 py-4 flex items-center gap-2 font-bold whitespace-nowrap ${activeTab === 'history' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-white'}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                История
            </button>
            <button data-tab="settings" class="tab-btn px-6 py-4 flex items-center gap-2 font-bold whitespace-nowrap ${activeTab === 'settings' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-white'}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Настройки
            </button>
        </div>

        <div id="tab-content"></div>
    `;
    app.appendChild(main);
    app.insertAdjacentHTML('beforeend', renderFooter());

    // Event listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTab = btn.dataset.tab;
            renderStructure();
            renderActiveTab();
        });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}

function renderActiveTab() {
    const container = document.getElementById('tab-content');
    const user = JSON.parse(localStorage.getItem('user'));

    switch (activeTab) {
        case 'dashboard':
            renderDashboard(container, user);
            break;
        case 'library':
            renderLibrary(container, user);
            break;
        case 'history':
            renderHistory(container, user);
            break;
        case 'settings':
            renderSettings(container, user);
            break;
    }
}

const metadataCache = new Map();

async function reviveItem(id, type, elementId) {
    const cacheKey = `${type}_${id}`;
    if (metadataCache.has(cacheKey)) return metadataCache.get(cacheKey);

    try {
        const data = await (type === 'tv' ? getTVSeriesDetails(id) : getMovieDetails(id));
        if (data) {
            metadataCache.set(cacheKey, data);

            // Update UI elements if they exist
            const titleEls = document.querySelectorAll(`[data-revive-title="${elementId}"]`);
            const posterEls = document.querySelectorAll(`[data-revive-poster="${elementId}"]`);

            const title = data.title || data.name;
            const poster = getImageUrl(data.poster_path || data.poster, 'w342');

            titleEls.forEach(el => {
                el.textContent = title;
                el.classList.remove('animate-pulse', 'bg-gray-800', 'h-4', 'h-6', 'w-24', 'w-32', 'w-3/4', 'rounded');
            });
            posterEls.forEach(el => {
                if (el.tagName === 'IMG') {
                    el.src = poster;
                    el.alt = title;
                    el.classList.remove('bg-gray-800');
                }
            });
            return data;
        }
    } catch (err) {
        console.error(`Failed to revive metadata for ${type} ${id}:`, err);
    }
    return null;
}

function renderDashboard(container, user) {
    const library = user.library || {};
    const stats = {
        watching: 0,
        planned: 0,
        watched: 0,
        dropped: 0
    };
    Object.values(library).forEach(item => {
        const status = typeof item === 'string' ? item : item.status;
        if (stats[status] !== undefined) stats[status]++;
    });

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1 bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
                <h2 class="text-xl font-bold mb-6">Статистика просмотров</h2>
                <div class="aspect-square relative flex items-center justify-center">
                    <canvas id="statsChart"></canvas>
                </div>
            </div>
            
            <div class="lg:col-span-2">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    Последняя активность
                </h2>
                <div class="space-y-4">
                    ${user.history?.length > 0 ? user.history.map((item, idx) => {
        const type = item.type || item.media_type || 'movie';
        const elementId = `hist-${idx}-${item.id}`;
        const hasMetadata = item.title || item.name;
        const title = item.title || item.name || '';
        const poster = getImageUrl(item.poster || item.poster_path, 'w92');

        if (!hasMetadata) reviveItem(item.id, type, elementId);

        return `
                        <a href="details.html?id=${item.id}&type=${type}" class="flex items-center gap-4 bg-gray-900/40 hover:bg-gray-800 p-4 rounded-xl border border-gray-800 transition group">
                            <img src="${poster}" data-revive-poster="${elementId}" class="w-16 h-24 object-cover rounded-lg shadow-lg ${!hasMetadata ? 'bg-gray-800' : ''}" alt="${title}">
                            <div class="flex-1">
                                <h3 class="font-bold text-white group-hover:text-red-500 transition ${!hasMetadata ? 'animate-pulse bg-gray-800 h-4 w-32 rounded' : ''}" data-revive-title="${elementId}">${title}</h3>
                                <p class="text-xs text-gray-500 uppercase font-black mt-1">${type === 'tv' ? 'Сериал' : 'Фильм'}</p>
                                ${user.progress?.[`${type}_${item.id}`] ? `
                                    <p class="text-xs text-red-500 font-bold mt-1">Остановились на: S${user.progress[`${type}_${item.id}`].season} E${user.progress[`${type}_${item.id}`].episode}</p>
                                ` : ''}
                            </div>
                            <div class="text-xs text-gray-600">${new Date(item.timestamp).toLocaleDateString()}</div>
                        </a>
                    `}).join('') : '<p class="text-gray-500 py-8 text-center bg-gray-900/20 rounded-xl">Вы еще ничего не смотрели</p>'}
                </div>
            </div>
        </div>
    `;

    // Render Chart
    const ctx = document.getElementById('statsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Смотрю', 'В планах', 'Просмотрено', 'Брошено'],
                datasets: [{
                    data: [stats.watching, stats.planned, stats.watched, stats.dropped],
                    backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#6b7280'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#9ca3af', font: { weight: 'bold' }, padding: 20 }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

function renderLibrary(container, user) {
    const library = user.library || {};
    const statuses = ['watching', 'planned', 'watched', 'dropped'];
    const labels = {
        watching: 'Смотрю',
        planned: 'В планах',
        watched: 'Просмотрено',
        dropped: 'Брошено'
    };

    container.innerHTML = `
        <div class="space-y-12">
            ${statuses.map(status => {
        const entries = Object.entries(library).filter(([k, v]) => {
            const val = typeof v === 'string' ? v : v.status;
            return val === status;
        });

        if (entries.length === 0) return '';

        return `
                    <section>
                        <h2 class="text-2xl font-black mb-6 flex items-center gap-3">
                            <span class="w-2 h-8 bg-red-600 rounded-full"></span>
                            ${labels[status]}
                            <span class="text-sm bg-gray-800 px-3 py-1 rounded-full text-gray-400 font-normal">${entries.length}</span>
                        </h2>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            ${entries.map(([key, data], idx) => {
            const hasFullData = typeof data === 'object' && (data.title || data.name);
            const type = data.type || data.media_type || key.split('_')[0];
            const id = data.id || key.split('_')[1];
            const elementId = `lib-${status}-${idx}-${id}`;
            const title = (typeof data === 'object' ? (data.title || data.name) : '') || '';
            const poster = getImageUrl(typeof data === 'object' ? (data.poster || data.poster_path) : null, 'w342');

            if (!hasFullData) reviveItem(id, type, elementId);

            return `
                                    <a href="details.html?id=${id}&type=${type}" class="block group">
                                        <div class="aspect-[2/3] bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center group-hover:border-red-600 transition overflow-hidden relative shadow-lg">
                                            <img src="${poster}" data-revive-poster="${elementId}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110 ${!hasFullData ? 'bg-gray-800' : ''}" alt="${title}">
                                            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center p-4 text-center text-xs font-bold transition">Нажмите для просмотра</div>
                                        </div>
                                        <p class="mt-2 text-sm text-white font-bold transition truncate ${!hasFullData ? 'animate-pulse bg-gray-800 h-4 w-24 rounded' : ''}" data-revive-title="${elementId}">${title}</p>
                                        <p class="text-[10px] text-gray-500 uppercase font-black mt-0.5">${type === 'tv' ? 'Сериал' : 'Фильм'}</p>
                                    </a>
                                `;
        }).join('')}
                        </div>
                    </section>
                `;
    }).join('') || '<p class="text-center text-gray-500 py-32 bg-gray-900/20 rounded-3xl">Ваш список пуст</p>'}
        </div>
    `;
}

function renderHistory(container, user) {
    container.innerHTML = `
        <h2 class="text-2xl font-black mb-8">Вся история просмотров</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${user.history?.map((item, idx) => {
        const type = item.type || item.media_type || 'movie';
        const elementId = `hist-full-${idx}-${item.id}`;
        const hasMetadata = item.title || item.name;
        const title = item.title || item.name || '';
        const poster = getImageUrl(item.poster || item.poster_path, 'w185');

        if (!hasMetadata) reviveItem(item.id, type, elementId);

        return `
                <div class="bg-gray-900/40 p-4 rounded-2xl border border-gray-800 flex gap-4">
                    <img src="${poster}" data-revive-poster="${elementId}" class="w-24 h-36 object-cover rounded-xl ${!hasMetadata ? 'bg-gray-800' : ''}" alt="${title}">
                    <div class="flex-1 flex flex-col justify-between overflow-hidden">
                        <div>
                            <h3 class="text-xl font-bold truncate ${!hasMetadata ? 'animate-pulse bg-gray-800 h-6 w-3/4 rounded' : ''}" data-revive-title="${elementId}">${title}</h3>
                            <p class="text-xs text-red-600 font-black uppercase tracking-widest mt-1">${type === 'tv' ? 'Сериал' : 'Фильм'}</p>
                        </div>
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs text-gray-600">${new Date(item.timestamp).toLocaleString()}</span>
                            <a href="details.html?id=${item.id}&type=${type}" class="text-sm font-bold text-white hover:text-red-500 transition">Перейти →</a>
                        </div>
                    </div>
                </div>
            `}).join('') || '<p class="text-center text-gray-500 col-span-2 py-32">История пуста</p>'}
        </div>
    `;
}

function renderSettings(container, user) {
    container.innerHTML = `
        <div class="max-w-2xl bg-gray-900/40 p-8 rounded-3xl border border-gray-800">
            <h2 class="text-2xl font-black mb-8">Настройки контента</h2>
            
            <div class="space-y-6">
                <!-- Adult Content Toggle -->
                <div class="flex items-center justify-between p-4 bg-black/40 rounded-xl">
                    <div>
                        <h3 class="font-bold">Контент для взрослых (18+)</h3>
                        <p class="text-xs text-gray-500">Показывать фильмы и сериалы с возрастным ограничением</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="adult-toggle" class="sr-only peer" ${user.settings?.include_adult ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                </div>

                <div class="pt-8 border-t border-gray-800">
                    <button class="w-full py-4 bg-gray-800 hover:bg-red-700 text-white font-bold rounded-xl transition">
                        Сбросить статистику
                    </button>
                    <p class="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest font-black">Осторожно: это действие необратимо</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('adult-toggle').addEventListener('change', async (e) => {
        const include_adult = e.target.checked;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/auth/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token.replace('Bearer ', ''), settings: { include_adult } })
            });
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (err) {
            console.error('Failed to update settings:', err);
        }
    });
}

initProfilePage();
