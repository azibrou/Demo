import { SearchField } from './SearchField'

export type HomeSearchSectionProps = {
  filterCount?: number
  onSearchClick?: () => void
  onFilterClick?: () => void
}

/** Home search row — 24px horizontal gutters (Figma layout). */
export function HomeSearchSection({ filterCount, onSearchClick, onFilterClick }: HomeSearchSectionProps) {
  return (
    <section className="home-search-section home-gutter-inline w-full min-w-0 shrink-0" aria-label="Search">
      <SearchField filterCount={filterCount} onSearchClick={onSearchClick} onFilterClick={onFilterClick} />
    </section>
  )
}
