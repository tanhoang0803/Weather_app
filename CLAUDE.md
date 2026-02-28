# CLAUDE.md — Weather App Project

## Project Overview
A real-time weather web application built with vanilla HTML, CSS, and JavaScript.
It fetches live weather data from the **OpenWeatherMap API** and displays current
conditions plus a 5-day forecast. No build tools or frameworks — pure front-end.

## File Structure
```
Weather app on Website/
├── CLAUDE.md              ← This file (AI assistant instructions)
├── README.md              ← Human-facing documentation
└── resouces/              ← Note: intentionally misspelled folder name (legacy)
    ├── index.html         ← Single-page app entry point
    ├── css/
    │   └── index.css      ← All styles (glassmorphism, dynamic backgrounds, responsive)
    ├── js/
    │   └── app.js         ← All JavaScript logic
    └── images/            ← Local weather icons (PNG)
        ├── clear.png
        ├── clouds.png
        ├── drizzle.png
        ├── humidity.png
        ├── mist.png
        ├── rain.png
        ├── search.png
        ├── snow.png
        └── wind.png
```

## Tech Stack
- **HTML5** — semantic markup, no frameworks
- **CSS3** — custom properties, grid, flexbox, backdrop-filter, animations
- **JavaScript (ES2020)** — async/await, localStorage, Geolocation API
- **OpenWeatherMap API** — free tier (current weather + 5-day forecast endpoints)

## Key Architecture Decisions
- **Single JS file** (`app.js`) — all logic in one place, no bundler needed
- **CSS classes for weather backgrounds** — body gets a class like `bg-clear`, `bg-rain` etc.
- **localStorage** — persists last 5 searched cities; auto-loads most recent on startup
- **Dual API calls** — `Promise.all()` fetches current + forecast simultaneously
- **Unit system** — `metric` (°C, km/h) or `imperial` (°F, mph); wind speed from API is
  m/s in metric so it is multiplied ×3.6 to convert to km/h

## API Configuration
The API key lives in `resouces/js/app.js` at the top:
```js
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
```
Obtain a free key at https://openweathermap.org/api — free tier allows 1,000 calls/day.

Endpoints used:
- Current weather: `GET /data/2.5/weather?q={city}&appid={key}&units={unit}`
- Forecast:        `GET /data/2.5/forecast?q={city}&appid={key}&units={unit}`
- By coords:       `GET /data/2.5/weather?lat={lat}&lon={lon}&appid={key}&units={unit}`

## Conventions
- **CSS naming** — BEM-like flat class names (`.weather-card`, `.detail-value`, `.forecast-grid`)
- **JS style** — small named functions, no classes, functional flow
- **Error handling** — user-friendly emoji messages shown in `.error-message` div
- **Hidden elements** — toggle via `.hidden` class (`display: none`) not JS display property
- **No external JS libraries** — keep zero dependencies

## Development Notes
- The folder is named `resouces` (typo) — do NOT rename it; changing it would break paths
- Images are local PNGs; OpenWeatherMap also provides icon URLs but local is faster
- `forecast` endpoint returns data every 3 hours; filter for `12:00:00` to get daily summary
- `wind.speed` in metric API response is m/s — convert: `speed_kmh = speed_ms * 3.6`
- Visibility from API is in metres — convert: `km = visibility / 1000`

## Author
TanQHoang — created July 2024
