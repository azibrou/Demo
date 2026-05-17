import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { triggerHaptic } from '../lib/haptic'

/** FAB width in the basket slot (12px gap is `gap-3` on the row). */
export const BASKET_FAB_RESERVE_PX = 60
/** Tab label fade + icon recenter (FloatingTabBar). */
export const TAB_COMPACT_MS = 150
/** Basket FAB scale-in from center. */
export const BASKET_FAB_POP_MS = 100
/** Count badge appears this long after FAB reveal starts. */
export const BASKET_BADGE_DELAY_MS = 150
/** Badge scale bounce — keep in sync with `basket-fab-badge-pop` in styles.css. */
export const BASKET_BADGE_POP_MS = 220
/** Gap between FAB pop end and badge pop start on enter (mirrored on exit). */
const BASKET_FAB_TO_BADGE_GAP_MS = BASKET_BADGE_DELAY_MS - BASKET_FAB_POP_MS

/** Exit: badge reverse ends → FAB reverse starts. */
const BASKET_EXIT_FAB_START_MS = BASKET_BADGE_POP_MS + BASKET_FAB_TO_BADGE_GAP_MS
/** Exit: FAB reverse ends → tab expand + slot shrink start. */
const BASKET_EXIT_LAYOUT_START_MS = BASKET_EXIT_FAB_START_MS + BASKET_FAB_POP_MS
/** Full exit sequence (mirrors enter: tabs + fab + gap + badge). */
const BASKET_EXIT_TOTAL_MS = BASKET_EXIT_LAYOUT_START_MS + TAB_COMPACT_MS

export type BasketFabContextValue = {
  basketUnitTotal: number
  /** Count shown on the basket FAB (lingers during exit animation). */
  basketDisplayCount: number
  compactTabs: boolean
  fabReserveWidthPx: number
  fabReveal: boolean
  showBasketBadge: boolean
  /** True for the full exit sequence (slot stays mounted until layout finishes). */
  basketFabExiting: boolean
  badgeExiting: boolean
  fabExiting: boolean
  /** True only while the FAB scale-in runs after reveal. */
  fabPopIn: boolean
  badgePopNonce: number
  adjustCarouselBasketUnits: (delta: number) => void
  syncShoppingListBasketUnits: (units: number, opts?: { initial?: boolean }) => void
}

const BasketFabContext = createContext<BasketFabContextValue | null>(null)

export function useBasketFab() {
  const ctx = useContext(BasketFabContext)
  if (!ctx) throw new Error('useBasketFab must be used within BasketFabProvider')
  return ctx
}

export function useBasketFabOptional() {
  return useContext(BasketFabContext)
}

