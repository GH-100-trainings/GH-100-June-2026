'use strict';

const cities = [
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺', zone: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'Australia', flag: '🇦🇺', zone: 'Australia/Melbourne' },
  { name: 'Adelaide', country: 'Australia', flag: '🇦🇺', zone: 'Australia/Adelaide' },
  { name: 'Singapore', country: 'Singapore', flag: '🇸🇬', zone: 'Asia/Singapore' },
  { name: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾', zone: 'Asia/Kuala_Lumpur' },
  { name: 'India', country: 'India', flag: '🇮🇳', zone: 'Asia/Kolkata' }
];

const STORAGE_KEYS = { theme: 'worldclock.theme', format: 'worldclock.format' };

// Azure Maps Weather icon codes (1-44) mapped to a representative emoji.
// https://learn.microsoft.com/rest/api/maps/weather/get-current-conditions
const WEATHER_EMOJI = {
  1: '☀️', 2: '☀️', 3: '🌤️', 4: '⛅', 5: '🌤️', 6: '⛅', 7: '☁️', 8: '☁️',
  11: '🌫️', 12: '🌦️', 13: '🌦️', 14: '🌦️', 15: '⛈️', 16: '⛈️', 17: '⛈️',
  18: '🌧️', 19: '🌨️', 20: '🌨️', 21: '🌨️', 22: '❄️', 23: '❄️', 24: '🧊',
  25: '🌨️', 26: '🌧️', 29: '🌨️', 30: '🥵', 31: '🥶', 32: '💨', 33: '🌙',
  34: '🌙', 35: '☁️', 36: '☁️', 37: '🌙', 38: '☁️', 39: '🌦️', 40: '🌦️',
  41: '⛈️', 42: '⛈️', 43: '🌨️', 44: '❄️'
};

function weatherEmoji(iconCode) {
  return WEATHER_EMOJI[iconCode] || '🌡️';
}

let hour12 = true;

const grid = document.getElementById('clockGrid');
const themeToggle = document.getElementById('themeToggle');
const fmt12 = document.getElementById('fmt12');
const fmt24 = document.getElementById('fmt24');

// Build a card per city and keep references to the fields we update each tick.
const refs = cities.map((city) => {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-4';
  col.innerHTML = `
    <div class="card clock-card h-100">
      <div class="card-body text-center">
        <div class="clock-flag">${city.flag}</div>
        <h2 class="h4 card-title mb-0">${city.name}</h2>
        <p class="text-secondary small mb-3">${city.country}</p>
        <div class="clock-time" data-time>--:--:--</div>
        <div class="clock-meta">
          <span class="badge rounded-pill text-bg-primary" data-period></span>
          <span class="clock-date" data-date></span>
        </div>
        <div class="clock-day text-secondary small" data-day></div>
        <div class="clock-weather" data-weather>
          <span class="weather-emoji" data-weather-emoji></span>
          <span class="weather-text text-secondary small" data-weather-text>Loading weather…</span>
        </div>
      </div>
    </div>`;
  grid.appendChild(col);
  return {
    name: city.name,
    zone: city.zone,
    time: col.querySelector('[data-time]'),
    period: col.querySelector('[data-period]'),
    date: col.querySelector('[data-date]'),
    day: col.querySelector('[data-day]'),
    weatherEmoji: col.querySelector('[data-weather-emoji]'),
    weatherText: col.querySelector('[data-weather-text]')
  };
});

function partsFor(zone, now) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour12,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const map = {};
  for (const p of fmt.formatToParts(now)) map[p.type] = p.value;
  return map;
}

function tick() {
  const now = new Date();
  for (const ref of refs) {
    const p = partsFor(ref.zone, now);
    ref.time.textContent = `${p.hour}:${p.minute}:${p.second}`;
    ref.period.textContent = hour12 && p.dayPeriod ? p.dayPeriod : '';
    ref.period.classList.toggle('d-none', !(hour12 && p.dayPeriod));
    ref.date.textContent = `${p.day} ${p.month} ${p.year}`;
    ref.day.textContent = p.weekday;
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  themeToggle.innerHTML =
    theme === 'dark'
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function setFormat(use12) {
  hour12 = use12;
  fmt12.checked = use12;
  fmt24.checked = !use12;
  localStorage.setItem(STORAGE_KEYS.format, use12 ? '12' : '24');
  tick();
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-bs-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});
fmt12.addEventListener('change', () => setFormat(true));
fmt24.addEventListener('change', () => setFormat(false));

function applyWeather(payload) {
  const weather = (payload && payload.weather) || {};
  for (const ref of refs) {
    const w = weather[ref.name];
    if (!w || w.error || w.iconCode == null) {
      ref.weatherEmoji.textContent = '';
      ref.weatherText.textContent = payload && payload.configured === false
        ? 'Weather unavailable'
        : '—';
      continue;
    }
    ref.weatherEmoji.textContent = weatherEmoji(w.iconCode);
    const temp = w.temperature != null ? `${Math.round(w.temperature)}°${w.unit || ''} · ` : '';
    ref.weatherText.textContent = `${temp}${w.phrase || ''}`.trim();
  }
}

async function loadWeather() {
  if (typeof fetch !== 'function') return;
  try {
    const res = await fetch('/api/weather');
    const payload = await res.json();
    applyWeather(payload);
  } catch (err) {
    for (const ref of refs) {
      ref.weatherEmoji.textContent = '';
      ref.weatherText.textContent = 'Weather unavailable';
    }
  }
}

// Restore saved preferences.
setTheme(localStorage.getItem(STORAGE_KEYS.theme) || 'light');
setFormat((localStorage.getItem(STORAGE_KEYS.format) || '12') === '12');

tick();
setInterval(tick, 1000);

// Weather changes slowly; refresh every 10 minutes.
loadWeather();
setInterval(loadWeather, 10 * 60 * 1000);
