import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  MERCHANT_TAB_SOLO_PX,
  TAB_ACTION_TOTAL_RESERVE_PX,
  TAB_BAR_ITEM_GAP_PX,
  WIDE_BASKET_FAB_SLOT_PX,
  BASKET_FAB_BUTTON_POP_MS,
  MERCHANT_FAB_POP_MS,
  MERCHANT_FAB_EXPAND_MS,
  TAB_BAR_LAYOUT_EASE,
  useBasketFabOptional,
} from '../context/BasketFabContext'
import { MERCHANT_TAB_SEARCH_ICON } from '../config/merchantFloatingTabBarConfig'
import { useAnimatedPillWidth } from '../hooks/useAnimatedPillWidth'
import { useFloatingTabBarTabs } from '../hooks/useFloatingTabBarTabs'
import {
  floatingTabBarMotionVars,
  floatingTabBarPillGridStyle,
  floatingTabBarSoloPillGridStyle,
} from '../lib/floatingTabBarLayout'
import { WIDE_BASKET_FAB_IN_TAB_BAR_CLASS } from '../lib/wideBasketFabExpand'
import { design } from '../lib/figmaDesignAssets'
import { formatEuro } from '../lib/price'
import { WideBasketFab, type WideBasketFabState } from './WideBasketFab'
import { TabAction } from './TabAction'
import { FloatingTabBarPill } from './FloatingTabBarPill'
import type { FloatingTabBarItem } from './FloatingTabBar'

function merchantWideFabUiState(phase: string): WideBasketFabState {
  if (phase === 'loading') return 'loading'
  if (phase === 'collapsed') return 'collapsed'
  return 'default'
}

/** Defer one frame so pop-in runs after layout snap (loading appear). */
function useDeferredFrame(active: boolean) {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if (!active) {
      setReady(false)
      return
    }
    setReady(false)
    const raf = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(raf)
  }, [active])

  return ready
}

export type MerchantFTabBarItem = FloatingTabBarItem

export type MerchantFTabBarProps = {
  items: readonly MerchantFTabBarItem[]
  activeId?: string
  onTabChange?: (id: string) => void
  defaultActiveId?: string
  className?: string
  ariaLabel?: string
  showHomeIndicator?: boolean
  onSearchClick?: () => void
}

/**
 * Merchant tab bar sequence:
 * A) icons-only compact (row unchanged)
 * B–C) wide FAB `loading` at 56px (pop-in once)
 * D) pill → solo + slot RTL expand to `default` (150ms ease-out, parallel)
 */
