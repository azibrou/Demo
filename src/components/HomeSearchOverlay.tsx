import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { HomeSearchScreen } from '../screens/HomeSearchScreen'
import { HomeSearchBasketFab } from './HomeSearchBasketFab'
import { useVisualViewportInset } from '../hooks/useVisualViewportInset'

const HOME_SEARCH_SLIDE_MS = 150
const HOME_SEARCH_SLIDE_EASE = 'ease-out'
const DISMISS_DRAG_THRESHOLD_PX = 96
/** Commit to sheet dismiss after this much downward drag at scroll top. */
const DISMISS_DRAG_START_PX = 10
/** Off-screen enter/exit — viewport units avoid % of a mis-sized fixed box on mobile. */
const HOME_SEARCH_OFFSCREEN_Y = '100dvh' as const

/** Ignore drag-dismiss when the gesture starts on a control or nested scroller. */
function isDragDismissExempt(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return (
    target.closest(
      [
        'button',
        'input',
        'textarea',
        'select',
        'a',
        'label',
        '[role="button"]',
        '.home-horizontal-scroll-row',
        '.home-product-carousel',
        '.shortcuts-carousel-cq',
        '.shortcuts-carousel-scale-row',
      ].join(','),
    ) != null
  )
}

type TranslateY = number | typeof HOME_SEARCH_OFFSCREEN_Y

function toTransform(value: TranslateY): string {
  return typeof value === 'number' ? `translateY(${value}px)` : `translateY(${value})`
}

function safeSetPointerCapture(el: HTMLElement, pointerId: number) {
  try {
    el.setPointerCapture(pointerId)
  } catch {
    /* Pointer already captured or element disconnected — ignore. */
  }
}

function safeReleasePointerCapture(el: HTMLElement, pointerId: number) {
  try {
    if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId)
  } catch {
    /* ignore */
  }
}

function useMobileDragDismissEnabled() {
  const get = () => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 640px)').matches
    )
  }
  const [enabled, setEnabled] = useState(get)
  useEffect(() => {
    const queries = ['(pointer: coarse)', '(max-width: 640px)'].map((q) => window.matchMedia(q))
    const sync = () => setEnabled(queries.some((mq) => mq.matches))
    queries.forEach((mq) => mq.addEventListener('change', sync))
    return () => queries.forEach((mq) => mq.removeEventListener('change', sync))
  }, [])
  return enabled
}

export type HomeSearchOverlayProps = {
  onClosed: () => void
}

/**
 * Full-screen home search sheet — slides up on open, down on close / drag dismiss (mobile).
 */
