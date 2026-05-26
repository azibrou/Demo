import {
  memo,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import {
  TAB_COMPACT_MS,
  TAB_BAR_LAYOUT_MS,
  TAB_BAR_LAYOUT_EASE,
  TAB_ACTION_TOTAL_RESERVE_PX,
  TAB_BAR_ITEM_GAP_PX,
  WIDE_BASKET_FAB_SLOT_PX,
  MERCHANT_FAB_POP_MS,
  MERCHANT_FAB_EXPAND_MS,
  useBasketFabOptional,
} from '../context/BasketFabContext'
import { MERCHANT_TAB_SEARCH_ICON } from '../config/merchantFloatingTabBarConfig'
import { WIDE_BASKET_FAB_IN_TAB_BAR_CLASS } from '../lib/wideBasketFabExpand'
import { FLOATING_CHROME_SHADOW_CLASS } from '../lib/floatingChromeShadow'
import { design } from '../lib/figmaDesignAssets'
import { WideBasketFab, type WideBasketFabState } from './WideBasketFab'
import { TabAction } from './TabAction'
import type { FloatingTabBarItem } from './FloatingTabBar'

function merchantWideFabUiState(phase: string, fabLoading: boolean): WideBasketFabState {
  if (phase === 'loading' || fabLoading) return 'loading'
  if (phase === 'collapsed') return 'collapsed'
  return 'default'
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
 * B–C) loading FAB 56px on the right
 * D) solo tab + FAB expands left
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
  const showWideFab = wideFabPhase !== 'hidden'
  const basketRowPhase =
    wideFabPhase === 'default'
      ? 'default'
      : wideFabPhase === 'collapsed'
        ? 'collapsed'
        : wideFabPhase === 'loading'
          ? 'loading'
          : undefined
  const merchantBasketRow =
    basketEnabled &&
    basket.basketUnitTotal > 0 &&
    (basket.compactTabs || showWideFab || basket.basketFabExiting)

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

  const onTabClick = useCallback(
    (id: string, isActive: boolean) => {
      if (merchantTabSolo && isActive && basketEnabled) {
        basket.expandMerchantTabs()
        return
      }
      selectTab(id)
    },
    [basket, basketEnabled, merchantTabSolo, selectTab],
  )

  const activeIndex = useMemo(() => {
    if (n === 0) return 0
    const i = items.findIndex((it) => it.id === activeId)
    return i < 0 ? 0 : i
  }, [activeId, items, n])

  const pillGridStyle = useMemo(
    (): CSSProperties =>
      ({
        gridTemplateColumns: merchantTabSolo ? 'minmax(0, 1fr)' : `repeat(${n}, minmax(0, 1fr))`,
        '--ftb-tab-count': merchantTabSolo ? '1' : String(n),
        '--ftb-active-index': merchantTabSolo ? '0' : String(activeIndex),
      }) as CSSProperties,
    [n, activeIndex, merchantTabSolo],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const from = activeIndex
    const next =
      e.key === 'ArrowLeft' ? (from + items.length - 1) % items.length : (from + 1) % items.length
    selectTab(items[next]!.id)
  }

  const layoutStyle = useMemo((): CSSProperties => {
    const slotWidth =
      merchantBasketRow &&
      !merchantTabSolo &&
      (basketRowPhase === 'loading' || basketRowPhase === 'collapsed')
        ? WIDE_BASKET_FAB_SLOT_PX
        : 0
    const trailingChromePx =
      merchantBasketRow && !merchantTabSolo
        ? TAB_ACTION_TOTAL_RESERVE_PX + TAB_BAR_ITEM_GAP_PX + slotWidth
        : 0

    return {
      '--ftb-compact-ms': `${TAB_COMPACT_MS}ms`,
      '--ftb-layout-ms': `${TAB_BAR_LAYOUT_MS}ms`,
      '--ftb-layout-ease': TAB_BAR_LAYOUT_EASE,
      '--ftb-trailing-chrome': `${trailingChromePx}px`,
      '--merchant-pop-ms': `${MERCHANT_FAB_POP_MS}ms`,
      '--merchant-motion-ms': `${MERCHANT_FAB_EXPAND_MS}ms`,
      '--merchant-motion-ease': TAB_BAR_LAYOUT_EASE,
    } as CSSProperties
  }, [merchantBasketRow, merchantTabSolo, basketRowPhase])

  if (n === 0) return null

  const wideFabState = basketEnabled
    ? merchantWideFabUiState(wideFabPhase, basket.fabLoading)
    : 'default'

  return (
    <div
      className={[
        'bolt-font-base relative flex w-full min-w-0 flex-col items-start justify-end',
        'bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.9)]',
        'floating-tab-bar pt-3',
        'pb-[calc(34px+env(safe-area-inset-bottom,0px))]',
        className,
      ].join(' ')}
      data-name="merchant-ftb"
    >
      <div
        className={[
          'floating-tab-bar__row flex w-full min-w-0',
          merchantBasketRow ? 'merchant-ftb__row--basket' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={layoutStyle}
        data-basket-phase={basketRowPhase}
      >
        <div
          role="tablist"
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          data-compact={compactTabs ? 'true' : 'false'}
          data-merchant-solo={merchantTabSolo ? 'true' : 'false'}
          className={[
            FLOATING_CHROME_SHADOW_CLASS,
            'floating-tab-bar__pill relative grid min-w-0 rounded-[50px] bg-white p-1',
            merchantBasketRow ? '' : 'flex-[1_0_0]',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ ...pillGridStyle, ...layoutStyle } as CSSProperties}
        >
          <div
            aria-hidden
            className="floating-tab-bar__indicator pointer-events-none absolute top-1 bottom-1 left-1 z-0 rounded-[60px] bg-[var(--color-bg-neutral-secondary)] motion-reduce:transition-none"
          />
          {items.map((item, itemIndex) => {
            const isActive = item.id === activeId
            const iconSrc = isActive ? item.iconSrcSelected : item.iconSrcDefault
            const soloHidden = merchantTabSolo && !isActive

            return (
              <div
                key={item.id}
                className={[
                  'floating-tab-bar__cell relative z-[1] min-w-0',
                  soloHidden ? 'merchant-ftb__tab-cell--solo-hidden' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  gridColumn: merchantTabSolo ? 1 : itemIndex + 1,
                  gridRow: 1,
                }}
              >
                <button
                  type="button"
                  role="tab"
                  id={`merchant-tab-${item.id}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onTabClick(item.id, isActive)}
                  data-name="Navigation"
                  className="floating-tab-bar__tab flex w-full min-w-0 items-center justify-center overflow-hidden rounded-[60px] bg-transparent outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
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

        <div className="floating-tab-bar__actions flex shrink-0 items-center">
          <TabAction iconSrc={MERCHANT_TAB_SEARCH_ICON} ariaLabel="Search" onClick={onSearchClick} />
        </div>

        {merchantBasketRow && basket ? (
          <div className="floating-tab-bar__basket-slot floating-tab-bar__basket-slot--wide relative overflow-visible">
            {showWideFab ? (
              <WideBasketFab
                state={wideFabState}
                count={basket.basketDisplayCount}
                popIn={basket.fabPopIn}
                revealed
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
