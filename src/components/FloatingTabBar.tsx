import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { TAB_COMPACT_MS, TAB_BAR_LAYOUT_MS, TAB_BAR_LAYOUT_EASE, TAB_ACTION_TOTAL_RESERVE_PX, TAB_BAR_ITEM_GAP_PX, BASKET_FAB_RESERVE_PX, useBasketFabOptional } from '../context/BasketFabContext'
import { FLOATING_CHROME_SHADOW_CLASS } from '../lib/floatingChromeShadow'
import { design } from '../lib/figmaDesignAssets'
import { BasketFabHome } from './BasketFabHome'

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
  const pillRef = useRef<HTMLDivElement>(null)

  const fabReserveWidthPx = basketEnabled ? basket.fabReserveWidthPx : 0
  const basketLayoutActive =
    basketEnabled &&
    (basket.compactTabs || basket.basketFabExiting || basket.basketUnitTotal > 0)
  /** Keep slot mounted through enter/exit so width eases; unmount only when fully idle. */
  const mountBasketSlot =
    basketEnabled &&
    (basketLayoutActive ||
      fabReserveWidthPx > 0 ||
      basket.fabReveal ||
      basket.fabLoading ||
      basket.loaderExiting ||
      basket.fabExiting ||
      basket.badgeExiting)

  const n = items.length

  const [uncontrolledActiveId, setUncontrolledActiveId] = useState(() => {
    if (defaultActiveId && items.some((it) => it.id === defaultActiveId)) return defaultActiveId
    return items[0]?.id ?? ''
  })

  const isControlled = activeIdProp !== undefined
  const activeId =
    isControlled && activeIdProp && items.some((it) => it.id === activeIdProp)
      ? activeIdProp
      : isControlled
        ? items[0]?.id ?? ''
        : uncontrolledActiveId

  const selectTab = useCallback(
    (id: string) => {
      onTabChange?.(id)
      if (!isControlled) setUncontrolledActiveId(id)
    },
    [isControlled, onTabChange],
  )

  const activeIndex = useMemo(() => {
    if (n === 0) return 0
    const i = items.findIndex((it) => it.id === activeId)
    return i < 0 ? 0 : i
  }, [activeId, items, n])

  const pillGridStyle = useMemo(
    (): CSSProperties =>
      ({
        gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
        '--ftb-tab-count': String(n),
        '--ftb-active-index': String(activeIndex),
      }) as CSSProperties,
    [n, activeIndex],
  )

  const basketSlotStyle = useMemo((): CSSProperties => {
    const open = fabReserveWidthPx > 0
    return {
      width: open ? BASKET_FAB_RESERVE_PX : 0,
      flexBasis: open ? BASKET_FAB_RESERVE_PX : 0,
    }
  }, [fabReserveWidthPx])

  const layoutStyle = useMemo((): CSSProperties => {
    const actionsReservePx = tabActions != null ? TAB_ACTION_TOTAL_RESERVE_PX : 0
    const basketReservePx = mountBasketSlot
      ? TAB_BAR_ITEM_GAP_PX + (fabReserveWidthPx > 0 ? fabReserveWidthPx : 0)
      : 0
    return {
      '--ftb-compact-ms': `${TAB_COMPACT_MS}ms`,
      '--ftb-layout-ms': `${TAB_BAR_LAYOUT_MS}ms`,
      '--ftb-layout-ease': TAB_BAR_LAYOUT_EASE,
      '--ftb-trailing-chrome': `${actionsReservePx + basketReservePx}px`,
    } as CSSProperties
  }, [fabReserveWidthPx, tabActions, mountBasketSlot])

  const rowStyle = layoutStyle

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const from = activeIndex
    const next =
      e.key === 'ArrowLeft' ? (from + items.length - 1) % items.length : (from + 1) % items.length
    selectTab(items[next]!.id)
  }

  if (n === 0) return null

  return (
    <div
      className={[
        'bolt-font-base relative flex w-full min-w-0 flex-col items-start justify-end',
        'bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.9)]',
        'floating-tab-bar pt-3',
        showHomeIndicator
          ? 'pb-[calc(34px+env(safe-area-inset-bottom,0px))]'
          : 'pb-[calc(34px+env(safe-area-inset-bottom,0px))]',
        'animate-floating-tab-bar-enter motion-reduce:animate-none',
        className,
      ].join(' ')}
      data-name="ftb"
      data-node-id="76281:68555"
    >
      <div
        className="floating-tab-bar__row flex w-full min-w-0"
        style={rowStyle}
      >
        <div
          ref={pillRef}
          role="tablist"
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          data-compact={compactTabs ? 'true' : 'false'}
          className={[
            FLOATING_CHROME_SHADOW_CLASS,
            'floating-tab-bar__pill relative grid min-w-0 rounded-[50px] bg-white p-1',
          ].join(' ')}
          style={{ ...pillGridStyle, ...layoutStyle } as CSSProperties}
          data-node-id="76281:68556"
        >
          <div
            aria-hidden
            className="floating-tab-bar__indicator pointer-events-none absolute top-1 bottom-1 left-1 z-0 rounded-[56px] bg-[var(--color-bg-neutral-secondary)] motion-reduce:transition-none"
          />
          {items.map((item, itemIndex) => {
            const isActive = itemIndex === activeIndex
            const iconSrc = isActive ? item.iconSrcSelected : item.iconSrcDefault

            return (
              <div
                key={item.id}
                className="floating-tab-bar__cell relative z-[1] min-w-0"
                style={{ gridColumn: itemIndex + 1, gridRow: 1 }}
              >
                <button
                  type="button"
                  role="tab"
                  id={`floating-tab-${item.id}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(item.id)}
                  data-name="Navigation"
                  className="floating-tab-bar__tab flex w-full min-w-0 items-center justify-center overflow-hidden rounded-[56px] bg-transparent outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
                >
                  <span className="floating-tab-bar__motion w-full min-w-0">
                    <span className="floating-tab-bar__icon relative flex size-6 shrink-0 items-center justify-center" aria-hidden>
                      <img alt="" src={iconSrc} className="floating-tab-bar__icon-img pointer-events-none block size-6" />
                    </span>
                    <span className="floating-tab-bar__label-row min-h-0 overflow-hidden">
                      <span
                        className={[
                          'floating-tab-bar__label bolt-font-body-xs-regular block w-full min-w-0 overflow-hidden text-center text-ellipsis whitespace-nowrap',
                          isActive ? 'text-[var(--color-content-primary)]' : 'text-[var(--color-content-secondary)]',
                        ].join(' ')}
                      >
                        {item.label}
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        {tabActions != null ? (
          <div className="floating-tab-bar__actions flex shrink-0 items-center gap-3">{tabActions}</div>
        ) : null}

        {mountBasketSlot && basket ? (
          <div
            className="floating-tab-bar__basket-slot relative shrink-0 overflow-visible"
            style={basketSlotStyle}
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2"
              style={{ width: BASKET_FAB_RESERVE_PX }}
            >
              <BasketFabHome
                count={basket.basketDisplayCount}
                fabReveal={basket.fabReveal}
                fabLoading={basket.fabLoading}
                loaderExiting={basket.loaderExiting}
                fabIconPopIn={basket.fabIconPopIn}
                showBadge={basket.showBasketBadge}
                badgeExiting={basket.badgeExiting}
                fabExiting={basket.fabExiting}
                fabPopIn={basket.fabPopIn}
                exiting={basket.basketFabExiting}
                badgePopNonce={basket.badgePopNonce}
              />
            </div>
          </div>
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
