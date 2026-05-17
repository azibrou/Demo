import { Favorite } from './Favorite'
import { Rating } from './Rating'
import { design } from '../lib/figmaDesignAssets'

const tm = design.thumbnailM

export type ThumbnailMProps = {
  imageSrc?: string
  title?: string
  deliveryLabel?: string
  deliveryOriginalPrice?: string
  etaText?: string
  rating?: string
  reviews?: string
  /** Scaled carousel tile — media scales; caption row stays fixed px. */
  variant?: 'default' | 'scaled'
}

function ThumbnailMMedia({
  imageSrc,
  rating,
  reviews,
  mediaClassName,
}: {
  imageSrc: string
  rating: string
  reviews: string
  mediaClassName: string
}) {
  return (
    <div className={mediaClassName} data-name="Img">
      <img alt="" src={imageSrc} className="thumbnail-fill-img" />
      <Favorite size="m" />
      <Rating size="m" rating={rating} reviews={reviews} />
    </div>
  )
}

function ThumbnailMMeta({
  deliveryLabel,
  deliveryOriginalPrice,
  etaText,
}: Pick<ThumbnailMProps, 'deliveryLabel' | 'deliveryOriginalPrice' | 'etaText'>) {
  return (
    <div className="thumbnail-m__info flex w-full items-center gap-2" data-name="info">
      <div className="flex shrink-0 items-center gap-1" data-name="Delivery">
        <span className="relative size-3 shrink-0" aria-hidden data-name="bike_delivery (outline)">
          <img
            alt=""
            src={tm.bikeDelivery}
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
          />
        </span>
        <span className="bolt-font-body-xs-accent text-[var(--color-content-danger-primary)]">{deliveryLabel}</span>
        {deliveryOriginalPrice ? (
          <span className="bolt-font-body-xs-regular text-[var(--color-content-tertiary)] line-through">
            {deliveryOriginalPrice}
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden rounded-full" data-name="ETA">
        <span className="relative size-3 shrink-0" aria-hidden data-name="timer (outline)">
          <img
            alt=""
            src={tm.timer}
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
          />
        </span>
        <p className="bolt-font-body-xs-regular min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-content-primary)]">
          {etaText}
        </p>
      </div>
    </div>
  )
}

/** Figma 76330:71602 — medium provider thumb (210×105 image @ scale 1). */
export function ThumbnailM({
  imageSrc = design.eaterHome.thumbnailM,
  title = 'Burger Town',
  deliveryLabel = '1,50 €',
  deliveryOriginalPrice = '3,50 €',
  etaText = '15–25 min',
  rating = '4.6',
  reviews = '(200+)',
  variant = 'default',
}: ThumbnailMProps) {
  if (variant === 'scaled') {
    return (
      <article className="thumbnail-m-scaled bolt-font-base" data-name="ThumbnailM" data-node-id="76330:71602">
        <ThumbnailMMedia
          imageSrc={imageSrc}
          rating={rating}
          reviews={reviews}
          mediaClassName="thumbnail-m-scaled__media"
        />
        <div className="thumbnail-m-scaled__body" data-name="Text">
          <p className="bolt-font-body-m-accent shrink-0 text-[var(--color-content-primary)]" data-name="Title">
            {title}
          </p>
          <ThumbnailMMeta
            deliveryLabel={deliveryLabel}
            deliveryOriginalPrice={deliveryOriginalPrice}
            etaText={etaText}
          />
        </div>
      </article>
    )
  }

  return (
    <article
      className="thumbnail-m bolt-font-base flex w-[210px] shrink-0 flex-col gap-1"
      data-name="ThumbnailM"
      data-node-id="76330:71602"
    >
      <ThumbnailMMedia
        imageSrc={imageSrc}
        rating={rating}
        reviews={reviews}
        mediaClassName="thumbnail-m__media relative h-[105px] w-full shrink-0"
      />
      <div className="flex w-full flex-col items-start gap-1" data-name="Text">
        <p className="bolt-font-body-m-accent w-full shrink-0 text-[var(--color-content-primary)]" data-name="Title">
          {title}
        </p>
        <ThumbnailMMeta
          deliveryLabel={deliveryLabel}
          deliveryOriginalPrice={deliveryOriginalPrice}
          etaText={etaText}
        />
      </div>
    </article>
  )
}
