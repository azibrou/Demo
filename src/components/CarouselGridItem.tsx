import { useCallback, useState } from 'react'
import { useBasketFab } from '../context/BasketFabContext'
import { CAROUSEL_TILE_WIDTH } from '../lib/carouselTileWidth'
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
  variant?: CarouselGridItemVariant
  /** Slot width (default: same calc as MoreToExplore — ~2.5 tiles visible) */
  tileWidth?: string
  imageSrc?: string
  title?: string
  unitLabel?: string
  price?: string
  priceNow?: string
  priceWas?: string
  discountLabel?: string
  /** Yellow pill on the image (Figma grocery “New” / “Sweet”). Shown above the discount pill when both apply. */
  accentLabel?: string
}

/**
 * Grid product tile — nodes 70394:111364 / 70394:111384 / 70394:111405.
 * Square image block contains quick add (4px inset from bottom/sides); pricing + copy sit 4px below that block.
 */
export function CarouselGridItem({
  variant = 'default',
  tileWidth = CAROUSEL_TILE_WIDTH,
  imageSrc,
  title = defaultCopy.title,
  unitLabel = defaultCopy.unit,
  price = defaultCopy.price,
  priceNow = defaultCopy.priceNow,
  priceWas = defaultCopy.priceWas,
  discountLabel = defaultCopy.discountLabel,
  accentLabel,
}: CarouselGridItemProps) {
  const [quickOpen, setQuickOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const { adjustCarouselBasketUnits } = useBasketFab()

  const img = imageSrc ?? c.product

  const handleAdd = useCallback(() => {
    adjustCarouselBasketUnits(1)
    setQty(1)
    setQuickOpen(true)
  }, [adjustCarouselBasketUnits])

  const handleDecrement = useCallback(() => {
    if (!quickOpen) return
    if (qty <= 1) {
      adjustCarouselBasketUnits(-1)
      setQuickOpen(false)
      setQty(1)
      return
    }
    adjustCarouselBasketUnits(-1)
    setQty((q) => q - 1)
  }, [adjustCarouselBasketUnits, quickOpen, qty])

  const handleIncrement = useCallback(() => {
    adjustCarouselBasketUnits(1)
    setQty((q) => q + 1)
  }, [adjustCarouselBasketUnits])

  return (
    <article
      style={{ width: tileWidth }}
      className="font-sans flex min-w-0 shrink-0 flex-col gap-0 text-[#191f1c]"
    >
      <div className="relative isolate w-full shrink-0 overflow-hidden rounded-[8px] bg-white">
        {(accentLabel || variant === 'discount') && (
          <div className="absolute left-1 top-1 z-[3] flex flex-col gap-0.5">
            {accentLabel ? (
              <span className="flex h-5 items-center justify-center gap-0.5 overflow-hidden rounded-[4px] bg-[#ffb200] px-1.5 py-0.5">
                <span className="px-0.5 text-center text-xs font-semibold leading-4 text-[#191f1c]">{accentLabel}</span>
              </span>
            ) : null}
            {variant === 'discount' ? (
              <span className="flex h-5 items-center justify-center gap-0.5 overflow-hidden rounded-[4px] bg-[#de1929] px-1 py-0.5">
                <span className="px-0.5 text-center text-xs font-semibold leading-4 text-white">{discountLabel}</span>
              </span>
            ) : null}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[rgba(0,45,30,0.06)]" aria-hidden />
        <div className="relative z-[1] aspect-square w-full shrink-0">
          <img
            alt=""
            src={img}
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          />
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
            <p className="min-w-0 shrink-0 whitespace-nowrap text-left text-sm font-semibold leading-5 tracking-[-0.084px] text-[#191f1c]">
              {price}
            </p>
          </div>
        )}
        {variant === 'discount' && (
          <div className="relative flex w-full min-w-0 shrink-0 flex-col items-start justify-center gap-0 whitespace-nowrap pb-0.5 text-left">
            <p className="w-full min-w-0 shrink-0 text-left text-sm font-semibold leading-5 tracking-[-0.084px] text-[rgba(173,0,14,0.94)]">
              {priceNow}
            </p>
            <p className="w-full min-w-0 shrink-0 text-left text-xs font-normal leading-4 text-[rgba(0,10,7,0.63)] [text-decoration-skip-ink:none] line-through decoration-solid">
              {priceWas}
            </p>
          </div>
        )}
        <div className="flex w-full min-w-0 shrink-0 flex-col items-start text-left">
          <p
            className={[
              'w-full min-w-0 text-left text-xs font-normal leading-4 text-[#191f1c]',
              variant === 'default' ? 'line-clamp-2 overflow-hidden' : 'truncate',
            ].join(' ')}
          >
            {title}
          </p>
          <div className="flex w-full min-w-0 flex-wrap items-start justify-start gap-x-1 gap-y-0">
            <p className="min-w-0 shrink-0 whitespace-nowrap text-left text-[10px] font-normal leading-[14px] text-[rgba(0,10,7,0.63)]">
              {unitLabel}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
