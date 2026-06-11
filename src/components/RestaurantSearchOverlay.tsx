import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type TransitionEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { EaterSearchInput } from './EaterSearchInput'
import { SimpleItem } from './SimpleItem'
import type { RestaurantAssortmentItem } from '../lib/restaurantMerchantContent'

const SLIDE_MS = 150
const SLIDE_EASE = 'ease-out'
const OFFSCREEN_Y = '-100dvh' as const

export type RestaurantSearchOverlayProps = {
  /** Searchable items for the current restaurant. */
  assortment: readonly RestaurantAssortmentItem[]
  onClose: () => void
}

/**
 * Restaurant menu search — Figma 80638:179495.
 * Slides down from the top covering the screen (150ms ease-out); results are the
 * restaurant's own assortment ({@link SimpleItem} rows with quick-add).
 */
export function RestaurantSearchOverlay({ assortment, onClose }: RestaurantSearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)
  const closingRef = useRef(false)
  const rafIdsRef = useRef<number[]>([])
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const [query, setQuery] = useState('')
  const [offscreen, setOffscreen] = useState(true)
  const [transitionOn, setTransitionOn] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    document.documentElement.classList.add('restaurant-search-open')
    return () => {
      mountedRef.current = false
      document.documentElement.classList.remove('restaurant-search-open')
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
        inputRef.current?.focus({ preventScroll: true })
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

  const onOverlayTransitionEnd = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return
    if (e.target !== e.currentTarget) return
    if (!closingRef.current) return
    onCloseRef.current()
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length === 0) return assortment
    return assortment.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description ?? '').toLowerCase().includes(q),
    )
  }, [query, assortment])

  const overlayStyle = {
    transform: offscreen ? `translateY(${OFFSCREEN_Y})` : 'translateY(0)',
    transition: transitionOn ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}` : 'none',
  } as CSSProperties

  const overlay = (
    <div
      className="restaurant-search-overlay motion-reduce:transition-none"
      style={overlayStyle}
      onTransitionEnd={onOverlayTransitionEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Search menu"
    >
      <div className="restaurant-search-overlay__panel home-gutter-inline w-full shrink-0 pb-2 pt-[max(12px,env(safe-area-inset-top,0px))]">
        <EaterSearchInput
          value={query}
          onChange={setQuery}
          placeholder="Categories and products"
          inputRef={inputRef}
          autoFocus
          onCancel={requestClose}
        />
      </div>

      <div className="restaurant-search-overlay__results flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[calc(24px+env(safe-area-inset-bottom,0px))]">
        {results.map((item) => (
          <SimpleItem key={item.itemId} showDivider {...item} />
        ))}
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
