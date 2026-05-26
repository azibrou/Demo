import { Favorite } from './Favorite'
import { Rating } from './Rating'
import { design } from '../lib/figmaDesignAssets'

const tl = design.thumbnailL

export type ThumbnailLProps = {
  imageSrc?: string
  title?: string
  deliveryLabel?: string
  deliveryOriginalPrice?: string
  etaText?: string
  discountPct?: string | null
  rating?: string
  reviews?: string
  /** Scaled list card — media uses `--thumbnail-l-scale` from {@link ThumbnailLListBlock}. */
  variant?: 'default' | 'scaled'
}

function ThumbnailLMedia({
  imageSrc,
  rating,
  reviews,
  discountPct,
  mediaClassName,
}: {
  imageSrc: string
  rating: string
  reviews: string
  discountPct: string | null
  mediaClassName: string
}) {
  return (
    <div className={mediaClassName} data-name="Img">
      <img alt="" src={imageSrc} className="thumbnail-fill-img" />
      <Favorite size="l" />
      <Rating size="l" rating={rating} reviews={reviews} />
      {discountPct ? (
        <div className="thumbnail-l__discount" data-name="Campaign badge">
          <p className="bolt-font-body-s-accent whitespace-nowrap text-[var(--color-content-primary-inverted)]">
            {discountPct}
          </p>
        </div>
      ) : null}
    </div>
  )
}

function ThumbnailLMeta({
  deliveryLabel,
  deliveryOriginalPrice,
  etaText,
}: Pick<ThumbnailLProps, 'deliveryLabel' | 'deliveryOriginalPrice' | 'etaText'>) {
  return (
    <div className="thumbnail-l__info flex w-full items-center gap-3" data-name="info">
      <div className="flex shrink-0 items-center gap-1" data-name="Delivery">
        <span className="relative size-4 shrink-0" aria-hidden data-name="bike_delivery (outline)">
          <img
            alt=""
            src={tl.bikeDelivery}
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
          />
        </span>
        <span className="bolt-font-body-s-accent text-[var(--color-content-danger-primary)]">{deliveryLabel}</span>
        {deliveryOriginalPrice ? (
          <span className="bolt-font-body-s-regular text-[var(--color-content-tertiary)] line-through">
            {deliveryOriginalPrice}
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden rounded-full" data-name="ETA">
        <span className="relative size-4 shrink-0" aria-hidden data-name="timer (outline)">
          <img
            alt=""
            src={tl.timer}
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
          />
        </span>
        <p className="bolt-font-body-s-regular min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-content-primary)]">
          {etaText}
        </p>
      </div>
    </div>
  )
}

/** Figma 74916:29102 — large list restaurant card (342×156 image @ scale 1). */
export function ThumbnailL({
  imageSrc = design.eaterHome.thumbnailL,
  title = 'Poke Bowl Hariduse',
  deliveryLabel = '1,50 €',
  deliveryOriginalPrice = '3,50 €',
  etaText = '15–25 min',
  discountPct = '−25%',
  rating = '4.6',
  reviews = '(200+)',
  variant = 'default',
}: ThumbnailLProps) {
  if (variant === 'scaled') {
    return (
      <article className="thumbnail-l-scaled bolt-font-base" data-name="ThumbnailL">
        <ThumbnailLMedia
          imageSrc={imageSrc}
          rating={rating}
          reviews={reviews}
          discountPct={discountPct}
          mediaClassName="thumbnail-l-scaled__media"
        />
        <div className="thumbnail-l-scaled__body" data-name="Text">
          <p className="bolt-font-body-l-accent w-full shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-content-primary)]">
            {title}
          </p>
          <ThumbnailLMeta
            deliveryLabel={deliveryLabel}
            deliveryOriginalPrice={deliveryOriginalPrice}
            etaText={etaText}
          />
        </div>
      </article>
    )
  }

  return (
    <article className="thumbnail-l bolt-font-base flex w-full min-w-0 max-w-full flex-col gap-2" data-name="ThumbnailL">
      <ThumbnailLMedia
        imageSrc={imageSrc}
        rating={rating}
        reviews={reviews}
        discountPct={discountPct}
        mediaClassName="thumbnail-l__media relative h-[156px] w-full shrink-0"
      />
      <div className="flex w-full flex-col items-start gap-1" data-name="Text">
        <p className="bolt-font-body-l-accent w-full shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-content-primary)]">
          {title}
        </p>
        <ThumbnailLMeta
          deliveryLabel={deliveryLabel}
          deliveryOriginalPrice={deliveryOriginalPrice}
          etaText={etaText}
        />
      </div>
    </article>
  )
}
