import { AccountButton } from '../../components/AccountButton'
import { design } from '../../lib/figmaDesignAssets'
import { dineOutFilterChips } from '../../lib/dineOutFilterContent'
import { HomeHorizontalScroll } from '../../components/HomeHorizontalScroll'
import { DineOutSearchField } from './DineOutSearchField'

const dn = design.dineOutTopNav

function FilterIcon({ src, name }: { src: string; name: string }) {
  return (
    <span className="relative size-5 shrink-0" aria-hidden data-name={name}>
      <img alt="" src={src} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
    </span>
  )
}

/**
 * DineOut top navigation — Figma 77937:93121 (search + avatar + filter chips).
 */
export function DineOutTopNavBlock() {
  return (
    <header
      className="dine-out-top-nav pointer-events-auto flex w-full shrink-0 flex-col items-start bg-gradient-to-b from-[var(--color-layer-floor-0)] to-transparent"
      data-node-id="77937:93121"
    >
      <div
        className="flex w-full shrink-0 items-start gap-2 px-6 pb-3"
        data-node-id="77937:93122"
        data-name="Panel"
      >
        <div className="min-w-0 flex-1" data-node-id="77937:93123">
          <DineOutSearchField placeholder="Food, restaurants, stores..." />
        </div>
        <AccountButton className="dine-out-account-button" data-node-id="77937:93129" />
      </div>

      <HomeHorizontalScroll
        aria-label="Map filters"
        className="w-full shrink-0"
        trackClassName="dine-out-top-nav__filters-track gap-2"
      >
        <div className="flex items-center gap-2" data-node-id="77937:93135" data-name="Current_filters">
          {dineOutFilterChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="dine-out-filter-chip flex shrink-0 items-start gap-1 rounded-lg bg-[var(--color-layer-floor-1)] px-3 py-2"
              data-name="Filter"
            >
              {chip.iconSrc ? <FilterIcon src={chip.iconSrc} name={chip.id} /> : null}
              <span
                className={[
                  'bolt-font-body-s-accent whitespace-nowrap',
                  chip.accent ? 'text-[var(--color-content-action-primary)]' : 'text-[var(--color-content-primary)]',
                ].join(' ')}
              >
                {chip.label}
              </span>
              {chip.chevron ? <FilterIcon src={dn.chevronDown} name="chevron_down" /> : null}
            </button>
          ))}
        </div>
      </HomeHorizontalScroll>
    </header>
  )
}
