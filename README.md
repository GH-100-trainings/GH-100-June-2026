[![CI](https://github.com/GH-100-trainings/GH-100-June-2026/actions/workflows/ci.yml/badge.svg)](https://github.com/GH-100-trainings/GH-100-June-2026/actions/workflows/ci.yml)
[![CD](https://github.com/GH-100-trainings/GH-100-June-2026/actions/workflows/cd.yml/badge.svg)](https://github.com/GH-100-trainings/GH-100-June-2026/actions/workflows/cd.yml)

# World Clock 🌏

A simple web app that shows the **current local time** and the **current weather**
for six cities at a glance:

- 🇦🇺 Sydney
- 🇦🇺 Melbourne
- 🇦🇺 Adelaide
- 🇸🇬 Singapore
- 🇲🇾 Kuala Lumpur
- 🇮🇳 India (New Delhi)

Each city is shown on its own card with a live ticking clock, the date, and a
little weather emoji (☀️ sunny, 🌧️ rain, ❄️ snow, ⛈️ thunderstorm, and so on).
You can switch between 12-hour and 24-hour time, and flip between light and dark
mode. Your choices are remembered the next time you open the page.

> _Created for the GH-100 training on 16 June 2026._

---

## What you need before you start

You only need **one** thing installed on your computer:

- **Node.js** (version 18 or newer) — this is what runs the app.
  Download it from [nodejs.org](https://nodejs.org) and install it like any
  other program. To check it's installed, open a terminal and type:

  ```pwsh
  node --version
  ```

  If you see a version number (for example `v20.11.0`), you're good to go.

That's it. You do **not** need to be a programmer to run this app — just follow
the steps below.

---

## How to run the app (step by step)

Think of this like setting up a small website on your own computer.

**1. Open a terminal in the project folder.**

In VS Code, choose **Terminal → New Terminal**. The terminal opens already
pointing at this project folder.

**2. Install the app's building blocks.** Type this and press Enter:

```pwsh
npm install
```

This downloads the helper libraries the app needs. You only have to do this
**once** (or again after the project is updated). It may take a minute.

**3. Start the app.** Type this and press Enter:

```pwsh
npm start
```

You'll see a message like:

```
World Clock running at http://localhost:3000
```

**4. Open it in your web browser.**

Go to **http://localhost:3000**. The six clocks should appear and start ticking. 🎉

**5. To stop the app**, click in the terminal and press **Ctrl + C**.

> `localhost` simply means "this computer." The app is running on your own
> machine, not on the internet — only you can see it.

---

## Turning on live weather (optional)

The clocks work straight away. If you also want **real weather** on each card,
the app needs a free key from Microsoft's **Azure Maps** weather service.

Why a key? It's like a password that lets the app politely ask Azure Maps for
the latest weather. We keep this key private and on the server only — it is
never shown to your web browser, which keeps it safe.

**Steps:**

1. Get an Azure Maps subscription key from the
   [Azure Portal](https://portal.azure.com) (create an _Azure Maps_ resource and
   copy one of its keys).

2. In the project folder, make your own settings file by copying the example:

   ```pwsh
   Copy-Item .env.example .env
   ```

3. Open the new `.env` file and paste your key after the `=` sign:

   ```
   AZURE_MAPS_KEY=your-key-goes-here
   ```

4. Start the app again with `npm start` and refresh the page.

Each card will now show the temperature, a short description, and a matching
weather emoji.

> The `.env` file is kept private (it's ignored by Git), so your key is never
> uploaded or shared by accident. **Without** a key, the app still runs — the
> cards just say "Weather unavailable".

---

## Project at a glance

| File / folder       | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `server.js`         | The small web server that hosts the page and weather. |
| `public/index.html` | The page layout (the cards you see).                  |
| `public/app.js`     | The clock and weather logic running in your browser.  |
| `public/styles.css` | The colours, fonts, and overall look.                 |
| `__tests__/`        | Automated tests that check the app works.             |
| `.env.example`      | A template for your private weather key.              |

---

## Running the tests (for the curious)

This project comes with automated tests that confirm everything works:

```pwsh
npm test
```

A successful run ends with something like `Tests: 14 passed`. These same tests
also run automatically on GitHub every time the code changes (that's the green
**CI** badge at the top).

---

## Running with Docker (optional)

Every change merged to `main` is automatically built into a Docker image and
published to the **GitHub Container Registry** by the **CD** workflow. You can
pull and run that image without installing Node.js yourself:

```pwsh
docker pull ghcr.io/gh-100-trainings/gh-100-june-2026:latest
docker run -p 3000:3000 ghcr.io/gh-100-trainings/gh-100-june-2026:latest
```

To also enable live weather, pass your Azure Maps key:

```pwsh
docker run -p 3000:3000 -e AZURE_MAPS_KEY=your-key-goes-here ghcr.io/gh-100-trainings/gh-100-june-2026:latest
```

You can also build the image locally from the included `Dockerfile`:

```pwsh
docker build -t world-clock .
docker run -p 3000:3000 world-clock
```

Then open `http://localhost:3000` as usual.

---

## Common questions

**"The page won't open / nothing happens."**
Make sure the terminal still shows `World Clock running at...` and that you
typed the address exactly: `http://localhost:3000`.

**"Port 3000 is already in use."**
Another program is using that address. Start the app on a different one:

```pwsh
$env:PORT = 3001
npm start
```

Then open `http://localhost:3001` instead.

**"The clocks show but the weather says 'unavailable'."**
That's expected until you add an Azure Maps key — see
[Turning on live weather](#turning-on-live-weather-optional) above.

