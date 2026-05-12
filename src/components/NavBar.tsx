import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { design } from '../lib/figmaDesignAssets'

const h = design.providerHeader

export type NavBarLayout = 'big' | 'small'

export type NavBarCollapseMode = 'onScroll' | 'fixedSmall'

export type NavBarProps = {
  title: string
  onBack: () => void
  /** Static node, or function receiving current layout (big pre-scroll vs small sticky). */
  endSlot?: ReactNode | ((layout: NavBarLayout) => ReactNode)
  collapseMode: NavBarCollapseMode
}

const SCROLL_COLLAPSE_PX = 88

function IconButton({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="relative grid size-6 shrink-0 place-items-center">
      {children}
    </button>
  )
}

function BackIcon({ onClick }: { onClick: () => void }) {
  return (
    <IconButton label="Back" onClick={onClick}>
      <span className="relative size-6 shrink-0" aria-hidden>
        <img alt="" src={h.arrowLeft} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
      </span>
    </IconButton>
  )
}

function resolveEndSlot(endSlot: NavBarProps['endSlot'], layout: NavBarLayout): ReactNode {
  if (endSlot == null) return null
  if (typeof endSlot === 'function') return endSlot(layout)
  return endSlot
}

export function NavBar({ title, onBack, endSlot, collapseMode }: NavBarProps) {
  const [scrollY, setScrollY] = useState(0)

  const syncScroll = useCallback(() => {
    if (collapseMode !== 'onScroll') return
    setScrollY(window.scrollY)
  }, [collapseMode])

  useEffect(() => {
    if (collapseMode !== 'onScroll') return
    const id = requestAnimationFrame(syncScroll)
    window.addEventListener('scroll', syncScroll, { passive: true })
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('scroll', syncScroll)
    }
  }, [collapseMode, syncScroll])

  const progress = useMemo(() => {
    if (collapseMode === 'fixedSmall') return 1
    return Math.min(1, Math.max(0, scrollY / SCROLL_COLLAPSE_PX))
  }, [collapseMode, scrollY])

  const layout: NavBarLayout = progress > 0.5 ? 'small' : 'big'
  const resolvedEnd = resolveEndSlot(endSlot, layout)

  const p = progress
  const bigTitleOpacity = Math.max(0, 1 - p * 1.35)
  const rowTitleOpacity = Math.max(0, p * 1.35 - 0.35)
  const dividerOpacity = Math.max(0, (p - 0.15) / 0.85)
  const dividerMarginTop = p * 15

  return (
    <header className="sticky top-0 z-20 w-full bg-white">
      <div className="flex w-full flex-col px-6 pt-4">
        <div className="flex w-full items-center gap-4">
          <BackIcon onClick={onBack} />
          <div className="relative isolate min-h-9 min-w-0 flex-1">
            <p
              aria-hidden={p < 0.5}
              className="pointer-events-none absolute inset-x-0 top-1/2 min-w-0 -translate-y-1/2 truncate text-center text-lg font-semibold leading-6 tracking-[-0.252px] text-[#191f1c]"
              style={{ opacity: rowTitleOpacity }}
            >
              {title}
            </p>
          </div>
          <div className="flex w-6 shrink-0 justify-end">
            {resolvedEnd ?? <span className="size-6 shrink-0" aria-hidden />}
          </div>
        </div>

        <div
          className="overflow-hidden"
          style={{
            maxHeight: `${(1 - p) * 120}px`,
            opacity: bigTitleOpacity,
          }}
        >
          <div className="pb-2 pt-1">
            <h1
              aria-hidden={p >= 0.5}
              className="w-full text-[28px] font-semibold leading-9 tracking-[-0.616px] text-[#191f1c]"
            >
              {title}
            </h1>
          </div>
        </div>

        <div
          className="h-px w-full shrink-0 bg-[rgba(0,45,30,0.07)]"
          style={{
            marginTop: dividerMarginTop,
            opacity: dividerOpacity,
            maxHeight: dividerOpacity < 0.02 ? 0 : 1,
            overflow: 'hidden',
          }}
          aria-hidden
        />
      </div>
    </header>
  )
}

/** Edit control for NavBar `endSlot` — toggles pressed state for a11y. */
export function NavBarEditButton({
  pressed,
  onClick,
  variant,
}: {
  pressed: boolean
  onClick: () => void
  variant: 'large' | 'small'
}) {
  const src = variant === 'small' ? design.shoppingList.navEditSmall : design.shoppingList.navEditLarge
  return (
    <button
      type="button"
      aria-label="Edit list"
      aria-pressed={pressed}
      onClick={onClick}
      className="relative grid size-6 shrink-0 place-items-center"
    >
      <span className="relative size-6 shrink-0" aria-hidden>
        <img alt="" src={src} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
      </span>
    </button>
  )
}
