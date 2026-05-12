import { useCallback, useEffect, useState } from 'react'
import binIconUrl from '../assets/shopping-list-bin.svg?url'
import { design } from '../lib/figmaDesignAssets'
import { QuickAddExpandPill } from './QuickAddExpandPill'

const h = design.providerHeader
const c = design.carousel

export type ListItemVariant = 'heart' | 'add' | 'added' | 'delete'

export type ListItemProps = {
  variant: ListItemVariant
  title: string
  price: string
  imageSrc: string
  showDivider?: boolean
  /** When variant is `added`, quantity in basket (controlled by parent). */
  basketQty?: number
  onHeartClick?: () => void
  onAddClick?: () => void
  onBasketDecrement?: () => void
  onBasketIncrement?: () => void
  onDeleteClick?: () => void
}

export function ListItem({
  variant,
  title,
  price,
  imageSrc,
  showDivider = true,
  basketQty = 1,
  onHeartClick,
  onAddClick,
  onBasketDecrement,
  onBasketIncrement,
  onDeleteClick,
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
            <img alt="" src={binIconUrl} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
          </span>
        </button>
      </div>
    )
  })()

  return (
    <div className="font-sans flex w-full flex-col gap-[15px] px-6 text-[#191f1c]">
      <div className="flex w-full flex-col gap-1 pt-4">
        <div className="flex w-full items-start gap-3">
          <div className="relative isolate shrink-0 overflow-hidden rounded-xl bg-white">
            <div className="absolute inset-0 z-[2] bg-[rgba(0,45,30,0.06)]" aria-hidden />
            <div className="relative z-[1] size-14 shrink-0">
              <img alt="" src={imageSrc} className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" />
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
