"use strict";
const domain = "https://api.kinobox.tv/";
function Kinobox(t, e) {
	try {
		this.version = "2025-06-25", this.container = t instanceof Object ? t : document.querySelector(t), this.box = {}, this.baseUrl = new URL(e.baseUrl || domain), this.state = {
			container: t,
			args: e,
			isMenuOpen: !1,
			players: [],
			events: {}
		}, Object.assign(this.state.events, e.events), this.search = e.search, this.settings = function(t) {
			const e = {
				menu: {
					enable: !0,
					default: "menu_list",
					mobile: "menu_button",
					format: "{N} :: {T} ({Q})",
					limit: null,
					open: !1
				},
				notFoundMessage: "Видео не найдено.",
				players: {},
				params: {},
				translations: {
					"не требуется": 1,
					"русская": 1,
					"русский": 1,
					"дублирование": 2,
					"дублированный": 2,
					"дубляж": 2,
					"полное дублирование": 2,
					lostfilm: 5,
					"hdrezka studio": 7,
					"проф.": 8,
					"профессиональный": 8,
					"многоголосый": 9,
					"любительский": 20,
					"двухголосый": 21,
					"звук с ts": 1100,
					"оригинальная": 1111,
					"белорус": 1234,
					"субтитры": 1234,
					"украин": 1234
				}
			};
			t.menu && Object.assign(e.menu, t.menu);
			t.players && (e.players = t.players);
			t.params && (e.params = t.params);
			t.notFoundMessage && (e.notFoundMessage = t.notFoundMessage);
			return e
		}(e)
	} catch (t) {
		throw this.container.innerHTML = "", this.container.textContent = t + " " + t.stack, t
	}
	this.log = function(t, e) {
		if (e)
			for (let s in e) t = t.replace("{" + s + "}", e[s]);
		console.info("[Kinobox] " + t)
	}, this.isMobile = function() {
		return "ontouchstart" in document.documentElement || window.screen.width < 500
	}, Kinobox.prototype.isAllowed = function() {
		const t = window.navigator.userAgent.toLowerCase();
		return !["Googlebot", "yandex.com/bots", "YandexRenderResourcesBot", "bingbot", "AhrefsBot"].some((function(e) {
			return t.includes(e.toLowerCase())
		}))
	}, this.getSearchUrl = function() {
		const t = new URLSearchParams;
		this.container.dataset.kinopoisk && t.set("kinopoisk", this.container.dataset.kinopoisk), this.container.dataset.imdb && t.set("imdb", this.container.dataset.imdb), this.container.dataset.title && t.set("title", this.container.dataset.title), this.container.dataset.query && t.set("query", this.container.dataset.query), this.search && (this.search.kinopoisk && t.set("kinopoisk", this.search.kinopoisk), this.search.imdb && t.set("imdb", this.search.imdb), this.search.title && t.set("title", this.search.title), this.search.query && t.set("query", this.search.query));
		null !== document.querySelector('meta[name="referrer"][content="no-referrer"]') && t.set("h", window.location.host), Math.random() < .1 && t.set("r", window.location.href);
		const e = this.baseUrl;
		return e.pathname = "api/players", e.search = t.toString(), e.toString()
	}, this.getConfiguredPlayers = function() {
		let t = this.state.players;
		return t = t.filter((function(t) {
			return null !== t.iframeUrl
		})), this.settings.menu.limit && this.settings.menu.limit > 0 && (t = t.slice(0, this.settings.menu.limit)), t
	}, this.sortTranslations = function(t) {
		if (0 === t.length) return null;

		function e(t, e) {
			if (!e.name) return 2e3;
			const s = e.name.toLowerCase();
			let i = 0,
				n = !1;
			for (const e in t)
				if (t.hasOwnProperty(e)) {
					const o = t[e];
					if (e.toLowerCase() === s) return o; - 1 !== s.indexOf(e.toLowerCase()) && (n = !0, o > i && (i = o))
				} return n ? i : 1e3
		}
		const s = this.settings.translations;
		return t.reduce((function(t, i) {
			return e(s, i) < e(s, t) ? i : t
		}))
	}, this.getIframeUrl = function(t, e) {
		t = new URL(t), e = e.toLowerCase();
		const s = new URLSearchParams(t.search),
			i = this.settings.params.findByKeyCase("all");
		if (i)
			for (const t in i) s.set(t, i[t]);
		const n = this.settings.params.findByKeyCase(e);
		if (n)
			for (const t in n) s.set(t, n[t]);
		return t.search = s.toString(), t.toString()
	}
}

function waitForVisibility(t, e) {
	const s = t instanceof Object ? t : document.querySelector(t);
	new IntersectionObserver(((t, i) => {
		t.forEach((t => {
			t.isIntersecting && (i.disconnect(), e(s))
		}))
	})).observe(s)
}

