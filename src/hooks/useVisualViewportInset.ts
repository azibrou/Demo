import { useEffect } from 'react'

/**
 * Pins full-screen, `position: fixed` search overlays to the on-screen keyboard's
 * visual viewport.
 *
 * Without this, focusing the search input opens the keyboard and the browser
 * (default `interactive-widget=resizes-visual`) keeps the layout viewport at full
 * height while panning the *visual* viewport to reveal the focused field — which
 * visually shoves the whole fixed overlay up off the top of the screen.
 *
 * While mounted, this tracks `window.visualViewport` and writes two custom props on
 * `<html>` that the overlays consume:
 * - `--app-vv-top`: visual-viewport `offsetTop` (px) — the overlay's `top`.
 * - `--app-vvh`: visual-viewport height (px) — the overlay's `height`, so it fits
 *   exactly above the keyboard instead of underneath it.
 */
export function useVisualViewportInset(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const vv = window.visualViewport
    const root = document.documentElement
    if (!vv) return

    const update = () => {
      root.style.setProperty('--app-vv-top', `${vv.offsetTop}px`)
      root.style.setProperty('--app-vvh', `${vv.height}px`)
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      root.style.removeProperty('--app-vv-top')
      root.style.removeProperty('--app-vvh')
    }
  }, [])
}
