import { useCallback, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { KalepIcon } from './KalepIcon'

/** Figma 79413:250410 — [Eater] SearchInput visual states. */
export type EaterSearchInputVisualState = 'empty' | 'empty-focused' | 'filled' | 'filled-focused'

export type EaterSearchInputProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  /** Figma `filters` — trailing filter control inside the field. */
  filters?: boolean
  filterCount?: number
  onFilterClick?: () => void
  /** Figma `indicator` — badge on filter icon when filterCount > 0. */
  indicator?: boolean
  /** Cancel action in the search row (home overlay). */
  onCancel?: () => void
  cancelLabel?: string
  autoFocus?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  className?: string
}

function formatFilterCount(count: number): string {
  if (count > 99) return '99+'
  return String(count)
}

function resolveVisualState(value: string, focused: boolean): EaterSearchInputVisualState {
  const filled = value.length > 0
  if (!filled && !focused) return 'empty'
  if (!filled && focused) return 'empty-focused'
  if (filled && !focused) return 'filled'
  return 'filled-focused'
}

/**
 * [Eater] SearchInput — Figma 79413:250410.
 * Row: field + optional Cancel. States animate at 100ms ease-out.
 */
export function EaterSearchInput({
  value = '',
  onChange,
  placeholder = 'Restaurants and stores',
  filters = false,
  filterCount = 0,
  onFilterClick,
  indicator = false,
  onCancel,
  cancelLabel = 'Cancel',
  autoFocus = false,
  inputRef: inputRefProp,
  className = '',
}: EaterSearchInputProps) {
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = inputRefProp ?? internalRef
  const [focused, setFocused] = useState(autoFocus)

  const showIndicator = indicator && filterCount > 0
  const displayCount = formatFilterCount(filterCount)
  const multiDigit = filterCount >= 10
  const visualState = resolveVisualState(value, focused)
  const showClear = value.length > 0

  const handleFocus = useCallback(() => setFocused(true), [])
  const handleBlur = useCallback(() => setFocused(false), [])

  const handleClear = useCallback(() => {
    onChange?.('')
    inputRef.current?.focus()
  }, [onChange, inputRef])

  const handleClearPointerDown = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }, [])

  const handleCancelPointerDown = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      className={['eater-search-input-row flex w-full min-w-0 items-center gap-3', className].filter(Boolean).join(' ')}
      data-name="[Eater] SearchInput"
      data-node-id="79413:250410"
    >
      <div
        className={[
          'eater-search-input relative flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg px-3',
          `eater-search-input--${visualState}`,
        ].join(' ')}
        data-state={visualState}
        data-name="Input"
      >
        <div className="eater-search-input__content relative flex min-w-0 flex-1 items-center gap-3">
          <KalepIcon name="search" size={24} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            enterKeyHint="search"
            className="eater-search-input__field bolt-font-body-m-regular min-w-0 flex-1 bg-transparent text-[var(--color-content-primary)] outline-none placeholder:text-[var(--color-content-tertiary)]"
            aria-label={placeholder}
          />
          <button
            type="button"
            aria-label="Clear search"
            aria-hidden={!showClear}
            tabIndex={showClear ? 0 : -1}
            onPointerDown={handleClearPointerDown}
            onClick={handleClear}
            className={[
              'eater-search-input__clear relative size-6 shrink-0 bg-transparent p-0 outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2',
              showClear ? 'eater-search-input__clear--visible' : '',
            ].join(' ')}
            data-name="clear"
            data-node-id="58331:104961"
          >
            <KalepIcon name="clear" size={24} />
          </button>
        </div>

        {filters ? (
          <button
            type="button"
            aria-label={showIndicator ? `Filters, ${displayCount} selected` : 'Filters'}
            onClick={onFilterClick}
            className="eater-search-input__filters relative size-6 shrink-0 bg-transparent p-0 outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
            data-name="filters (outline)"
          >
            <KalepIcon name="filters" size={24} />
          </button>
        ) : null}

        {showIndicator ? (
          <span
            className={[
              'eater-search-input__filter-indicator absolute top-1.5 flex h-5 items-center justify-center rounded-[20px]',
              'bg-[var(--color-bg-action-primary)] text-[var(--color-content-primary-inverted)]',
              'bolt-font-body-xs-accent [font-feature-settings:"cv03"_1,"cv04"_1]',
              multiDigit ? 'min-w-5 px-1.5' : 'size-5 min-w-5 px-0',
            ].join(' ')}
            aria-hidden
            data-name="Indicator"
          >
            {displayCount}
          </span>
        ) : null}
      </div>

      {onCancel ? (
        <button
          type="button"
          onPointerDown={handleCancelPointerDown}
          onClick={onCancel}
          className="eater-search-input__cancel bolt-font-body-s-regular shrink-0 whitespace-nowrap py-3 text-[var(--color-content-primary)] outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
        >
          {cancelLabel}
        </button>
      ) : null}
    </div>
  )
}
