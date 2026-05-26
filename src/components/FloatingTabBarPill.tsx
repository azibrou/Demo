import type { CSSProperties, KeyboardEvent, RefObject } from 'react'
import { FLOATING_CHROME_SHADOW_CLASS } from '../lib/floatingChromeShadow'
import type { FloatingTabBarItem } from './FloatingTabBar'

export type FloatingTabBarPillProps = {
  items: readonly FloatingTabBarItem[]
  activeId: string
  activeIndex: number
  compact: boolean
  ariaLabel: string
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
  onTabActivate: (id: string, isActive: boolean) => void
  gridStyle: CSSProperties
  motionVars: CSSProperties
  tabIdPrefix?: string
  /** Hide non-active cells (merchant solo). */
  soloMode?: boolean
  pillRef?: RefObject<HTMLDivElement | null>
  /** Explicit width tween (merchant basket row); overrides calc-based width from motion vars. */
  pillLayoutStyle?: CSSProperties
  pillDataAttrs?: Record<string, string | undefined>
}

/**
 * Shared tab pill — label/icon compact animation via `data-compact` (styles.css).
 * Used by home {@link FloatingTabBar} and {@link MerchantFTabBar}.
 */
export function FloatingTabBarPill({
  items,
  activeId,
  activeIndex,
  compact,
  ariaLabel,
  onKeyDown,
  onTabActivate,
  gridStyle,
  motionVars,
  tabIdPrefix = 'floating-tab',
  soloMode = false,
  pillRef,
  pillLayoutStyle,
  pillDataAttrs,
}: FloatingTabBarPillProps) {
  return (
    <div
      ref={pillRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      data-compact={compact ? 'true' : 'false'}
      data-merchant-solo={soloMode ? 'true' : 'false'}
      data-pill-width-tween={pillLayoutStyle != null ? 'true' : 'false'}
      className={[
        FLOATING_CHROME_SHADOW_CLASS,
        'floating-tab-bar__pill floating-tab-bar__pill--layout-chrome relative grid min-w-0 rounded-[50px] bg-white p-1',
        pillLayoutStyle != null ? 'floating-tab-bar__pill--width-tween' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...gridStyle, ...motionVars, ...pillLayoutStyle } as CSSProperties}
      data-node-id="76281:68556"
      {...pillDataAttrs}
    >
      <div
        aria-hidden
        className="floating-tab-bar__indicator pointer-events-none absolute top-1 bottom-1 left-1 z-0 rounded-[56px] bg-[var(--color-bg-neutral-secondary)] motion-reduce:transition-none"
      />
      {items.map((item, itemIndex) => {
        const isActive = soloMode ? item.id === activeId : itemIndex === activeIndex
        const iconSrc = isActive ? item.iconSrcSelected : item.iconSrcDefault
        const soloHidden = soloMode && !isActive

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
              gridColumn: soloMode ? 1 : itemIndex + 1,
              gridRow: 1,
            }}
          >
            <button
              type="button"
              role="tab"
              id={`${tabIdPrefix}-${item.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabActivate(item.id, isActive)}
              data-name="Navigation"
              className="floating-tab-bar__tab flex w-full min-w-0 items-center justify-center overflow-hidden rounded-[56px] bg-transparent outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
            >
              <span className="floating-tab-bar__motion w-full min-w-0">
                <span
                  className="floating-tab-bar__icon relative flex size-6 shrink-0 items-center justify-center"
                  aria-hidden
                >
                  <img
                    alt=""
                    src={iconSrc}
                    className="floating-tab-bar__icon-img pointer-events-none block size-6"
                  />
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
  )
}
