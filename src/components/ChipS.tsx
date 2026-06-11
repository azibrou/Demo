import { forwardRef } from 'react'

export type ChipSProps = {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

/**
 * Filter chip — Figma 80613:193480 (selected) / 80613:193488 (default).
 */
export const ChipS = forwardRef<HTMLButtonElement, ChipSProps>(function ChipS(
  { label, selected = false, onClick, className = '' },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'shrink-0 rounded-lg px-2 py-1.5 bolt-font-body-s-regular whitespace-nowrap',
        selected
          ? 'bg-[var(--color-bg-action-primary,#2b8659)] text-white'
          : 'bg-[rgba(0,45,30,0.07)] text-[var(--color-content-primary,#191f1c)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  )
})
