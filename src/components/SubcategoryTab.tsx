import { useEffect, useRef } from 'react'
import { ChipS } from './ChipS'

export type SubcategoryTabProps = {
  subcategories: readonly string[]
  activeId: string
  onChange: (id: string) => void
  'aria-label'?: string
}

function subcategoryKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Horizontal subcategory chips — Figma 80613:192876; uses {@link ChipS}.
 */
export function SubcategoryTab({
  subcategories,
  activeId,
  onChange,
  'aria-label': ariaLabel = 'Subcategories',
}: SubcategoryTabProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const el = chipRefs.current[activeId]
    const scroller = scrollRef.current
    if (!el || !scroller) return

    const targetLeft = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2
    scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
  }, [activeId])

  return (
    <div
      ref={scrollRef}
      className="subcategory-tab flex w-full items-center gap-2 overflow-x-auto overscroll-x-contain py-2 pl-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={ariaLabel}
    >
      {subcategories.map((label) => {
        const id = subcategoryKey(label)
        const selected = id === activeId
        return (
          <ChipS
            key={id}
            ref={(node) => {
              chipRefs.current[id] = node
            }}
            label={label}
            selected={selected}
            onClick={() => onChange(id)}
          />
        )
      })}
    </div>
  )
}
