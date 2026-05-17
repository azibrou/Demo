import { ThumbnailMCarousel } from './ThumbnailMCarousel'
import { ThumbnailM } from './ThumbnailM'

export type ThumbnailMRowItem = {
  title: string
  imageSrc: string
  deliveryLabel: string
  deliveryOriginalPrice?: string
  etaText: string
  rating?: string
  reviews?: string
}

export type ThumbnailMRowProps = {
  title: string
  ariaLabel: string
  items: readonly ThumbnailMRowItem[]
}

/** Section headline + scaled {@link ThumbnailM} carousel (1.5 tiles visible @ 375px). */
export function ThumbnailMRow({ title, ariaLabel, items }: ThumbnailMRowProps) {
  return (
    <section className="thumbnail-m-row" aria-labelledby={`${ariaLabel.replace(/\s+/g, '-')}-heading`}>
      <div className="thumbnail-m-row__header home-gutter-inline">
        <h2
          id={`${ariaLabel.replace(/\s+/g, '-')}-heading`}
          className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]"
        >
          {title}
        </h2>
      </div>
      <ThumbnailMCarousel ariaLabel={ariaLabel}>
        {items.map((item) => (
          <ThumbnailM
            key={item.title}
            variant="scaled"
            imageSrc={item.imageSrc}
            title={item.title}
            deliveryLabel={item.deliveryLabel}
            deliveryOriginalPrice={item.deliveryOriginalPrice}
            etaText={item.etaText}
            rating={item.rating}
            reviews={item.reviews}
          />
        ))}
      </ThumbnailMCarousel>
    </section>
  )
}
