# WeatherNow — Real-Time Weather App

**Live Demo:** [https://tanhoang0803.github.io/Weather_app/](https://tanhoang0803.github.io/Weather_app/)

A clean, responsive weather web application built with **vanilla HTML, CSS, and JavaScript**.
Get real-time weather conditions and a 5-day forecast for any city in the world — no frameworks, no build tools.

---

## Features

| Feature | Description |
|---|---|
| **Live Weather Data** | Temperature, humidity, wind speed, pressure, visibility |
| **5-Day Forecast** | Daily high/low with weather icons |
| **Geolocation** | "My Location" button auto-detects your city |
| **Unit Toggle** | Switch between °C / km/h and °F / mph instantly |
| **Recent Searches** | Last 5 searched cities saved locally, clickable as quick tags |
| **Dynamic Backgrounds** | App gradient changes based on actual weather (sunny, rainy, snowy, etc.) |
| **Sunrise & Sunset** | Local sunrise and sunset times for the searched city |
| **Error Handling** | Friendly messages for city-not-found, network errors, denied location |
| **Loading State** | Animated spinner while fetching data |
| **Responsive Design** | Works on desktop, tablet, and mobile |

---

## Screenshots

```
┌──────────────────────────────────────────┐
│  ☁️ WeatherNow    [📍 My Location] [°F]  │
│                                          │
│  [ Search for a city...          🔍 ]   │
│  Recent: Hanoi  Tokyo  London           │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Ho Chi Minh City, VN              │  │
│  │  Friday, February 28, 2026         │  │
│  │                                    │  │
│  │    ☁️      32°C                    │  │
│  │            Feels like 38°C         │  │
│  │            Scattered clouds        │  │
│  │                                    │  │
│  │  💧 82%   💨 18km/h  👁 10km      │  │
│  │  📊 1012  🌅 06:14   🌇 18:03     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  5-DAY FORECAST                          │
│  ┌──────┬──────┬──────┬──────┬──────┐   │
│  │ Sat  │ Sun  │ Mon  │ Tue  │ Wed  │   │
│  │  ☁️  │  🌧  │  ☀️  │  ☀️  │  ⛅  │   │
│  │33/27 │31/26 │34/28 │35/29 │33/27 │   │
└──┴──────┴──────┴──────┴──────┴──────┘
```

---

## Getting Started

### 1. Get a Free API Key

1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Go to **API Keys** in your account dashboard
3. Copy your key (it activates within ~10 minutes of signup)

The free tier allows **1,000 API calls/day** — more than enough for personal use.

### 2. Configure the App

Open `resouces/js/app.js` and replace the placeholder on line 1:

```js
// Before
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

// After
const API_KEY = 'a1b2c3d4e5f6...'; // your real key
```

### 3. Open in Browser

No server needed — just open `resouces/index.html` directly in any modern browser:

```
File → Open File → resouces/index.html
```

Or with VS Code Live Server, right-click `index.html` → **Open with Live Server**.

---

## Project Structure

```
Weather app on Website/
├── README.md
├── CLAUDE.md
└── resouces/
    ├── index.html        ← App entry point
    ├── css/
    │   └── index.css     ← All styles
    ├── js/
    │   └── app.js        ← All JavaScript
    └── images/
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

---

## How It Works

1. **Search** — Type a city name and press Enter or click the search button
2. **Geolocation** — Click "My Location" to auto-detect and load your city's weather
3. **Unit toggle** — Click the °F / °C button in the top-right to switch units
4. **Recent cities** — Appear as clickable tags below the search bar after your first searches
5. **Auto-load** — On next visit, the app automatically loads the last city you searched

---

## API Endpoints Used

| Purpose | Endpoint |
|---|---|
| Current weather (by city) | `/data/2.5/weather?q={city}&appid={key}&units={unit}` |
| Current weather (by coords) | `/data/2.5/weather?lat={lat}&lon={lon}&appid={key}&units={unit}` |
| 5-day forecast (by city) | `/data/2.5/forecast?q={city}&appid={key}&units={unit}` |
| 5-day forecast (by coords) | `/data/2.5/forecast?lat={lat}&lon={lon}&appid={key}&units={unit}` |

---

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Flexbox, CSS Grid, `backdrop-filter`, CSS animations
- **JavaScript (ES2020)** — `async/await`, `Promise.all`, `localStorage`, Geolocation API
- **[OpenWeatherMap API](https://openweathermap.org/)** — Free weather data provider

No npm, no build step, no frameworks.

---

## Browser Support

Works in all modern browsers:

| Chrome | Firefox | Safari | Edge |
|--------|---------|--------|------|
| ✅ 88+ | ✅ 90+ | ✅ 14+ | ✅ 88+ |

---

## Author

**TanQHoang** — July 2024

Weather data provided by [OpenWeatherMap](https://openweathermap.org/).
