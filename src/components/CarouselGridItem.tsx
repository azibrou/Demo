import { useCallback, useState } from 'react'
import { useMerchantOrderProvider, useOrderOptional } from '../context/OrderContext'
import { design } from '../lib/figmaDesignAssets'
import { ProductSheet } from './ProductSheet'
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
  description?: string
  /**
   * Override the tap-to-open behavior. When omitted, tapping the tile opens a
   * built-in product detail sheet (as long as an order provider is in context).
   */
  onOpenDetails?: () => void
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
  description,
  onOpenDetails,
}: CarouselGridItemProps) {
  const order = useOrderOptional()
  const merchantProvider = useMerchantOrderProvider()
  /** Provider this tile attributes to — the surface's merchant, or the active order's (e.g. checkout upsell). */
  const addProvider = merchantProvider ?? order?.provider ?? null
  const persisted = itemId != null && itemId !== '' && order != null && addProvider != null

  const [localOpen, setLocalOpen] = useState(false)
  const [localQty, setLocalQty] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const orderQty = persisted ? order.getQtyFor(addProvider.id, itemId) : 0
  const quickOpen = persisted ? orderQty > 0 : localOpen
  const qty = persisted ? Math.max(1, orderQty) : localQty

  const lineTitle = title
  const linePrice = variant === 'discount' ? priceNow : price

  // Tap the tile to open product details. Falls back to a built-in sheet when no
  // explicit handler is given, provided there's an order provider to attribute adds to.
  const canOpenDetails = onOpenDetails != null || (order != null && addProvider != null)
  const handleOpenDetails = useCallback(() => {
    if (onOpenDetails) {
      onOpenDetails()
      return
    }
    setDetailsOpen(true)
  }, [onOpenDetails])

  const textContent = (
    <>
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
    </>
  )

  const handleAdd = useCallback(() => {
    if (persisted) {
      order.addOne(addProvider, { id: itemId, title: lineTitle, price: linePrice, image: imageSrc })
      return
    }
    setLocalQty(1)
    setLocalOpen(true)
  }, [order, addProvider, itemId, persisted, lineTitle, linePrice, imageSrc])

  const handleDecrement = useCallback(() => {
    if (persisted) {
      order.decrement(itemId)
      return
    }
    setLocalQty((q) => {
      if (q <= 1) {
        setLocalOpen(false)
        return 1
      }
      return q - 1
    })
  }, [order, itemId, persisted])

  const handleIncrement = useCallback(() => {
    if (persisted) {
      order.increment(itemId)
      return
    }
    setLocalQty((q) => q + 1)
  }, [order, itemId, persisted])

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
        {canOpenDetails ? (
          <button
            type="button"
            aria-label={`Open ${title}`}
            onClick={handleOpenDetails}
            className="relative z-[1] block aspect-square w-full shrink-0 overflow-hidden outline-none"
          >
            <img alt="" src={imageSrc ?? c.product} className="thumbnail-fill-img" />
          </button>
        ) : (
          <div className="relative z-[1] aspect-square w-full shrink-0 overflow-hidden">
            <img alt="" src={imageSrc ?? c.product} className="thumbnail-fill-img" />
          </div>
        )}
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

      {canOpenDetails ? (
        <button
          type="button"
          onClick={handleOpenDetails}
          className="mt-1 flex w-full min-w-0 shrink-0 flex-col items-start gap-0.5 text-left outline-none"
        >
          {textContent}
        </button>
      ) : (
        <div className="mt-1 flex w-full min-w-0 shrink-0 flex-col items-start gap-0.5">
          {textContent}
        </div>
      )}

      {detailsOpen && addProvider ? (
        <ProductSheet
          product={{
            id: itemId ?? lineTitle,
            title: lineTitle,
            price: linePrice ?? price,
            image: imageSrc,
            description,
          }}
          provider={addProvider}
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}
    </article>
  )
}
