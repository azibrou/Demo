import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { design } from '../lib/figmaDesignAssets'
import { kalepIcons } from '../lib/kalepIcons'
import { QuickAddExpandPill } from './QuickAddExpandPill'

const h = design.providerHeader
const c = design.carousel

export type ListItemVariant =
  | 'heart'
  | 'add'
  | 'added'
  | 'delete'
  | 'search'
  /** Profile row — icon, title, trailing action (e.g. Edit). Figma 80613:193631. */
  | 'profile'
  /** Profile payment row — icon, title, optional info, subtitle link, optional trailing value. */
  | 'profileDetail'
  /** Profile menu row — icon + body-l title. Figma 80613:193643. */
  | 'profileMenu'

export type ListItemProps = {
  variant: ListItemVariant
  title: string
  price?: string
  imageSrc?: string
  /** Search / profile rows — 24px leading icon. */
  leadingIconSrc?: string
  /** Profile rows — custom leading node (e.g. Mastercard badge). */
  leadingSlot?: ReactNode
  showDivider?: boolean
  /** When variant is `added`, quantity in basket (controlled by parent). */
  basketQty?: number
  /** `profile` / `profileDetail` — green action on the right (Edit) or below title (Change). */
  trailingAction?: string
  subtitle?: string
  trailingValue?: string
  showInfoIcon?: boolean
  infoIconSrc?: string
  onHeartClick?: () => void
  onAddClick?: () => void
  onBasketDecrement?: () => void
  onBasketIncrement?: () => void
  onDeleteClick?: () => void
  onTrailingActionClick?: () => void
  onSubtitleClick?: () => void
  onRowClick?: () => void
}

