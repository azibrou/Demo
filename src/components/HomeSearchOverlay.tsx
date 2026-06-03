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
import { HomeSearchScreen } from '../screens/HomeSearchScreen'
import { HomeSearchBasketFab } from './HomeSearchBasketFab'

const HOME_SEARCH_SLIDE_MS = 150
const HOME_SEARCH_SLIDE_EASE = 'ease-out'
const DISMISS_DRAG_THRESHOLD_PX = 96

/** Ignore drag-dismiss when the gesture starts on a control (Cancel, filters, input, etc.). */
function isInteractiveDragTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('button, input, textarea, select, a, label, [role="button"]') != null
  )
}

type TranslateY = number | '100%'

function toTransform(value: TranslateY): string {
  return typeof value === 'number' ? `translateY(${value}px)` : `translateY(${value})`
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
  const dragEnabled = useMobileDragDismissEnabled()

  const [translateY, setTranslateY] = useState<TranslateY>('100%')
  const [transitionOn, setTransitionOn] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const pointerIdRef = useRef<number | null>(null)
  const dragStartYRef = useRef(0)
  const dragStartXRef = useRef(0)
  const dragOffsetRef = useRef(0)

  useLayoutEffect(() => {
    setTranslateY('100%')
    setTransitionOn(false)
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
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
    setIsDragging(false)
    pointerIdRef.current = null
    dragOffsetRef.current = 0

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTransitionOn(false)
      setTranslateY('100%')
      onClosed()
      return
    }

    setTransitionOn(false)
    setTranslateY(fromOffset)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionOn(true)
        setTranslateY('100%')
      })
    })
  }, [onClosed])

  const onOverlayTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return
      if (e.target !== e.currentTarget) return
      if (!closingRef.current) return
      onClosed()
    },
    [onClosed],
  )

  const endDrag = useCallback(() => {
    const scrollEl = scrollRef.current
    const pointerId = pointerIdRef.current
    if (pointerId != null && scrollEl?.hasPointerCapture(pointerId)) {
      scrollEl.releasePointerCapture(pointerId)
    }
    pointerIdRef.current = null
    setIsDragging(false)

    const offset = dragOffsetRef.current
    dragOffsetRef.current = 0

    if (offset > DISMISS_DRAG_THRESHOLD_PX) {
      animateClose(offset)
      return
    }

    setTransitionOn(true)
    setTranslateY(0)
  }, [animateClose])

  const onScrollPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragEnabled || closingRef.current) return
      if (isInteractiveDragTarget(e.target)) return
      const scrollEl = scrollRef.current
      if (!scrollEl || scrollEl.scrollTop > 0) return
      if (e.pointerType === 'mouse' && e.button !== 0) return

      pointerIdRef.current = e.pointerId
      dragStartYRef.current = e.clientY
      dragStartXRef.current = e.clientX
      dragOffsetRef.current = 0
      setIsDragging(true)
      setTransitionOn(false)
      scrollEl.setPointerCapture(e.pointerId)
    },
    [dragEnabled],
  )

  const onScrollPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId || closingRef.current) return
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const deltaY = e.clientY - dragStartYRef.current
    const deltaX = e.clientX - dragStartXRef.current

    if (dragOffsetRef.current === 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
      pointerIdRef.current = null
      setIsDragging(false)
      scrollEl.releasePointerCapture(e.pointerId)
      return
    }

    if (deltaY > 0 && scrollEl.scrollTop <= 0) {
      dragOffsetRef.current = deltaY
      setTranslateY(deltaY)
      if (e.cancelable) e.preventDefault()
      return
    }

    if (dragOffsetRef.current > 0 && deltaY <= 0) {
      dragOffsetRef.current = 0
      setTranslateY(0)
      return
    }

    if (deltaY <= 0 && dragOffsetRef.current === 0) {
      pointerIdRef.current = null
      setIsDragging(false)
      scrollEl.releasePointerCapture(e.pointerId)
    }
  }, [])

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

  const overlayStyle = {
    transform: toTransform(translateY),
    transition: transitionOn ? `transform ${HOME_SEARCH_SLIDE_MS}ms ${HOME_SEARCH_SLIDE_EASE}` : 'none',
    '--home-search-slide-ms': `${HOME_SEARCH_SLIDE_MS}ms`,
  } as CSSProperties

  return (
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
      >
        <HomeSearchScreen onCancel={() => animateClose(0)} />
      </div>
      <HomeSearchBasketFab />
    </div>
  )
}