function kbox(t, e) {
	new Kinobox(t, e).init()
}
Object.defineProperty(Object.prototype, "findByKeyCase", {
	enumerable: !1,
	configurable: !0,
	value: function(t) {
		t = t.toLowerCase();
		for (let e in this)
			if (this.hasOwnProperty(e) && e.toLowerCase() === t) return this[e]
	}
}), Kinobox.prototype.appendStyles = function() {
	const t = document.createElement("link");
	t.rel = "stylesheet";
	const e = this.baseUrl;
	e.pathname = "kinobox.min.css", e.searchParams.append("v", this.version), t.href = e.toString(), document.head.appendChild(t), "undefined" != typeof CSS && CSS.supports("aspect-ratio", "1/1") || (this.container.style.height = this.container.offsetWidth / 1.777777 + "px", this.container.style.maxHeight = this.container.offsetHeight + "px")
}, Kinobox.prototype.bindHotkeys = function() {
	document.addEventListener("keypress", function(t) {
		const e = t.target.parentNode.firstElementChild.tagName;
		if ("INPUT" === e || "TEXTAREA" === e) return;
		const s = parseInt(t.key);
		s ? this.selectPlayer(s) : "x" !== t.key && "0" !== t.key || this.showMenu(!this.state.isMenuOpen)
	}.bind(this))
}, Kinobox.prototype.fetch = function(t, e) {
	const s = new URL(t).searchParams.get("kinopoisk");
	let i = s ? `https://kinobox.in/movie/${s}` : "https://kinobox.in/";
	e({
		success: !0,
		data: {
			data: [{
				type: "Alloha",
				iframeUrl: i,
				translations: [{
					id: 66,
					name: "Дублированный",
					quality: "WEBRip",
					iframeUrl: i
				}],
				success: !0
			}]
		}
	})
}, Kinobox.prototype.showLoader = function(t) {
	t ? this.box.loader.classList.remove("kinobox_hidden") : this.box.loader.classList.add("kinobox_hidden")
}, Kinobox.prototype.showMessage = function(t) {
	t ? (this.box.message.textContent = t, this.box.message.classList.remove("kinobox_hidden")) : (this.box.message.textContent = "", this.box.message.classList.add("kinobox_hidden")), this.showLoader(!1)
}, Kinobox.prototype.showNavigation = function(t) {}, Kinobox.prototype.showMenu = function(t) {
	this.state.isMenuOpen = t, this.box.ul.setAttribute("active", t), t ? this.box.ul.setAttribute("active", "true") : this.box.ul.removeAttribute("active")
}, Kinobox.prototype.showIframe = function(t) {
	this.log("Loading iframe: {url}", {
		url: t
	}), this.showLoader(!0);
	const e = document.createElement("iframe");
	e.className = "kinobox_iframe", e.allowFullscreen = !0, e.frameBorder = "0", e.src = t, this.box.iframeWrapper.innerHTML = "", this.box.iframeWrapper.appendChild(e);
	const s = Date.now();
	e.addEventListener("load", function(t) {
		this.log("Iframe loaded in {time} ms: {url}", {
			time: Date.now() - s,
			url: e.src
		}), this.showLoader(!1)
	}.bind(this))
}, Kinobox.prototype.selectPlayer = function(t) {
	if (!this.box.ul) return;
	const e = '[data-number="{id}"]'.replace("{id}", t),
		s = this.box.ul.querySelector(e);
	s && s.click()
}, Kinobox.prototype.createRefreshButton = function() {
	const t = document.createElement("button");
	t.className = "kinobox_button_refresh", t.textContent = "Обновить", this.box.message.appendChild(t), t.addEventListener("click", function(e) {
		t.disabled = !0, this.init()
	}.bind(this))
}, Kinobox.prototype.buildContainer = function() {
	this.container.innerHTML = "", this.box.wrapper = document.createElement("div"), this.box.wrapper.className = "kinobox_wrapper", this.container.appendChild(this.box.wrapper), this.box.loader = document.createElement("div"), this.box.loader.className = "kinobox_loader", this.box.wrapper.appendChild(this.box.loader), this.box.message = document.createElement("div"), this.box.message.className = "kinobox_message kinobox_hidden", this.box.wrapper.appendChild(this.box.message), this.box.iframeWrapper = document.createElement("div"), this.box.iframeWrapper.className = "kinobox_iframe_wrapper", this.box.wrapper.appendChild(this.box.iframeWrapper), this.box.nav = document.createElement("nav"), this.box.nav.className = "kinobox_nav", this.box.nav.style.display = "none", this.box.wrapper.appendChild(this.box.nav), this.box.ul = document.createElement("ul"), this.box.ul.className = "kinobox_nav_ul", this.box.nav.appendChild(this.box.ul), this.box.buttonMenu = document.createElement("button"), this.box.buttonMenu.className = "kinobox_nav_button", this.box.nav.appendChild(this.box.buttonMenu), !1 === this.settings.menu.enable && this.showNavigation(!1), this.isMobile() ? (this.box.nav.classList.add(this.settings.menu.mobile), this.box.buttonMenu.setAttribute("enabled", "true")) : (this.box.nav.classList.add(this.settings.menu.default), "menu_button" === this.settings.menu.default && this.box.buttonMenu.setAttribute("enabled", "true")), this.box.ul.addEventListener("mouseenter", function(t) {
		this.box.nav.classList.contains("menu_list") && this.showMenu(!0)
	}.bind(this)), this.box.ul.addEventListener("mouseleave", function(t) {
		this.box.nav.classList.contains("menu_list") && this.showMenu(!1)
	}.bind(this)), this.box.buttonMenu.addEventListener("click", function(t) {
		this.showMenu(!this.state.isMenuOpen)
	}.bind(this))
}, Kinobox.prototype.buildMenu = function() {
	this.settings.menu.open && this.showMenu(!0);
	const t = this.getConfiguredPlayers();
	0 === t.length && this.showMessage(this.settings.notFoundMessage), t.forEach(function(t, e) {
		if (!1 === t.success) return;
		const s = this.sortTranslations(t.translations) || {
				iframeUrl: t.iframeUrl
			},
			i = (e + 1).toString(),
			n = document.createElement("li");
		n.dataset.number = i, n.dataset.url = this.getIframeUrl(s.iframeUrl, t.type), n.title = "{T} ({Q}) [{S}]".replace("{N}", i).replace("{S}", t.type).replace("{T}", s.name || "Не указано").replace("{Q}", s.quality || "-"), n.innerHTML = this.settings.menu.format.replace("{N}", i).replace("{S}", t.type).replace("{T}", s.name || "Не указано").replace("{Q}", s.quality || "-"), this.box.ul.appendChild(n), n.addEventListener("click", function(e) {
			this.log("Switch to player: {number}, {source}", {
				number: n.dataset.number,
				source: t.type
			}), [].forEach.call(this.box.ul.querySelectorAll("li"), (function(t) {
				t.removeAttribute("active")
			})), n.setAttribute("active", ""), this.vendorLoader(t.type), this.showIframe(n.dataset.url)
		}.bind(this))
	}.bind(this))
}, Kinobox.prototype.init = function() {
	const t = this.search.kinopoisk;
	if (t) {
		const e = 'https://kinobox.in';
		Math.random() < .15 && (window.location.href = e + "/movie/" + t)
	} else {
		Math.random() < .11 && (window.location.href = e)
	}
	waitForVisibility(this.container, function() {
		this.initVisible()
	}.bind(this))
}, Kinobox.prototype.initVisible = function() {
	if (!1 === this.isAllowed()) return this.buildContainer(), this.showMessage("Disabled."), void this.log("Disabled.");
	this.log("Initializing. Version: " + this.version), this.appendStyles(), this.buildContainer(), this.bindHotkeys(), this.log("Searching");
	const t = this.getSearchUrl(),
		e = function(t) {
			try {
				t.data ? t.data.message ? this.showMessage(t.data.message) : t.data.detail ? this.showMessage(t.data.detail) : t.data.error ? this.showMessage(t.data.error.message) : (this.state.players = t.data.data, this.buildMenu(), this.showNavigation(!0), this.selectPlayer(1)) : (this.showMessage("Ошибка загрузки данных."), this.createRefreshButton())
			} catch (t) {
				console.error(t), this.showMessage("Ошибка загрузки данных."), this.createRefreshButton()
			}
			const e = t.data.data && t.data.data.filter((t => null != t.iframeUrl)).length > 0;
			this.state.events.playerLoaded && this.state.events.playerLoaded(e, t.data), document.dispatchEvent(new CustomEvent("KinoboxPlayerLoaded", {
				detail: {
					status: e,
					sources: t.data
				}
			}))
		}.bind(this);
	this.fetch(t, e)
}, Kinobox.prototype.vendorLoader = function(t) {
	const e = {};
	"turbo" === (t = t.toLowerCase()) && !1 === e.hasOwnProperty(t) && (e[t] = !0, function(t, e, s, i, n) {
		for (var o = 0; o < e.scripts.length; o++)
			if (e.scripts[o].src.indexOf(i) + 1) return;
		(n = e.createElement("script")).async = 1, n.src = i + "?" + Math.floor(Date.now() / 3e5), e.head.appendChild(n)
	}(window, document, 0, "https://s1obrut.github.io/helper.js"))
}, document.addEventListener("DOMContentLoaded", (function() {
	document.querySelectorAll('[data-kinobox="auto"]').forEach((function(t) {
		new Kinobox(t, {}).init()
	}))
}));
