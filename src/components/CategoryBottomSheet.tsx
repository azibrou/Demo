import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type TransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'

const SHEET_SLIDE_MS = 150
const SHEET_SLIDE_EASE = 'ease-out'
const SHEET_OFFSCREEN_Y = '100dvh' as const

export type CategoryBottomSheetProps = {
  /** Unmount callback — fired after the slide-down finishes. */
  onClose: () => void
  ariaLabel: string
  /** Receives a `requestClose` callback to trigger the slide-down from inside. */
  children: (requestClose: () => void) => ReactNode
}

/**
 * Bottom sheet that slides up from the bottom (150ms ease-out). Category screen only.
 * Portaled to `document.body` so it stays viewport-fixed above the iOS stack panel.
 */
export function CategoryBottomSheet({ onClose, ariaLabel, children }: CategoryBottomSheetProps) {
  const mountedRef = useRef(true)
  const closingRef = useRef(false)
  const rafIdsRef = useRef<number[]>([])
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const [offscreen, setOffscreen] = useState(true)
  const [transitionOn, setTransitionOn] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    document.documentElement.classList.add('category-sheet-open')
    return () => {
      mountedRef.current = false
      document.documentElement.classList.remove('category-sheet-open')
      rafIdsRef.current.forEach((id) => cancelAnimationFrame(id))
      rafIdsRef.current = []
    }
  }, [])

  useLayoutEffect(() => {
    setOffscreen(true)
    setTransitionOn(false)
    const outer = requestAnimationFrame(() => {
      const inner = requestAnimationFrame(() => {
        if (!mountedRef.current) return
        setTransitionOn(true)
        setOffscreen(false)
      })
      rafIdsRef.current.push(inner)
    })
    rafIdsRef.current.push(outer)
    return () => {
      rafIdsRef.current.forEach((id) => cancelAnimationFrame(id))
      rafIdsRef.current = []
    }
  }, [])

  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onCloseRef.current()
      return
    }

    setTransitionOn(true)
    setOffscreen(true)
  }, [])

  const onPanelTransitionEnd = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return
    if (e.target !== e.currentTarget) return
    if (!closingRef.current) return
    onCloseRef.current()
  }, [])

  const panelStyle = {
    transform: offscreen ? `translateY(${SHEET_OFFSCREEN_Y})` : 'translateY(0)',
    transition: transitionOn ? `transform ${SHEET_SLIDE_MS}ms ${SHEET_SLIDE_EASE}` : 'none',
  } as CSSProperties

  const sheet = (
    <div className="category-sheet-root fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <button
        type="button"
        aria-label="Close"
        onClick={requestClose}
        className={[
          'absolute inset-0 size-full bg-black/40 transition-opacity motion-reduce:transition-none',
          offscreen ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
        style={{ transitionDuration: `${SHEET_SLIDE_MS}ms`, transitionTimingFunction: SHEET_SLIDE_EASE }}
      />
      <div
        className="category-sheet-panel absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-2xl bg-[var(--color-layer-floor-1,#fff)] motion-reduce:transition-none"
        style={panelStyle}
        onTransitionEnd={onPanelTransitionEnd}
      >
        {children(requestClose)}
      </div>
    </div>
  )

  return createPortal(sheet, document.body)
}
