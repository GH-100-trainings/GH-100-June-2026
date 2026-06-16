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

---

## 📘 GH-100 June 2026 Training Recap (Student Notes)

### 🧠 Big Picture

Today's training focused on GitHub administration and usage — not just how to
store code, but how to manage teams, control access, automate workflows, and
secure applications.

The key takeaway:

> 👉 GitHub is not just a code repository — it is a full platform for
> collaboration, automation, and DevOps.

### 🔑 Core Concepts Learned

#### 1. Git vs GitHub

- Git = version control system (tracks changes locally or on a server)
- GitHub = cloud platform built on Git for collaboration

✅ Key idea:

- Git = engine
- GitHub = platform

#### 2. Repository (Repo)

- A repository is where your project files live (code, config, docs, etc.)
- Can be:
  - Public (anyone can see)
  - Private (restricted access)

✅ Real-world use-case:

- Store application code for team collaboration
- Maintain documentation alongside code (README)

#### 3. Commits & Version Tracking

- A commit = saving changes to the repo
- Every commit has a unique ID → allows rollback

✅ Use-case:

- Track history of changes
- Restore previous working version if something breaks

#### 4. Branching & GitHub Flow (VERY IMPORTANT)

Instead of editing the main code directly:

1. Create a branch
2. Work on it safely
3. Submit a pull request
4. Merge into main

✅ Why it matters:

- Prevents breaking production code
- Allows parallel work by multiple developers

✅ Example use-case:

- Developer A builds a new feature
- Developer B fixes a bug
  - → both can work safely without conflict

#### 5. Pull Requests (PR)

- Used to merge changes from a branch into main
- Can include:
  - Code review
  - Approval process
  - Automated checks

✅ Use-case:

- Team lead reviews code quality before merge
- Prevents poor or unsafe code from entering production

#### 6. Issues & Project Boards

- Issues = tasks, bugs, or improvements
- Can be tracked in a Kanban-style board

✅ Use-case:

- Manage project tasks (backlog → in progress → done)
- Link commits to issues (example: `GH-100-trainings/GH-100-June-2026#1`)

#### 7. Fork vs Clone

- Clone → copy repo locally
- Fork → copy repo into your own GitHub account

✅ Use-case:

- Contributing to open-source projects:
  - Fork → make changes → submit PR back

### ⚙️ Automation with GitHub Actions (CI/CD)

This is one of the biggest topics.

**What is GitHub Actions?**

- A way to automate tasks like:
  - Build
  - Test
  - Deploy
- Runs using runners (virtual machines).

**CI/CD Pipeline Concept**

- CI (Continuous Integration) → build + test code
- CD (Continuous Delivery) → package or deploy

✅ Example pipeline:

1. Install dependencies
2. Run tests
3. Build app
4. Publish artifact (e.g., Docker image)

✅ Use-case:

- Automatic testing on every code change
- No manual deployment needed

### 🤖 GitHub Copilot (AI in Development)

AI tool that helps:

- Generate code
- Plan architecture
- Fix bugs
- Write tests

✅ Use-case:

- Quickly build apps (e.g., Node.js app with time zones)
- Auto-generate unit tests
- Improve productivity significantly

### 🔐 Security & Best Practices

#### 1. Dependency & Code Scanning

GitHub can:

- Detect vulnerable libraries
- Scan your code for risks

✅ Use-case:

- Prevent incidents like Log4j vulnerability
- Reduce security risks automatically

#### 2. Secrets Management

- Never store sensitive data (API keys, passwords) in code
- Use:
  - `.gitignore` to exclude files
  - Secrets/Variables in GitHub settings

✅ Use-case:

- Protect Azure API keys or database credentials

#### 3. Branch Protection

- Prevent direct changes to main branch
- Require:
  - Pull requests
  - Reviews

✅ Use-case:

- Enforce quality control in teams

#### 4. Identity & Access Control

- Use roles:
  - Read / Write / Maintain / Admin
- Apply least privilege principle

✅ Use-case:

- Restrict interns or external vendors from full access

### 📦 GitHub Packages & Containers

GitHub can store:

- Build artifacts
- Docker images

✅ Use-case:

- Publish application for reuse
- Share build outputs across teams

### 🧪 Hands-on Learning Highlights

- Created:
  - GitHub repo
  - Issues and project board
- Built:
  - Simple Node.js app (time + UI)
- Used:
  - Copilot to generate code
- Implemented:
  - CI pipeline
  - Unit testing
- Triggered:
  - GitHub Actions workflow

### 💡 Key Takeaways

- Always use branches + pull requests
- Automate everything (CI/CD)
- Secure your repo (dependencies + secrets)
- Use AI tools to speed up development
- GitHub = central platform for DevOps lifecycle

### 🔗 Links Shared During Training

**📚 Learning & Certification**

- [GitHub Administration Certification](https://learn.microsoft.com/en-us/credentials/certifications/github-administration)

**🧰 Core Tools**

- [Git Official Website](https://git-scm.com/)
- [GitHub Platform](https://github.com/)

**🧪 Training Resources**

- [GH-100 Training Repository](https://github.com/GH-100-trainings)
- [GH-100 June 2026 Repo](https://github.com/GH-100-trainings/GH-100-June-2026)

Clone command:

```pwsh
git clone https://github.com/GH-100-trainings/GH-100-June-2026.git
```

**🎯 Azure Animations (Visual Learning)**

- [Azure Animations Home](https://aka.ms/AzureAnimations)
- [GitHub Flow Animation](https://azureanimations.github.io/github/git-version-control)

**🧪 Labs**

- [Lab 1: Guided Tour of GitHub](https://learn.microsoft.com/en-us/training/modules/introduction-to-github/6-guided-tour-of-github/?ns-enrollment-type=learningpath&ns-enrollment-id=learn.github.github-administration-products-1)
- [Lab 2: Secure Repository](https://learn.microsoft.com/en-us/training/modules/maintain-secure-repository-github/3-security-strategy-essentials/?ns-enrollment-type=learningpath&ns-enrollment-id=learn.github.github-administration-products-1)
- Lab 3: Change Commit History
- [Lab 4: Use a repository secret in a GitHub Actions workflow](https://learn.microsoft.com/en-us/training/modules/manage-github-actions-enterprise/exercise/?ns-enrollment-type=learningpath&ns-enrollment-id=learn.github.github-administration-products-2)
- [Lab 5: Publish to a GitHub Packages registry](https://learn.microsoft.com/en-us/training/modules/github-actions-packages/3-exercise-github-packages-docker-registry/?ns-enrollment-type=learningpath&ns-enrollment-id=learn.github.github-administration-products-2)

**📊 Project Board**

- [Training Backlog Board](https://github.com/orgs/GH-100-trainings/projects/1/views/1)

**🔧 Tools**

- [Oh My Posh (Terminal tool)](https://ohmyposh.dev/)

**🆘 Support & Feedback**

- [ESI Support](https://aka.ms/esisupport)
- [Training Survey](https://www.metricsthatmatter.com/student/evaluation.asp?k=79335&i=100704)

### ✅ Final Reflection (Student Perspective)

This training showed that GitHub is not just about code storage — it is a
complete system to manage development, automate workflows, and secure software.

The combination of:

- GitHub Actions
- Copilot
- Security tools

…makes it possible to build production-ready workflows much faster than
traditional approaches.

