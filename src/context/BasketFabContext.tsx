import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/** 12px gap + 60px FAB slot (Figma consumer bottom bar). */
const RESERVE_PX = 72
/** Matches tab label collapse/expand duration in `FloatingTabBar` (220ms). */
const TAB_LABEL_MS = 220
/** Basket slot `max-width` transition (FloatingTabBar) — tab pill eases narrower / wider (same IN and OUT). */
const RESERVE_TRANSITION_MS = 100
/** Matches `BasketFab` pop animation (`--animate-basket-fab-pop` = 150ms). */
const FAB_POP_MS = 150

export type BasketFabContextValue = {
  basketUnitTotal: number
  /** Count shown on the basket FAB (lingers during exit animation). */
  basketDisplayCount: number
  compactTabs: boolean
  fabReserveWidthPx: number
  fabReveal: boolean
  showBasketBadge: boolean
  /** True while FAB + badge play the reverse pop-out together. */
  basketFabExiting: boolean
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

export function BasketFabProvider({ children }: { children: ReactNode }) {
  const [carouselUnits, setCarouselUnits] = useState(0)
  const [shoppingUnits, setShoppingUnits] = useState(0)
  const total = carouselUnits + shoppingUnits

  const [compactTabs, setCompactTabs] = useState(false)
  const [fabReservePx, setFabReservePx] = useState(0)
  const [fabReveal, setFabReveal] = useState(false)
  const [showBasketBadge, setShowBasketBadge] = useState(false)
  const [basketFabExiting, setBasketFabExiting] = useState(false)
  const [exitDisplayCount, setExitDisplayCount] = useState(0)
  const [badgePopNonce, setBadgePopNonce] = useState(0)

  const prevTotalRef = useRef(0)
  const pendingInitialRef = useRef(false)
  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAnimationTimers = useCallback(() => {
    timerIdsRef.current.forEach((id) => clearTimeout(id))
    timerIdsRef.current = []
  }, [])

  const applyImmediateBasketVisible = useCallback((nextTotal: number) => {
    prevTotalRef.current = nextTotal
    setBasketFabExiting(false)
    setCompactTabs(nextTotal > 0)
    setFabReservePx(nextTotal > 0 ? RESERVE_PX : 0)
    setFabReveal(nextTotal > 0)
    setShowBasketBadge(nextTotal > 0)
  }, [])

  const syncShoppingListBasketUnits = useCallback((units: number, opts?: { initial?: boolean }) => {
    setShoppingUnits(units)
    if (opts?.initial) pendingInitialRef.current = true
  }, [])

  const adjustCarouselBasketUnits = useCallback((delta: number) => {
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
      setExitDisplayCount(0)
      setCompactTabs(true)
      setFabReservePx(0)
      setFabReveal(false)
      setShowBasketBadge(false)
      const tOpenReserve = window.setTimeout(() => {
        setFabReservePx(RESERVE_PX)
      }, TAB_LABEL_MS)
      const tFab = window.setTimeout(() => {
        setFabReveal(true)
      }, TAB_LABEL_MS + RESERVE_TRANSITION_MS)
      const tBadge = window.setTimeout(() => {
        setShowBasketBadge(true)
        setBadgePopNonce((n) => n + 1)
      }, TAB_LABEL_MS + RESERVE_TRANSITION_MS + FAB_POP_MS)
      timerIdsRef.current.push(tOpenReserve, tFab, tBadge)
      return clearAnimationTimers
    }

    if (prev > 0 && next === 0) {
      clearAnimationTimers()
      prevTotalRef.current = 0
      setExitDisplayCount(prev)
      setBasketFabExiting(true)
      const tAfterReversePop = window.setTimeout(() => {
        setBasketFabExiting(false)
        setShowBasketBadge(false)
        setFabReveal(false)
        setFabReservePx(0)
      }, FAB_POP_MS)
      const tExpandTabs = window.setTimeout(() => {
        setCompactTabs(false)
      }, FAB_POP_MS + RESERVE_TRANSITION_MS)
      timerIdsRef.current.push(tAfterReversePop, tExpandTabs)
      return clearAnimationTimers
    }

    prevTotalRef.current = next
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
    badgePopNonce,
    adjustCarouselBasketUnits,
    syncShoppingListBasketUnits,
  }

  return <BasketFabContext.Provider value={value}>{children}</BasketFabContext.Provider>
}
