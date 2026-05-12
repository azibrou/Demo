import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/** `scaled` — Figma 74916:234866; uses `.shortcut-item-scaled*` + inherited `--shortcut-scale` (`.home-viewport-scale`). */
export type ShortcutItemVariant = 'default' | 'scaled'

export type ShortcutItemProps = {
  iconSrc: string
  label: string
  /** When set, entire tile is a client-side route link (e.g. `/stores`). */
  to?: string
  variant?: ShortcutItemVariant
}

const labelLeading = '[font-feature-settings:"cv03"_1,"cv04"_1,"lnum"_1,"pnum"_1]'

/**
 * Compact shortcut (circle + label).
 * Figma 74916:29853 (default); carousel 74916:234866 uses `variant="scaled"` inside {@link ShortcutsCarousel}.
 */
export function ShortcutItem({ iconSrc, label, to, variant = 'default' }: ShortcutItemProps) {
  const colClass = variant === 'scaled' ? 'shortcut-item-scaled' : 'flex shrink-0 flex-col items-center gap-1'

  const inner: ReactNode =
    variant === 'scaled' ? (
      <>
        <div className="shortcut-item-scaled__ring">
          <div className="shortcut-item-scaled__inner">
            <img alt="" src={iconSrc} className="shortcut-item-scaled__img" />
          </div>
        </div>
        <p className="shortcut-item-scaled__label">{label}</p>
      </>
    ) : (
      <>
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-[rgba(0,45,30,0.07)]">
          <img alt="" src={iconSrc} className="pointer-events-none absolute inset-0 m-auto size-[52px] max-w-none object-contain" />
        </div>
        <p
          className={`mt-1 w-[72px] text-center text-sm font-normal leading-5 tracking-[-0.084px] text-[#191f1c] ${labelLeading}`}
        >
          {label}
        </p>
      </>
    )

  const focusRing = 'outline-none ring-[#002d1e]/20 focus-visible:ring-2'

  if (to) {
    return (
      <Link to={to} className={`${colClass} no-underline ${focusRing}`}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" className={`${colClass} bg-transparent p-0 ${focusRing}`}>
      {inner}
    </button>
  )
}
