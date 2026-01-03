import { renderHeader, renderFooter, renderMovieCard } from './components.js';
import { getMovieDetails, getTVSeriesDetails, removeFromHistory, updateUserProfile } from './api.js';
import { initMobileMenu, updateAuthLinks, initSearch, getImageUrl, handleError } from './utils.js';

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
    const user = JSON.parse(localStorage.getItem('user'));
    app.innerHTML = renderHeader();
    initMobileMenu();
    updateAuthLinks();
    initSearch();

    const main = document.createElement('main');
    main.className = 'pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8';
    main.innerHTML = `
        <div class="flex flex-col md:flex-row items-center gap-6 mb-12 bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
            <div class="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden shadow-2xl shadow-red-900/20 group relative">
                ${user.avatar ?
            `<img src="${user.avatar}" class="w-full h-full object-cover" alt="${user.username}">` :
            `<div class="w-full h-full bg-red-600 flex items-center justify-center text-5xl font-black">${user.username[0].toUpperCase()}</div>`
        }
                <button id="edit-avatar-btn" class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold uppercase">
                    Изменить
                </button>
            </div>
            <div class="text-center md:text-left">
                <div class="flex items-center gap-3 mb-1">
                    <h1 class="text-4xl font-black text-white">${user.username}</h1>
                    <button id="edit-name-btn" class="p-2 text-gray-500 hover:text-red-600 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                </div>
                ${user.tgUsername ?
            `<div class="flex items-center gap-2">
                        <a href="https://t.me/${user.tgUsername}" target="_blank" class="text-blue-400 hover:text-blue-300 transition flex items-center gap-2">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.5 4.36-1.76 4.85-1.77.11 0 .35.03.5.15.13.1.17.24.18.33.02.09-.01.21-.02.24z"/></svg>
                            t.me/${user.tgUsername}
                        </a>
                    </div>` :
            `<div class="flex items-center gap-2">
                        <p class="text-gray-400">${user.email}</p>
                    </div>`
        }
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

    document.getElementById('edit-name-btn').onclick = () => showEditModal('username', user.username);
    document.getElementById('edit-avatar-btn').onclick = () => showEditModal('avatar', user.avatar || '');
}

function showEditModal(field, currentValue) {
    let title, placeholder;
    if (field === 'username') {
        title = 'Изменить никнейм';
        placeholder = 'Введите новый никнейм';
    } else if (field === 'avatar') {
        title = 'Изменить аватарку';
        placeholder = 'Вставьте ссылку на изображение';
    } else {
        title = 'Ссылка на Telegram';
        placeholder = 'Введите ваш @username в Telegram';
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in';
    modal.innerHTML = `
        <div class="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <h2 class="text-2xl font-black mb-6 text-white">${title}</h2>
            <input 
                type="text" 
                id="edit-input" 
                value="${currentValue}" 
                placeholder="${placeholder}"
                class="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 mb-6 transition"
            >
            <div class="flex gap-4">
                <button id="cancel-edit" class="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition">Отмена</button>
                <button id="save-edit" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition">Сохранить</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const input = modal.querySelector('#edit-input');
    input.focus();
    input.select();

    const closeModal = () => modal.remove();

    modal.querySelector('#cancel-edit').onclick = closeModal;
    modal.querySelector('#save-edit').onclick = async () => {
        const newValue = input.value.trim();
        if (!newValue && field === 'username') return;

        try {
            const btn = modal.querySelector('#save-edit');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner w-4 h-4"></span>';

            await updateUserProfile(
                field === 'username' ? newValue : undefined,
                field === 'avatar' ? newValue : undefined,
                field === 'tgUsername' ? newValue : undefined
            );

            closeModal();
            renderStructure();
            renderActiveTab();
        } catch (e) {
            alert(handleError(e));
        }
    };
}

function renderActiveTab() {
    const container = document.getElementById('tab-content');
    const user = JSON.parse(localStorage.getItem('user'));

    // Clear pending revivals
    revivalQueue.length = 0;

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

    // Process revivals after innerHTML is set
    processRevivals();
}

