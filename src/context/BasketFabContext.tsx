import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import type { WideBasketFabState } from '../components/WideBasketFab'
import { triggerHaptic } from '../lib/haptic'
import { isMerchantHubPath } from '../lib/merchantHubPath'

/** Gap between tab bar row siblings (pill · actions · basket). */
export const TAB_BAR_ITEM_GAP_PX = 12
/** TabAction diameter — keep in sync with TabAction `size-[56px]`. */
export const TAB_ACTION_SIZE_PX = 56
/** Round basket FAB slot width in tab bar rows (FAB only; add {@link TAB_BAR_ITEM_GAP_PX} for row reserve). */
export const BASKET_FAB_RESERVE_PX = 56
/** Home row reserve when basket slot is open (FAB + leading gap). */
export const BASKET_FAB_TOTAL_RESERVE_PX = BASKET_FAB_RESERVE_PX + TAB_BAR_ITEM_GAP_PX
/** Home row reserve for the search TabAction (button + leading gap). */
export const TAB_ACTION_TOTAL_RESERVE_PX = TAB_ACTION_SIZE_PX + TAB_BAR_ITEM_GAP_PX
/** Merchant wide basket FAB — loading / collapsed width. */
export const WIDE_BASKET_FAB_SLOT_PX = 56
/** Merchant tab pill — single selected tab width. */
export const MERCHANT_TAB_SOLO_PX = 56
/** Pre–wide-FAB reserve in tab row (56px FAB + 12px gap) — Figma merchant compact step. */
export const MERCHANT_PRE_FAB_RESERVE_PX = 68
/** Pill shrink, basket slot grow, wide FAB padding — one duration, ease-out. */
export const TAB_BAR_LAYOUT_MS = 150
export const TAB_BAR_LAYOUT_EASE = 'ease-out'
/** Tab label fade + icon recenter (same beat as layout). */
export const TAB_COMPACT_MS = TAB_BAR_LAYOUT_MS
/** Merchant FAB + pill expand — keep in sync with `--merchant-motion-ms`. */
export const MERCHANT_FAB_EXPAND_MS = TAB_BAR_LAYOUT_MS
/** Merchant loading FAB pop-in — same beat as slot open. */
export const MERCHANT_FAB_POP_MS = TAB_BAR_LAYOUT_MS
/** Home basket FAB scale-in — matches slot reserve tween. */
export const BASKET_FAB_POP_MS = TAB_BAR_LAYOUT_MS
/** Round FAB enter pop — slight bounce; keep in sync with `basket-fab-button-pop` in styles.css. */
export const BASKET_FAB_BUTTON_POP_MS = 220
/** Loading spinner visible duration — Figma 77550:93474. */
export const BASKET_FAB_LOADER_SPIN_MS = 1500
/** Spinner fade-out before basket icon appears. */
export const BASKET_FAB_LOADER_FADE_MS = 150
/** Merchant wide FAB — expand after home loader spin + fade (Figma 77550:93474). */
export const MERCHANT_BASKET_EXPAND_AT_MS = BASKET_FAB_LOADER_SPIN_MS + BASKET_FAB_LOADER_FADE_MS
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
const BASKET_EXIT_TOTAL_MS = BASKET_EXIT_LAYOUT_START_MS + TAB_COMPACT_MS

export type MerchantWideFabPhase = WideBasketFabState | 'hidden'

