# EVGoo — Deployment Guide

Three ways to get a shareable link, from fastest to most permanent.

---

## Option 1 — StackBlitz (instant, no account needed) ⚡

**Get a link in 60 seconds:**

1. Go to **https://stackblitz.com/fork/react**
2. Delete the contents of `src/App.jsx`
3. Paste the entire contents of `src/App.jsx` from this folder
4. Click **Share** (top right) → copy the URL
5. Done — anyone with the link can view the app live

> The URL looks like: `https://stackblitz.com/edit/react-xxxxx`

---

## Option 2 — Netlify Drop (permanent link, no account needed) 🚀

**Get a permanent link in 3 minutes:**

1. On your computer, open a terminal in this folder
2. Run:
   ```bash
   npm install
   npm run build
   ```
3. This creates a `dist/` folder
4. Go to **https://app.netlify.com/drop**
5. Drag and drop the `dist/` folder onto the page
6. Netlify gives you a free URL instantly:
   `https://xxxxxx.netlify.app`
7. Optional: Rename it to `evgoo.netlify.app` in Netlify settings

---

## Option 3 — Vercel (best, custom domain possible) 🌐

**Get a permanent link with a proper URL:**

1. Push this folder to a GitHub repository
2. Go to **https://vercel.com** → sign up with GitHub
3. Click **"Add New Project"** → import your repository
4. Vercel auto-detects Vite — click **Deploy**
5. Your app is live at:
   `https://evgoo.vercel.app` (or similar)

Or skip GitHub entirely and use the CLI:
```bash
npm install -g vercel
vercel
```
Follow the prompts — you get a live URL in ~30 seconds.

---

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Files in this folder

```
evgoo-deploy/
├── index.html          ← HTML entry point
├── package.json        ← dependencies (React + Vite only)
├── vite.config.js      ← build config
├── netlify.toml        ← Netlify auto-config
├── vercel.json         ← Vercel auto-config
└── src/
    ├── main.jsx        ← React root
    └── App.jsx         ← The full EVGoo app (51 screens)
```
