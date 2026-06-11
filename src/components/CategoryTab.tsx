import { useEffect, useRef } from 'react'
import type { MerchantAislesCategory } from '../lib/merchantAislesCategories'

export type CategoryTabProps = {
  categories: readonly MerchantAislesCategory[]
  activeId: string
  onChange: (id: string) => void
  'aria-label'?: string
}

/**
 * Horizontal merchant category tabs — Figma 80613:192976.
 * Active tab scrolls to the horizontal center of the row.
 */
export function CategoryTab({
  categories,
  activeId,
  onChange,
  'aria-label': ariaLabel = 'Categories',
}: CategoryTabProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const el = tabRefs.current[activeId]
    const scroller = scrollRef.current
    if (!el || !scroller) return

    const targetLeft = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2
    scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
  }, [activeId])

  return (
    <div
      ref={scrollRef}
      className="category-tab flex w-full items-center overflow-x-auto overscroll-x-contain pr-[50px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={ariaLabel}
    >
      {categories.map((category) => {
        const selected = category.id === activeId
        return (
          <button
            key={category.id}
            ref={(node) => {
              tabRefs.current[category.id] = node
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(category.id)}
            className={[
              'shrink-0 px-3 text-left',
              selected
                ? 'bolt-font-body-m-accent pt-1 pb-3 text-[var(--color-content-primary,#191f1c)]'
                : 'bolt-font-body-m-regular pb-4 text-[var(--color-content-secondary)]',
            ].join(' ')}
          >
            {category.emoji} {category.label}
          </button>
        )
      })}
    </div>
  )
}
