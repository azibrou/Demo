import { ThumbnailMCarousel } from '../../components/ThumbnailMCarousel'
import { ThumbnailM } from '../../components/ThumbnailM'

export type ThumbnailMRowBlockItem = {
  title: string
  imageSrc: string
  deliveryLabel: string
  deliveryOriginalPrice?: string
  etaText: string
  rating?: string
  reviews?: string
}

export type ThumbnailMRowBlockProps = {
  title: string
  ariaLabel: string
  items: readonly ThumbnailMRowBlockItem[]
  onItemClick?: () => void
}

/** Page block: headline + scaled {@link ThumbnailM} carousel (1.5 tiles visible @ 375px). */
export function ThumbnailMRowBlock({ title, ariaLabel, items, onItemClick }: ThumbnailMRowBlockProps) {
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
        {items.map((item) =>
          onItemClick ? (
            <button
              key={item.title}
              type="button"
              onClick={onItemClick}
              className="cursor-pointer text-left"
            >
              <ThumbnailM
                variant="scaled"
                imageSrc={item.imageSrc}
                title={item.title}
                deliveryLabel={item.deliveryLabel}
                deliveryOriginalPrice={item.deliveryOriginalPrice}
                etaText={item.etaText}
                rating={item.rating}
                reviews={item.reviews}
              />
            </button>
          ) : (
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
          ),
        )}
      </ThumbnailMCarousel>
    </section>
  )
}
