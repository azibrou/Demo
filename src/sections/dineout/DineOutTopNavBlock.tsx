import { design } from '../../lib/figmaDesignAssets'
import { dineOutFilterChips } from '../../lib/dineOutFilterContent'
import { HomeHorizontalScroll } from '../../components/HomeHorizontalScroll'
import { SearchField } from '../../components/SearchField'

const as = design.addressSelector
const chevron = design.carousel.allChevron

/**
 * DineOut top navigation — Figma 77303:221009 (search + avatar + filter chips).
 */
export function DineOutTopNavBlock() {
  return (
    <header
      className="dine-out-top-nav pointer-events-auto w-full shrink-0 bg-gradient-to-b from-[var(--color-layer-floor-0)] to-transparent pt-[calc(44px+env(safe-area-inset-top,0px))]"
      data-node-id="77303:221009"
    >
      <div
        className="dine-out-top-nav__panel flex items-start gap-2 px-6 pb-3"
        data-node-id="77303:221108"
      >
        <div className="min-w-0 flex-1 shadow-[0_2px_3px_rgba(0,0,0,0.16)]">
          <SearchField placeholder="Food, restaurants, stores..." className="bg-[var(--color-layer-floor-1)]" />
        </div>
        <button
          type="button"
          aria-label="Account"
          className="relative size-12 shrink-0 shadow-[0_2px_3px_rgba(0,0,0,0.16)] outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
          data-node-id="77303:221110"
        >
          <img alt="" src={as.avatarRing} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
          <div className="absolute inset-[4.55%] flex flex-col items-center justify-center rounded-full bg-[var(--color-bg-action-secondary)] p-2">
            <p className="bolt-font-heading-xs-accent text-[var(--color-content-action-primary)]">T</p>
          </div>
        </button>
      </div>

      <div className="dine-out-top-nav__filters h-9 overflow-hidden px-6 shadow-[0_2px_3px_rgba(0,0,0,0.16)]" data-node-id="77303:221011">
        <HomeHorizontalScroll aria-label="Map filters" className="h-full">
          <div className="home-horizontal-scroll-track h-full gap-2">
            {dineOutFilterChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className="dine-out-filter-chip flex h-full shrink-0 items-center gap-1 rounded-lg bg-[var(--color-layer-floor-1)] px-3 py-2"
                data-name="Filter"
              >
                {chip.iconSrc ? (
                  <span className="relative size-5 shrink-0" aria-hidden>
                    <img alt="" src={chip.iconSrc} className="pointer-events-none block size-full max-w-none object-contain" />
                  </span>
                ) : null}
                <span
                  className={[
                    'bolt-font-body-s-accent whitespace-nowrap',
                    chip.accent ? 'text-[var(--color-content-action-primary)]' : 'text-[var(--color-content-primary)]',
                  ].join(' ')}
                >
                  {chip.label}
                </span>
                {chip.chevron ? (
                  <span className="relative size-5 shrink-0 opacity-70" aria-hidden>
                    <img alt="" src={chevron} className="pointer-events-none block size-full max-w-none rotate-90 object-contain" />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </HomeHorizontalScroll>
      </div>
    </header>
  )
}
