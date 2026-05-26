import { design } from '../../lib/figmaDesignAssets'

const dn = design.dineOutTopNav

export type DineOutSearchFieldProps = {
  placeholder?: string
  onSearchClick?: () => void
  onFilterClick?: () => void
}

/**
 * DineOut map search — Figma 77937:93123 ([Eater] SearchInput).
 * Separate from {@link SearchField} (76330:70427) used on Home/Stores.
 */
export function DineOutSearchField({
  placeholder = 'Food, restaurants, stores...',
  onSearchClick,
  onFilterClick,
}: DineOutSearchFieldProps) {
  const focusRing = 'outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2'

  return (
    <div
      className="dine-out-search-field relative flex h-12 w-full min-w-0 items-center gap-3 rounded-lg bg-[var(--color-layer-floor-1)] px-3"
      data-name="[Eater] SearchInput"
      data-node-id="77937:93123"
    >
      <button
        type="button"
        onClick={onSearchClick}
        className={`flex min-w-0 flex-1 items-center gap-3 bg-transparent p-0 text-left ${focusRing}`}
        data-node-id="77937:93124"
        data-name="Content"
      >
        <span className="relative size-6 shrink-0" aria-hidden data-name="search" data-node-id="77937:95159">
          <img alt="" src={dn.searchIcon} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
        </span>
        <span
          className="bolt-font-body-m-regular min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-content-secondary)]"
          data-node-id="77937:93126"
        >
          {placeholder}
        </span>
      </button>

      <button
        type="button"
        aria-label="Filters"
        onClick={onFilterClick}
        className={`relative size-6 shrink-0 bg-transparent p-0 ${focusRing}`}
        data-name="filters (outline)"
        data-node-id="77937:95157"
      >
        <img alt="" src={dn.filtersIcon} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
      </button>
    </div>
  )
}
