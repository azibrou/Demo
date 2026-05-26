import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { TAB_BAR_LAYOUT_EASE, TAB_BAR_LAYOUT_MS } from '../context/BasketFabContext'

/**
 * FLIP-style width tween — measures the pill, then transitions to `targetWidthPx` (150ms ease-out).
 * Used when CSS `calc(100% - var(--ftb-trailing-chrome))` does not interpolate reliably.
 */
export function useAnimatedPillWidth(
  pillRef: RefObject<HTMLDivElement | null>,
  targetWidthPx: number | null,
): CSSProperties | undefined {
  const [widthPx, setWidthPx] = useState<number | null>(null)
  const prevTargetRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (targetWidthPx == null) {
      setWidthPx(null)
      prevTargetRef.current = null
      return
    }

    const el = pillRef.current
    if (!el) return

    const prevTarget = prevTargetRef.current
    prevTargetRef.current = targetWidthPx

    const startPx = el.getBoundingClientRect().width
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || prevTarget === null || Math.abs(startPx - targetWidthPx) < 0.5) {
      setWidthPx(targetWidthPx)
      return
    }

    setWidthPx(startPx)
    let raf2 = 0
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setWidthPx(targetWidthPx))
    })

    return () => {
      window.cancelAnimationFrame(raf1)
      if (raf2) window.cancelAnimationFrame(raf2)
    }
  }, [pillRef, targetWidthPx])

  return useMemo((): CSSProperties | undefined => {
    if (widthPx == null) return undefined
    return {
      width: widthPx,
      maxWidth: widthPx,
      minWidth: 0,
      flex: '0 0 auto',
      transition: `width ${TAB_BAR_LAYOUT_MS}ms ${TAB_BAR_LAYOUT_EASE}, max-width ${TAB_BAR_LAYOUT_MS}ms ${TAB_BAR_LAYOUT_EASE}, flex-basis ${TAB_BAR_LAYOUT_MS}ms ${TAB_BAR_LAYOUT_EASE}`,
    }
  }, [widthPx])
}
