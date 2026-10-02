<div align="center">
  <img src="docs/media/banner.png" alt="Encelada banner: name, description, technologies and a screenshot of the home page" width="100%">
  <h1><img src="images/logo.webp" alt="Encelada logo" width="36" height="36" align="top"> ENCELADA</h1>
  <p><strong>A web cinema for movies, series and anime: a searchable catalog, a personal library, watch history and an airing schedule for ongoing anime.</strong></p>
  <p>
    <a href="#run-locally">Run it</a> ·
    <a href="#features">Features</a> ·
    <a href="#demo">Demo</a> ·
    <a href="#how-it-works">How it works</a> ·
    <a href="ARCHITECTURE.md">Architecture</a> ·
    <a href="README.md">Русский</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js 20+">
    <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express 4">
    <img src="https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white" alt="SQLite">
    <img src="https://img.shields.io/badge/UI-Vanilla%20JS-F7DF1E?logo=javascript&logoColor=111111" alt="Vanilla JavaScript">
  </p>
</div>

<div align="center">
  <img src="docs/media/demo.gif" alt="Recording of the running app: home page with a featured banner, scrolling the catalog, opening a series page with its description and trailer" width="100%">
</div>

<sub>Recorded from the locally running app with the scenario in <a href="demo.scenario.yaml">demo.scenario.yaml</a>. Catalog titles and banners come from the connected APIs and change over time. The interface is in Russian.</sub>

## Features

- Separate catalogs for movies, series, anime and trends.
- Search and genre filters; popular over 1, 7 and 30 days.
- For anime: ongoing titles and a weekly schedule based on TMDB air dates.
- Title page: description, trailer, cast and creators, rating, comments with voting.
- Accounts, a personal library, watch history and playback progress; Telegram sign-in when a bot is configured.
- Interface preferences and an 18+ content filter.
- Russian-language interface and TMDB queries; user data and cache in SQLite.

## Demo

Everything below is recorded from the locally running app; the 3D staging was added in editing.

| Live search | Anime: ongoing titles and schedule |
|---|---|
| ![A title is typed into the search box and results with posters appear below it](docs/media/demo-search.gif) | ![Anime page: scrolling the catalog and switching to the weekly schedule of ongoing titles](docs/media/demo-anime.gif) |

### Pages

| Carousel | Cube |
|---|---|
| ![Five pages of the app take turns: home, movies, anime, a title page, series](docs/media/pages-carousel.gif) | ![Four pages of the app on the faces of a rotating cube](docs/media/pages-cube.gif) |

| Stack | Wall |
|---|---|
| ![Pages lie in a stack; the top one flies away and reveals the next](docs/media/pages-stack.gif) | ![Pages stand in a row and the camera travels along them](docs/media/pages-wall.gif) |

### On a computer and on a phone

| Laptop and phone | Mobile layout |
|---|---|
| ![A movie page on a laptop and the same page on a phone](docs/media/devices-duo.gif) | ![Four phones: home, movies, anime and a title page in the mobile layout](docs/media/phones-row.gif) |

## Interface

| Home | Anime catalog |
|---|---|
| ![Home page: featured banner and collections](docs/media/home.jpg) | ![Anime catalog: title cards with ratings and filters](docs/media/anime-catalog.jpg) |

| Title page | Profile and statistics |
|---|---|
| ![Movie page: poster, description, trailer and watchlist control](docs/media/details-main.jpg) | ![User profile: dashboard, history and watch chart](docs/media/profile-dashboard.png) |

<details>
<summary>More screenshots: movies, series, trends, comments, statistics, sign-in</summary>

| Movies | Series |
|---|---|
| ![Movie catalog with collections](docs/media/movies.jpg) | ![Series catalog with a banner](docs/media/series.jpg) |

| Anime | Anime: ongoing banner |
|---|---|
| ![Anime page with title artwork](docs/media/anime.jpg) | ![Anime page banner and catalog navigation](docs/media/anime-hero.jpg) |

| Trends and filters | Cast and rating |
|---|---|
| ![Trends page: categories and genres](docs/media/trends-filters.png) | ![Cast, creators and rating of a movie](docs/media/details-cast-rating.png) |

| Comments | Watch statistics |
|---|---|
| ![Movie comments: reviews, spoilers and reactions](docs/media/details-comments.png) | ![Watch statistics chart](docs/media/stats-chart.png) |

![Sign-in page](docs/media/login.png)

</details>

## Run locally

You need Node.js 20 or later, npm and a [TMDB API](https://www.themoviedb.org/settings/api) key. No separate SQLite install is required: the app uses `better-sqlite3`.

```bash
git clone https://github.com/ArabKustam/encelada-film.git
cd encelada-film
npm install
```

Create `.env` from the template and put your `TMDB_API_KEY` in it:

```bash
cp .env.example .env
```

In Windows PowerShell use `Copy-Item .env.example .env` instead of `cp`.

```bash
npm start
```

Open the address printed in the terminal. The default port is `3000`; if it is taken and `PORT` is not set, the server tries the next free one. The SQLite database is created at `data/cinema.db`.

## Configuration

The server reads five environment variables:

| Variable | Required | Used for |
|---|---|---|
| `TMDB_API_KEY` | yes | catalog, search, title pages |
| `PORT` | no | server port, `3000` by default |
| `FANART_API_KEY` | no | backgrounds and logos from Fanart.tv; without the key they are simply not shown |
| `TELEGRAM_BOT_TOKEN` | no | Telegram sign-in |
| `TELEGRAM_BOT_NAME` | no | Telegram sign-in |

The other lines of the [`.env.example`](.env.example) template are not used by the current server. Do not commit `.env` or real keys.

## How it works

![Diagram: the user, a screenshot of the interface, the Express server and backend modules; requests travel along the links, with captions naming the method, path and handler line](docs/media/how-it-works.gif)

The walk-through is built from the code: links are imports and the pages' calls to `/api/*`, captions are real routes from `server.js` with line numbers (captions are in Russian).


```mermaid
flowchart LR
  user(["User"])
  pages["HTML pages<br/>ES modules in js/"]
  server["server.js<br/>Express, /api/*"]
  backend["backend/<br/>catalog, content filter"]
  db[("SQLite<br/>data/cinema.db")]
  ext["TMDB · Fanart · Telegram"]
  user --> pages
  pages -- HTTP --> server
  server --> backend
  backend --> db
  server --> ext
```

There is no bundler: pages load browser ES modules directly, and the server serves static files and the API. The module map and notes on collections and the content filter are in [ARCHITECTURE.md](ARCHITECTURE.md) (in Russian).

## Tests

```bash
node --test tests/*.test.cjs
```

Regression checks for the 18+ settings, history, collections, the API and protected static files. They do not modify the user database.

## Limitations

- Authentication is simplified: the session token is not signed and passwords are hashed with unsalted SHA-256. The project is meant to run locally; replace the authentication before deploying it publicly.
- The catalog depends entirely on external APIs: without `TMDB_API_KEY` and a network connection the pages stay empty.
- Dates in the anime schedule are original air dates from TMDB; the source has no dates for Russian dubs.
- The repository has no license file yet.

## Credits

Catalog data and imagery are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This project is not endorsed by or affiliated with TMDB. Please follow the terms of the APIs and services you connect.

<div align="center"><sub>Built for people who love a good story.</sub></div>
