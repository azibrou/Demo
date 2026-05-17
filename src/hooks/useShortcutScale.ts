import { useEffect, useState, type RefObject } from 'react'
import { computeShortcutScale, computeTileFitScale } from '../lib/shortcutScale'

export type ShortcutScaleMode = 'viewport' | 'tile-fit'

export function useShortcutScale(
  ref: RefObject<HTMLElement | null>,
  options?: { enabled?: boolean; mode?: ShortcutScaleMode; tileCount?: number },
): number {
  const { enabled = true, mode = 'viewport', tileCount = 5 } = options ?? {}
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    const update = () => {
      const width = el.getBoundingClientRect().width
      setScale(
        mode === 'tile-fit' ? computeTileFitScale(width, tileCount) : computeShortcutScale(width),
      )
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, mode, ref, tileCount])

  return scale
}
