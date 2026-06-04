import { useCallback, useRef, useState } from 'react'
import { useBasketFabOptional } from '../context/BasketFabContext'
import { design } from '../lib/figmaDesignAssets'
import { QuickAddExpandPill } from './QuickAddExpandPill'

const c = design.carousel

const defaultCopy = {
  title: 'Toode on lühikese realiseerimiseajaga ning on mõeldud koheseks tarbimiseks.',
  unit: '1,50 €/kg',
  price: '1,50 €',
  priceNow: '1,50 €',
  priceWas: '3,50 €',
  discountLabel: '−25 %',
}

export type CarouselGridItemVariant = 'default' | 'discount'

export type CarouselGridItemProps = {
  /** Stable id — qty persists in {@link BasketFabProvider} across hub tab switches. */
  itemId?: string
  variant?: CarouselGridItemVariant
  /** Override `--carousel-tile-width` from the parent carousel shell (default: CSS). */
  tileWidth?: string
  imageSrc?: string
  title?: string
  unitLabel?: string
  price?: string
  priceNow?: string
  priceWas?: string
  discountLabel?: string
}

/**
 * Grid product tile — nodes 70394:111364 / 70394:111384 / 70394:111405.
 * Square image block contains quick add (4px inset from bottom/sides); pricing + copy sit 4px below that block.
 */
export function CarouselGridItem({
  itemId,
  variant = 'default',
  tileWidth,
  imageSrc,
  title = defaultCopy.title,
  unitLabel = defaultCopy.unit,
  price = defaultCopy.price,
  priceNow = defaultCopy.priceNow,
  priceWas = defaultCopy.priceWas,
  discountLabel = defaultCopy.discountLabel,
}: CarouselGridItemProps) {
  const basket = useBasketFabOptional()
  const persisted = itemId != null && itemId !== '' && basket != null

  const persistedQty = persisted ? basket.getCarouselItemQty(itemId) : 0

  const [localOpen, setLocalOpen] = useState(false)
  const [localQty, setLocalQty] = useState(1)
  const contributedRef = useRef(0)

  const quickOpen = persisted ? persistedQty > 0 : localOpen
  const qty = persisted ? Math.max(1, persistedQty) : localQty

  const adjustCarouselRef = useRef(basket?.adjustCarouselBasketUnits)
  adjustCarouselRef.current = basket?.adjustCarouselBasketUnits

  const syncBasketUnits = useCallback((nextQty: number, open: boolean) => {
    const units = open ? nextQty : 0
    const delta = units - contributedRef.current
    contributedRef.current = units
    if (delta !== 0) adjustCarouselRef.current?.(delta)
  }, [])

  const handleAdd = useCallback(() => {
    if (persisted) {
      basket.setCarouselItemQty(itemId, 1)
      return
    }
    setLocalQty(1)
    setLocalOpen(true)
    syncBasketUnits(1, true)
  }, [basket, itemId, persisted, syncBasketUnits])

  const handleDecrement = useCallback(() => {
    if (persisted) {
      if (persistedQty <= 1) {
        basket.setCarouselItemQty(itemId, 0)
        return
      }
      basket.setCarouselItemQty(itemId, persistedQty - 1)
      return
    }
    setLocalQty((q) => {
      if (q <= 1) {
        setLocalOpen(false)
        syncBasketUnits(1, false)
        return 1
      }
      const next = q - 1
      syncBasketUnits(next, true)
      return next
    })
  }, [basket, itemId, persisted, persistedQty, syncBasketUnits])

  const handleIncrement = useCallback(() => {
    if (persisted) {
      basket.setCarouselItemQty(itemId, persistedQty + 1)
      return
    }
    setLocalQty((q) => {
      const next = q + 1
      syncBasketUnits(next, true)
      return next
    })
  }, [basket, itemId, persisted, persistedQty, syncBasketUnits])

  return (
    <article
      style={tileWidth !== undefined ? { width: tileWidth } : undefined}
      className="carousel-grid-item bolt-font-base flex min-w-0 shrink-0 flex-col gap-0 text-[var(--color-content-primary)]"
    >
      <div className="relative isolate w-full shrink-0 overflow-hidden rounded-[8px] bg-white">
        {variant === 'discount' && (
          <div className="absolute left-1 top-1 z-[3] flex flex-col gap-0.5">
            <span className="flex h-5 items-center justify-center gap-0.5 overflow-hidden rounded-[4px] bg-[var(--color-bg-danger-primary)] px-1 py-0.5">
              <span className="bolt-font-body-xs-accent px-0.5 text-center text-[var(--color-content-primary-inverted)]">
                {discountLabel}
              </span>
            </span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[rgba(0,45,30,0.06)] text-[var(--color-content-primary)]"
          aria-hidden
        />
        <div className="relative z-[1] aspect-square w-full shrink-0 overflow-hidden">
          <img alt="" src={imageSrc ?? c.product} className="thumbnail-fill-img" />
        </div>
        <div className="absolute bottom-1 left-1 right-1 z-[4] flex min-w-0 justify-end">
          <QuickAddExpandPill
            open={quickOpen}
            quantity={qty}
            plusSrc={c.plus}
            minusSrc={c.minus}
            onAdd={handleAdd}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
          />
        </div>
      </div>

      <div className="mt-1 flex w-full min-w-0 shrink-0 flex-col items-start gap-0.5">
        {variant === 'default' && (
          <div className="relative flex w-full min-w-0 shrink-0 items-center justify-start">
            <p className="bolt-font-body-s-accent min-w-0 shrink-0 whitespace-nowrap text-left text-[var(--color-content-primary)]">
              {price}
            </p>
          </div>
        )}
        {variant === 'discount' && (
          <div className="relative flex w-full min-w-0 shrink-0 flex-col items-start justify-center gap-0 whitespace-nowrap pb-0.5 text-left">
            <p className="bolt-font-body-s-accent w-full min-w-0 shrink-0 text-left text-[var(--color-content-danger-primary)]">
              {priceNow}
            </p>
            <p className="bolt-font-body-xs-regular w-full min-w-0 shrink-0 text-left text-[var(--color-content-secondary)] [text-decoration-skip-ink:none] line-through decoration-solid">
              {priceWas}
            </p>
          </div>
        )}
        <div className="flex w-full min-w-0 shrink-0 flex-col items-start text-left">
          <p
            className={[
              'bolt-font-body-xs-regular w-full min-w-0 text-left text-[var(--color-content-primary)]',
              variant === 'default' ? 'line-clamp-2 overflow-hidden' : 'truncate',
            ].join(' ')}
          >
            {title}
          </p>
          <div className="flex w-full min-w-0 flex-wrap items-start justify-start gap-x-1 gap-y-0">
            <p className="bolt-font-body-xs-regular min-w-0 shrink-0 whitespace-nowrap text-left text-[10px] leading-[14px] text-[var(--color-content-secondary)]">
              {unitLabel}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
