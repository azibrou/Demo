import { SearchField } from '../../components/SearchField'

export type HomeSearchBlockProps = {
  placeholder?: string
  filterCount?: number
  onSearchClick?: () => void
  onFilterClick?: () => void
}

/** Home search row — 24px horizontal gutters (Figma layout). */
export function HomeSearchBlock({
  placeholder,
  filterCount,
  onSearchClick,
  onFilterClick,
}: HomeSearchBlockProps) {
  return (
    <section className="home-search-section home-gutter-inline w-full min-w-0 shrink-0" aria-label="Search">
      <SearchField
        placeholder={placeholder}
        filterCount={filterCount}
        onSearchClick={onSearchClick}
        onFilterClick={onFilterClick}
      />
    </section>
  )
}
