<div align="center">

# 🧭 FounderRadar Pro
### The Universal Multi-Platform Executive Outreach & Intelligence Engine

[![Version: 1.1.0](https://img.shields.io/badge/version-1.1.0-indigo.svg)](https://github.com/KHUSHALSY/FoundrRadar/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646cff.svg)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**Stop burning hours on manual prospect hunting, hitting LinkedIn commercial search limits, or sending awkward cold emails that get ignored.**  
FounderRadar Pro empowers founders, event directors, podcast hosts, operators, and business development leads to discover, verify, and initiate high-conversion outreach to top 1% executives in seconds.

[Live Demo](#-quick-start) • [Key Features](#-features) • [Installation](#-installation) • [Deployment](#-deployment) • [Architecture](#-architecture)

---

</div>

## 📌 The Problem It Solves

Modern outbound outreach is fundamentally broken:
1. **LinkedIn's Commercial Search Limits**: Free users get throttled after 30 searches a month, hiding profile URLs and names behind paid Sales Navigator paywalls.
2. **Fragmented Executive Presences**: The best founders, investors, and engineers aren't just on LinkedIn—they are actively discussing ideas on **𝕏 (Twitter)**, participating in **Reddit** AMAs, launching on **Product Hunt**, or building in public on **GitHub**.
3. **Low-Conversion Cold Pitching**: Generic, salesy templates trigger spam filters and get rejected by executive assistants and Chiefs of Staff.
4. **Disorganized Tracking**: Teams juggle messy spreadsheets, lost links, and disjointed follow-up cadences.

**FounderRadar Pro** unifies discovery, contact scraping, message drafting, and pipeline tracking into a single client-side platform.

---

## ⚡ Features

### 1. 🔍 Multi-Platform Precision Dork Search
- **Instant Vertical Scanning**: Target specific niches (*AI & Autonomous Agents, B2B SaaS, FinTech, D2C, ClimateTech, DevTools, Venture Capital*).
- **Google Dork Engine**: Directly queries Google's deep index to bypass LinkedIn's commercial search limits and unmask exact profile pages.
- **Cross-Channel Deep Queries**:
  - 💼 **LinkedIn**: Exact profile dorks + native search queries.
  - ✉️ **Direct Email Finder**: Extracts indexed profile bios containing contact emails and outreach handles (`@gmail.com`, `contact at`, `email me`).
  - 𝕏 **(Twitter)**: Targeted bio searches and direct user profile discovery.
  - 🤖 **Reddit Communities**: Queries `r/startups`, `r/Entrepreneur`, `r/SaaS`, `r/ycombinator` for founder AMAs and launch retrospectives.
  - 🚀 **Product Hunt**: Discovers active makers and newly launched products.
  - 📰 **Venture & Startup Media**: Scans TechCrunch, Crunchbase, Inc42, and VentureBeat for seed and Series A funding announcements.
  - 🐙 **GitHub Maintainers**: Pinpoints open-source creators and technical CTOs.
  - 🎥 **Keynotes & Podcasts**: Reviews past speaking appearances and stage presence.
- **1-Click Multi-Channel Launch**: Open all selected platform tabs in one click.

### 2. ⚡ Curated Executive & Founder Directory
- Pre-indexed database of verified global and Indian unicorn founders, Shark Tank investors, Y-Combinator alumni, and prominent builders.
- Detailed profiles including past speaking themes, verified LinkedIn & 𝕏 handles, and advisory topics.
- 1-click **Add to CRM** and **Draft Pitch** actions.

### 3. 📋 Lightweight Outreach Pipeline (Mini-CRM)
- **7-Stage Workflow**:
  `Identified` ➔ `Contacted (LinkedIn)` ➔ `Email Sent` ➔ `Follow-up Sent` ➔ `Meeting Booked` ➔ `Confirmed / Closed 🎉` ➔ `Passed`
- **Celebration Trigger**: Fires interactive canvas confetti when an executive or speaker confirms.
- **One-Click CSV Export**: Downloads structured CSVs ready for instant import into Microsoft Excel, Google Sheets, or Notion.
- **Persistent Storage**: All pipeline changes auto-sync to browser `localStorage`—no data lost on tab reload.

### 4. ✍️ Message Crafter & Pitch Templates
Generate 8 high-converting, personalized outreach formats:
- 💬 **LinkedIn Connection Note**: Strictly `<300 characters` with real-time character budget counter.
- ✉️ **Keynote & Conference Speaker Invitation**: Professional proposal detailing audience demographics, logistics, and value proposition.
- 🤝 **Strategic B2B Partnership Pitch**: Mutual distribution collaboration outline.
- 💡 **Investor / Angel Pitch Teaser**: 30-second metric-driven seed/Series A teaser.
- 🎙️ **Podcast / Interview Guest Invitation**: High-status media invitation.
- 𝕏 **(Twitter) Direct Message**: Casual, punchy hook designed for mobile notifications.
- ⏰ **Executive Follow-Up (Day 3 & Day 7)**: Low-friction reminders that capture missed replies.
- 📞 **Executive Assistant / Chief of Staff Note**: Professional gatekeeper routing request.

### 5. 💡 Executive Outreach Playbook
- **Golden Hours**: Best times and days to message executives (8:15–9:30 AM or 8:30–10:15 PM).
- **75%+ Open Rate Subject Lines**: Battle-tested subject line frameworks.
- **Deliverability Engineering**: Anti-spam tactics, SPF/DKIM awareness, avoiding heavy PDF attachments on initial outreach.
- **Interactive Pre-Flight Checklist**: 7 essential verification items before hitting send.

---


## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                       FounderRadar UI Layer                     │
├─────────────────┬──────────────────┬──────────────┬─────────────┤
│  Finder Engine  │  Curated Index   │ Pipeline CRM │ Pitch Suite │
└────────┬────────┴────────┬─────────┴──────┬───────┴──────┬──────┘
         │                 │                │              │
         ▼                 ▼                ▼              ▼
┌─────────────────┐ ┌──────────────┐ ┌─────────────┐ ┌───────────┐
│ Direct URL &    │ │ 60+ Indexed  │ │localStorage │ │ 8 Tested  │
│ Contact Routing │ │ Profiles     │ │ Persistence │ │ Frameworks│
└─────────────────┘ └──────────────┘ └─────────────┘ └───────────┘
```

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev)
- **Build Tool**: [Vite 8](https://vitejs.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Interactive FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Persistence**: Browser `localStorage` (Zero external database required)

---

## 💻 Installation & Local Setup

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or yarn / pnpm / bun

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/your-username/founderradar.git

# 2. Navigate into the directory
cd founderradar

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🚀 Building for Production

```bash
# Build the production bundle
npm run build

# Preview the production build locally
npm run preview
```

The optimized static files will be generated in the `/dist` directory.

---

## 🌐 Free 1-Click Deployment

Because FounderRadar Pro is a lightweight, static client-side single-page application (SPA), it can be deployed for free on:

### Deploy to Vercel
1. Fork or push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Set Build Command: `npm run build` and Output Directory: `dist`.
5. Click **Deploy**.

### Deploy to Netlify
1. Connect your GitHub repository to [Netlify](https://netlify.com).
2. Set Build Command: `npm run build` and Publish Directory: `dist`.
3. Click **Deploy Site**.

### Deploy to GitHub Pages
You can also deploy to GitHub Pages using `gh-pages`:
```bash
npm install -D gh-pages
# Add "deploy": "gh-pages -d dist" in package.json
npm run build
npm run deploy
```

---

## 📂 Project Structure

```
founder-radar/
├── public/                 # Static public assets & favicons
├── src/
│   ├── components/         # Core React components
│   │   ├── CuratedDirectory.jsx   # Directory of verified founders & leaders
│   │   ├── Navbar.jsx             # Top navigation & status counter
│   │   ├── PipelineCRM.jsx        # Kanban / Table outreach tracker
│   │   ├── PitchGenerator.jsx     # High-conversion message generator
│   │   ├── Playbook.jsx           # Executive outreach strategy playbook
│   │   └── SearchEngine.jsx       # Multi-platform Google Dork search engine
│   ├── data/               # Curated datasets & configuration
│   │   ├── categories.js          # Topics, roles, backgrounds & geography presets
│   │   ├── curatedFounders.js     # Pre-vetted profiles & speaking themes
│   │   ├── outreachTemplates.js   # 8 high-conversion outreach templates
│   │   └── playbookData.js        # Executive outreach rules & heuristics
│   ├── utils/              # Query generation utilities
│   │   └── searchDorks.js         # Google Dork & deep URL generator
│   ├── App.jsx             # Root application orchestrator
│   ├── index.css           # Tailwind v4 import & custom styling
│   └── main.jsx            # Application entry point
├── index.html              # HTML shell & SEO meta tags
├── package.json            # Dependencies and build scripts
├── vite.config.js          # Vite & Tailwind configuration
└── README.md               # Documentation
```

---

## 🤝 Contributing

Contributions are warmly welcomed! If you have ideas for additional search dorks, new high-converting templates, or UI improvements:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with care for founders, operators, event directors, and builders everywhere.</sub>
</div>
