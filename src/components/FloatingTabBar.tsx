import {
  memo,
  useMemo,
  type ReactNode,
} from 'react'
import {
  TAB_ACTION_TOTAL_RESERVE_PX,
  useBasketFabOptional,
} from '../context/BasketFabContext'
import { useFloatingTabBarTabs } from '../hooks/useFloatingTabBarTabs'
import { useFloatingTabBarRowChrome } from '../hooks/useFloatingTabBarRowChrome'
import { floatingTabBarPillGridStyle } from '../lib/floatingTabBarLayout'
import { design } from '../lib/figmaDesignAssets'
import { FloatingTabBarPill } from './FloatingTabBarPill'
import { FloatingTabBarRoundBasketSlot } from './FloatingTabBarRoundBasketSlot'

export type FloatingTabBarItem = {
  id: string
  label: string
  iconSrcDefault: string
  iconSrcSelected: string
}

export type FloatingTabBarProps = {
  items: readonly FloatingTabBarItem[]
  /** Controlled selection (e.g. synced to the route). */
  activeId?: string
  /** Called when the user selects a tab. */
  onTabChange?: (id: string) => void
  /** Initial tab when uncontrolled; defaults to the first item. */
  defaultActiveId?: string
  className?: string
  ariaLabel?: string
  /** 76281:68564 — not part of 76281:68555; opt in per screen */
  showHomeIndicator?: boolean
  /** When false, never mounts the basket slot (default: true if {@link BasketFabProvider} is present). */
  showBasketFab?: boolean
  /** Trailing circular actions (e.g. search) — not affected by tab compact animation. */
  tabActions?: ReactNode
}

/**
 * Floating bottom navigation — Figma [76281:68555](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=76281-68555).
 * Optional tab actions + basket FAB on the same row; compact animation applies to the pill only.
 */
function FloatingTabBarInner({
  items,
  activeId: activeIdProp,
  onTabChange,
  defaultActiveId,
  className = '',
  ariaLabel = 'Main navigation',
  showHomeIndicator = false,
  showBasketFab: showBasketFabProp = true,
  tabActions,
}: FloatingTabBarProps) {
  const basket = useBasketFabOptional()
  const basketEnabled = showBasketFabProp && basket != null

  const compactTabs = basketEnabled && basket.compactTabs

  const mountRoundBasketSlot =
    basketEnabled &&
    (basket.compactTabs ||
      basket.basketFabExiting ||
      basket.basketUnitTotal > 0 ||
      basket.fabReserveWidthPx > 0 ||
      basket.fabReveal ||
      basket.fabLoading ||
      basket.loaderExiting ||
      basket.fabExiting ||
      basket.badgeExiting)

  const { activeId, activeIndex, selectTab, onKeyDown, n } = useFloatingTabBarTabs({
    items,
    activeId: activeIdProp,
    defaultActiveId,
    onTabChange,
  })

  const pillGridStyle = useMemo(
    () => floatingTabBarPillGridStyle(n, activeIndex),
    [n, activeIndex],
  )

  const { motionVars, roundBasketSlotStyle } = useFloatingTabBarRowChrome({
    basket: basketEnabled ? basket : null,
    actionsReservePx: tabActions != null ? TAB_ACTION_TOTAL_RESERVE_PX : 0,
    mountRoundBasketSlot,
  })

  if (n === 0) return null

  return (
    <div
      className={[
        'bolt-font-base relative flex w-full min-w-0 flex-col items-start justify-end',
        'bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.9)]',
        'floating-tab-bar pt-3',
        'pb-[calc(34px+env(safe-area-inset-bottom,0px))]',
        'animate-floating-tab-bar-enter motion-reduce:animate-none',
        className,
      ].join(' ')}
      data-name="ftb"
      data-node-id="76281:68555"
    >
      <div className="floating-tab-bar__row flex w-full min-w-0" style={motionVars}>
        <FloatingTabBarPill
          items={items}
          activeId={activeId}
          activeIndex={activeIndex}
          compact={compactTabs}
          ariaLabel={ariaLabel}
          onKeyDown={onKeyDown}
          onTabActivate={(id) => selectTab(id)}
          gridStyle={pillGridStyle}
          motionVars={motionVars}
        />

        {tabActions != null ? (
          <div className="floating-tab-bar__actions flex shrink-0 items-center gap-3">{tabActions}</div>
        ) : null}

        {mountRoundBasketSlot && basket ? (
          <FloatingTabBarRoundBasketSlot basket={basket} style={roundBasketSlotStyle} />
        ) : null}
      </div>

      {showHomeIndicator ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34px]"
          aria-hidden
          data-name="Home Indicator"
          data-node-id="76281:68564"
        >
          <div className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2">
            <img
              alt=""
              src={design.floatingTabBar.homeIndicator}
              className="pointer-events-none block size-full max-w-none"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const FloatingTabBar = memo(FloatingTabBarInner)
