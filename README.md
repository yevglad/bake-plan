# Bake Plan

Pick the ingredients you're roasting, and get one oven schedule that staggers
everything to finish at the same time — no more guessing when to add the
broccoli.

Built with React, TypeScript, and Vite. Implemented from a [Claude
Design](https://claude.ai/design) handoff (see `baking-recipe-timer-app/`).

## Features

- Search and filter a library of vegetables and proteins
- Adjust roast time per ingredient, pick (or auto-recommend) an oven temp
- Get a staggered add-in schedule so everything finishes together
- Live countdown timer with a progress ring, add-in prompts, and sound/vibration alerts
- Keeps the screen awake while cooking (where supported)
- Remembers your last few bakes locally for one-tap reuse

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project structure

- `src/useBakePlan.ts` — all app state and timer logic
- `src/components/` — the four screens (Home, Plan, Cooking, Done)
- `src/ingredients.ts` — ingredient data (cook time, temp, color)
- `src/index.css` — design tokens and shared component styles
- `baking-recipe-timer-app/` — original Claude Design handoff bundle (reference only)
