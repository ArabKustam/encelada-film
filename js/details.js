import { renderHeader, renderFooter, renderMovieDetails, renderCast, renderTrailer } from './components.js';
import { getMovieDetails, getTVSeriesDetails, getItemCredits, getItemVideos, updateLibraryStatus, addToHistory } from './api.js';
import { initMobileMenu, updateAuthLinks, initSearch } from './utils.js';

let currentItem = null;

async function initDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type') || 'movie';

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    // Render basic structure
    app.innerHTML = renderHeader();
    initMobileMenu();
    updateAuthLinks();
    initSearch(); // Initialize search in header

    try {
        // Fetch data in parallel
        const fetchDetails = type === 'movie' ? getMovieDetails(id) : getTVSeriesDetails(id);
        const [item, credits, videoData] = await Promise.all([
            fetchDetails,
            getItemCredits(type, id),
            getItemVideos(type, id)
        ]);

        currentItem = item;

        // Add to history
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && localStorage.getItem('token')) {
            addToHistory(item, type).catch(err => console.error('History update failed:', err));
        }

        document.title = `${item.title || item.name} - Онлайн Кинотеатр`;

        // Render main content
        const main = document.createElement('main');
        main.innerHTML = renderMovieDetails(item, type, credits);
        app.appendChild(main);

        // Render secondary parts after main is in DOM
        const castList = document.getElementById('cast-list');
        const trailerPlayer = document.getElementById('trailer-player');

        if (castList) castList.innerHTML = renderCast(credits.cast);
        if (trailerPlayer) trailerPlayer.innerHTML = renderTrailer(videoData.results);

        app.insertAdjacentHTML('beforeend', renderFooter());

    } catch (error) {
        console.error('Error loading details:', error);
        app.innerHTML = renderHeader();
        app.insertAdjacentHTML('beforeend', `
            <div class="pt-32 text-center h-[60vh] flex flex-col items-center justify-center">
                <h1 class="text-4xl font-bold mb-4">Ошибка загрузки</h1>
                <p class="text-gray-400 mb-8">Не удалось загрузить информацию о контенте.</p>
                <a href="index.html" class="px-6 py-2 bg-red-600 rounded-lg">На главную</a>
            </div>
        `);
        app.insertAdjacentHTML('beforeend', renderFooter());
    }
}

// Global update status function
window.updateStatus = async (itemId, type, status) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !localStorage.getItem('token')) {
        alert('Пожалуйста, войдите в аккаунт, чтобы сохранять фильмы.');
        window.location.href = 'login.html';
        return;
    }

    try {
        await updateLibraryStatus(itemId, type, status, currentItem);
        // Refresh page to show new status
        window.location.reload();
    } catch (error) {
        console.error('Status update failed:', error);
        alert('Не удалось обновить статус. Попробуйте позже.');
    }
};

initDetailsPage();
