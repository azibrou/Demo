import { useLocation, useNavigate } from 'react-router-dom'
import { openProfile } from '../../lib/profileNavigation'
import { AccountButton } from '../../components/AccountButton'
import { KalepIcon } from '../../components/KalepIcon'
import { dineOutFilterChips } from '../../lib/dineOutFilterContent'
import type { KalepIconStem } from '../../lib/kalepIcons'
import { HomeHorizontalScroll } from '../../components/HomeHorizontalScroll'
import { DineOutSearchField } from './DineOutSearchField'

function FilterIcon({ name }: { name: KalepIconStem }) {
  return <KalepIcon name={name} size={20} />
}

/**
 * DineOut top navigation — Figma 77937:93121 (search + avatar + filter chips).
 */
export function DineOutTopNavBlock() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header
      className="dine-out-top-nav pointer-events-auto flex w-full shrink-0 flex-col items-start bg-gradient-to-b from-[var(--color-layer-floor-0)] to-transparent"
      data-node-id="77937:93121"
    >
      <div
        className="flex w-full shrink-0 items-center gap-2 px-6 pb-3"
        data-node-id="77937:93122"
        data-name="Panel"
      >
        <div className="min-w-0 flex-1" data-node-id="77937:93123">
          <DineOutSearchField placeholder="Food, restaurants, stores..." />
        </div>
        <AccountButton
          className="dine-out-account-button"
          data-node-id="77937:93129"
          onClick={() => openProfile(navigate, location.pathname)}
        />
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
              {chip.iconName ? <FilterIcon name={chip.iconName} /> : null}
              <span
                className={[
                  'bolt-font-body-s-accent whitespace-nowrap',
                  chip.accent ? 'text-[var(--color-content-action-primary)]' : 'text-[var(--color-content-primary)]',
                ].join(' ')}
              >
                {chip.label}
              </span>
              {chip.chevron ? <FilterIcon name="chevron-down" /> : null}
            </button>
          ))}
        </div>
      </HomeHorizontalScroll>
    </header>
  )
}
