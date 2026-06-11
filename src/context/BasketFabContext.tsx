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
import { resolveScreenProviderId } from '../lib/orderProvider'
import { parsePrice } from '../lib/price'
import { useOrder } from './OrderContext'
import {
  getMerchantScrollEl,
  isMerchantScrollPastExpandTop,
  merchantScrollCompactToFabPhase,
  merchantScrollCompactToTabSolo,
  resolveMerchantScrollCompact,
} from '../lib/merchantBasketScrollChrome'

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
  /** Order subtotal (sum of line price × qty) for the FAB's screen; 0 when the FAB shows no count. */
  basketDisplayAmount: number
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
  /** Merchant {@link MerchantFTabBar} — single 56px tab pill while scrolled (wide basket). */
  merchantTabSolo: boolean
  /** Merchant wide FAB phase (hidden until compact finishes). */
  merchantWideFabPhase: MerchantWideFabPhase
  /** 68px spacer while tab bar compacts (before loading FAB appears). */
  merchantLayoutReservePx: number
  /** Expand tab bar (icons, no labels) and collapse wide FAB — active tab tap when solo. */
  expandMerchantTabs: () => void
  /** Retained for `/shopping-list` API compatibility — no longer feeds the order FAB. */
  syncShoppingListBasketUnits: (units: number, opts?: { initial?: boolean }) => void
  /** Clears the active order and FAB chrome. */
  resetBasket: () => void
  /** Home search overlay — suppresses tab-bar enter animation while open. */
  setSearchOverlayOpen: (open: boolean) => void
  /** After search closes with items, show home tab-bar basket without replaying loading. */
  revealHomeTabBarBasketFromSearch: () => void
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
  const location = useLocation()
  const { pathname } = location
  const merchantMode = isMerchantHubPath(pathname)
  const order = useOrder()

  /** Merchant a route renders (store/restaurant id), or null on hub/inner screens. */
  const currentScreenProviderId = useMemo(
    () => resolveScreenProviderId(pathname, location.state),
    [pathname, location.state],
  )
  const matchesOrderProvider =
    order.provider != null && order.provider.id === currentScreenProviderId

  /**
   * Effective FAB count for the current screen:
   * - hub: always the order total (FAB navigates to its merchant),
   * - merchant matching the order: the order total,
   * - other merchant: 0 (no FAB until a new order starts here).
   */
  const total = merchantMode ? (matchesOrderProvider ? order.unitCount : 0) : order.unitCount

  /** Order subtotal shown next to the count in the expanded FAB — gated like `total`. */
  const orderAmount = useMemo(
    () => order.items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0),
    [order.items],
  )
  const amountTotal = merchantMode ? (matchesOrderProvider ? orderAmount : 0) : orderAmount

  /** Screen identity — order-independent; changes drive an immediate chrome snap. */
  const screenKey = `${pathname}|${currentScreenProviderId ?? ''}`

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
  const prevScreenKeyRef = useRef(screenKey)
  const merchantTabSoloRef = useRef(merchantTabSolo)
  const merchantWideFabPhaseRef = useRef(merchantWideFabPhase)
  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const rafIdsRef = useRef<number[]>([])
  const searchOverlayOpenRef = useRef(false)

  useLayoutEffect(() => {
    merchantTabSoloRef.current = merchantTabSolo
    merchantWideFabPhaseRef.current = merchantWideFabPhase
  }, [merchantTabSolo, merchantWideFabPhase])

  const clearAnimationTimers = useCallback(() => {
    timerIdsRef.current.forEach((id) => clearTimeout(id))
    timerIdsRef.current = []
    rafIdsRef.current.forEach((id) => cancelAnimationFrame(id))
    rafIdsRef.current = []
  }, [])

  /** Hide all FAB chrome immediately (does not touch the order itself). */
  const hideChromeImmediate = useCallback(() => {
    clearAnimationTimers()
    prevTotalRef.current = 0
    setBasketFabExiting(false)
    setBadgeExiting(false)
    setFabExiting(false)
    setFabPopIn(false)
    setFabLoading(false)
    setLoaderExiting(false)
    setFabIconPopIn(false)
    setExitDisplayCount(0)
    setCompactTabs(false)
    setMerchantTabSolo(false)
    setMerchantLayoutReservePx(0)
    setMerchantWideFabPhase('hidden')
    setFabReservePx(0)
    setFabReveal(false)
    setShowBasketBadge(false)
  }, [clearAnimationTimers])

  /** Clears the active order; chrome follows via the total-change effect. */
  const resetBasket = useCallback(() => {
    order.clear()
  }, [order])

  const applyImmediateBasketVisible = useCallback(
    (nextTotal: number, opts?: { bump?: boolean }) => {
      const bump = opts?.bump !== false
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
        setFabReservePx(0)
        setFabLoading(false)
        setShowBasketBadge(false)
        if (nextTotal > 0) {
          // Entering a merchant screen that already has items — skip the loading
          // animation and snap directly to the wide ("default") state so the
          // basket is immediately visible and expanded.
          setMerchantWideFabPhase('default')
          setMerchantTabSolo(true)
          setFabReveal(true)
        } else {
          setMerchantWideFabPhase('hidden')
          setMerchantTabSolo(false)
          setFabReveal(false)
        }
      } else {
        setMerchantWideFabPhase('hidden')
        setFabReservePx(nextTotal > 0 ? BASKET_FAB_RESERVE_PX : 0)
        setFabReveal(nextTotal > 0)
        setShowBasketBadge(nextTotal > 0)
        if (nextTotal > 0 && bump) setBadgePopNonce((n) => n + 1)
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

  const applyMerchantScrollCompact = useCallback((scrollCompact: boolean) => {
    setMerchantTabSolo(merchantScrollCompactToTabSolo(scrollCompact))
    setMerchantWideFabPhase(merchantScrollCompactToFabPhase(scrollCompact))
  }, [])

  /** Scroll: expanded tab pill + 56px basket at top; solo tab + wide basket when scrolling. */
  useEffect(() => {
    const scrollListening =
      merchantMode &&
      total > 0 &&
      !basketFabExiting &&
      (merchantWideFabPhase === 'collapsed' || merchantWideFabPhase === 'default')

    if (!scrollListening) return

    const el = getMerchantScrollEl()
    if (!el) return

    let lastTop = el.scrollTop
    let scrollCompact =
      merchantTabSoloRef.current && merchantWideFabPhaseRef.current === 'default'

    const onScroll = () => {
      const top = el.scrollTop
      const prevTop = lastTop
      lastTop = top
      const next = resolveMerchantScrollCompact(top, prevTop, scrollCompact)
      if (next === scrollCompact) return
      scrollCompact = next
      applyMerchantScrollCompact(next)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [
    merchantMode,
    total,
    basketFabExiting,
    merchantWideFabPhase,
    applyMerchantScrollCompact,
  ])

  useEffect(() => {
    return () => clearAnimationTimers()
  }, [clearAnimationTimers])

  /** Retained for `/shopping-list` API compatibility — no longer feeds the order FAB. */
  const syncShoppingListBasketUnits = useCallback((_units: number, _opts?: { initial?: boolean }) => {}, [])

  const setSearchOverlayOpen = useCallback((open: boolean) => {
    searchOverlayOpenRef.current = open
  }, [])

  const revealHomeTabBarBasketFromSearch = useCallback(() => {
    if (merchantMode || searchOverlayOpenRef.current) return
    const next = order.unitCount
    if (next <= 0) return
    // Already showing hub basket chrome — avoid re-applying on unrelated re-renders.
    if (fabReveal && showBasketBadge && !fabLoading && !basketFabExiting) return
    applyImmediateBasketVisible(next)
  }, [
    merchantMode,
    order.unitCount,
    applyImmediateBasketVisible,
    fabReveal,
    showBasketBadge,
    fabLoading,
    basketFabExiting,
  ])

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

  const finishMerchantBasketExit = useCallback(() => {
    setFabExiting(false)
    setFabReveal(false)
    setMerchantWideFabPhase('hidden')
    setMerchantTabSolo(false)
    setMerchantLayoutReservePx(0)
    setCompactTabs(false)
    setFabReservePx(0)
    setBasketFabExiting(false)
    setExitDisplayCount(0)
  }, [])

  /**
   * Merchant basket empty:
   * 1) RTL collapse to `collapsed` + pill solo → full (150ms) when expanded
   * 2) FAB scale-out (220ms)
   * 3) remove basket chrome
   */
  const startMerchantBasketExit = useCallback(
    (prev: number) => {
      setExitDisplayCount(prev)
      setBasketFabExiting(true)
      setBadgeExiting(false)
      setFabExiting(false)
      setFabPopIn(false)
      setFabLoading(false)
      setLoaderExiting(false)
      setFabIconPopIn(false)
      setMerchantLayoutReservePx(0)

      const needsRtlCollapse =
        merchantTabSoloRef.current && merchantWideFabPhaseRef.current === 'default'

      const startPopOut = () => {
        setFabExiting(true)
        const tHide = window.setTimeout(
          finishMerchantBasketExit,
          BASKET_FAB_BUTTON_POP_MS,
        )
        timerIdsRef.current.push(tHide)
      }

      if (!needsRtlCollapse) {
        setMerchantWideFabPhase('collapsed')
        setMerchantTabSolo(false)
        const rafPop = window.requestAnimationFrame(startPopOut)
        rafIdsRef.current.push(rafPop)
        return
      }

      // Commit expanded layout, then RTL collapse (150ms ease-out) before pop-out.
      setMerchantWideFabPhase('default')
      setMerchantTabSolo(true)

      const rafCollapse = window.requestAnimationFrame(() => {
        setMerchantWideFabPhase('collapsed')
        setMerchantTabSolo(false)
      })
      rafIdsRef.current.push(rafCollapse)

      const tPop = window.setTimeout(startPopOut, MERCHANT_FAB_EXPAND_MS)
      timerIdsRef.current.push(tPop)
    },
    [finishMerchantBasketExit],
  )

  /**
   * Merchant quick-add sequence (ms from t=0):
   * A+B) 0–150  — compact tabs + loading FAB pop-in (parallel, ease-out)
   * C) 150–1500 — loading spinner
   * D) 1500–1650 — full tab pill + 56px basket; scroll → solo tab + wide FAB (150ms ease-out)
   * Exit — collapse (150ms) → FAB pop-out (220ms) → basket hidden.
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
    setCompactTabs(true)
    setFabReveal(false)
    setShowBasketBadge(false)
    setFabReservePx(0)
    // Plain row: tween pill width like home FTB before basket row mounts (150ms ease-out).
    setMerchantLayoutReservePx(WIDE_BASKET_FAB_SLOT_PX + TAB_BAR_ITEM_GAP_PX)

    const rafLayout = window.requestAnimationFrame(() => {
      setMerchantLayoutReservePx(0)
      setMerchantWideFabPhase('loading')
      setFabLoading(true)
      setFabReveal(true)
      setFabPopIn(true)
      const tPopDone = window.setTimeout(() => setFabPopIn(false), BASKET_FAB_BUTTON_POP_MS)
      timerIdsRef.current.push(tPopDone)
      scheduleLoaderToBasket({ showBadgeAfter: false })
    })
    rafIdsRef.current.push(rafLayout)

    const tDefault = window.setTimeout(() => {
      triggerHaptic('success')
      setFabPopIn(false)
      setFabReservePx(0)
      const rafRest = window.requestAnimationFrame(() => {
        setMerchantWideFabPhase('collapsed')
        setMerchantTabSolo(false)
        const el = getMerchantScrollEl()
        if (el && isMerchantScrollPastExpandTop(el.scrollTop)) {
          setMerchantTabSolo(true)
          setMerchantWideFabPhase('default')
        }
      })
      rafIdsRef.current.push(rafRest)
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
    // Navigation between screens — snap chrome to the new screen without replaying loading.
    if (prevScreenKeyRef.current !== screenKey) {
      prevScreenKeyRef.current = screenKey
      clearAnimationTimers()
      if (total > 0) applyImmediateBasketVisible(total, { bump: false })
      else hideChromeImmediate()
      return
    }

    const prev = prevTotalRef.current
    const next = total
    if (prev === next) return

    if (prev === 0 && next > 0) {
      clearAnimationTimers()
      prevTotalRef.current = next

      if (merchantMode) {
        startMerchantBasketEnter()
        return
      }

      if (searchOverlayOpenRef.current) {
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

    if (prev > 0 && next > 0 && next !== prev) {
      prevTotalRef.current = next
      const showHubBadge = !merchantMode && showBasketBadge && !basketFabExiting
      const showMerchantCounter =
        merchantMode &&
        !basketFabExiting &&
        (merchantWideFabPhase === 'collapsed' || merchantWideFabPhase === 'default')
      if (showHubBadge || showMerchantCounter) {
        setBadgePopNonce((n) => n + 1)
      }
      return
    }

    if (prev > 0 && next === 0) {
      clearAnimationTimers()
      prevTotalRef.current = 0
      if (merchantMode) {
        startMerchantBasketExit(prev)
      } else {
        startBasketExit(prev)
      }
      return
    }

    prevTotalRef.current = next
  }, [
    total,
    screenKey,
    merchantMode,
    merchantWideFabPhase,
    showBasketBadge,
    basketFabExiting,
    applyImmediateBasketVisible,
    hideChromeImmediate,
    clearAnimationTimers,
    startBasketLoading,
    startBasketExit,
    startMerchantBasketEnter,
    startMerchantBasketExit,
  ])

  const basketDisplayCount = basketFabExiting ? exitDisplayCount : total

  /** Hold the last non-zero subtotal so the price stays put during the exit animation. */
  const lastPositiveAmountRef = useRef(0)
  useEffect(() => {
    if (amountTotal > 0) lastPositiveAmountRef.current = amountTotal
  }, [amountTotal])
  const basketDisplayAmount = basketFabExiting ? lastPositiveAmountRef.current : amountTotal

  const value = useMemo(
    (): BasketFabContextValue => ({
      basketUnitTotal: total,
      basketDisplayCount,
      basketDisplayAmount,
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
      syncShoppingListBasketUnits,
      resetBasket,
      setSearchOverlayOpen,
      revealHomeTabBarBasketFromSearch,
    }),
    [
      total,
      basketDisplayCount,
      basketDisplayAmount,
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
      syncShoppingListBasketUnits,
      resetBasket,
      setSearchOverlayOpen,
      revealHomeTabBarBasketFromSearch,
    ],
  )

  return <BasketFabContext.Provider value={value}>{children}</BasketFabContext.Provider>
}
