export type HapticKind = 'light' | 'success'

const PATTERNS: Record<HapticKind, number | number[]> = {
  light: 10,
  success: [10, 50, 10],
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Web Vibration API — no-op on desktop, unsupported browsers, or reduced motion. */
export function triggerHaptic(kind: HapticKind): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  if (prefersReducedMotion()) return
  try {
    navigator.vibrate(PATTERNS[kind])
  } catch {
    /* ignore */
  }
}
