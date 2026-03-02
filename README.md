<h1 align="center">PlateCalc</h1>
<p align="center">
  Fast, visual barbell loading calculator with custom inventory, dual units, and plate styling.
</p>
<p align="center">
  Built in public as part of my AI-assisted app building journey.
</p>

## Why This Project

I wanted a plate calculator that feels modern, works on mobile, and reflects real gym setups, not generic defaults.
This repo is also part of my GitHub portfolio to show consistent shipping with AI-assisted workflows.

## Features

- Two calculator modes:
  - Target mode: enter a goal weight and get the closest achievable loadout.
  - Build mode: add plates manually per side and see totals instantly.
- Inventory-aware calculations using your available plates.
- lb and kg support with unit toggle.
- Configurable barbell weight per unit.
- Plate appearance editor (colors, texture, labels) for visual realism.
- Mobile-first responsive UI with animated feedback.
- Local persistence with Zustand so your setup survives refreshes.

<img width="1127" height="1146" alt="image" src="https://github.com/user-attachments/assets/a80d38c4-9926-48e0-9033-fbd3f9b4be35" />
<img width="1126" height="1140" alt="image" src="https://github.com/user-attachments/assets/cf66b1d9-ff1a-4a7c-8675-477fc02113ac" />

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Zustand + Zod
- Radix UI + Lucide icons
- Framer Motion

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev    # local development
npm run test   # run unit tests (Vitest)
npm run build  # production build + static export to dist/
npm run start  # start production server
```

## Deployment

This app is configured for static export in `next.config.mjs`:

```js
output: 'export'
distDir: 'dist'
```

Deploy options:

- Vercel (recommended for fastest setup)
- Any static host that can serve the `dist/` folder

## How The Calculator Works

For target mode, the app runs a bounded knapsack dynamic programming algorithm:

1. Convert weights to 0.25-unit scaled integers (avoids float precision issues).
2. Build reachable per-side totals from available plate pairs.
3. Select the best total based on policy (`allowOver`, `preferFewerPlates`).
4. Reconstruct the selected plate combination per side.

## Building In Public

I’m sharing this openly to document my progress and keep shipping useful AI-assisted projects.

- Feedback and ideas: open an issue.
- If this helps your training workflow, a star helps this project reach more lifters.
