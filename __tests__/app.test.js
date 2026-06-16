/**
 * @jest-environment jsdom
 */
'use strict';

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
  path.join(__dirname, '../public/index.html'),
  'utf8'
);
const bodyContent = html.replace(/[\s\S]*<body>/, '').replace(/<\/body>[\s\S]*/, '');

const APP_PATH = path.join(__dirname, '../public/app.js');

const EXPECTED_CITIES = [
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { name: 'Melbourne', country: 'Australia', flag: '🇦🇺' },
  { name: 'Adelaide', country: 'Australia', flag: '🇦🇺' },
  { name: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { name: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾' },
  { name: 'India', country: 'India', flag: '🇮🇳' }
];

// (Re)load app.js against a fresh DOM. Call after seeding localStorage if needed.
function loadApp() {
  jest.resetModules();
  require(APP_PATH);
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-06-16T03:00:00Z'));
  document.documentElement.setAttribute('data-bs-theme', 'light');
  document.body.innerHTML = bodyContent;
  localStorage.clear();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('World Clock display', () => {
  test('renders a card for every configured city', () => {
    loadApp();
    const cards = document.querySelectorAll('#clockGrid .clock-card');
    expect(cards).toHaveLength(EXPECTED_CITIES.length);
  });

  test('shows the name, country and flag of each city', () => {
    loadApp();
    const cards = document.querySelectorAll('#clockGrid .clock-card');
    EXPECTED_CITIES.forEach((city, i) => {
      const card = cards[i];
      expect(card.querySelector('.card-title').textContent).toBe(city.name);
      expect(card.textContent).toContain(city.country);
      expect(card.querySelector('.clock-flag').textContent).toBe(city.flag);
    });
  });

  test('displays each clock time as HH:MM:SS', () => {
    loadApp();
    const times = document.querySelectorAll('#clockGrid [data-time]');
    expect(times).toHaveLength(EXPECTED_CITIES.length);
    times.forEach((el) => {
      expect(el.textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  test('shows the weekday and a formatted date for each city', () => {
    loadApp();
    document.querySelectorAll('#clockGrid .clock-card').forEach((card) => {
      expect(card.querySelector('[data-day]').textContent).toMatch(
        /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/
      );
      expect(card.querySelector('[data-date]').textContent).toMatch(
        /^\d{2} [A-Z][a-z]{2} \d{4}$/
      );
    });
  });
});

describe('Time format toggle', () => {
  test('defaults to 12-hour format with a visible AM/PM badge', () => {
    loadApp();
    expect(document.getElementById('fmt12').checked).toBe(true);
    const period = document.querySelector('#clockGrid [data-period]');
    expect(period.classList.contains('d-none')).toBe(false);
    expect(period.textContent).toMatch(/AM|PM/);
  });

  test('switching to 24-hour hides the AM/PM badge and persists the choice', () => {
    loadApp();
    const fmt24 = document.getElementById('fmt24');
    fmt24.dispatchEvent(new Event('change'));

    document.querySelectorAll('#clockGrid [data-period]').forEach((period) => {
      expect(period.classList.contains('d-none')).toBe(true);
      expect(period.textContent).toBe('');
    });
    expect(localStorage.getItem('worldclock.format')).toBe('24');
  });

  test('restores a saved 24-hour preference on load', () => {
    localStorage.setItem('worldclock.format', '24');
    loadApp();
    expect(document.getElementById('fmt24').checked).toBe(true);
    const period = document.querySelector('#clockGrid [data-period]');
    expect(period.classList.contains('d-none')).toBe(true);
  });
});

describe('Theme toggle', () => {
  test('toggles between light and dark and persists the theme', () => {
    loadApp();
    const toggle = document.getElementById('themeToggle');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');

    toggle.click();
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
    expect(localStorage.getItem('worldclock.theme')).toBe('dark');

    toggle.click();
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
    expect(localStorage.getItem('worldclock.theme')).toBe('light');
  });

  test('restores a saved dark theme on load', () => {
    localStorage.setItem('worldclock.theme', 'dark');
    loadApp();
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });
});

describe('Live updates', () => {
  test('refreshes the displayed time on each interval tick', () => {
    loadApp();
    const timeEl = document.querySelector('#clockGrid [data-time]');
    jest.setSystemTime(new Date('2026-06-16T03:00:00Z'));
    jest.advanceTimersByTime(1000);
    const first = timeEl.textContent;

    jest.setSystemTime(new Date('2026-06-16T03:00:05Z'));
    jest.advanceTimersByTime(1000);
    const second = timeEl.textContent;

    expect(first).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(second).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(second).not.toBe(first);
  });
});
