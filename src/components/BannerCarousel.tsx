export type BannerCarouselProps = {
  /** Local image paths (`design.*` / `figma()`). */
  banners: readonly string[]
  className?: string
  'aria-label'?: string
  /** Figma node id for traceability (e.g. `77237:150637`). */
  'data-node-id'?: string
}

/**
 * Horizontal promo banner carousel — Figma BannerCarousel Multiple @ 375.
 * 24px inner padding, 12px gap, 8px corner radius; slides scale with aspect ratio 327:156.
 */
export function BannerCarousel({
  banners,
  className = '',
  'aria-label': ariaLabel = 'Promotions',
  'data-node-id': dataNodeId,
}: BannerCarouselProps) {
  return (
    <section
      className={['banner-carousel bolt-font-base w-full', className].filter(Boolean).join(' ')}
      role="region"
      aria-label={ariaLabel}
      data-node-id={dataNodeId}
    >
      <div className="banner-carousel__scroll" aria-label={ariaLabel}>
        <div className="banner-carousel__track">
          {banners.map((src) => (
            <article key={src} className="banner-carousel__slide">
              <img alt="" src={src} className="banner-carousel__image" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
