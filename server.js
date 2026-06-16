require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Coordinates used to query the Azure Maps Weather service. The `name` values
// must match the city names used by the client (public/app.js).
const CITIES = [
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
  { name: 'Adelaide', lat: -34.9285, lon: 138.6007 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Kuala Lumpur', lat: 3.139, lon: 101.6869 },
  { name: 'India', lat: 28.6139, lon: 77.209 }
];

const WEATHER_BASE =
  'https://atlas.microsoft.com/weather/currentConditions/json?api-version=1.1';

async function fetchCityWeather(city, key) {
  const url =
    `${WEATHER_BASE}&query=${city.lat},${city.lon}` +
    `&subscription-key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Azure Maps responded ${res.status}`);
  }
  const data = await res.json();
  const current = data.results && data.results[0];
  if (!current) {
    throw new Error('No weather results');
  }
  return {
    iconCode: current.iconCode,
    phrase: current.phrase,
    temperature: current.temperature ? current.temperature.value : null,
    unit: current.temperature ? current.temperature.unit : null
  };
}

app.use(express.static(path.join(__dirname, 'public')));

// Server-side proxy so the Azure Maps subscription key is never exposed to the
// browser. Returns current conditions keyed by city name.
app.get('/api/weather', async (req, res) => {
  const key = process.env.AZURE_MAPS_KEY;
  if (!key) {
    return res.status(503).json({
      configured: false,
      message: 'Set the AZURE_MAPS_KEY environment variable to enable weather.'
    });
  }

  try {
    const entries = await Promise.all(
      CITIES.map(async (city) => {
        try {
          return [city.name, await fetchCityWeather(city, key)];
        } catch (err) {
          return [city.name, { error: err.message }];
        }
      })
    );
    res.json({ configured: true, weather: Object.fromEntries(entries) });
  } catch (err) {
    res.status(502).json({ configured: true, error: err.message });
  }
});

// Only start listening when run directly, so tests can import the app.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`World Clock running at http://localhost:${PORT}`);
  });
}

module.exports = app;