export function HomeSearchOverlay({ onClosed }: HomeSearchOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef(false)
  const mountedRef = useRef(true)
  const dismissActiveRef = useRef(false)
  const closeRafIdsRef = useRef<number[]>([])
  const dragEnabled = useMobileDragDismissEnabled()

  const [translateY, setTranslateY] = useState<TranslateY>(HOME_SEARCH_OFFSCREEN_Y)
  const [transitionOn, setTransitionOn] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const pointerIdRef = useRef<number | null>(null)
  const dragStartYRef = useRef(0)
  const dragStartXRef = useRef(0)
  const dragOffsetRef = useRef(0)

  const onClosedRef = useRef(onClosed)
  onClosedRef.current = onClosed

  useVisualViewportInset()

  useEffect(() => {
    mountedRef.current = true
    document.documentElement.classList.add('home-search-open')
    return () => {
      mountedRef.current = false
      document.documentElement.classList.remove('home-search-open')
      closeRafIdsRef.current.forEach((id) => cancelAnimationFrame(id))
      closeRafIdsRef.current = []
    }
  }, [])

  const resetDismissGesture = useCallback(() => {
    const scrollEl = scrollRef.current
    const pointerId = pointerIdRef.current
    if (scrollEl != null && pointerId != null) {
      safeReleasePointerCapture(scrollEl, pointerId)
    }
    pointerIdRef.current = null
    dismissActiveRef.current = false
    dragOffsetRef.current = 0
    if (mountedRef.current) setIsDragging(false)
  }, [])

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
    setTranslateY(HOME_SEARCH_OFFSCREEN_Y)
    setTransitionOn(false)
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        if (!mountedRef.current) return
        setTransitionOn(true)
        setTranslateY(0)
      })
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  const animateClose = useCallback((fromOffset = 0) => {
    if (closingRef.current) return
    closingRef.current = true
    resetDismissGesture()

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTransitionOn(false)
      setTranslateY(HOME_SEARCH_OFFSCREEN_Y)
      onClosedRef.current()
      return
    }

    setTransitionOn(false)
    setTranslateY(fromOffset)
    const outer = requestAnimationFrame(() => {
      const inner = requestAnimationFrame(() => {
        if (!mountedRef.current) return
        setTransitionOn(true)
        setTranslateY(HOME_SEARCH_OFFSCREEN_Y)
      })
      closeRafIdsRef.current.push(inner)
    })
    closeRafIdsRef.current.push(outer)
  }, [resetDismissGesture])

  const onOverlayTransitionEnd = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return
    if (e.target !== e.currentTarget) return
    if (!closingRef.current) return
    onClosedRef.current()
  }, [])

  const endDrag = useCallback(() => {
    const offset = dragOffsetRef.current
    const wasDismiss = dismissActiveRef.current
    resetDismissGesture()

    if (wasDismiss && offset > DISMISS_DRAG_THRESHOLD_PX) {
      animateClose(offset)
      return
    }

    if (!mountedRef.current) return
    setTransitionOn(true)
    setTranslateY(0)
  }, [animateClose, resetDismissGesture])

  const onScrollPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragEnabled || closingRef.current) return
      if (isDragDismissExempt(e.target)) return
      const scrollEl = scrollRef.current
      if (!scrollEl || scrollEl.scrollTop > 0) return
      if (e.pointerType === 'mouse' && e.button !== 0) return

      pointerIdRef.current = e.pointerId
      dragStartYRef.current = e.clientY
      dragStartXRef.current = e.clientX
      dragOffsetRef.current = 0
      dismissActiveRef.current = false
    },
    [dragEnabled],
  )

  const onScrollPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== e.pointerId || closingRef.current) return
      const scrollEl = scrollRef.current
      if (!scrollEl) return

      if (scrollEl.scrollTop > 0) {
        resetDismissGesture()
        return
      }

      const deltaY = e.clientY - dragStartYRef.current
      const deltaX = e.clientX - dragStartXRef.current

      if (!dismissActiveRef.current) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          resetDismissGesture()
          return
        }
        if (deltaY <= DISMISS_DRAG_START_PX) return

        dismissActiveRef.current = true
        setIsDragging(true)
        setTransitionOn(false)
        safeSetPointerCapture(scrollEl, e.pointerId)
      }

      dragOffsetRef.current = deltaY
      setTranslateY(deltaY)
      if (e.cancelable) e.preventDefault()
    },
    [resetDismissGesture],
  )

  const onScrollPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== e.pointerId) return
      endDrag()
    },
    [endDrag],
  )

  const onScrollPointerCancel = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== e.pointerId) return
      endDrag()
    },
    [endDrag],
  )

  const onScrollLostPointerCapture = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== e.pointerId || !dismissActiveRef.current) return
      const offset = dragOffsetRef.current
      dismissActiveRef.current = false
      pointerIdRef.current = null
      dragOffsetRef.current = 0
      if (mountedRef.current) setIsDragging(false)
      if (offset > DISMISS_DRAG_THRESHOLD_PX) {
        animateClose(offset)
      } else if (mountedRef.current) {
        setTransitionOn(true)
        setTranslateY(0)
      }
    },
    [animateClose],
  )

  const overlayStyle = {
    transform: toTransform(translateY),
    transition: transitionOn ? `transform ${HOME_SEARCH_SLIDE_MS}ms ${HOME_SEARCH_SLIDE_EASE}` : 'none',
    '--home-search-slide-ms': `${HOME_SEARCH_SLIDE_MS}ms`,
  } as CSSProperties

  const overlay = (
    <div
      className="home-search-overlay motion-reduce:transition-none"
      data-dragging={isDragging ? '' : undefined}
      style={overlayStyle}
      onTransitionEnd={onOverlayTransitionEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        ref={scrollRef}
        className="home-search-overlay__scroll"
        onPointerDown={dragEnabled ? onScrollPointerDown : undefined}
        onPointerMove={dragEnabled ? onScrollPointerMove : undefined}
        onPointerUp={dragEnabled ? onScrollPointerUp : undefined}
        onPointerCancel={dragEnabled ? onScrollPointerCancel : undefined}
        onLostPointerCapture={dragEnabled ? onScrollLostPointerCapture : undefined}
      >
        <HomeSearchScreen onCancel={() => animateClose(0)} />
      </div>
      <HomeSearchBasketFab />
    </div>
  )

  return createPortal(overlay, document.body)
}