export function ListItem({
  variant,
  title,
  price = '',
  imageSrc = '',
  leadingIconSrc,
  leadingSlot,
  showDivider = true,
  basketQty = 1,
  trailingAction,
  subtitle,
  trailingValue,
  showInfoIcon = false,
  infoIconSrc,
  onHeartClick,
  onAddClick,
  onBasketDecrement,
  onBasketIncrement,
  onDeleteClick,
  onTrailingActionClick,
  onSubtitleClick,
  onRowClick,
}: ListItemProps) {
  const [localOpen, setLocalOpen] = useState(false)
  const [localQty, setLocalQty] = useState(1)
  const isAdded = variant === 'added'

  useEffect(() => {
    if (variant !== 'add') return
    const id = requestAnimationFrame(() => {
      setLocalOpen(false)
      setLocalQty(1)
    })
    return () => cancelAnimationFrame(id)
  }, [variant])

  const pillOpen = isAdded || localOpen
  const pillQty = isAdded ? Math.max(1, basketQty) : localQty

  const handlePillAdd = useCallback(() => {
    if (isAdded) {
      onBasketIncrement?.()
      return
    }
    setLocalQty(1)
    setLocalOpen(true)
    onAddClick?.()
  }, [isAdded, onAddClick, onBasketIncrement])

  const handlePillDecrement = useCallback(() => {
    if (isAdded) {
      onBasketDecrement?.()
      return
    }
    setLocalQty((q) => {
      if (q <= 1) {
        setLocalOpen(false)
        return 1
      }
      return q - 1
    })
  }, [isAdded, onBasketDecrement])

  const handlePillIncrement = useCallback(() => {
    onBasketIncrement?.()
  }, [onBasketIncrement])

  if (variant === 'search') {
    return (
      <div className="font-sans flex w-full flex-col text-[var(--color-content-primary)]">
        <div className="flex w-full items-start gap-3 overflow-hidden pt-4 pb-[15px]">
          {leadingIconSrc ? (
            <span className="relative size-6 shrink-0" aria-hidden>
              <img alt="" src={leadingIconSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
            </span>
          ) : null}
          <p className="bolt-font-body-m-regular min-w-0 flex-1 break-words">{title}</p>
        </div>
        {showDivider ? (
          <div className="relative h-px w-full shrink-0 bg-[var(--color-border-separator)]" aria-hidden />
        ) : null}
      </div>
    )
  }

  const leadingVisual =
    leadingSlot ??
    (leadingIconSrc ? (
      <span className="relative size-6 shrink-0" aria-hidden>
        <img alt="" src={leadingIconSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
      </span>
    ) : null)

  if (variant === 'profile') {
    const row = (
      <div className="flex w-full items-center gap-3 overflow-hidden pt-4 pb-[15px]">
        {leadingVisual}
        <p className="bolt-font-body-m-regular min-w-0 flex-1 break-words">{title}</p>
        {trailingAction ? (
          <button
            type="button"
            onClick={onTrailingActionClick}
            className="bolt-font-body-s-regular shrink-0 text-[var(--color-content-action-primary,#007042)]"
          >
            {trailingAction}
          </button>
        ) : null}
      </div>
    )
    return (
      <div className="font-sans flex w-full flex-col text-[var(--color-content-primary)]">
        {onRowClick ? (
          <button type="button" onClick={onRowClick} className="w-full text-left">
            {row}
          </button>
        ) : (
          row
        )}
        {showDivider ? (
          <div className="relative h-px w-full shrink-0 bg-[var(--color-border-separator)]" aria-hidden />
        ) : null}
      </div>
    )
  }

  if (variant === 'profileDetail') {
    return (
      <div className="font-sans flex w-full flex-col text-[var(--color-content-primary)]">
        <div className="flex w-full items-center gap-3 pt-2.5 pb-[9px]">
          {leadingVisual}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="bolt-font-body-m-regular whitespace-nowrap">{title}</p>
              {showInfoIcon && infoIconSrc ? (
                <span className="relative size-5 shrink-0" aria-hidden>
                  <img alt="" src={infoIconSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
                </span>
              ) : null}
            </div>
            {subtitle ? (
              <button
                type="button"
                onClick={onSubtitleClick}
                className="bolt-font-body-s-regular text-left text-[#1d965c]"
              >
                {subtitle}
              </button>
            ) : null}
          </div>
          {trailingValue ? (
            <p className="bolt-font-body-m-regular shrink-0 whitespace-nowrap text-right">{trailingValue}</p>
          ) : null}
        </div>
        {showDivider ? (
          <div className="relative h-px w-full shrink-0 bg-[var(--color-border-separator)]" aria-hidden />
        ) : null}
      </div>
    )
  }

  if (variant === 'profileMenu') {
    const row = (
      <div className="flex w-full items-start gap-4 overflow-hidden pt-4 pb-[15px]">
        {leadingVisual}
        <p className="bolt-font-body-l-regular min-w-0 flex-1 break-words">{title}</p>
      </div>
    )
    return (
      <div className="font-sans flex w-full flex-col text-[var(--color-content-primary)]">
        {onRowClick ? (
          <button type="button" onClick={onRowClick} className="w-full text-left">
            {row}
          </button>
        ) : (
          row
        )}
        {showDivider ? (
          <div className="relative h-px w-full shrink-0 bg-[var(--color-border-separator)]" aria-hidden />
        ) : null}
      </div>
    )
  }

  const trailing = (() => {
    if (variant === 'heart') {
      return (
        <div className="flex h-14 w-24 shrink-0 items-start justify-end">
          <button
            type="button"
            aria-label="Save inspiration"
            onClick={onHeartClick}
            className="flex items-center gap-2.5 rounded-[20px] p-2"
          >
            <span className="relative size-6 shrink-0" aria-hidden>
              <img alt="" src={h.heartOutline} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
            </span>
          </button>
        </div>
      )
    }
    if (variant === 'add' || variant === 'added') {
      return (
        <div className="flex h-14 w-24 shrink-0 min-w-0 items-center justify-end">
          <QuickAddExpandPill
            open={pillOpen}
            quantity={pillQty}
            plusSrc={c.plus}
            minusSrc={c.minus}
            onAdd={handlePillAdd}
            onDecrement={handlePillDecrement}
            onIncrement={handlePillIncrement}
          />
        </div>
      )
    }
    return (
      <div className="flex h-14 w-24 shrink-0 items-start justify-end">
        <button
          type="button"
          aria-label="Remove from list"
          onClick={onDeleteClick}
          className="flex items-center gap-2.5 rounded-[20px] p-2"
        >
          <span className="relative size-6 shrink-0" aria-hidden>
            <img alt="" src={kalepIcons.bin} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
          </span>
        </button>
      </div>
    )
  })()

  return (
    <div className="font-sans flex w-full flex-col gap-[15px] px-6 text-[#191f1c]">
      <div className="flex w-full flex-col gap-1 pt-4">
        <div className="flex w-full items-start gap-3">
          <div className="relative isolate shrink-0 overflow-hidden rounded-lg bg-white">
            <div className="absolute inset-0 z-[2] bg-[rgba(0,45,30,0.06)]" aria-hidden />
            <div className="relative z-[1] size-14 shrink-0 overflow-hidden">
              <img alt="" src={imageSrc} className="thumbnail-fill-img" />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start pt-1">
            <p className="w-full min-w-0 text-base font-normal leading-6 tracking-[-0.176px]">{title}</p>
            <div className="mt-0 flex w-full items-center gap-1">
              <p className="shrink-0 whitespace-nowrap text-base font-normal leading-6 tracking-[-0.176px]">{price}</p>
            </div>
          </div>
          {trailing}
        </div>
      </div>
      {showDivider && <div className="relative h-px w-full shrink-0 bg-[rgba(0,45,30,0.07)]" aria-hidden />}
    </div>
  )
}
