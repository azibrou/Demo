import { useMemo, useRef, useState } from 'react'
import { EaterSearchInput } from '../components/EaterSearchInput'
import { HomeHorizontalScroll } from '../components/HomeHorizontalScroll'
import { HomeSearchProviderResult } from '../components/HomeSearchProviderResult'
import { HomeSearchTabs } from '../components/HomeSearchTabs'
import { KalepIcon } from '../components/KalepIcon'
import { ListItem } from '../components/ListItem'
import { kalepIcons as ki } from '../lib/kalepIcons'
import {
  filterBoltSearchSnapshotByTab,
  formatBoltSearchResultCount,
  getBoltSearchSnapshot,
} from '../lib/boltFoodTallinnSearchData'
import {
  HOME_SEARCH_CATEGORIES,
  HOME_SEARCH_FILTER_CHIPS,
  HOME_SEARCH_HISTORY,
  type HomeSearchTab,
} from '../lib/homeSearchContent'

export type HomeSearchScreenProps = {
  onCancel: () => void
}

function FilterChipIcon({ name }: { name: Parameters<typeof KalepIcon>[0]['name'] }) {
  return <KalepIcon name={name} size={20} />
}

/**
 * Home search — Figma 78810:114696 (Results / Suggestions).
 */
export function HomeSearchScreen({ onCancel }: HomeSearchScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<HomeSearchTab>('All')

  const searchSnapshot = useMemo(() => getBoltSearchSnapshot(query), [query])
  const filteredSnapshot = useMemo(
    () => (searchSnapshot ? filterBoltSearchSnapshotByTab(searchSnapshot, activeTab) : null),
    [searchSnapshot, activeTab],
  )
  const showResults = filteredSnapshot != null && query.trim().length > 0

  return (
    <div
      className="home-search-screen bolt-font-base flex min-h-full w-full flex-col bg-[var(--color-layer-floor-2)] text-[var(--color-content-primary)]"
      data-name={showResults ? 'search-results' : 'Results'}
      data-node-id={showResults ? '77656:280059' : '78810:114696'}
    >
      <div className="home-search-screen__panel flex w-full shrink-0 flex-col bg-[var(--color-layer-floor-2)]">
        <div className="home-gutter-inline w-full shrink-0 pb-3 pt-[max(12px,env(safe-area-inset-top,0px))]">
          <EaterSearchInput
            value={query}
            onChange={setQuery}
            placeholder="Restaurants and stores"
            filters={false}
            indicator={false}
            onCancel={onCancel}
            autoFocus
            inputRef={inputRef}
          />
        </div>

        <div className="home-gutter-inline w-full shrink-0 bg-[var(--color-layer-floor-1)] pb-3">
          <HomeSearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <HomeHorizontalScroll
          aria-label="Search filters"
          className="w-full shrink-0 bg-[var(--color-layer-floor-1)] pb-3"
          trackClassName="home-search-screen__filters-track gap-2"
        >
          <div className="flex items-center gap-2">
            {HOME_SEARCH_FILTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={[
                  'home-search-screen__filter-chip flex shrink-0 items-center gap-0.5 rounded-lg bg-[var(--color-bg-neutral-secondary)] py-2',
                  chip.iconName ? 'pl-3 pr-2' : 'px-3',
                ].join(' ')}
              >
                {chip.iconName ? (
                  <span className="flex items-center pr-1">
                    <FilterChipIcon name={chip.iconName} />
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
                {chip.chevron ? <FilterChipIcon name="chevron-down" /> : null}
              </button>
            ))}
          </div>
        </HomeHorizontalScroll>
      </div>

      <div className="home-search-screen__results flex flex-1 flex-col bg-[var(--color-layer-floor-1)]">
        {showResults && filteredSnapshot ? (
          <div className="home-search-screen__results-body flex w-full flex-col">
            <div className="home-gutter-inline w-full shrink-0 pb-4 pt-4">
              <h2 className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]">
                {formatBoltSearchResultCount(filteredSnapshot.resultCount)}
              </h2>
            </div>
            <div className="home-search-screen__providers flex w-full flex-col gap-3 pb-6">
              {filteredSnapshot.providers.map((provider) => (
                <HomeSearchProviderResult key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        ) : (
          <div className="home-gutter-inline flex w-full flex-col gap-4 py-4">
            <div className="flex w-full flex-col">
              {HOME_SEARCH_HISTORY.map((term, index) => (
                <ListItem
                  key={term}
                  variant="search"
                  title={term}
                  leadingIconSrc={ki.historyOutline}
                  showDivider={index < HOME_SEARCH_HISTORY.length - 1}
                />
              ))}
            </div>

            <div className="flex w-full flex-col gap-2">
              <h2 className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]">Popular categories</h2>
              <div className="flex w-full flex-col">
                {HOME_SEARCH_CATEGORIES.map((label, index) => (
                  <ListItem
                    key={label}
                    variant="search"
                    title={label}
                    showDivider={index < HOME_SEARCH_CATEGORIES.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
