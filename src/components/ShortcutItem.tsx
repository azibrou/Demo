import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { HomeShortcutIconVariant } from '../lib/boltFoodTallinnHomeContent'

/** `scaled` — Figma 76281:68503; uses `.shortcut-item-scaled*` + `--shortcut-scale`. */
export type ShortcutItemVariant = 'default' | 'scaled'

export type ShortcutItemProps = {
  iconSrc: string
  label: string
  iconVariant?: HomeShortcutIconVariant
  labelSingleLine?: boolean
  /** When set, entire tile is a client-side route link (e.g. `/stores`). */
  to?: string
  variant?: ShortcutItemVariant
}

function ScaledShortcutIcon({
  iconSrc,
  iconVariant,
}: {
  iconSrc: string
  iconVariant: HomeShortcutIconVariant
}) {
  switch (iconVariant) {
    case 'basket':
      return (
        <div className="shortcut-item-scaled__icon-slot overflow-hidden" data-name="icon">
          <img
            alt=""
            src={iconSrc}
            className="shortcut-item-scaled__icon-img shortcut-item-scaled__icon-img--basket pointer-events-none"
          />
        </div>
      )
    case 'cover':
      return (
        <div className="shortcut-item-scaled__icon-slot" data-name="icon">
          <img alt="" src={iconSrc} className="shortcut-item-scaled__icon-img pointer-events-none object-cover" />
        </div>
      )
    case 'iceCream':
      return (
        <div className="shortcut-item-scaled__icon-slot overflow-hidden" data-name="icon">
          <div className="shortcut-item-scaled__icon-slot--ice-cream overflow-hidden">
            <img
              alt=""
              src={iconSrc}
              className="shortcut-item-scaled__icon-img shortcut-item-scaled__icon-img--ice-cream pointer-events-none"
            />
          </div>
        </div>
      )
    case 'contain':
    default:
      return (
        <div className="shortcut-item-scaled__icon-slot" data-name="icon">
          <img alt="" src={iconSrc} className="shortcut-item-scaled__icon-img pointer-events-none object-contain" />
        </div>
      )
  }
}

function DefaultShortcutIcon({
  iconSrc,
  iconVariant,
}: {
  iconSrc: string
  iconVariant: HomeShortcutIconVariant
}) {
  const center = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'

  switch (iconVariant) {
    case 'basket':
      return (
        <div className={`${center} size-12 overflow-hidden`}>
          <img
            alt=""
            src={iconSrc}
            className="pointer-events-none absolute left-[-26.19%] top-[-23.57%] size-[152.46%] max-w-none"
          />
        </div>
      )
    case 'cover':
      return (
        <div className={`${center} size-12`}>
          <img alt="" src={iconSrc} className="pointer-events-none size-full max-w-none object-cover" />
        </div>
      )
    case 'iceCream':
      return (
        <div className={`${center} size-12 overflow-hidden`}>
          <div className={`${center} top-[calc(50%+1px)] size-14 overflow-hidden`}>
            <img
              alt=""
              src={iconSrc}
              className="pointer-events-none absolute left-[-23.21%] top-[-19.64%] size-[142.86%] max-w-none"
            />
          </div>
        </div>
      )
    case 'contain':
    default:
      return (
        <div className={`${center} size-12`}>
          <img alt="" src={iconSrc} className="pointer-events-none size-full max-w-none object-contain" />
        </div>
      )
  }
}

/**
 * Compact shortcut (circle + label).
 * Figma 76281:68504+ — home shortcuts row; `variant="scaled"` inside {@link ShortcutsCarousel}.
 */
export function ShortcutItem({
  iconSrc,
  label,
  iconVariant = 'contain',
  labelSingleLine = true,
  to,
  variant = 'default',
}: ShortcutItemProps) {
  const inner: ReactNode =
    variant === 'scaled' ? (
      <>
        <div className="shortcut-item-scaled__ring">
          <ScaledShortcutIcon iconSrc={iconSrc} iconVariant={iconVariant} />
        </div>
        <p
          className={[
            'shortcut-item-scaled__label bolt-font-body-s-compact-regular',
            labelSingleLine ? 'shortcut-item-scaled__label--single-line' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </p>
      </>
    ) : (
      <>
        <div className="relative size-[72px] shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-neutral-secondary)]">
          <DefaultShortcutIcon iconSrc={iconSrc} iconVariant={iconVariant} />
        </div>
        <p
          className={[
            'bolt-font-body-s-compact-regular h-9 min-h-9 w-[86px] text-center text-[var(--color-content-primary)]',
            labelSingleLine ? 'overflow-hidden text-ellipsis whitespace-nowrap' : 'break-words',
          ].join(' ')}
        >
          {label}
        </p>
      </>
    )

  const focusRing = 'outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2'
  const colClass =
    variant === 'scaled' ? 'shortcut-item-scaled bolt-font-base' : 'bolt-font-base flex shrink-0 flex-col items-center gap-1.5 px-1'

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
