/** Figma 74916:29102 — large list card @ 375px viewport, 24px gutters. */
export const THUMBNAIL_L_DESIGN = {
  viewportWidth: 375,
  gutter: 24,
  cardWidth: 342,
  imageHeight: 156,
  listGap: 24,
  minScale: 0.65,
  maxScale: 2.5,
} as const

/**
 * Scale 1 @ 375px — card spans content width (viewport − 48px gutters).
 * Image area scales; overlays and caption typography stay fixed px.
 */
export function computeThumbnailLScale(containerWidth: number): number {
  if (containerWidth <= 0) return 1
  const { viewportWidth, gutter, minScale, maxScale } = THUMBNAIL_L_DESIGN
  const available = containerWidth - 2 * gutter
  const availableAtBaseline = viewportWidth - 2 * gutter
  const scale = available / availableAtBaseline
  return Math.min(maxScale, Math.max(minScale, scale))
}
