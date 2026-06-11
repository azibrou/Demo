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
  onItemClick?: (item: ThumbnailMRowBlockItem) => void
  /** When set, only matching tiles are interactive (others render as static cards). */
  isItemClickable?: (item: ThumbnailMRowBlockItem) => boolean
}

/** Page block: headline + scaled {@link ThumbnailM} carousel (1.5 tiles visible @ 375px). */
export function ThumbnailMRowBlock({
  title,
  ariaLabel,
  items,
  onItemClick,
  isItemClickable,
}: ThumbnailMRowBlockProps) {
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
        {items.map((item) => {
          const thumb = (
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
          )
          const clickable = onItemClick && (isItemClickable?.(item) ?? true)
          if (clickable) {
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => onItemClick(item)}
                className="cursor-pointer text-left"
              >
                {thumb}
              </button>
            )
          }
          return <div key={item.title}>{thumb}</div>
        })}
      </ThumbnailMCarousel>
    </section>
  )
}
