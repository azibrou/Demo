/** Figma 74916:28992 — Thumbnail M carousel @ 375px viewport, 1.5 tiles visible. */
export const THUMBNAIL_M_DESIGN = {
  viewportWidth: 375,
  gutter: 24,
  tileWidth: 210,
  imageHeight: 105,
  gap: 12,
  /** Peeking half of the second tile at baseline. */
  visibleTiles: 1.5,
  minScale: 0.65,
  maxScale: 2.5,
} as const

/** Width of 1.5 tiles + half inter-tile gap @ scale 1. */
export function thumbnailMVisibleSpan(scale: number): number {
  const { tileWidth, gap, visibleTiles } = THUMBNAIL_M_DESIGN
  const fullGaps = visibleTiles - 1
  return visibleTiles * tileWidth * scale + fullGaps * gap * scale
}

/**
 * Scale 1 @ 375px container — keeps 1.5 tiles in the content area (minus 24px gutters).
 * Media scales; caption/meta typography stays fixed px.
 */
export function computeThumbnailMScale(containerWidth: number): number {
  if (containerWidth <= 0) return 1
  const { viewportWidth, gutter, minScale, maxScale } = THUMBNAIL_M_DESIGN
  const available = containerWidth - 2 * gutter
  const availableAtBaseline = viewportWidth - 2 * gutter
  const scale = available / availableAtBaseline
  return Math.min(maxScale, Math.max(minScale, scale))
}
