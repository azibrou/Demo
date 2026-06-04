import { useRef, type CSSProperties } from 'react'
import { useThumbnailLScale } from '../../hooks/useThumbnailLScale'
import { ThumbnailL } from '../../components/ThumbnailL'

export type ThumbnailLListBlockItem = {
  title: string
  imageSrc: string
  deliveryLabel: string
  deliveryOriginalPrice?: string
  etaText: string
  discountPct?: string | null
  rating?: string
  reviews?: string
}

export type ThumbnailLListBlockProps = {
  title: string
  items: readonly ThumbnailLListBlockItem[]
  onItemClick?: (item: ThumbnailLListBlockItem) => void
}

/** Page block: vertical list of scaled {@link ThumbnailL} cards — 24px gutters, 375px baseline. */
export function ThumbnailLListBlock({ title, items, onItemClick }: ThumbnailLListBlockProps) {
  const rootRef = useRef<HTMLElement>(null)
  const scale = useThumbnailLScale(rootRef)
  const headingId = 'all-restaurants-heading'

  const style = {
    '--thumbnail-l-scale': String(scale),
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className="thumbnail-l-section home-gutter-inline"
      style={style}
      aria-labelledby={headingId}
    >
      <header className="thumbnail-l-section__header">
        <h2 id={headingId} className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]">
          {title}
        </h2>
      </header>
      <ul className="thumbnail-l-section__list">
        {items.map((item) => (
          <li key={item.title} className="thumbnail-l-section__item">
            {onItemClick ? (
              <button type="button" onClick={() => onItemClick(item)} className="w-full cursor-pointer text-left">
                <ThumbnailL variant="scaled" {...item} />
              </button>
            ) : (
              <ThumbnailL variant="scaled" {...item} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export { THUMBNAIL_L_DESIGN, computeThumbnailLScale } from '../../lib/thumbnailLScale'