const metadataCache = new Map();
const revivalQueue = [];

function queueRevival(id, type, elementId) {
    revivalQueue.push({ id, type, elementId });
}

async function processRevivals() {
    const unique = Array.from(new Set(revivalQueue.map(t => `${t.type}_${t.id}`)));

    for (const item of revivalQueue) {
        reviveItem(item.id, item.type, item.elementId);
    }
}

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
            const posterPatch = data.poster_path || data.poster;
            const poster = getImageUrl(posterPatch, 'w342');

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

            // CRITICAL: Save this metadata back to the user library/history on the server
            // to prevent "IDs instead of titles" next time.
            const { updateLibraryStatus, addToHistory } = await import('./api.js');
            // If in library, update library metadata to persist it
            const libKey = `${type}_${id}`;
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.library && currentUser.library[libKey]) {
                const status = typeof currentUser.library[libKey] === 'string' ? currentUser.library[libKey] : currentUser.library[libKey].status;
                updateLibraryStatus(id, type, status, data).catch(e => console.error('Silent metadata sync failed:', e));
            }

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
                    ${(user.history || []).sort((a, b) => b.timestamp - a.timestamp).map((item, idx) => {
        const type = item.type || item.media_type || 'movie';
        const elementId = `hist-dash-${idx}-${item.id}`;
        const hasMetadata = item.title || item.name;
        const title = item.title || item.name || '';
        const poster = getImageUrl(item.poster || item.poster_path, 'w92');
        const progress = user.progress?.[`${type}_${item.id}`];

        if (!hasMetadata) queueRevival(item.id, type, elementId);

        return `
                        <div class="flex items-center gap-2 bg-gray-900/40 hover:bg-gray-800 p-2 rounded-xl border border-gray-800 transition group relative">
                            <a href="watch.html?id=${item.id}&type=${type}" class="flex items-center gap-4 flex-1 min-w-0">
                                <img src="${poster}" data-revive-poster="${elementId}" class="w-16 h-24 object-cover rounded-lg shadow-lg ${!hasMetadata ? 'bg-gray-800' : ''}" alt="${title}">
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-bold text-white group-hover:text-red-500 transition truncate ${!hasMetadata ? 'animate-pulse bg-gray-800 h-4 w-32 rounded' : ''}" data-revive-title="${elementId}">${title}</h3>
                                    <p class="text-[10px] text-gray-500 uppercase font-black mt-1">${type === 'tv' ? 'Сериал' : 'Фильм'}</p>
                                    ${progress ? `
                                        <div class="mt-2">
                                            <div class="flex justify-between text-[10px] font-bold mb-1">
                                                <span class="text-red-500">Прогресс</span>
                                            </div>
                                            ${progress.duration ? `
                                                <div class="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                                    <div class="bg-red-600 h-full" style="width: ${Math.min(100, (progress.time / progress.duration) * 100)}%"></div>
                                                </div>
                                            ` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            </a>
                            <div class="flex flex-col items-end gap-2">
                                <div class="text-[10px] text-gray-600 font-bold whitespace-nowrap">${new Date(item.timestamp).toLocaleDateString()}</div>
                                <button onclick="window.deleteHistoryItem('${item.id}', event)" class="p-2 text-gray-600 hover:text-red-500 transition" title="Удалить из истории">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    `}).join('') || '<p class="text-gray-500 py-8 text-center bg-gray-900/20 rounded-xl">Вы еще ничего не смотрели</p>'}
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

            if (!hasFullData) queueRevival(id, type, elementId);

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
            ${(user.history || []).sort((a, b) => b.timestamp - a.timestamp).map((item, idx) => {
        const type = item.type || item.media_type || 'movie';
        const elementId = `hist-full-${idx}-${item.id}`;
        const hasMetadata = item.title || item.name;
        const title = item.title || item.name || '';
        const poster = getImageUrl(item.poster || item.poster_path, 'w185');
        const progress = user.progress?.[`${type}_${item.id}`];

        if (!hasMetadata) queueRevival(item.id, type, elementId);

        return `
                <div class="bg-gray-900/40 p-4 rounded-2xl border border-gray-800 flex gap-4 group">
                    <div class="relative w-24 h-36 flex-shrink-0 overflow-hidden rounded-xl">
                        <img src="${poster}" data-revive-poster="${elementId}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500 ${!hasMetadata ? 'bg-gray-800' : ''}" alt="${title}">
                        ${progress?.duration ? `
                            <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                                <div class="bg-red-600 h-full" style="width: ${Math.min(100, (progress.time / progress.duration) * 100)}%"></div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="flex-1 flex flex-col justify-between overflow-hidden">
                        <div>
                            <h3 class="text-lg font-bold truncate group-hover:text-red-500 transition ${!hasMetadata ? 'animate-pulse bg-gray-800 h-6 w-3/4 rounded' : ''}" data-revive-title="${elementId}">${title}</h3>
                            <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">${type === 'tv' ? 'Сериал' : 'Фильм'}</p>
                            ${progress ? `
                                <p class="text-xs text-red-500 font-bold mt-2">
                                </p>
                            ` : ''}
                        </div>
                        <div class="flex items-center mt-2 gap-2">
                            <span class="text-[10px] text-gray-600 font-bold">${new Date(item.timestamp).toLocaleString()}</span>
                            <div class="flex gap-2">
                                <button onclick="window.deleteHistoryItem('${item.id}', event)" class="p-2 text-gray-600 hover:text-red-500 transition" title="Удалить">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                                <a href="watch.html?id=${item.id}&type=${type}" class="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-red-900/20">Смотреть</a>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join('') || '<p class="text-center text-gray-500 col-span-2 py-32">История пуста</p>'}
        </div>
    `;
}

function renderSettings(container, user) {
    container.innerHTML = `
        <div class="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Content & Safety -->
            <div class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 space-y-6">
                <h2 class="text-xl font-black mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Безопасность
                </h2>
                <div class="flex items-center justify-between p-4 bg-black/40 rounded-xl">
                    <div>
                        <h3 class="font-bold text-sm">Контент 18+</h3>
                        <p class="text-[10px] text-gray-500">Показывать взрослый контент</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="setting-adult" class="sr-only peer" ${user.settings?.include_adult ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                </div>
            </div>

            <!-- Player Settings -->
            <div class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 space-y-6">
                <h2 class="text-xl font-black mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Плеер
                </h2>
                <div class="flex items-center justify-between p-4 bg-black/40 rounded-xl">
                    <div>
                        <h3 class="font-bold text-sm">Центрирование</h3>
                        <p class="text-[10px] text-gray-500">Автоматически центрировать плеер</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="setting-center" class="sr-only peer" ${user.settings?.player_center ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <!-- UI Customization -->
            <div class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 space-y-6">
                <h2 class="text-xl font-black mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    Интерфейс
                </h2>
                <div class="space-y-4">
                    <div class="p-4 bg-black/40 rounded-xl">
                        <label class="block text-sm font-bold mb-2">Размер карточек</label>
                        <select id="setting-card-size" class="w-full bg-gray-800 border-none rounded-lg text-xs py-2 focus:ring-0">
                            <option value="small" ${user.settings?.card_size === 'small' ? 'selected' : ''}>Маленький</option>
                            <option value="medium" ${user.settings?.card_size === 'medium' || !user.settings?.card_size ? 'selected' : ''}>Средний</option>
                            <option value="large" ${user.settings?.card_size === 'large' ? 'selected' : ''}>Большой</option>
                        </select>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-black/40 rounded-xl">
                        <div>
                            <h3 class="font-bold text-sm">Анимация наведения</h3>
                            <p class="text-[10px] text-gray-500">Подъем карточек при наведении</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="setting-hover" class="sr-only peer" ${user.settings?.card_hover_disabled ? '' : 'checked'}>
                            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <div class="p-4 bg-black/40 rounded-xl">
                        <label class="block text-sm font-bold mb-2">Общий фон</label>
                        <select id="setting-bg-mode" class="w-full bg-gray-800 border-none rounded-lg text-xs py-2 focus:ring-0">
                            <option value="default" ${user.settings?.background_mode === 'default' || !user.settings?.background_mode ? 'selected' : ''}>Стандартный (Черный 90%)</option>
                            <option value="black" ${user.settings?.background_mode === 'black' ? 'selected' : ''}>Глубокий черный</option>
                            <option value="lava" ${user.settings?.background_mode === 'lava' ? 'selected' : ''}>Лавовая лампа</option>
                            <option value="dynamic" ${user.settings?.background_mode === 'dynamic' ? 'selected' : ''}>Динамический (Размытый баннер)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Danger Zone -->
            <div class="space-y-6">
                <div class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
                    <button id="apply-settings-btn" class="w-full py-4 bg-white text-black hover:bg-red-600 hover:text-white font-black rounded-xl transition shadow-xl transform hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-widest">
                        Применить изменения
                    </button>
                    <p class="mt-3 text-[10px] text-gray-500 font-bold uppercase">Настройки будут сохранены в облаке</p>
                </div>

                <div class="bg-gray-900/40 p-6 rounded-2xl border border-red-900/30 space-y-4">
                    <h2 class="text-xl font-black flex items-center gap-2 text-red-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Опасная зона
                    </h2>
                    <button id="clear-history-btn" class="w-full py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-bold rounded-xl transition text-sm">
                        Очистить историю просмотра
                    </button>
                </div>
            </div>
        </div>
    `;

    // Apply Settings Button logic
    document.getElementById('apply-settings-btn').onclick = async () => {
        const btn = document.getElementById('apply-settings-btn');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Сохранение...';

        try {
            const settings = {
                include_adult: document.getElementById('setting-adult').checked,
                player_center: document.getElementById('setting-center').checked,
                card_size: document.getElementById('setting-card-size').value,
                card_hover_disabled: !document.getElementById('setting-hover').checked,
                background_mode: document.getElementById('setting-bg-mode').value
            };

            const updatedUser = await updateSettings(settings);

            // Apply changes immediately
            const { applyGlobalSettings } = await import('./utils.js');
            applyGlobalSettings();

            btn.textContent = 'Успешно!';
            btn.classList.add('bg-green-600', 'text-white');
            btn.classList.remove('bg-white', 'text-black');

            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                btn.classList.remove('bg-green-600', 'text-white');
                btn.classList.add('bg-white', 'text-black');
                // Re-render tab to reflect changes in UI (like card sizes in favorites)
                renderActiveTab();
            }, 2000);

        } catch (err) {
            console.error('Failed to update settings:', err);
            btn.textContent = 'Ошибка!';
            btn.classList.add('bg-red-600', 'text-white');
            btn.classList.remove('bg-white', 'text-black');
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                btn.classList.remove('bg-red-600', 'text-white');
                btn.classList.add('bg-white', 'text-black');
            }, 2000);
        }
    };

    document.getElementById('clear-history-btn').onclick = async () => {
        if (!confirm('Вы уверены, что хотите полностью очистить историю просмотра?')) return;
        try {
            await clearHistory();
            renderActiveTab();
            alert('История успешно очищена');
        } catch (err) {
            console.error('Failed to clear history:', err);
        }
    };
}

// Global delete history item function
window.deleteHistoryItem = async (itemId, event) => {
    if (event) event.preventDefault();
    if (!confirm('Вы уверены, что хотите удалить этот элемент из истории?')) return;

    try {
        await removeFromHistory(itemId);
        // Re-render
        renderActiveTab();
    } catch (err) {
        console.error('Failed to delete history item:', err);
    }
};

initProfilePage();
