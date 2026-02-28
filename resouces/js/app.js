/**
 * WeatherNow — app.js
 *
 * Powered by OpenWeatherMap Free API (1,000 calls/day)
 * Get your free key at: https://openweathermap.org/api
 *
 * Replace the value below with your real API key before opening the app.
 */
const API_KEY = '20d2a4973cc1cd3980d6a4d01c047d93';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ─── DOM REFERENCES ───────────────────────────────────────────
const loadingOverlay   = document.querySelector('.loading-overlay');
const searchForm       = document.querySelector('.search-form');
const searchInput      = document.querySelector('.search-input');
const locationBtn      = document.querySelector('.location-btn');
const unitToggleBtn    = document.querySelector('.unit-toggle');
const errorDiv         = document.querySelector('.error-message');
const weatherCard      = document.querySelector('.weather-card');
const forecastSection  = document.querySelector('.forecast-container');
const recentDiv        = document.querySelector('.recent-searches');
const recentTagsDiv    = document.querySelector('.recent-tags');

// ─── STATE ────────────────────────────────────────────────────
let currentUnit  = 'metric';   // 'metric' = °C / km/h | 'imperial' = °F / mph
let lastCity     = '';
let recentCities = JSON.parse(localStorage.getItem('wn_recent')) || [];

// Maps OpenWeatherMap condition names → local image paths
const ICONS = {
    Clear:        './images/clear.png',
    Clouds:       './images/clouds.png',
    Rain:         './images/rain.png',
    Drizzle:      './images/drizzle.png',
    Thunderstorm: './images/rain.png',
    Snow:         './images/snow.png',
    Mist:         './images/mist.png',
    Haze:         './images/mist.png',
    Fog:          './images/mist.png',
    Smoke:        './images/mist.png',
    Dust:         './images/mist.png',
    Sand:         './images/mist.png',
    Ash:          './images/mist.png',
    Squall:       './images/rain.png',
    Tornado:      './images/mist.png',
};

// Maps condition names → CSS body class for background gradient
const BG_CLASSES = {
    Clear:        'bg-clear',
    Clouds:       'bg-clouds',
    Rain:         'bg-rain',
    Drizzle:      'bg-drizzle',
    Thunderstorm: 'bg-thunderstorm',
    Snow:         'bg-snow',
    Mist:         'bg-mist',
    Haze:         'bg-mist',
    Fog:          'bg-mist',
};

// ─── INITIALISE ───────────────────────────────────────────────
function init() {
    renderRecentTags();

    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const city = searchInput.value.trim();
        if (city) {
            fetchByCity(city);
            searchInput.value = '';
        }
    });

    locationBtn.addEventListener('click', fetchByLocation);

    unitToggleBtn.addEventListener('click', () => {
        currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
        unitToggleBtn.textContent = currentUnit === 'metric' ? '\u00B0F' : '\u00B0C';
        if (lastCity) fetchByCity(lastCity);
    });

    // Auto-load last searched city on startup
    if (recentCities.length > 0) {
        fetchByCity(recentCities[0]);
    }
}

// ─── FETCH BY CITY NAME ───────────────────────────────────────
async function fetchByCity(city) {
    setLoading(true);
    clearError();
    try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${currentUnit}`),
            fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${currentUnit}`),
        ]);

        if (!weatherRes.ok) {
            if (weatherRes.status === 401) throw new Error('API key not active yet. New keys take up to 2 hours to activate. Check openweathermap.org → My Profile → API Keys.');
            if (weatherRes.status === 404) throw new Error('\uD83D\uDD0D City not found. Please check the spelling and try again.');
            throw new Error('\u26A0\uFE0F Could not fetch weather data. Please try again later.');
        }

        const [weatherData, forecastData] = await Promise.all([weatherRes.json(), forecastRes.json()]);

        renderWeather(weatherData);
        renderForecast(forecastData);
        saveCity(weatherData.name);
        lastCity = weatherData.name;

    } catch (err) {
        showError(err.message);
        weatherCard.classList.add('hidden');
        forecastSection.classList.add('hidden');
    } finally {
        setLoading(false);
    }
}