export function BasketFabProvider({ children }: { children: ReactNode }) {
  const [carouselUnits, setCarouselUnits] = useState(0)
  const [shoppingUnits, setShoppingUnits] = useState(0)
  const total = carouselUnits + shoppingUnits

  const [compactTabs, setCompactTabs] = useState(false)
  const [fabReservePx, setFabReservePx] = useState(0)
  const [fabReveal, setFabReveal] = useState(false)
  const [showBasketBadge, setShowBasketBadge] = useState(false)
  const [basketFabExiting, setBasketFabExiting] = useState(false)
  const [badgeExiting, setBadgeExiting] = useState(false)
  const [fabExiting, setFabExiting] = useState(false)
  const [fabPopIn, setFabPopIn] = useState(false)
  const [exitDisplayCount, setExitDisplayCount] = useState(0)
  const [badgePopNonce, setBadgePopNonce] = useState(0)

  const prevTotalRef = useRef(0)
  const pendingInitialRef = useRef(false)
  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const rafIdsRef = useRef<number[]>([])

  const clearAnimationTimers = useCallback(() => {
    timerIdsRef.current.forEach((id) => clearTimeout(id))
    timerIdsRef.current = []
    rafIdsRef.current.forEach((id) => cancelAnimationFrame(id))
    rafIdsRef.current = []
  }, [])

  const applyImmediateBasketVisible = useCallback((nextTotal: number) => {
    prevTotalRef.current = nextTotal
    setBasketFabExiting(false)
    setBadgeExiting(false)
    setFabExiting(false)
    setFabPopIn(false)
    setExitDisplayCount(0)
    setCompactTabs(nextTotal > 0)
    setFabReservePx(nextTotal > 0 ? BASKET_FAB_RESERVE_PX : 0)
    setFabReveal(nextTotal > 0)
    setShowBasketBadge(nextTotal > 0)
    if (nextTotal > 0) setBadgePopNonce((n) => n + 1)
  }, [])

  const syncShoppingListBasketUnits = useCallback((units: number, opts?: { initial?: boolean }) => {
    setShoppingUnits(units)
    if (opts?.initial) pendingInitialRef.current = true
  }, [])

  const adjustCarouselBasketUnits = useCallback((delta: number) => {
    if (delta === 0) return
    setCarouselUnits((c) => Math.max(0, c + delta))
  }, [])

  useLayoutEffect(() => {
    if (pendingInitialRef.current) {
      pendingInitialRef.current = false
      clearAnimationTimers()
      const next = shoppingUnits + carouselUnits
      if (next > 0) applyImmediateBasketVisible(next)
      else prevTotalRef.current = next
      return
    }

    const prev = prevTotalRef.current
    const next = shoppingUnits + carouselUnits
    if (prev === next) return

    if (prev === 0 && next > 0) {
      clearAnimationTimers()
      prevTotalRef.current = next
      setBasketFabExiting(false)
      setBadgeExiting(false)
      setFabExiting(false)
      setFabPopIn(false)
      setExitDisplayCount(0)
      setCompactTabs(true)
      setFabReservePx(0)
      setFabReveal(false)
      setShowBasketBadge(false)

      const raf1 = window.requestAnimationFrame(() => {
        const raf2 = window.requestAnimationFrame(() => setFabReservePx(BASKET_FAB_RESERVE_PX))
        rafIdsRef.current.push(raf2)
      })
      rafIdsRef.current.push(raf1)

      const tFab = window.setTimeout(() => {
        triggerHaptic('success')
        setFabReveal(true)
        setFabPopIn(true)
        const tPopDone = window.setTimeout(() => setFabPopIn(false), BASKET_FAB_POP_MS)
        timerIdsRef.current.push(tPopDone)
      }, TAB_COMPACT_MS)

      const tBadge = window.setTimeout(() => {
        setShowBasketBadge(true)
        setBadgePopNonce((n) => n + 1)
      }, TAB_COMPACT_MS + BASKET_BADGE_DELAY_MS)

      timerIdsRef.current.push(tFab, tBadge)
      return clearAnimationTimers
    }

    if (prev > 0 && next === 0) {
      clearAnimationTimers()
      prevTotalRef.current = 0
      setExitDisplayCount(prev)
      setBasketFabExiting(true)
      setBadgeExiting(true)
      setFabExiting(false)
      setFabReveal(true)

      const tFabOut = window.setTimeout(() => {
        setBadgeExiting(false)
        setShowBasketBadge(false)
        setFabExiting(true)
      }, BASKET_BADGE_POP_MS)

      const tLayout = window.setTimeout(() => {
        setFabExiting(false)
        setFabReveal(false)
        setCompactTabs(false)
        setFabReservePx(0)
      }, BASKET_EXIT_LAYOUT_START_MS)

      const tDone = window.setTimeout(() => {
        setBasketFabExiting(false)
        setExitDisplayCount(0)
      }, BASKET_EXIT_TOTAL_MS)

      timerIdsRef.current.push(tFabOut, tLayout, tDone)
      return clearAnimationTimers
    }

    prevTotalRef.current = next
    if (next > 0) setBadgePopNonce((n) => n + 1)
  }, [shoppingUnits, carouselUnits, applyImmediateBasketVisible, clearAnimationTimers])

  const basketDisplayCount = basketFabExiting ? exitDisplayCount : total

  const value: BasketFabContextValue = {
    basketUnitTotal: total,
    basketDisplayCount,
    compactTabs,
    fabReserveWidthPx: fabReservePx,
    fabReveal,
    showBasketBadge,
    basketFabExiting,
    badgeExiting,
    fabExiting,
    fabPopIn,
    badgePopNonce,
    adjustCarouselBasketUnits,
    syncShoppingListBasketUnits,
  }

  return <BasketFabContext.Provider value={value}>{children}</BasketFabContext.Provider>
}
