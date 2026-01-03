import { renderCommentItem, renderRatingBar } from './components.js';
import { getComments, postComment, voteComment, rateMedia } from './api.js';

export function initCommentsLogic(id, type) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    // --- Character Count ---
    const textarea = document.getElementById('comment-textarea');
    if (textarea) {
        textarea.addEventListener('input', () => {
            const count = document.getElementById('char-count');
            if (count) count.textContent = `${textarea.value.length} / 1500 символов`;
        });
    }

    // --- Rating Handlers ---
    window.highlightStars = (rating) => {
        const btns = document.querySelectorAll('.star-btn');
        btns.forEach(btn => {
            const val = parseInt(btn.dataset.star);
            if (val <= rating) {
                btn.classList.add('text-yellow-500');
                btn.classList.remove('text-gray-700');
            } else {
                btn.classList.remove('text-yellow-500');
                btn.classList.add('text-gray-700');
            }
        });
        const label = document.getElementById('rating-label');
        if (label) label.textContent = `${rating} / 10 звезд`;
    };

    window.resetStars = () => {
        const btns = document.querySelectorAll('.star-btn');
        btns.forEach(btn => {
            btn.classList.remove('text-yellow-500');
            btn.classList.add('text-gray-700');
        });
        const label = document.getElementById('rating-label');
        if (label) label.textContent = 'Наведите на звезды';
    };

    window.handleRate = async (itemId, type, rating) => {
        if (!token) {
            alert('Войдите, чтобы поставить оценку');
            return;
        }
        await rateMedia(itemId, type, rating);
        const container = document.getElementById(`rating-container-${itemId}`);
        if (container) {
            container.outerHTML = renderRatingBar(itemId, type, rating);
        }
    };

    window.showRatingSelector = () => {
        document.getElementById('rating-display').classList.add('hidden');
        document.getElementById('rating-selector').classList.remove('hidden');
    };

    // --- Comment Handlers ---
    window.toggleComments = async () => {
        const container = document.getElementById('comments-container');
        const btnText = document.getElementById('toggle-comments-text');
        const eyeOpen = document.getElementById('eye-open');
        const eyeClosed = document.getElementById('eye-closed');
        const eyePath = document.getElementById('eye-path');

        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            btnText.textContent = 'Скрыть комментарии';
            eyeOpen.classList.add('hidden');
            eyePath.classList.add('hidden');
            eyeClosed.classList.remove('hidden');
            loadComments(id, type);
        } else {
            container.classList.add('hidden');
            btnText.textContent = 'Открыть комментарии';
            eyeOpen.classList.remove('hidden');
            eyePath.classList.remove('hidden');
            eyeClosed.classList.add('hidden');
        }
    };

    window.revealSpoiler = (cid) => {
        const text = document.getElementById(`text-${cid}`);
        const reveal = document.getElementById(`reveal-${cid}`);
        text.classList.remove('blur-md', 'select-none');
        reveal.classList.add('hidden');
    };

    window.submitComment = async (mid, mtype) => {
        const textarea = document.getElementById('comment-textarea');
        const spoilerCheck = document.getElementById('spoiler-check');
        const text = textarea.value.trim();

        if (!text) return;

        try {
            const res = await postComment(mid, mtype, text, spoilerCheck.checked, window.currentReplyTo || null);
            if (res.success) {
                textarea.value = '';
                spoilerCheck.checked = false;
                window.currentReplyTo = null;
                const replyIndicator = document.getElementById('reply-indicator');
                if (replyIndicator) replyIndicator.remove();
                loadComments(mid, mtype); // Refresh list
            }
        } catch (e) {
            alert('Ошибка при отправке комментария');
        }
    };

    window.vote = async (cid, vtype) => {
        if (!token) return alert('Войдите, чтобы голосовать');
        const res = await voteComment(cid, vtype);
        if (res.success) {
            // Re-render specific comment
            const commentEl = document.getElementById(`comment-${cid}`);
            if (commentEl) {
                const currentUserId = user?.id;
                commentEl.outerHTML = renderCommentItem(res.comment, currentUserId);
            }
        }
    };

    window.replyTo = (cid, username) => {
        const textarea = document.getElementById('comment-textarea');
        if (textarea) {
            window.currentReplyTo = cid;

            // Add visual indicator of replying
            let indicator = document.getElementById('reply-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'reply-indicator';
                indicator.className = 'flex items-center justify-between bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-lg mb-4 text-xs';
                textarea.parentNode.insertBefore(indicator, textarea);
            }
            indicator.innerHTML = `
                <span class="text-gray-300 font-bold uppercase tracking-widest">Ответ пользователю <span class="text-red-500">${username}</span></span>
                <button onclick="window.cancelReply()" class="text-gray-500 hover:text-white transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            `;

            textarea.focus();
            textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    window.cancelReply = () => {
        window.currentReplyTo = null;
        const indicator = document.getElementById('reply-indicator');
        if (indicator) indicator.remove();
    };

    window.toggleBranch = (cid) => {
        const branch = document.getElementById(`branch-${cid}`);
        const btn = document.getElementById(`toggle-btn-${cid}`);
        const indicator = btn.querySelector('.toggle-indicator');

        if (branch.classList.contains('hidden')) {
            branch.classList.remove('hidden');
            btn.innerHTML = btn.innerHTML.replace('Показать ответы', 'Скрыть ответы');
            indicator?.style.setProperty('transform', 'rotate(180deg)');
        } else {
            branch.classList.add('hidden');
            btn.innerHTML = btn.innerHTML.replace('Скрыть ответы', 'Показать ответы');
            indicator?.style.setProperty('transform', 'rotate(0deg)');
        }
    };

    async function loadComments(mid, mtype) {
        const list = document.getElementById('comments-list');
        list.innerHTML = '<div class="text-center py-8 text-gray-500">Загрузка...</div>';

        try {
            const comments = await getComments(mid, mtype);
            if (comments.length === 0) {
                list.innerHTML = '<p class="text-center py-12 text-gray-600 bg-gray-900/10 rounded-2xl">Будьте первым, кто оставит комментарий!</p>';
                return;
            }

            // Build tree
            const commentMap = {};
            const roots = [];

            comments.forEach(c => {
                commentMap[c.id] = { ...c, replies: [] };
            });

            comments.forEach(c => {
                if (c.parentId && commentMap[c.parentId]) {
                    commentMap[c.parentId].replies.push(commentMap[c.id]);
                } else {
                    roots.push(commentMap[c.id]);
                }
            });

            // Sort roots by newest first
            roots.sort((a, b) => b.timestamp - a.timestamp);

            const currentUserId = user?.id;

            function renderTree(items, level = 0) {
                return items.map(c => {
                    // Sort replies by oldest first (chronological)
                    const sortedReplies = c.replies.sort((a, b) => a.timestamp - b.timestamp);
                    return renderCommentItem(c, currentUserId, level, sortedReplies.length > 0, renderTree(sortedReplies, level + 1));
                }).join('');
            }

            list.innerHTML = renderTree(roots);
        } catch (e) {
            list.innerHTML = '<p class="text-center py-12 text-red-900/50">Не удалось загрузить комментарии</p>';
        }
    }
}