// ─── FETCH BY GPS COORDINATES ─────────────────────────────────
function fetchByLocation() {
    if (!navigator.geolocation) {
        showError('\uD83D\uDCCD Geolocation is not supported by this browser.');
        return;
    }
    setLoading(true);
    clearError();
    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            try {
                const { latitude: lat, longitude: lon } = coords;
                const [weatherRes, forecastRes] = await Promise.all([
                    fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`),
                    fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`),
                ]);

                if (!weatherRes.ok) throw new Error('\u26A0\uFE0F Could not get weather for your location.');

                const [weatherData, forecastData] = await Promise.all([weatherRes.json(), forecastRes.json()]);

                renderWeather(weatherData);
                renderForecast(forecastData);
                saveCity(weatherData.name);
                lastCity = weatherData.name;

            } catch (err) {
                showError(err.message);
            } finally {
                setLoading(false);
            }
        },
        () => {
            setLoading(false);
            showError('\uD83D\uDCCD Location access denied. Allow location access or search by city name.');
        }
    );
}

// ─── RENDER CURRENT WEATHER ───────────────────────────────────
function renderWeather(d) {
    const unit      = currentUnit === 'metric' ? '\u00B0C' : '\u00B0F';
    const windUnit  = currentUnit === 'metric' ? 'km/h'   : 'mph';
    // API returns m/s in metric — convert to km/h
    const windSpeed = currentUnit === 'metric'
        ? Math.round(d.wind.speed * 3.6)
        : Math.round(d.wind.speed);

    const condition = d.weather[0].main;

    set('.city-name',       `${d.name}, ${d.sys.country}`);
    set('.date',            formatDate(new Date()));
    set('.temperature',     `${Math.round(d.main.temp)}${unit}`);
    set('.description',     capFirst(d.weather[0].description));
    set('.feels-like',      `Feels like ${Math.round(d.main.feels_like)}${unit}`);
    set('.humidity-value',  `${d.main.humidity}%`);
    set('.wind-value',      `${windSpeed} ${windUnit}`);
    set('.visibility-value',`${(d.visibility / 1000).toFixed(1)} km`);
    set('.pressure-value',  `${d.main.pressure} hPa`);
    set('.sunrise-value',   toTime(d.sys.sunrise));
    set('.sunset-value',    toTime(d.sys.sunset));

    document.querySelector('.weather-icon').src = ICONS[condition] || ICONS.Clouds;

    setBackground(condition);
    weatherCard.classList.remove('hidden');
}

// ─── RENDER 5-DAY FORECAST ────────────────────────────────────
function renderForecast(data) {
    const unit = currentUnit === 'metric' ? '\u00B0C' : '\u00B0F';
    const grid = document.querySelector('.forecast-grid');

    // OpenWeatherMap returns 3-hour slots; pick noon (12:00:00) for one card per day
    const daily = data.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5);

    grid.innerHTML = daily.map(item => {
        const cond = item.weather[0].main;
        const icon = ICONS[cond] || ICONS.Clouds;
        const day  = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const hi   = Math.round(item.main.temp_max);
        const lo   = Math.round(item.main.temp_min);
        return `
            <div class="forecast-card">
                <p class="forecast-day">${day}</p>
                <img src="${icon}" alt="${cond}">
                <p class="forecast-temp">${hi}${unit} / ${lo}${unit}</p>
                <p class="forecast-desc">${capFirst(item.weather[0].description)}</p>
            </div>`;
    }).join('');

    forecastSection.classList.remove('hidden');
}

// ─── BACKGROUND ───────────────────────────────────────────────
function setBackground(condition) {
    const cls = BG_CLASSES[condition] || 'bg-default';
    // Remove all bg-* classes then add the new one
    document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.startsWith('bg-'))
        .join(' ');
    document.body.classList.add(cls);
}

// ─── RECENT CITIES ────────────────────────────────────────────
function saveCity(city) {
    recentCities = [city, ...recentCities.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    localStorage.setItem('wn_recent', JSON.stringify(recentCities));
    renderRecentTags();
}

function renderRecentTags() {
    if (recentCities.length === 0) {
        recentDiv.classList.add('hidden');
        return;
    }
    recentDiv.classList.remove('hidden');
    recentTagsDiv.innerHTML = recentCities
        .map(city => `<button class="city-tag" data-city="${city}">${city}</button>`)
        .join('');
}

// Event delegation for recent city tags
document.querySelector('.recent-tags').addEventListener('click', e => {
    const tag = e.target.closest('.city-tag');
    if (tag) fetchByCity(tag.dataset.city);
});

// ─── HELPERS ─────────────────────────────────────────────────
function set(selector, text) {
    document.querySelector(selector).textContent = text;
}

function toTime(unixSeconds) {
    return new Date(unixSeconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function capFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setLoading(on) {
    loadingOverlay.classList.toggle('hidden', !on);
}

function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
}

function clearError() {
    errorDiv.classList.add('hidden');
}

// ─── START ────────────────────────────────────────────────────
init();
