# Demo — responsive React (Vite + Tailwind)

Single-page app with **components** in `src/components` and **screens** in `src/screens`, styled with **Tailwind CSS**, ready for **GitHub Pages** as a project site.

## Prerequisites

- Node.js 20+ (CI uses 22)
- npm

## Local development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/`). During dev, Vite uses `base: '/'` so routing matches the dev server.

The **DineOut** tab shows a generic [Google Maps](https://www.google.com/maps) embed. The map centers on your device location when permitted, otherwise Tallinn (demo default). Optionally set `VITE_GOOGLE_MAPS_API_KEY` in `.env` for the [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) (enable **Maps Embed API** in Cloud Console).

## Production build and preview

```bash
npm run build
npm run preview
```

The production build uses `base: '/Demo/'` so assets resolve under `https://<username>.github.io/Demo/`. If your GitHub repository name is not `Demo`, change `base` in `vite.config.ts` to `/<your-repo-name>/` (leading and trailing slashes).

## Publish to GitHub Pages

1. Create a **public** repository on GitHub named **`Demo`** (project site path `/Demo/`).
2. Push this project to the `main` branch.
3. In the repo: **Settings → Pages → Build and deployment** — set **Source** to **GitHub Actions** (not “Deploy from a branch”). If branch deploy is selected, the site serves raw `index.html` with `/src/main.tsx` and the page stays blank.
4. After the **Deploy to GitHub Pages** workflow succeeds, open `https://<username>.github.io/Demo/` (trailing slash). Example: `https://azibrou.github.io/Demo/`.

Ensure `vite.config.ts` `base` matches the repository name exactly. `npm run build` must produce `dist/index.html` with `/Demo/assets/...` scripts (verified by `scripts/pages-postbuild.mjs`).

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (`@tailwindcss/vite`)
- [React Router](https://reactrouter.com/) with `basename={import.meta.env.BASE_URL}` for subpath hosting
