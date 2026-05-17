import { design } from '../lib/figmaDesignAssets'

const sf = design.searchField

export type SearchFieldProps = {
  placeholder?: string
  /** Active filter count; hidden when 0 or undefined. */
  filterCount?: number
  onSearchClick?: () => void
  onFilterClick?: () => void
  className?: string
}

function formatFilterCount(count: number): string {
  if (count > 99) return '99+'
  return String(count)
}

/**
 * Figma SearchInput-default [76330:70427](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=76330-70427)
 * with filter indicator [76330:70414](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=76330-70414).
 */
export function SearchField({
  placeholder = 'Food, restaurants, stores...',
  filterCount = 0,
  onSearchClick,
  onFilterClick,
  className = '',
}: SearchFieldProps) {
  const showIndicator = filterCount > 0
  const displayCount = formatFilterCount(filterCount)
  const multiDigit = filterCount >= 10

  return (
    <div
      className={['search-field relative flex h-12 w-full min-w-0 items-center gap-3 rounded-lg px-3', className].join(' ')}
      data-name={showIndicator ? 'SearchInput-default+filterindicator' : 'SearchInput-default'}
      data-node-id={showIndicator ? '76330:70414' : '76330:70427'}
    >
      <button
        type="button"
        onClick={onSearchClick}
        className="flex min-w-0 flex-1 items-center gap-3 bg-transparent p-0 text-left outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
        data-name="Content"
      >
        <span className="relative size-6 shrink-0" aria-hidden data-name="search">
          <img alt="" src={sf.searchIcon} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
        </span>
        <span className="bolt-font-body-m-regular min-w-0 flex-1 break-words text-[var(--color-content-secondary)]">
          {placeholder}
        </span>
      </button>

      <button
        type="button"
        aria-label={showIndicator ? `Filters, ${displayCount} selected` : 'Filters'}
        onClick={onFilterClick}
        className="relative size-6 shrink-0 bg-transparent p-0 outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
        data-name="filters (outline)"
      >
        <img alt="" src={sf.filtersIcon} className="pointer-events-none block size-full max-w-none" />
      </button>

      {showIndicator ? (
        <span
          className={[
            'search-field__filter-indicator absolute top-1.5 flex h-5 items-center justify-center rounded-[20px] bg-[var(--color-bg-action-primary)] text-[var(--color-content-primary-inverted)]',
            'bolt-font-body-xs-accent [font-feature-settings:"cv03"_1,"cv04"_1]',
            multiDigit ? 'min-w-5 px-1.5' : 'size-5 min-w-5 px-0',
          ].join(' ')}
          style={{ right: 6 }}
          data-name="Indicator"
          aria-hidden
        >
          {displayCount}
        </span>
      ) : null}
    </div>
  )
}
