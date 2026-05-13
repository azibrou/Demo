/**
 * URLs for raster/SVG assets aligned with Figma exports (e.g. basket FAB).
 * Replace `basket` with an exported asset URL from Figma when you have one.
 */
const basketSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h15l-1.5 9.5a1 1 0 0 1-1 .5H8.5a1 1 0 0 1-1-.5L6 7Z"/><path d="M6 7 5 4H2"/><path d="M9 11v4"/><path d="M15 11v4"/><circle cx="9.5" cy="18.5" r="1"/><circle cx="16.5" cy="18.5" r="1"/></svg>`

export const design = {
  basketFab: {
    basket: `data:image/svg+xml,${encodeURIComponent(basketSvg)}`,
  },
} as const