export type BasketFabContextValue = {
  basketUnitTotal: number
  basketDisplayCount: number
  compactTabs: boolean
  fabReserveWidthPx: number
  fabReveal: boolean
  showBasketBadge: boolean
  basketFabExiting: boolean
  badgeExiting: boolean
  fabExiting: boolean
  fabPopIn: boolean
  fabLoading: boolean
  loaderExiting: boolean
  fabIconPopIn: boolean
  badgePopNonce: number
  /** Merchant {@link MerchantFTabBar} — single 56px tab pill after basket reveal. */
  merchantTabSolo: boolean
  /** Merchant wide FAB phase (hidden until compact finishes). */
  merchantWideFabPhase: MerchantWideFabPhase
  /** 68px spacer while tab bar compacts (before loading FAB appears). */
  merchantLayoutReservePx: number
  /** Expand tab bar (icons, no labels) and collapse wide FAB — active tab tap when solo. */
  expandMerchantTabs: () => void
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
  const { pathname } = useLocation()
  const merchantMode = isMerchantHubPath(pathname)

  const [carouselUnits, setCarouselUnits] = useState(0)
  const [shoppingUnits, setShoppingUnits] = useState(0)
  const total = carouselUnits + shoppingUnits

  const [compactTabs, setCompactTabs] = useState(false)
  const [merchantTabSolo, setMerchantTabSolo] = useState(false)
  const [merchantWideFabPhase, setMerchantWideFabPhase] = useState<MerchantWideFabPhase>('hidden')
  const [merchantLayoutReservePx, setMerchantLayoutReservePx] = useState(0)
  const [fabReservePx, setFabReservePx] = useState(0)
  const [fabReveal, setFabReveal] = useState(false)
  const [showBasketBadge, setShowBasketBadge] = useState(false)
  const [basketFabExiting, setBasketFabExiting] = useState(false)
  const [badgeExiting, setBadgeExiting] = useState(false)
  const [fabExiting, setFabExiting] = useState(false)
  const [fabPopIn, setFabPopIn] = useState(false)
  const [fabLoading, setFabLoading] = useState(false)
  const [loaderExiting, setLoaderExiting] = useState(false)
  const [fabIconPopIn, setFabIconPopIn] = useState(false)
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

  const applyImmediateBasketVisible = useCallback(
    (nextTotal: number) => {
      prevTotalRef.current = nextTotal
      setBasketFabExiting(false)
      setBadgeExiting(false)
      setFabExiting(false)
      setFabPopIn(false)
      setFabLoading(false)
      setLoaderExiting(false)
      setFabIconPopIn(false)
      setExitDisplayCount(0)
      setMerchantTabSolo(false)
      setMerchantLayoutReservePx(0)
      setCompactTabs(nextTotal > 0)
      if (merchantMode) {
        setMerchantWideFabPhase(nextTotal > 0 ? 'default' : 'hidden')
        setMerchantTabSolo(nextTotal > 0)
        setFabReservePx(0)
        setFabReveal(nextTotal > 0)
        setFabLoading(false)
        setShowBasketBadge(false)
      } else {
        setMerchantWideFabPhase('hidden')
        setFabReservePx(nextTotal > 0 ? BASKET_FAB_RESERVE_PX : 0)
        setFabReveal(nextTotal > 0)
        setShowBasketBadge(nextTotal > 0)
        if (nextTotal > 0) setBadgePopNonce((n) => n + 1)
      }
    },
    [merchantMode],
  )

  const expandMerchantTabs = useCallback(() => {
    if (!merchantMode) return
    setMerchantTabSolo(false)
    setMerchantLayoutReservePx(0)
    setCompactTabs(true)
    setMerchantWideFabPhase('collapsed')
    setFabReservePx(0)
  }, [merchantMode])

  /** Leaving merchant with basket → home round FAB. */
  useLayoutEffect(() => {
    if (total <= 0 || merchantMode) return

    if (merchantWideFabPhase !== 'hidden' || merchantTabSolo || merchantLayoutReservePx > 0) {
      setMerchantWideFabPhase('hidden')
      setMerchantTabSolo(false)
      setMerchantLayoutReservePx(0)
      setCompactTabs(true)
      setFabReservePx(BASKET_FAB_RESERVE_PX)
      setFabReveal(true)
      setFabLoading(false)
      setShowBasketBadge(true)
      setBadgePopNonce((n) => n + 1)
    }
  }, [merchantMode, total, merchantWideFabPhase, merchantTabSolo, merchantLayoutReservePx])

  useEffect(() => {
    return () => clearAnimationTimers()
  }, [clearAnimationTimers])

  /** Idle merchant screen — full tab bar, no basket chrome. */
  useLayoutEffect(() => {
    if (!merchantMode || total > 0) return
    clearAnimationTimers()
    setCompactTabs(false)
    setMerchantTabSolo(false)
    setMerchantLayoutReservePx(0)
    setMerchantWideFabPhase('hidden')
    setFabReveal(false)
    setFabPopIn(false)
    setFabLoading(false)
    setFabReservePx(0)
  }, [merchantMode, total, clearAnimationTimers])

  const syncShoppingListBasketUnits = useCallback((units: number, opts?: { initial?: boolean }) => {
    setShoppingUnits(units)
    if (opts?.initial) pendingInitialRef.current = true
  }, [])

  const adjustCarouselBasketUnits = useCallback((delta: number) => {
    if (delta === 0) return
    setCarouselUnits((c) => Math.max(0, c + delta))
  }, [])

  const scheduleLoaderToBasket = useCallback((opts?: { showBadgeAfter?: boolean }) => {
    const showBadgeAfter = opts?.showBadgeAfter !== false
    const spinEndMs = BASKET_FAB_LOADER_SPIN_MS
    const iconPopStartMs = spinEndMs + BASKET_FAB_LOADER_FADE_MS

    const tLoaderFade = window.setTimeout(() => setLoaderExiting(true), spinEndMs)

    const tIcon = window.setTimeout(() => {
      setLoaderExiting(false)
      setFabLoading(false)
      setFabIconPopIn(true)
      const tIconDone = window.setTimeout(() => setFabIconPopIn(false), BASKET_FAB_POP_MS)
      timerIdsRef.current.push(tIconDone)
    }, iconPopStartMs)

    if (showBadgeAfter) {
      const tBadge = window.setTimeout(() => {
        setShowBasketBadge(true)
        setBadgePopNonce((n) => n + 1)
      }, iconPopStartMs + BASKET_BADGE_DELAY_MS)
      timerIdsRef.current.push(tBadge)
    }

    timerIdsRef.current.push(tLoaderFade, tIcon)
  }, [])

  const startBasketLoading = useCallback(() => {
    setLoaderExiting(false)
    setFabIconPopIn(false)
    setShowBasketBadge(false)
    triggerHaptic('success')
    setFabReveal(true)
    setFabPopIn(true)
    setFabLoading(true)
    const tPopDone = window.setTimeout(() => setFabPopIn(false), BASKET_FAB_BUTTON_POP_MS)
    timerIdsRef.current.push(tPopDone)
    scheduleLoaderToBasket()
  }, [scheduleLoaderToBasket])

  const startMerchantBasketExit = useCallback(() => {
    setBasketFabExiting(false)
    setBadgeExiting(false)
    setFabExiting(false)
    setFabPopIn(false)
    setFabLoading(false)
    setLoaderExiting(false)
    setFabIconPopIn(false)
    setExitDisplayCount(0)
    setMerchantTabSolo(false)
    setMerchantLayoutReservePx(0)
    setMerchantWideFabPhase('hidden')
    setCompactTabs(false)
    setFabReveal(false)
    setFabReservePx(0)
  }, [])

  /**
   * Merchant quick-add sequence (ms from t=0):
   * A+B) 0–150  — compact tabs + loading FAB pop-in (parallel, ease-out)
   * C) 150–1500 — loading spinner
   * D) 1500–1650 — solo tab 56px + FAB expands left (150ms ease-out)
   */
  const startMerchantBasketEnter = useCallback(() => {
    setBasketFabExiting(false)
    setBadgeExiting(false)
    setFabExiting(false)
    setFabPopIn(false)
    setFabLoading(false)
    setLoaderExiting(false)
    setFabIconPopIn(false)
    setExitDisplayCount(0)
    setMerchantTabSolo(false)
    setMerchantWideFabPhase('hidden')
    setMerchantLayoutReservePx(0)
    setCompactTabs(true)
    setFabReveal(false)
    setShowBasketBadge(false)
    setFabReservePx(0)

    setMerchantWideFabPhase('loading')
    setFabLoading(true)
    setFabReveal(true)
    setFabPopIn(true)
    const tPopDone = window.setTimeout(() => setFabPopIn(false), BASKET_FAB_BUTTON_POP_MS)
    timerIdsRef.current.push(tPopDone)
    scheduleLoaderToBasket({ showBadgeAfter: false })

    const tDefault = window.setTimeout(() => {
      triggerHaptic('success')
      setMerchantWideFabPhase('default')
      setMerchantTabSolo(true)
    }, MERCHANT_BASKET_EXPAND_AT_MS)

    timerIdsRef.current.push(tDefault)
  }, [scheduleLoaderToBasket])

  const startBasketExit = useCallback((prev: number) => {
    setExitDisplayCount(prev)
    setBasketFabExiting(true)
    setBadgeExiting(true)
    setFabExiting(false)
    setFabReveal(true)
    setFabLoading(false)
    setLoaderExiting(false)
    setFabIconPopIn(false)

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

      if (merchantMode) {
        startMerchantBasketEnter()
        return
      }

      setBasketFabExiting(false)
      setBadgeExiting(false)
      setFabExiting(false)
      setFabPopIn(false)
      setFabLoading(false)
      setLoaderExiting(false)
      setFabIconPopIn(false)
      setExitDisplayCount(0)
      setCompactTabs(true)
      setFabReveal(false)
      setShowBasketBadge(false)

      setFabReservePx(0)
      const rafLayout = window.requestAnimationFrame(() => {
        setFabReservePx(BASKET_FAB_RESERVE_PX)
        startBasketLoading()
      })
      rafIdsRef.current.push(rafLayout)
      return
    }

    if (prev > 0 && next > prev) {
      prevTotalRef.current = next
      return
    }

    if (prev > 0 && next === 0) {
      clearAnimationTimers()
      prevTotalRef.current = 0
      if (merchantMode) {
        startMerchantBasketExit()
      } else {
        startBasketExit(prev)
      }
      return
    }

    prevTotalRef.current = next
  }, [
    shoppingUnits,
    carouselUnits,
    merchantMode,
    applyImmediateBasketVisible,
    clearAnimationTimers,
    startBasketLoading,
    startBasketExit,
    startMerchantBasketEnter,
    startMerchantBasketExit,
  ])

  const basketDisplayCount = basketFabExiting ? exitDisplayCount : total

  const value = useMemo(
    (): BasketFabContextValue => ({
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
      fabLoading,
      loaderExiting,
      fabIconPopIn,
      badgePopNonce,
      merchantTabSolo,
      merchantWideFabPhase,
      merchantLayoutReservePx,
      expandMerchantTabs,
      adjustCarouselBasketUnits,
      syncShoppingListBasketUnits,
    }),
    [
      total,
      basketDisplayCount,
      compactTabs,
      fabReservePx,
      fabReveal,
      showBasketBadge,
      basketFabExiting,
      badgeExiting,
      fabExiting,
      fabPopIn,
      fabLoading,
      loaderExiting,
      fabIconPopIn,
      badgePopNonce,
      merchantTabSolo,
      merchantWideFabPhase,
      merchantLayoutReservePx,
      expandMerchantTabs,
      adjustCarouselBasketUnits,
      syncShoppingListBasketUnits,
    ],
  )

  return <BasketFabContext.Provider value={value}>{children}</BasketFabContext.Provider>
}