function MerchantFTabBarInner({
  items,
  activeId: activeIdProp,
  onTabChange,
  defaultActiveId,
  className = '',
  ariaLabel = 'Merchant navigation',
  showHomeIndicator = false,
  onSearchClick,
}: MerchantFTabBarProps) {
  const basket = useBasketFabOptional()
  const basketEnabled = basket != null

  const compactTabs = basketEnabled && basket.compactTabs
  const merchantTabSolo = basketEnabled && basket.merchantTabSolo
  const wideFabPhase = basketEnabled ? basket.merchantWideFabPhase : 'hidden'
  const basketRowPhase =
    wideFabPhase === 'default'
      ? 'default'
      : wideFabPhase === 'collapsed'
        ? 'collapsed'
        : wideFabPhase === 'loading'
          ? 'loading'
          : undefined
  const useMerchantBasketRow =
    basketEnabled && (wideFabPhase !== 'hidden' || basket.basketFabExiting)

  const rowRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const [rowWidthPx, setRowWidthPx] = useState(0)

  const layoutReservePx =
    basketEnabled && !useMerchantBasketRow ? basket.merchantLayoutReservePx : 0

  useLayoutEffect(() => {
    const row = rowRef.current
    if (!row || !basketEnabled) {
      setRowWidthPx(0)
      return
    }
    const measure = () => setRowWidthPx(row.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    return () => ro.disconnect()
  }, [basketEnabled, useMerchantBasketRow, basketRowPhase, merchantTabSolo, layoutReservePx])

  const wideRowTrailingChromePx =
    TAB_ACTION_TOTAL_RESERVE_PX + TAB_BAR_ITEM_GAP_PX + WIDE_BASKET_FAB_SLOT_PX

  const widePillWidthPx =
    rowWidthPx > 0 ? Math.max(MERCHANT_TAB_SOLO_PX, rowWidthPx - wideRowTrailingChromePx) : null

  /** Merchant basket row — explicit px width tween (150ms ease-out). */
  const pillLayoutTargetPx = useMemo(() => {
    if (!useMerchantBasketRow || widePillWidthPx == null) return null
    if (merchantTabSolo && basketRowPhase === 'default') return MERCHANT_TAB_SOLO_PX
    return widePillWidthPx
  }, [useMerchantBasketRow, widePillWidthPx, merchantTabSolo, basketRowPhase])

  const pillLayoutStyle = useAnimatedPillWidth(pillRef, pillLayoutTargetPx)

  /** Plain row: trailing chrome tween (home FTB); basket row: trailing for slot flex only. */
  const pillTrailingChromePx = useMemo(() => {
    if (useMerchantBasketRow) {
      if (merchantTabSolo && basketRowPhase === 'default' && rowWidthPx > 0) {
        return Math.max(TAB_ACTION_TOTAL_RESERVE_PX, rowWidthPx - MERCHANT_TAB_SOLO_PX)
      }
      return wideRowTrailingChromePx
    }
    return TAB_ACTION_TOTAL_RESERVE_PX + layoutReservePx
  }, [
    useMerchantBasketRow,
    merchantTabSolo,
    basketRowPhase,
    rowWidthPx,
    wideRowTrailingChromePx,
    layoutReservePx,
  ])

  const { activeId, activeIndex, selectTab, onKeyDown, n } = useFloatingTabBarTabs({
    items,
    activeId: activeIdProp,
    defaultActiveId,
    onTabChange,
  })

  const onTabActivate = useCallback(
    (id: string, isActive: boolean) => {
      if (merchantTabSolo && isActive && basketEnabled) {
        basket.expandMerchantTabs()
        return
      }
      selectTab(id)
    },
    [basket, basketEnabled, merchantTabSolo, selectTab],
  )

  const pillGridStyle = useMemo(
    () => (merchantTabSolo ? floatingTabBarSoloPillGridStyle() : floatingTabBarPillGridStyle(n, activeIndex)),
    [n, activeIndex, merchantTabSolo],
  )

  const snapLoadingLayout = basketRowPhase === 'loading'

  const rowMotionVars = useMemo(
    () =>
      ({
        ...floatingTabBarMotionVars(pillTrailingChromePx),
        ...(snapLoadingLayout
          ? { '--ftb-trailing-chrome': `${wideRowTrailingChromePx}px`, '--ftb-layout-ms': '0ms' }
          : null),
        '--merchant-pop-ms': `${MERCHANT_FAB_POP_MS}ms`,
        '--merchant-motion-ms': `${MERCHANT_FAB_EXPAND_MS}ms`,
        '--merchant-motion-ease': TAB_BAR_LAYOUT_EASE,
        '--basket-fab-button-pop-ms': `${BASKET_FAB_BUTTON_POP_MS}ms`,
      }) as CSSProperties,
    [pillTrailingChromePx, snapLoadingLayout, wideRowTrailingChromePx],
  )

  /** Pill always uses row trailing; never inherit loading snap (0ms) so shrink can tween after loading. */
  const pillMotionVars = useMemo(
    () => floatingTabBarMotionVars(pillTrailingChromePx),
    [pillTrailingChromePx],
  )

  const wideSlotSnapStyle = useMemo((): CSSProperties | undefined => {
    if (!snapLoadingLayout) return undefined
    return {
      width: WIDE_BASKET_FAB_SLOT_PX,
      flexBasis: WIDE_BASKET_FAB_SLOT_PX,
      transition: 'none',
    }
  }, [snapLoadingLayout])

  if (n === 0) return null

  const showWideBasketFab = useMerchantBasketRow && wideFabPhase !== 'hidden'

  const loadingPopFrameReady = useDeferredFrame(snapLoadingLayout)

  const wideFabState = basketEnabled ? merchantWideFabUiState(wideFabPhase) : 'default'
  const wideFabPopIn =
    basketEnabled && basket.fabPopIn && wideFabPhase === 'loading' && loadingPopFrameReady
  const wideFabPopOut = basketEnabled && basket.fabExiting
  const wideFabRevealed =
    !wideFabPopOut &&
    (wideFabPhase === 'default' ||
      wideFabPhase === 'collapsed' ||
      (wideFabPhase === 'loading' && loadingPopFrameReady && !wideFabPopIn))

  return (
    <div
      className={[
        'bolt-font-base relative flex w-full min-w-0 flex-col items-start justify-end',
        'bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.9)]',
        'floating-tab-bar pt-3',
        'pb-[calc(12px+env(safe-area-inset-bottom,0px))]',
        className,
      ].join(' ')}
      data-name="merchant-ftb"
    >
      <div
        ref={rowRef}
        className={[
          'floating-tab-bar__row flex w-full min-w-0',
          useMerchantBasketRow ? 'merchant-ftb__row--basket' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={rowMotionVars}
        data-basket-phase={useMerchantBasketRow ? basketRowPhase : undefined}
      >
        <FloatingTabBarPill
          pillRef={pillRef}
          items={items}
          activeId={activeId}
          activeIndex={activeIndex}
          compact={compactTabs}
          soloMode={merchantTabSolo}
          ariaLabel={ariaLabel}
          onKeyDown={onKeyDown}
          onTabActivate={onTabActivate}
          gridStyle={pillGridStyle}
          motionVars={pillMotionVars}
          pillLayoutStyle={pillLayoutStyle}
          tabIdPrefix="merchant-tab"
        />

        <div className="floating-tab-bar__actions flex shrink-0 items-center">
          <TabAction iconSrc={MERCHANT_TAB_SEARCH_ICON} ariaLabel="Search" onClick={onSearchClick} />
        </div>

        {useMerchantBasketRow && basket ? (
          <div
            className="floating-tab-bar__basket-slot floating-tab-bar__basket-slot--wide relative shrink-0 overflow-visible"
            style={wideSlotSnapStyle}
          >
            {showWideBasketFab ? (
              <WideBasketFab
                state={wideFabState}
                count={basket.basketDisplayCount}
                totalLabel={
                  basket.basketDisplayAmount > 0 ? formatEuro(basket.basketDisplayAmount) : ''
                }
                counterPopNonce={basket.badgePopNonce}
                popIn={wideFabPopIn}
                popOut={wideFabPopOut}
                revealed={wideFabRevealed}
                className={WIDE_BASKET_FAB_IN_TAB_BAR_CLASS}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      {showHomeIndicator ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34px]" aria-hidden>
          <div className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2">
            <img
              alt=""
              src={design.merchantFloatingTabBar.homeIndicator}
              className="pointer-events-none block size-full max-w-none"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const MerchantFTabBar = memo(MerchantFTabBarInner)
