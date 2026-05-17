/** Figma 76281:68503 — shortcuts row baseline @ 375px viewport width. */
export const SHORTCUTS_DESIGN = {
  viewportWidth: 375,
  tileWidth: 86,
  tilePaddingX: 4,
  gap: 12,
  gutter: 24,
  rowPaddingTop: 12,
  ringSize: 72,
  iconSize: 48,
  iceCreamIconSize: 56,
  labelHeight: 36,
  tileGap: 6,
  minScale: 0.65,
  maxScale: 2.5,
} as const

/**
 * Scale factor for shortcut tiles: 1 @ 375px container width.
 * Icon ring/icon scale with this; label typography stays fixed (container width only).
 */
/** 1 @ 375px viewport; grows/shrinks with container width (shortcuts row). */
export function computeShortcutScale(containerWidth: number): number {
  if (containerWidth <= 0) return 1
  const scale = containerWidth / SHORTCUTS_DESIGN.viewportWidth
  return Math.min(SHORTCUTS_DESIGN.maxScale, Math.max(SHORTCUTS_DESIGN.minScale, scale))
}

/** Fit N tiles + gaps into container width (order-again, etc.). */
export function computeTileFitScale(containerWidth: number, tileCount: number): number {
  if (containerWidth <= 0 || tileCount <= 0) return 1
  const available =
    containerWidth - 2 * SHORTCUTS_DESIGN.gutter - (tileCount - 1) * SHORTCUTS_DESIGN.gap
  const natural = tileCount * SHORTCUTS_DESIGN.tileWidth
  const scale = available / natural
  return Math.min(SHORTCUTS_DESIGN.maxScale, Math.max(SHORTCUTS_DESIGN.minScale, scale))
}
