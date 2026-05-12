import { useMemo, type KeyboardEvent } from 'react'
import { FLOATING_PILL_BOX_SHADOW_CLASS } from '../lib/floatingPillShadow'
import { BasketFab } from './BasketFab'

export type FloatingTabBarItem = {
  id: string
  label: string
  /** Inactive icon */
  iconSrcDefault: string
  /** Icon when tab is focused / selected */
  iconSrcSelected: string
}

export type FloatingTabBarProps = {
  items: readonly FloatingTabBarItem[]
  activeId: string
  onActiveChange?: (id: string) => void
  /** Extra classes on the outer shell (full-width; horizontal inset is `max(1.5rem, safe-area)`). */
  className?: string
  ariaLabel?: string
  /** Hide tab labels and vertically center icons (50ms ease-out). */
  compact?: boolean
  /** Basket FAB to the right of the pill on the same row (`max-width` eases — tab pill shrinks smoothly). */
  basketFab?: {
    count: number
    fabReveal: boolean
    showBadge: boolean
    exiting: boolean
    badgePopNonce: number
    reserveWidthPx: number
  }
}

const labelLeading = '[font-feature-settings:"cv03"_1,"cv04"_1,"lnum"_1,"pnum"_1]'

/**
 * Floating bottom navigation — node 74905:22273 (Consumer).
 * Active tint is one layer that slides behind tabs (100ms ease-out).
 */
export function FloatingTabBar({
  items,
  activeId,
  onActiveChange,
  className = '',
  ariaLabel = 'Main navigation',
  compact = false,
  basketFab,
}: FloatingTabBarProps) {
  const n = items.length

  const activeIndex = useMemo(() => {
    if (n === 0) return 0
    const i = items.findIndex((it) => it.id === activeId)
    return i < 0 ? 0 : i
  }, [items, activeId, n])

  const knownActive = items.findIndex((it) => it.id === activeId) >= 0

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const i = items.findIndex((it) => it.id === activeId)
    const from = !knownActive ? activeIndex : i
    const next =
      e.key === 'ArrowLeft' ? (from + items.length - 1) % items.length : (from + 1) % items.length
    onActiveChange?.(items[next]!.id)
  }

  if (n === 0) return null

  return (
    <div
      className={[
        'box-border flex w-full min-w-0 max-w-full flex-col pt-3',
        'pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))]',
        'pb-[calc(34px+env(safe-area-inset-bottom,0px))]',
        'bg-[linear-gradient(to_top,#ffffff,rgba(255,255,255,0))]',
        'animate-floating-tab-bar-enter motion-reduce:animate-none',
        className,
      ].join(' ')}
    >
      <div className="flex min-h-[60px] w-full min-w-0 max-w-full shrink-0 flex-row items-center gap-0 overflow-visible py-2">
        <div
          role="tablist"
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          className="relative h-[60px] min-h-0 min-w-0 w-full flex-[1_0_0]"
        >
          <div
            className={[
              'relative flex h-full min-h-0 min-w-0 w-full rounded-[50px] bg-white p-1',
              FLOATING_PILL_BOX_SHADOW_CLASS,
            ].join(' ')}
          >
            <div className="relative flex h-full min-h-0 min-w-0 w-full flex-[1_0_0] flex-row items-stretch">
              <div
                aria-hidden
                className={[
                  'pointer-events-none absolute inset-y-0 left-0 z-0 rounded-[60px]',
                  'bg-[rgba(0,45,30,0.07)]',
                  'transition-transform duration-100 ease-out will-change-transform',
                ].join(' ')}
                style={{
                  width: `${100 / n}%`,
                  transform: `translateX(calc(${activeIndex} * 100%))`,
                }}
              />
              {items.map((item, itemIndex) => {
                const showPrimary = knownActive ? item.id === activeId : itemIndex === 0

                return (
                  <div key={item.id} className="relative z-10 flex h-full min-h-0 min-w-px flex-[1_0_0] flex-row items-stretch">
                    <button
                      type="button"
                      role="tab"
                      id={`floating-tab-${item.id}`}
                      aria-label={item.label}
                      aria-selected={showPrimary}
                      tabIndex={showPrimary ? 0 : -1}
                      onClick={() => onActiveChange?.(item.id)}
                      className={[
                        'flex h-full min-h-0 flex-[1_0_0] flex-col items-center justify-center overflow-clip rounded-[60px] bg-transparent outline-none ring-[#002d1e]/20 focus-visible:ring-2',
                        compact
                          ? 'min-w-0 gap-0 px-1.5 py-0 min-[360px]:px-2 sm:px-3'
                          : 'min-w-0 gap-1 px-1.5 py-0 min-[360px]:px-2 sm:px-3',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'relative size-6 shrink-0 transition-transform duration-[220ms] ease-out motion-reduce:transition-none',
                          compact ? '-translate-y-0.5' : 'translate-y-0',
                        ].join(' ')}
                        aria-hidden
                      >
                        <img
                          alt=""
                          src={showPrimary ? item.iconSrcSelected : item.iconSrcDefault}
                          className="pointer-events-none absolute inset-0 block size-full max-w-none"
                        />
                      </span>
                      <p
                        aria-hidden={compact}
                        className={[
                          'w-full min-w-0 shrink-0 overflow-hidden text-center text-[11px] leading-4 whitespace-nowrap sm:text-xs',
                          'transition-[opacity,max-height,transform] duration-[220ms] ease-out motion-reduce:transition-none',
                          compact
                            ? 'pointer-events-none max-h-0 translate-y-1 opacity-0'
                            : 'max-h-8 translate-y-0 opacity-100',
                          labelLeading,
                          showPrimary ? 'text-[#191f1c]' : 'text-[rgba(0,10,7,0.63)]',
                        ].join(' ')}
                      >
                        {item.label}
                      </p>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {basketFab ? (
          <div
            className={[
              'flex h-[60px] min-w-0 shrink-0 items-center overflow-visible',
              'transition-[max-width] duration-100 ease-out motion-reduce:transition-none',
            ].join(' ')}
            style={{ maxWidth: basketFab.reserveWidthPx }}
          >
            <div className="flex h-full w-[72px] shrink-0 items-center justify-end overflow-visible">
              <span className="w-3 shrink-0" aria-hidden />
              <BasketFab
                count={basketFab.count}
                fabReveal={basketFab.fabReveal}
                showBadge={basketFab.showBadge}
                exiting={basketFab.exiting}
                badgePopNonce={basketFab.badgePopNonce}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
