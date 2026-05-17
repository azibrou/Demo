/** ~2.5 tiles across viewport: `px-6` both sides + two `gap-3` gutters (matches MoreToExplore). */
export const CAROUSEL_TILE_WIDTH = 'calc((100vw - 3rem - 2 * 0.75rem) / 2.5)'

/** Retail snippet product row — same slot math as {@link CAROUSEL_TILE_WIDTH}. */
export const RETAIL_TILE_WIDTH = CAROUSEL_TILE_WIDTH
