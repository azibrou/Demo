import { useEffect, useState, type RefObject } from 'react'
import { computeThumbnailLScale } from '../lib/thumbnailLScale'

export function useThumbnailLScale(ref: RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => setScale(computeThumbnailLScale(el.getBoundingClientRect().width))

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return scale
}
