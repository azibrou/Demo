import { HOME_SEARCH_TABS, type HomeSearchTab } from '../lib/homeSearchContent'

export type HomeSearchTabsProps = {
  activeTab: HomeSearchTab
  onTabChange: (tab: HomeSearchTab) => void
  tabs?: readonly HomeSearchTab[]
  'aria-label'?: string
}

/** Figma 78810:114696 — All / Restaurants / Stores category tabs. */
export function HomeSearchTabs({
  activeTab,
  onTabChange,
  tabs = HOME_SEARCH_TABS,
  'aria-label': ariaLabel = 'Search categories',
}: HomeSearchTabsProps) {
  return (
    <div
      className="home-search-screen__tabs flex w-full items-center border-b border-[var(--color-border-separator)]"
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const selected = tab === activeTab
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onTabChange(tab)}
            className={[
              'home-search-screen__tab shrink-0 px-4 pb-3',
              selected
                ? 'border-b border-[var(--color-content-primary)] bolt-font-body-m-accent text-[var(--color-content-primary)]'
                : 'bolt-font-body-m-regular text-[var(--color-content-secondary)]',
            ].join(' ')}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
